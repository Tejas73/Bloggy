
import React, { useEffect } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import useAuth from '@/hooks/useAuth';
import { currUserId, isLoggedIn } from '@/store/atoms/isLoggedIn';
import axios from 'axios';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { currCommentState, editCommentState, selectedCommentIdState, selectedCommentState } from '@/store/atoms/commentAtoms';
import { useCookies } from 'react-cookie';

// optimze the re-renders caused by the useEffect
//improve UI
interface CommentMenuProps {
    userId: string;
    id: string;
    comment:string;
}

const CommentMenu: React.FC<CommentMenuProps> = ({
    id,
    userId,
    comment
}) => {
    useAuth();

    
    const authState = useRecoilValue(isLoggedIn);

    const setSelectedCommentId = useSetRecoilState(selectedCommentIdState);
    const [comments, setComments] = useRecoilState(currCommentState); // currCommentState holds all the current blog comments
    const setIsEditComment = useSetRecoilState(editCommentState) // used for editing a comment based on boolean value of editCommentState
    const [authUserId, setAuthUserId] = useRecoilState(currUserId);
    const setSelectedComment = useSetRecoilState(selectedCommentState);
    const [cookie, setCookie] = useCookies(['jwt']);

    useEffect(() => {
        const getCurrUserId = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/user/check', {
                    withCredentials: true
                });
                const { userId } = response.data;
                // return userId ? { userID: userId } : { userID: null };
                if (userId) {
                    setAuthUserId({ userID: userId })
                }
            } catch (error) {
                console.error("Error fetching current userID :", error);
            }
        }
        getCurrUserId();
    }, []);

    const handleClickEditComment = async () => {
        setSelectedCommentId(id);
        setIsEditComment(true);
        setSelectedComment(comment);
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

    // console.log("cookies.jwt from COMMENTMENU:", cookie.jwt);
    // console.log("authState.isAuthenticated from COMMENTMENU:", authState.isAuthenticated); 
    // console.log("authUserId.userID from COMMENTMENU:", authUserId.userID); 
    // console.log("userId from COMMENTMENU:", userId);

    return (
        <div>
            {authState.isAuthenticated && userId === authUserId.userID && (
                <div className="flex items-center w-64">

                    {/* three dots */}
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

                        <DropdownMenuContent >

                            {/* Edit */}
                            <DropdownMenuItem onClick={handleClickEditComment}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                </svg>

                                Edit
                            </DropdownMenuItem>

                            {/* Delete */}
                            <DropdownMenuItem onClick={handleDeleteComment}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>

                                Delete
                            </DropdownMenuItem>

                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}
        </div>
    );
};

export default CommentMenu;

