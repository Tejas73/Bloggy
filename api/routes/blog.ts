import express from "express"
import passport from "passport";
import prisma from "../utils/prismaClient";
import { User } from "@prisma/client";

const router = express.Router();

interface BlogTypes{
    title: string,
    description:string
}

router.post("/createBlog", passport.authenticate("jwt", { session: false }), async (req:express.Request<{},{},BlogTypes>, res:express.Response) => {
    try {
        const { title, description } = req.body;

        const newBlog = await prisma.blog.create({
            data: {
                title,
                description,
                authorId: (req.user as User).id
            }
        })

        res.json({ message: "Blog created successfully", newBlog })

    } catch (error) {
        console.error("Error creating a blog: ", error)
    }
})

router.get("/myBlogs", passport.authenticate("jwt", { session: false }), async (req:express.Request, res:express.Response) => {
    try {
        const myBlog = await prisma.blog.findMany({
            where: {
                authorId: (req.user as User).id
            },
            distinct: ["id"]
        })
        res.json({ message: "Fetching of myBlogs successful", myBlog })
    } catch (error) {
        console.error("Error getting a blog: ", error)
    }
})
router.get("/allBlogs", passport.authenticate("jwt", { session: false }), async (req:express.Request, res:express.Response) => {
    try {
        const showBlogs = await prisma.blog.findMany({})
        res.json({ message: "Fetching of all Blogs successful", showBlogs })
    } catch (error) {
        console.error("Error getting all blogs: ", error)
    }
})

router.put("/updateMyBlog", passport.authenticate("jwt", { session: false }), async (req:express.Request<{},{},BlogTypes>, res:express.Response) => {
    try {
        const { title, description } = req.body
        const updatedBlog = await prisma.blog.updateMany({
            where: {
                authorId: (req.user as User).id
            },
            data: {
                title: title,
                description: description,
            }
        })

        res.json({ message: "Blog updated successfully", updatedBlog })
    } catch (error) {
        console.error("Error updating my blogs ", error)
    }
})

router.delete("/deleteBlog/:id", passport.authenticate("jwt", { session: false }), async (req: express.Request<{id:string},{},{}>, res:express.Response) => {
    try {
        const blogId = req.params.id
        const deleteMyBlog= await prisma.blog.delete({
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