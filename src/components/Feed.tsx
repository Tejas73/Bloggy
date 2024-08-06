import { useEffect, useState } from "react";
import Appbar from "../utility-components/Appbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import sanitizeHtml from 'sanitize-html';
import { BlogLike, CommentBubble } from "./ui/svg-elements";
import { currUserId } from "@/store/atoms/isLoggedIn";
import { useRecoilValue } from "recoil";
// import { useRecoilState } from "recoil";
// import { selectedBlogIdState } from "@/store/atoms/blogAtoms";

//improve UI
// add like blog button and number of comments for each blog 

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
                <div className="py-2 " >
                    <div onClick={blogClick}>
                        {/* title  */}
                        <div className="text-3xl text-gray-800">{blogs.title}</div>

                        {/* name  */}
                        <div>{blogs.profile.name}</div>

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
                        <div onClick={() => blogLikeClick(blogs.id)}>
                            <BlogLike fillColor={
                                blogs.blogLikes.some(
                                    (prop: BlogLikes)=> prop.userId === thisUserId && prop.blogliked
                                )
                            } />
                            {/* {blogs.blogLikes.blogLiked ? (
                                <BlogLike fillColor={true} />
                            ) : (
                                <BlogLike fillColor={false} />
                            )} */}
                        </div>
                        <div>
                            {blogs.blogLike}
                        </div>


                        {/* blog comments  */}
                        <div onClick={blogClick}>
                            <CommentBubble />
                        </div>
                        <div onClick={blogClick}>
                            {blogs.comments.length}
                        </div>
                    </div>

                </div>
            </div>
        )
    })

    return (
        <div>
            <Appbar></Appbar>
            <div >
                <div className="w-2/4 mx-auto">
                    <div className="">
                        {getMyBLogs}
                    </div>
                </div>
            </div>
        </div>
    )

}

export default Feed;