import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
// import { useRecoilState } from "recoil";
import { useRecoilState, useRecoilValue } from "recoil";
import { currCommentState, selectedCommentIdState } from "@/store/atoms/commentAtoms";
import { editCommentState } from "@/store/atoms/commentAtoms";
import CommentMenu from "./CommentMenu";
import { currUserId } from "@/store/atoms/isLoggedIn";

//improve UI
// add likes and dislikes of the comments
//one user can only like or dislike a comment
// the  dislike request shouldn't be decremented and sent if the value is 0.

// add comment sorting functionality by oldest and latest
//when user clicks on the edit button, it should display the text which has to be edited
interface Like {
    liked: boolean;
    disliked: boolean;
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


const BlogCommentTest = () => {
    const { blogId } = useParams<{ blogId: string }>();
    const [comment, setComment] = useState(""); // to create a comment
    const [currBlogComments, setCurrBlogComments] = useRecoilState(currCommentState); // to fetch the comments from the server
    const [editedComment, setEditedComment] = useState(""); //used to store the text during editing
    const [isEditing, setIsEditing] = useRecoilState(editCommentState); // used for editing a comment based on boolean value of editCommentState
    const [selectedCommentId, setSelectedCommentId] = useRecoilState(selectedCommentIdState); // used to provide the id for the intended comment

    const authUserId = useRecoilValue(currUserId);// holds the curr user ID

    //the BE expects a boolean value true or false in order to function properly.
    //when the FE fetches the comments, 
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

    const handleLikeButton = async (commentId: string) => {
        const comment = currBlogComments.find(c => c.id === commentId);
        const userLike = comment?.likes.find(like => like.userId === authUserId);
        const newLikeState = userLike ? !userLike.liked : true;
        
        try {
            await axios.put(`http://localhost:3000/api/comment/updatecommentlike/${commentId}`, { liked: newLikeState });
            getComments();
        } catch (error) {
            console.error("Error updating like: ", error);
        }
    };

    const handleDislikeButton = async (commentId: string) => {
        const comment = currBlogComments.find(c => c.id === commentId);
        const userLike = comment?.likes.find(like => like.userId === authUserId);
        const newDislikeState = userLike ? !userLike.disliked : true;
        
        try {
            await axios.put(`http://localhost:3000/api/comment/updatecommentdislike/${commentId}`, { disliked: newDislikeState });
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
                        <Button onClick={handleCancelEditComment}>Cancel</Button>
                        <Button onClick={() => handleEditComment(comment.id)}>Save</Button>
                    </div>
                </div>) : (
                    //
                    //
                    // when user is not editing 
                    <div>
                        <span className="text-gray-500 text-sm">{comment.profile.name}</span>
                        <div>{comment.comment}</div>

                        <div className="flex">

                            {/* like  */}
                            <div className="" onClick={() => handleLikeButton(comment.id)}>
                                like
                            </div>
                            <span>{comment.commentLikes}</span>

                            {/* dislike  */}
                            <div className="" onClick={() => handleDislikeButton(comment.id)} >
                                dislike
                            </div>
                            <span>{comment.commentDislikes}</span>

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

export default BlogCommentTest;

// blogId: "54050aaf-fcfb-4402-aa2f-68d56dd1cf27"
// comment: "test 1 comment 1"
// commentDislikes: 0
// commentLikes: 0
// id: "67fe03eb-7755-4e90-a203-1d1264532035"
// likes: Array(0)
// length: 0
// profile: {name: 'test 1 name'}
// profileId: "d153fbd4-b4aa-4acc-ad68-07991e1f439d"
// user: {id: '0b26e4ec-5ea8-457b-91f3-c80a92ce192a', email: 'test1@gmail.com', password:        '$2a$10$8eCa6jDJwENORDNb7UNDDu01M5Q9YrleqQdRFbvt6G/       caNGJNVdwe'}
// userId: "0b26e4ec-5ea8-457b-91f3-c80a92ce192a"






  // const handleLikeButton = (commentId: string) => {
        
    //     if (likeClicked === false) {
    //         setLiked(liked + 1);
    //         setLikeClicked(true);
    //     } else if (likeClicked === true) {
    //         setLiked(liked - 1);
    //         setLikeClicked(false);
    //     }
    // }

    // const handleDislikeButton = (commentId: string) => {
    //     if (dislikeClicked === false) {
    //         setDisliked(disliked + 1);
    //         setDislikeClicked(true);
    //     } else if (dislikeClicked === true) {
    //         setDisliked(disliked - 1);
    //         setDislikeClicked(false);
    //     }
    // }
