import { useEffect, useState } from "react";
import Appbar from "../utility-components/Appbar";
import axios from "axios";
import sanitizeHtml from 'sanitize-html';
import { useNavigate } from "react-router-dom";
import { BlogLike, CommentBubble } from "@/ui/svg-elements";

// improve UI
//add a three dot menu for edit and delete feature of a blog
// when clicked on the blog, instead of editing EditBlog, Blog should be called
interface BlogLikes {
    blogId: string,
    blogliked: boolean,
    userId: string
}

interface BlogField {
    title: string,
    description: string,
    id: string,
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

interface MyBlogsField {
    myBlogs: Array<BlogField>
}

const MyBlogs = () => {
    const [myblogs, setMyblogs] = useState<MyBlogsField | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const currBlogs = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/blog/myblogs")
                console.log(response.data);
                setMyblogs(response.data);
            } catch (error) {
                console.error("Error fetching blog data: ", error);
            }
        }
        currBlogs();
    }, [])
    console.log("myblogs: ", myblogs);


    const getMyBLogs = myblogs?.myBlogs.map((blog) => {
        const editThisBlog = () => {
            navigate(`/myblog/${blog.id}`)
        }

        return (
            <div className="border p-3" key={blog.id}>
                <div className="py-2 " onClick={editThisBlog}>
                    {/* title  */}
                    <div className="text-xl lg:text-3xl text-gray-800">{blog.title}</div>

                    {/* name  */}
                    <div>{blog.profile.name}</div>

                    {/* description */}
                    <div className="relative h-11 overflow-hidden">
                        <div
                            className="absolute inset-0 bg-gradient-to-t from-white via-white to-transparent pointer-events-none"

                        ></div>
                        <div
                            className="relative px-6 text-justify text-gray-600"
                            dangerouslySetInnerHTML={{ __html: sanitizeHtml(blog.description || '').trim() }}
                        />
                    </div>

                    <div className="flex pt-5">

                        {/* blog like  */}
                        <div className="hover:cursor-pointer">
                            <BlogLike fillColor={true} />
                        </div>
                        <div>
                            {blog.blogLike}
                        </div>


                        {/* blog comments  */}
                        <div className="hover:cursor-pointer pl-3">
                            <CommentBubble />
                        </div>
                        <div className="hover:cursor-pointer" >
                            {blog.comments.length}
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
            <div>
                <div className="w-4/5 md:w-3/5 lg:w-3/5 mx-auto pt-16 md:pt-20">
                {/* <div className="w-2/4 mx-auto p-4 pt-24"> */}
                    <div className="text-3xl fixed bg-opacity-100 z-10 bg-white w-full py-2">My Blogs</div>

                    {/* line */}
                    <hr className="h-px mt-4 mb-8 bg-gray-300 border-0 dark:bg-gray-700" />

                    {/* my blogs  */}
                    <div className="mt-4">
                        {getMyBLogs}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyBlogs;