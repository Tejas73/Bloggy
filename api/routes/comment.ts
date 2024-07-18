import express from "express"
import passport from "passport";
import prisma from "../utils/prismaClient";
import { User } from "@prisma/client";
import { connect } from "http2";

const router = express.Router();

interface CommentBody {
    comment: string;
    blogId: string; // ID of the blog the comment belongs to
    userId?: string; // Optional user ID for anonymous comments
}

interface UpdateCommentBody {
    comment: string;
    id: string;
    userId: string;
}

//create comment in the blog
router.post("/createComment/:blogId", passport.authenticate("jwt", { session: false }), async (req: express.Request<{ blogId: string }, {}, CommentBody>, res: express.Response) => {
    try {
        const { blogId } = req.params
        const { comment } = req.body
        const userId = (req.user as User).id
        if (!comment) {
            return res.json({ message: "Comment is empty" })
        }
        if (!blogId) {
            return res.json({ message: "blogId is empty" })
        }

        const userProfile = await prisma.profile.findUnique({
            where: { userId }
        })

        if (!userProfile) {
            return res.json({ message: "User profile not found for userId: ${userId}" })
        }

        const newComment = await prisma.comment.create({
            data: {
                comment,
                blog: { connect: { id: blogId } },
                user: userId ? { connect: { id: userId } } : undefined,
                profile: { connect: { id: userProfile.id } }
            },
        });
        console.log("comment: ", newComment.comment);
        res.json({ message: "Comment created successfully", newComment });
    } catch (error) {
        console.error("Error creating comment: ", error);
        res.json({ message: "Error creating comment" });
    }
});

//get comments for a blog
router.get("/showcomments/:blogId", passport.authenticate("jwt", { session: false }), async (req: express.Request<{ blogId: string }, {}, {}>, res: express.Response) => {
    const { blogId } = req.params;

    if (!blogId) {
        return res.status(400).json({ message: 'Missing blog ID' });
    }

    try {
        const blogComments = await prisma.comment.findMany({
            where: { blogId },
            include: {
                user: true,
                profile: {
                    select: { name: true }
                }
            }
        });
        console.log("blogComments:", blogComments);
        res.status(200).json({ message: "Blog Comments fetched successfully", blogComments });

    } catch (error) {
        console.error("Error fetching blog comments:", error);
        res.status(500).json({ message: 'Error fetching blog comments' });
    }
});

//route to put like or dislike in the comment
// likes and dislikes are not updating as expected  
router.put("/updateCommentLike/:commentId", passport.authenticate("jwt", { session: false }), async (req: express.Request<{ commentId: string }, {}, { liked: boolean; disliked: boolean }>, res: express.Response) => {
    const { commentId } = req.params;
    const { liked, disliked } = req.body;
    const userId = (req.user as User).id;

    if (!commentId) {
        return res.status(400).json({ message: "Missing comment ID" });
    }

    try {
        const existingLike = await prisma.commentLike.findUnique({
            where: {
                userId_commentId: {
                    userId,
                    commentId
                }
            }
        });

        if (existingLike) {
            await prisma.commentLike.update({
                where: {
                    userId_commentId: {
                        userId,
                        commentId
                    }
                },
                data: {
                    liked,
                    disliked
                }

            });

            if (liked && !existingLike.liked) {
                await prisma.comment.update({
                    where: { id: commentId },
                    data: {
                        commentLikes: { increment: 1 },
                        commentDislikes: existingLike.disliked ? { decrement: 1 } : undefined
                    }
                });
            }
            else if (liked && existingLike.liked) {
                await prisma.comment.update({
                    where: { id: commentId },
                    data: {
                        commentLikes: { decrement: 1 }
                    }
                });
            }

            if (disliked && !existingLike.disliked) {
                await prisma.comment.update({
                    where: { id: commentId },
                    data: {
                        commentDislikes: { increment: 1 },
                        commentLikes: existingLike.liked ? { decrement: 1 } : undefined
                    }
                });
            }
            else if (disliked && existingLike.disliked) {
                await prisma.comment.update({
                    where: { id: commentId },
                    data: {
                        commentDislikes: { decrement: 1 }
                    }
                })
            }
        }

        else {
            await prisma.commentLike.create({
                data: {
                    user: { connect: { id: userId } },
                    comment: { connect: { id: commentId } },
                    liked,
                    disliked
                }
            });

            if (liked) {
                await prisma.comment.update({
                    where: { id: commentId },
                    data: {
                        commentLikes: { increment: 1 }
                    }
                });
            } else if (disliked) {
                await prisma.comment.update({
                    where: { id: commentId },
                    data: { commentDislikes: { increment: 1 } }
                });
            }
        }

        return res.json({ message: 'Comment like/dislike updated successfully' });

    } catch (error) {
        console.log("Error updating like/dislike: ", error);
        return res.status(500).json({ message: 'Error updating comment like/dislike' });
    }
});

// route to edit a comment
router.put("/editcomment", passport.authenticate("jwt", { session: false }), async (req: express.Request<{ id: string }, {}, UpdateCommentBody>, res: express.Response) => {
    const { id, userId } = req.query as { id: string; userId: string };
    const { comment } = req.body;

    if (!id || !comment) {
        return res.status(400).json({ message: 'Missing comment ID or comment' });
    }

    try {
        // Fetch the existing comment by its id
        const existingComment = await prisma.comment.findUnique({
            where: { id }
        });

        if (!existingComment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Check if the userId from the request matches the userId of the fetched comment
        if (existingComment.userId === userId) {
            const updateComment = await prisma.comment.update({
                where: { id },
                data: { comment }
            });

            return res.status(200).json({ message: "Comment updated successfully", updateComment });
        } else {
            return res.status(403).json({ message: 'Unauthorized to update this comment' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error updating comment' });
    }
});


//delete comment
router.delete("/deletecomment", passport.authenticate("jwt", { session: false }), async (req: express.Request<{ id: string }, {}, UpdateCommentBody>, res: express.Response) => {

    const { id, userId } = req.query as { id: string, userId: string }
    if (!id) {
        return res.status(400).json({ message: 'Missing comment ID' });
    }

    try {
        const existingComment = await prisma.comment.findUnique({
            where: { id }
        })

        if (!existingComment) {
            res.status(404).json({ message: 'Comment not found' });
        }
        if (existingComment?.userId === userId) {
            const deleteComment = await prisma.comment.delete({
                where: { id }
            });
            if (deleteComment) {
                res.status(200).json({ message: 'Comment deleted successfully' });
            } else {
                return res.status(403).json({ message: 'Unauthorized to delete this comment' });
            }
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting comment' });
    }

})

//show user their comments in My Profile for each user
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

export default router;