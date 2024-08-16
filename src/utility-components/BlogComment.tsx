
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import axios from "axios";
import { useRecoilState, useRecoilValue, } from "recoil";
import { currCommentState, selectedCommentIdState, selectedCommentState } from "@/store/atoms/commentAtoms";
import { editCommentState } from "@/store/atoms/commentAtoms";
import CommentMenu from "./CommentMenu";
import { currUserId } from "@/store/atoms/isLoggedIn";
import { CommentBtn, DislikeBtn, LikeBtn } from "@/ui/svg-elements";

interface Like {
    liked: boolean;
    disliked: boolean;
    userId: null | string;
}

interface Comment {
    id: string;
    comment: string;
    commentDislikes: number;
    commentLikes: number;
    userId: string;
    profile: { name: string };
    likes: Like[];
}

interface BlogCommentsResponse {
    blogComments: Comment[];
}
const BlogComment = () => {
    const { blogId } = useParams<{ blogId: string }>();
    const [comment, setComment] = useState(""); // to create a comment
    const [currBlogComments, setCurrBlogComments] = useRecoilState(currCommentState); // to fetch the comments from the server
    const [selectedCommentId, setSelectedCommentId] = useRecoilState(selectedCommentIdState); // used to provide the id for the intended comment
    const [isEditing, setIsEditing] = useRecoilState(editCommentState); // used for editing a comment based on boolean value of editCommentState
    const [editedComment, setEditedComment] = useState(''); //used to store the text during editing before sending it to the BE
    const selectedComment = useRecoilValue(selectedCommentState);
    const authUserId = useRecoilValue(currUserId);
    const thisUserId = authUserId.userID;
    console.log("authUserId: ", authUserId);
    console.log("thisUserId: ", thisUserId);

    const getComments = async () => {
        try {
            const response = await axios.get<BlogCommentsResponse>(`http://localhost:3000/api/comment/showcomments/${blogId}`);
            setCurrBlogComments(response.data.blogComments);
        } catch (error) {
            console.error("Error fetching comments: ", error);
        }
    };

    useEffect(() => {
        getComments();
    }, [blogId]);

    useEffect(() => {
        if (isEditing && selectedComment) {
            setEditedComment(selectedComment);
        }
    }, [isEditing, selectedComment]);

    const handleCreateComment = async () => {
        try {
            const response = await axios.post(`http://localhost:3000/api/comment/createComment/${blogId}`, {
                comment
            });
            if (response.status === 200) {
                setComment(""); //clears the commment field
                getComments(); // Re-fetch comments to update the list
            }
        } catch (error) {
            console.error("Error sending createComment request: ", error);
        }
    };

    const handleEditComment = async (id: string) => {
        try {
            await axios.put(
                `http://localhost:3000/api/comment/editcomment/?id=${currBlogComments[0].id}&userId=${currBlogComments[0].userId}`,
                {
                    comment: editedComment,
                }
            );

            const updatedComments = currBlogComments.map(comment =>
                comment.id === id ? { ...comment, comment: editedComment } : comment
            );
            setCurrBlogComments(updatedComments);
            setEditedComment("");
            handleCancelEditComment();
        } catch (error) {
            console.error('Error editing comment: ', error);
        }
    };

    const handleCancelEditComment = () => {
        setIsEditing(false);
        setEditedComment("");
        setComment("");
        setSelectedCommentId(null);
    }

    const handleLikeButton = async (commentId: string) => {

        try {
            await axios.put(`http://localhost:3000/api/comment/updatecommentlike/${commentId}`);
            getComments();
        } catch (error) {
            console.error("Error updating like: ", error);
        }
    };

    const handleDislikeButton = async (commentId: string) => {

        try {
            await axios.put(`http://localhost:3000/api/comment/updatecommentdislike/${commentId}`);
            getComments();
        } catch (error) {
            console.error("Error updating dislike: ", error);
        }
    };

    const showBlogComments = currBlogComments.map((comment) => (

        <div key={comment.id} className="flex justify-between py-4 ">

            {/* when user clicks on edit  */}
            {isEditing && selectedCommentId === comment.id && comment.userId === thisUserId ? (

                <div>

                    <div >
                        <Input
                            type="text"
                            id="comment"
                            value={editedComment}
                            onChange={(e) => setEditedComment(e.target.value)}
                            className="border-2 w-96"
                        />

                    </div>

                    <div className="flex  p-2">
                        {/* Cancel  */}
                        <Button onClick={handleCancelEditComment}
                            className="m-1 rounded-full">
                            Cancel
                        </Button>

                        {/* Save  */}
                        <Button onClick={() => handleEditComment(comment.id)}
                            className="mr-1 mt-1 rounded-full ">
                            Save
                        </Button>
                    </div>

                </div>) : (
                // when user is not editing
                <div>
                    <span className="text-gray-500 text-sm">{comment.profile.name}</span>
                    <div>{comment.comment}</div>

                    <div className="flex">
                        {/* like  */}
                        <div className="" onClick={() => handleLikeButton(comment.id)}>
                            <LikeBtn
                                fillColor={comment.likes.some(
                                    (prop: Like) => prop.userId === thisUserId && prop.liked
                                )}
                            />                            
                        </div>
                        <span>{comment.commentLikes}</span>

                        {/* dislike  */}
                        <div className="" onClick={() => handleDislikeButton(comment.id)}>
                            <DislikeBtn
                                fillColor={comment.likes.some(
                                    (prop: Like) => prop.userId === thisUserId && prop.disliked
                                )}
                            />
                        </div>
                        <span>{comment.commentDislikes}</span>

                    </div>
                </div>
            )}

            <div className="w-6 h-fit" >
                {isEditing && selectedCommentId === comment.id && comment.userId === thisUserId ?
                    (<></>) : (
                        <CommentMenu id={comment.id} userId={comment.userId} comment={comment.comment} />
                    )}
            </div>
        </div>
    ));

    console.log("currBlogComments: ", currBlogComments);

    return (
        <div className="container">
            <div className="text-2xl" >Responses</div>
            <hr className="h-px mt-1 mb-2 bg-gray-300 border-0 dark:bg-gray-700" />

            <div className=" pt-5">
                <Input
                    type="text"
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment"
                    className="border-2"
                />

                <div className="flex flex-row-reverse p-2">
                    {/* Save  */}
                    <Button onClick={handleCreateComment}
                        className="ml-1 mt-1 rounded-full"
                    >
                        <CommentBtn></CommentBtn>
                    </Button>

                    {/* Cancel  */}
                    <Button onClick={handleCancelEditComment}
                        className="m-1 rounded-full"
                    >Cancel</Button>
                </div>
            </div>
            <div>
                {showBlogComments}
            </div>
        </div>
    );
};

export default BlogComment;