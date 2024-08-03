
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useRecoilState, useRecoilValue, } from "recoil";
import { currCommentState, selectedCommentIdState, selectedCommentState } from "@/store/atoms/commentAtoms";
import { editCommentState } from "@/store/atoms/commentAtoms";
import CommentMenu from "./CommentMenu";
import { currUserId } from "@/store/atoms/isLoggedIn";
import { DislikeBtn, LikeBtn } from "@/components/ui/svg-elements";

//improve UI
//the like and dislike button should glow if their respective values are true

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
    const [authUserId, setAuthUserId] = useRecoilState(currUserId);
    const thisUserId = authUserId.userID;

    //optimize this useEffect for getCurrUserId
    useEffect(() => {
        const getCurrUserId = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/user/check', {
                    withCredentials: true
                });
                const { userId } = response.data;
                if (userId) {
                    setAuthUserId({ userID: userId })
                }
            } catch (error) {
                console.error("Error fetching current userID :", error);
            }
        }
        getCurrUserId();
    }, []);


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
        <div key={comment.id}>
            <div className="flex justify-between border border-slate-400">

                {/* when user clicks on edit  */}
                {isEditing && selectedCommentId === comment.id ? (

                    <div>
                        <div>
                            <input
                                type="text"
                                id="comment"
                                value={editedComment}
                                onChange={(e) => setEditedComment(e.target.value)}
                            />

                        </div>
                        <div>
                            <Button onClick={() => handleEditComment(comment.id)}>Save</Button>
                            <Button onClick={handleCancelEditComment}>Cancel</Button>
                        </div>
                    </div>) : (
                    // when user is not editing
                    <div>
                        <span className="text-gray-500 text-sm">{comment.profile.name}</span>
                        <div>{comment.comment}</div>

                        <div className="flex">
                            {/* like  */}
                            <div className="" onClick={() => handleLikeButton(comment.id)}>
                                {comment.likes.some((prop: Like) => prop.userId === thisUserId) ? (
                                    <LikeBtn fillColor={comment.likes.some((prop: Like) => prop.userId === thisUserId && prop.liked)} />
                                ) : (
                                    <LikeBtn fillColor={false} />
                                )}
                            </div>
                            <span>{comment.commentLikes}</span>

                            {/* dislike  */}
                            <div className="" onClick={() => handleDislikeButton(comment.id)}>
                                {comment.likes.some((prop: Like) => prop.userId === thisUserId) ? (
                                    <DislikeBtn fillColor={comment.likes.some((prop: Like) => prop.userId === thisUserId && prop.disliked)} />
                                ) : (
                                    <DislikeBtn fillColor={false} />
                                )}
                            </div>
                            <span>{comment.commentDislikes}</span>

                        </div>
                    </div>
                )}

                <div>
                    <CommentMenu id={comment.id} userId={comment.userId} comment={comment.comment} />
                </div>
            </div>
        </div>
    ));

    console.log("currBlogComments: ", currBlogComments);

    return (
        <div className="container bg-zomp">
            <div>Comments</div>
            <div>
                <Input
                    type="text"
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment"
                />

                <Button onClick={handleCreateComment}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                    </svg>
                </Button>
            </div>
            <div>
                {showBlogComments}
            </div>
        </div>
    );
};

export default BlogComment;


{/* {(prop.liked === true) && prop.userId === thisUserId && (
                                            <LikeBtn fillColor={true} />
                                        )}

                                        {(prop.liked === false) && prop.userId === thisUserId ? (
                                            <LikeBtn fillColor={false} />
                                        ) : (
                                            <LikeBtn fillColor={false} />
                                        )} */}