import React, { useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import useAuth from '@/hooks/useAuth';
import {
    currCommentState,
    selectedCommentIdState,
} from '@/store/atoms/commentAtoms';
import { isLoggedIn } from '@/store/atoms/isLoggedIn';
import axios from 'axios';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CommentDropDownProps {
    userId: string;
    id: string;
    initialComment: string;
}

const CommentDropDown: React.FC<CommentDropDownProps> = ({
    id,
    userId,
    initialComment,
}) => {
    useAuth();
    const auth = useRecoilValue(isLoggedIn);
    const setSelectedCommentId = useSetRecoilState(selectedCommentIdState);
    const [comments, setComments] = useRecoilState(currCommentState);

    const [editedComment, setEditedComment] = useState(initialComment);

    const handleEditThisComment = async () => {
        try {
            await axios.put(
                `http://localhost:3000/api/comment/editcomment/?userId=${userId}&id=${id}`,
                {
                    comment: editedComment,
                }
            );

            const updatedComments = comments.map(comment =>
                comment.id === id ? { ...comment, comment: editedComment } : comment
            );
            setComments(updatedComments);
            setSelectedCommentId(null);
        } catch (error) {
            console.error('Error editing comment: ', error);
        }
    };

    const handleDeleteComment = async () => {
        try {
            await axios.delete(
                `http://localhost:3000/api/comment/deletecomment/?userId=${userId}&id=${id}`
            );
            const updatedComments = comments.filter(comment => comment.id !== id);
            setComments(updatedComments);
            setSelectedCommentId(null);
        } catch (error) {
            console.error('Error deleting comment: ', error);
        }
    };

    return (
        <div>
            {auth.isAuthenticated && (
                <div className="flex items-center w-64">
                    <Input
                        type="text"
                        id="comment"
                        value={editedComment}
                        onChange={e => setEditedComment(e.target.value)}
                        placeholder="Type your comment"
                    />
                    <Button onClick={handleEditThisComment}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-4"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 12 3.269 3.125A59.769 59.768 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                            />
                        </svg>
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="size-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                                />
                            </svg>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="flex justify-around">
                            <DropdownMenuItem onClick={handleDeleteComment}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="size-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                    />
                                </svg>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}
        </div>
    );
};

export default CommentDropDown;
