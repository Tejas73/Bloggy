import express from "express"
import passport from "passport";
import prisma from "../utils/prismaClient";
import { User } from "@prisma/client";
import sanitizeHtml from 'sanitize-html';

const router = express.Router();

interface BlogTypes {
    title: string,
    description: string
}

//create a new blog
router.post("/createblog", passport.authenticate("jwt", { session: false }), async (req: express.Request<{}, {}, BlogTypes>, res: express.Response) => {
    try {
        const { title, description } = req.body;
        const sanitizedDescription = sanitizeHtml(description);
        const userId = (req.user as User).id;
        let blogId;

        const userProfile = await prisma.profile.findUnique({
            where: { userId }
        })

        if (!userProfile) {
            return res.json({ message: "User profile not found for userId: ${userId}" })
        }
        console.log("userProfile: ", userProfile);
        console.log("userProfile.name: ", userProfile.name);

        const newBlog = await prisma.blog.create({
            data: {
                title,
                description: sanitizedDescription,
                author: { connect: { id: userProfile.userId } },
                profile: { connect: { id: userProfile.id } },
                blogLikes:{
                    create:{
                        blogliked: false,
                        userId,
                    }
                }
            }
        })

        console.log("newBlog: ", newBlog);
        res.json({ message: "Blog created successfully", newBlog })
    } catch (error) {
        console.error("Error creating a blog: ", error)
    }
})

// get all blogs for feed
router.get("/allblogs", passport.authenticate("jwt", { session: false }), async (req: express.Request, res: express.Response) => {
    try {
        const showBlogs = await prisma.blog.findMany({
            include: {
                profile: true,
                comments: true,
                blogLikes: true
            },
        });
        res.json({ message: "Fetching of all Blogs successful", showBlogs })
    } catch (error) {
        console.error("Error getting all blogs: ", error)
    }
});

//get user's personal blogs
router.get("/myblogs", passport.authenticate("jwt", { session: false }), async (req: express.Request, res: express.Response) => {
    console.log("myblogs called")
    try {
        const myBlogs = await prisma.blog.findMany({
            where: {
                authorId: (req.user as User).id
            },
            include: {
                profile: true,
                comments: true,
                blogLikes: true
            },
        })
        console.log("myblogs: ", myBlogs);
        res.json({ message: "Fetching of myBlogs successful", myBlogs })
    } catch (error) {
        console.error("Error getting a blog: ", error)
    }
});

//update blog likes  
router.put("/updatebloglike/:blogId", passport.authenticate("jwt", { session: false }), async (req: express.Request, res: express.Response) => {
    const { blogId } = req.params;
    const userId = (req.user as User).id;

    if (!blogId) {
        return res.status(400).json({ message: "Missing blog ID" });
    }
    try {
        const existingBlogLike = await prisma.blogLike.findUnique({
            where: { userId_blogId: { userId, blogId } }
        })

        if (existingBlogLike) {
            const blogLiked = !existingBlogLike.blogliked;

        const updatedBlogLike = await prisma.blogLike.update({
            where: { userId_blogId: { userId, blogId } },
            data: { blogliked: blogLiked }
        });


            const likeChange = blogLiked ? 1 : -1;

        await prisma.blog.update({
            where: { id: blogId },
            data: { blogLike: {increment: likeChange} }
        })

        return res.json({ message: 'Blog like updated successfully', updatedBlogLike });
        }
        else {
            const newBlogLike = await prisma.blogLike.create({
                data: {
                    blogliked: true,
                    userId,
                    blogId
                }
            });

            await prisma.blog.update({
                where: { id: blogId },
                data: {
                    blogLike: { increment: 1 }
                }
            });

            return res.json({ message: 'Blog like added successfully', newBlogLike });

        }
    } catch (error) {
        console.error("Error updating blog likes: ", error)
    }
});


//get blog by id
router.get("/feed/:blogId", passport.authenticate("jwt", { session: false }), async (req: express.Request, res: express.Response) => {
    try {
        const { blogId } = req.params;
        console.log(blogId);
        const singleBlog = await prisma.blog.findUnique({
            where: { id: blogId }
        })
        console.log("reached in feed/blogId");
        if (singleBlog) {
            res.json({ message: "Fetching of a Blog successful", singleBlog })
        } else {
            res.status(404).json({ message: 'Blog not found' })
        }
    } catch (error) {
        console.error("Error getting a blog: ", error)
    }
})


//update blog
router.put("/updatemyblog/:blogId", passport.authenticate("jwt", { session: false }), async (req: express.Request, res: express.Response) => {
    try {
        const { blogId } = req.params;
        const { title, description } = req.body
        const sanitizedDescription = sanitizeHtml(description);
        const updatedBlog = await prisma.blog.update({
            where: {
                id: blogId
            },
            data: {
                title: title,
                description: sanitizedDescription,
            }
        })

        res.json({ message: "Blog updated successfully", updatedBlog })
    } catch (error) {
        console.error("Error updating my blogs ", error)
    }
})

//delete blog
router.delete("/deleteblog/:id", passport.authenticate("jwt", { session: false }), async (req: express.Request<{ id: string }, {}, {}>, res: express.Response) => {
    try {
        const blogId = req.params.id
        const deleteMyBlog = await prisma.blog.delete({
            where: {
                id: blogId
            }
        })
        res.json({ message: "Blog deleted successfully", deleteMyBlog })

    } catch (error) {
        console.error("Error deleting my blog ", error)
    }
})

export default router