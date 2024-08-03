
import React, { useEffect } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import useAuth from '@/hooks/useAuth';
import { currUserId, isLoggedIn } from '@/store/atoms/isLoggedIn';
import axios from 'axios';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { currCommentState, editCommentState, selectedCommentIdState, selectedCommentState } from '@/store/atoms/commentAtoms';
import { DeleteBin, EditPencil, ThreeDotsMenu } from '@/components/ui/svg-elements';

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

    return (
        <div>
            {authState.isAuthenticated && userId === authUserId.userID && (
                <div >

                    {/* three dots */}
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <ThreeDotsMenu />
                        </DropdownMenuTrigger>

                        <DropdownMenuContent >

                            {/* Edit */}
                            <DropdownMenuItem onClick={handleClickEditComment}>
                                <EditPencil />
                                Edit
                            </DropdownMenuItem>

                            {/* Delete */}
                            <DropdownMenuItem onClick={handleDeleteComment}>
                                <DeleteBin />
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

