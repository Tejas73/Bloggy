import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import CommentDropDown from "./CommentDropDown";
import { useRecoilState } from "recoil";
import { currCommentState } from "@/store/atoms/commentAtoms";

interface Comment {
    id: string;
    comment: string;
    commentDislikes: number;
    commentLikes: number;
    userId: string;
}

interface BlogCommentsResponse {
    blogComments: Comment[];
}

const BlogComment = () => {
    const { blogId } = useParams<{ blogId: string }>();
    const [comment, setComment] = useState(""); // to create a comment
    const [currBlogComments, setCurrBlogComments] = useRecoilState(currCommentState); // to fetch the comment

    const getComments = async () => {
        try {
            const response = await axios.get<BlogCommentsResponse>(`http://localhost:3000/api/comment/showcomments/${blogId}`);
            console.log("in useEffect: ", response.data.blogComments);
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
                console.log("Comment created successfully");
                console.log("comment: ", comment);
                setComment(""); //clears the commment field
                getComments(); // Re-fetch comments to update the list
            }
        } catch (error) {
            console.error("Error sending createComment request: ", error);
        }
    };

    console.log("currBlogComments: ", currBlogComments);
    
    const showBlogComments = currBlogComments.map((comment) => (
        <div key={comment.id}>
            <div className="flex justify-between border border-slate-400">
                <div>
                    {comment.comment}
                </div>
                <div>
                    <CommentDropDown id={comment.id} userId={comment.userId} initialComment={""} />
                </div>
            </div>
        </div>
    ));
    
    return (
        <div className="container bg-zomp">
            <div>comment section</div>
            <div>
                <Input
                    type="text"
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Type your comment"
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
