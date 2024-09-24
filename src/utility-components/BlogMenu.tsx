
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/ui/dropdown-menu';
import useAuth from '@/hooks/useAuth';
import axios from 'axios';
import { DeleteBin, EditPencil, ThreeDotsMenu } from '@/ui/svg-elements';
import { useNavigate } from 'react-router-dom';
import { currUserId, isLoggedIn } from '@/store/atoms/isLoggedIn';
import { useRecoilState, useRecoilValue, } from 'recoil';
import { currBlogState } from '@/store/atoms/blogAtoms';

// optimze the re-renders caused by the useEffect
interface BlogMenuProps {
    id: string,
    userId: string,
}

interface BlogLikes {
    blogId: string,
    blogliked: boolean,
    userId: string
}

interface BlogField {
    id: string,
    title: string,
    description: string,
    authorId: string,
    blogLike: number,
    profile: {
        bio: string,
        id: string,
        name: string,
        userId: string
    },
    comments: { length: number },
    blogLikes: Array<BlogLikes>
}

const origin = import.meta.env.VITE_ORIGIN;

const BlogMenu: React.FC<BlogMenuProps> = ({ id, userId }) => {
    useAuth();

    const navigate = useNavigate();
    const [myblogs, setMyblogs] = useRecoilState<BlogField[] | null>(currBlogState);
    const authState = useRecoilValue(isLoggedIn);
    const authUserId = useRecoilValue(currUserId);
    const thisUserId = authUserId.userID;

    const handleEditThisBlog = async () => {
        navigate(`/myblog/${id}`)
    };

    const handleDeleteThisBlog = async () => {
        try {
            await axios.delete(
                `${origin}/api/blog/deleteblog/${id}`
            );
            if (myblogs) { 
                const updatedBlogs = myblogs.filter(blogs => blogs.id !== id);
                setMyblogs(updatedBlogs);
            }

        } catch (error) {
            console.error('Error deleting blog: ', error);
        }
    };

    return (
        <div>
            {authState.isAuthenticated && userId === thisUserId && (
                <div >

                    {/* three dots */}
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <ThreeDotsMenu />
                        </DropdownMenuTrigger>

                        <DropdownMenuContent >

                            {/* Edit */}
                            <DropdownMenuItem onClick={handleEditThisBlog}>
                                <EditPencil />
                                Edit blog
                            </DropdownMenuItem>

                            {/* Delete */}
                            <DropdownMenuItem onClick={handleDeleteThisBlog}>
                                <DeleteBin />
                                Delete blog
                            </DropdownMenuItem>

                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}
        </div>
    );
};

export default BlogMenu;