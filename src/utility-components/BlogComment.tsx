import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useRecoilState } from "recoil";
import { currCommentState, selectedCommentIdState } from "@/store/atoms/commentAtoms";
import { editCommentState } from "@/store/atoms/commentAtoms";
import CommentMenu from "./CommentMenu";

//improve UI
// add likes and dislikes of the comments
// add comment sorting functionality by oldest and latest
//when user clicks on the edit button, it should display the text which has to be edited
interface Comment {
    id: string;
    comment: string;
    commentDislikes: number;
    commentLikes: number;
    userId: string;
    profile: { name: string }
}

interface BlogCommentsResponse {
    blogComments: Comment[];
}

const BlogComment = () => {
    const { blogId } = useParams<{ blogId: string }>();
    const [comment, setComment] = useState(""); // to create a comment
    const [currBlogComments, setCurrBlogComments] = useRecoilState(currCommentState); // to fetch the comments from the server
    const [isEditing, setIsEditing] = useRecoilState(editCommentState); // used for editing a comment based on boolean value of editCommentState
    const [editedComment, setEditedComment] = useState(""); //used to store the text during editing
    const [selectedCommentId, setSelectedCommentId] = useRecoilState(selectedCommentIdState); // used to provide the id for the intended comment
    const [liked, setLiked] = useState(0);
    const [disliked, setDisliked] = useState(0);
    const [likeClicked, setLikeClicked] = useState(false);
    const [dislikeClicked, setDislikeClicked] = useState(false);

    const getComments = async () => {
        try {
            const response = await axios.get<BlogCommentsResponse>(`http://localhost:3000/api/comment/showcomments/${blogId}`);
            // console.log("in useEffect: ", response.data.blogComments);
            setCurrBlogComments(response.data.blogComments);
        } catch (error) {
            console.error("Error fetching comments: ", error);
        }
    };

    useEffect(() => {
        getComments();
    }, [blogId]);

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

    const handleLikeButton = () => {
        if (likeClicked===false){
            setLiked(liked + 1);
            setLikeClicked(true);
        } else if( likeClicked === true){
            setLiked(liked - 1);
            setLikeClicked(false);
        }
    }
    
    const handleDislikeButton = () => {
        if (dislikeClicked===false){
            setDisliked(disliked + 1);
            setDislikeClicked(true);
        } else if( dislikeClicked === true){
            setDisliked(disliked - 1);
            setDislikeClicked(false);
        }
    }

    const showBlogComments = currBlogComments.map((comment) => (
        <div key={comment.id}>
            <div className="flex justify-between border border-slate-400">
                {/* when user clicks on edit  */}
                {isEditing && selectedCommentId === comment.id ? (<div>
                    <div>
                        <input
                            type="text"
                            id="comment"
                            value={editedComment}
                            onChange={(e) => setEditedComment(e.target.value)}

                        />

                    </div>
                    <div>
                        <Button onClick={handleCancelEditComment}>Cancel</Button>
                        <Button onClick={() => handleEditComment(comment.id)}>Save</Button>
                    </div>
                </div>) : (
                    <div>
                        <span className="text-gray-500 text-sm">{comment.profile.name}</span>
                        <div>{comment.comment}</div>

                        <div className="flex">

                            {/* like  */}
                            <div className="" onClick={handleLikeButton}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                                </svg>
                            </div>
                            <span>{liked}</span>

                            {/* dislike  */}
                            <div className="" onClick={handleDislikeButton} >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M7.498 15.25H4.372c-1.026 0-1.945-.694-2.054-1.715a12.137 12.137 0 0 1-.068-1.285c0-2.848.992-5.464 2.649-7.521C5.287 4.247 5.886 4 6.504 4h4.016a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23h1.294M7.498 15.25c.618 0 .991.724.725 1.282A7.471 7.471 0 0 0 7.5 19.75 2.25 2.25 0 0 0 9.75 22a.75.75 0 0 0 .75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 0 0 2.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384m-10.253 1.5H9.7m8.075-9.75c.01.05.027.1.05.148.593 1.2.925 2.55.925 3.977 0 1.487-.36 2.89-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398-.306.774-1.086 1.227-1.918 1.227h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 0 0 .303-.54" />
                                </svg>
                            </div>
                            <span>{disliked}</span>

                        </div>
                    </div>
                )}

                <div>
                    <CommentMenu id={comment.id} userId={comment.userId} />
                </div>
            </div>
        </div>
    ));

    console.log("currBlogComments: ", currBlogComments);
    //

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
