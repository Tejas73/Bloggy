import { useEffect, useState } from "react";
import Appbar from "../utility-components/Appbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import sanitizeHtml from 'sanitize-html';
import { BlogLike, CommentBubble, AuthorIcon } from "../ui/svg-elements";
import { currUserId } from "@/store/atoms/isLoggedIn";
import { useRecoilValue } from "recoil";

interface BlogLikes {
    blogId: string,
    blogliked: boolean,
    userId: string
}
interface Blogs {
    id: string,
    title: string,
    description: string,
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

interface ShowFeed {
    showBlogs: Array<Blogs>
}

const Feed = () => {
    const [feed, setFeed] = useState<ShowFeed | null>(null);
    const authUserId = useRecoilValue(currUserId);
    const thisUserId = authUserId.userID;
    const navigate = useNavigate();

    const currBlogs = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/blog/allblogs")
            console.log("response.data: ", response.data);
            setFeed(response.data);
        } catch (error) {
            console.error("Error fetching feed data: ", error);
        }
    }
    useEffect(() => {
        currBlogs();
    }, []);



    const getMyBLogs = feed?.showBlogs.map((blogs) => {

        const blogClick = () => {
            navigate(`/feed/${blogs.id}`)
        }

        const blogLikeClick = async (blogId: string) => {
            try {
                const response = await axios.put(`http://localhost:3000/api/blog/updatebloglike/${blogId}`);
                console.log("response.data FEED: ", response.data);
                currBlogs();

            } catch (error) {
                console.error("Error liking a blog: ", error);
            }
        }

        return (
            <div className="border p-3 " key={blogs.id}>

                <div className="py-2 hover:cursor-pointer" >
                    <div onClick={blogClick}>
                        {/* title  */}
                        <div className="text-xl lg:text-3xl text-gray-800">{blogs.title}</div>

                        {/* name  */}
                        <div className="flex">
                            <div className="pr-1 pt-1"><AuthorIcon /></div>
                            <div> {blogs.profile.name}</div>
                        </div>

                        {/* description  */}
                        <div className="relative h-11 overflow-hidden">
                            <div
                                className="absolute inset-0 bg-gradient-to-t from-white via-white to-transparent pointer-events-none"
                            ></div>
                            <div
                                className="relative mt-1 px-6 text-justify text-gray-600"
                                dangerouslySetInnerHTML={{ __html: sanitizeHtml(blogs.description || '').trim() }}
                            />
                        </div>

                    </div>

                    <div className="flex pt-5">

                        {/* blog like  */}
                        <div className="hover:cursor-pointer" onClick={() => blogLikeClick(blogs.id)}>
                            <BlogLike fillColor={
                                blogs.blogLikes.some(
                                    (prop: BlogLikes) => prop.userId === thisUserId && prop.blogliked
                                )
                            } />
                        </div>
                        <div>
                            {blogs.blogLike}
                        </div>


                        {/* blog comments  */}
                        <div className="hover:cursor-pointer pl-3" onClick={blogClick}>
                            <CommentBubble />
                        </div>
                        <div className="hover:cursor-pointer" onClick={blogClick}>
                            {blogs.comments.length}
                        </div>
                    </div>

                </div>
            </div>
        )
    })

    return (
        <div>

            <div>
                <Appbar></Appbar>
            </div>
                <div className="w-4/5 md:w-3/5 lg:w-3/5 mx-auto pt-10 md:pt-20">
                    <div className="">
                        {getMyBLogs}
                    </div>
                </div>
                
        </div>
    )

}

export default Feed;