//this file is untested
import express from "express"
import passport from "passport";
import prisma from "../utils/prismaClient";
import { User } from "@prisma/client";

const router = express.Router();

interface CommentBody {
    comment: string;  
    blogId: string; // ID of the blog the comment belongs to
    userId?: string; // Optional user ID for anonymous comments
}

interface UpdateCommentBody {
    comment: string
}

router.post("/blog/:blogId/createComment", passport.authenticate("jwt", { session: false }), async (req: express.Request<{ blogId: string }, {}, CommentBody>, res: express.Response) => {
    try {
        const {blogId} = req.params
        const { comment, userId } = req.body

        if (!comment ) {
            return res.json({ message: "Comment is empty" })
        }
        if (!blogId ) {
            return res.json({ message: "blogId is empty" })
        }
        

        const newComment = await prisma.comment.create({
            data: {
                comment,
                blog: { connect: { id: blogId } },
                user: userId ? { connect: { id: userId } } : undefined
            },
        });

        res.status(201).json({ message: "Comment created successfully", newComment });
    } catch (error) {
        console.error("Error creating comment: ", error);
        res.json({ message: "Error creating comment" });
    }
});

router.get("/allComments/user/:userId", passport.authenticate("jwt", { session: false }), async (req: express.Request<{ userId: string }, {}, {}>, res: express.Response) => {

    const userId = req.params.userId
    if (!userId) {
        return res.status(400).json({ message: 'Missing user ID' });
    }

    try {
        const userComments = await prisma.comment.findMany({
            where: { userId },
            include: { blog: true }
        });

        res.status(200).json({ message: " User Comments fetched successfully", userComments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching user comments' });
    }

})

router.get("/blog/:blogId/comments", passport.authenticate("jwt", { session: false }), async (req: express.Request<{ blogId: string }, {}, {}>, res: express.Response) => {

    const blogId = req.params.blogId
    if (!blogId) {
        return res.status(400).json({ message: 'Missing blog ID' });
    }

    try {
        const blogComments = await prisma.comment.findMany({
            where: { blogId },
            include: { user: true }
        });

        res.status(200).json({ message: " Blog Comments fetched successfully", blogComments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching blog comments' });
    }

})

//route to update a comment
router.put("/comments/:id", passport.authenticate("jwt", { session: false }), async (req: express.Request<{ id: string }, {}, UpdateCommentBody>, res: express.Response) => {

    const { id } = req.params
    const { comment } = req.body
    if (!id || !comment) {
        return res.status(400).json({ message: 'Missing comment ID or comment' });
    }

    try {
        const updateComment = await prisma.comment.update({
            where: { id },
            data: { comment }
        });

        res.status(200).json({ message: "Comment updated successfully", updateComment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating comment' });
    }

})

router.delete("/comments/:id", passport.authenticate("jwt", { session: false }), async (req: express.Request<{ id: string }, {}, UpdateCommentBody>, res: express.Response) => {

    const { id } = req.params
    if (!id) {
        return res.status(400).json({ message: 'Missing comment ID' });
    }

    try {
        const deleteComment = await prisma.comment.delete({
            where: { id }
        });

        if (deleteComment) {
            res.status(200).json({ message: 'Comment deleted successfully' });
        } else {
            res.status(404).json({ message: 'Comment not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting comment' });
    }

})


export default router;