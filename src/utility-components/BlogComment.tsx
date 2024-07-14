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
    profile: {name: string}
}

interface BlogCommentsResponse {
    blogComments: Comment[];
}

const BlogComment = () => {
    const { blogId } = useParams<{ blogId: string }>();
    const [comment, setComment] = useState(""); // to create a comment
    const [currBlogComments, setCurrBlogComments] = useRecoilState(currCommentState); // to fetch the comments from the server
    const [isEditing, setIsEditing] = useRecoilState(editCommentState) // used for editing a comment based on boolean value of editCommentState
    const [editedComment, setEditedComment] = useState("");
    const [selectedCommentId, setSelectedCommentId] = useRecoilState(selectedCommentIdState);

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
