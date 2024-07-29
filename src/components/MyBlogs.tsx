import { useEffect, useState } from "react";
import Appbar from "../utility-components/Appbar";
import axios from "axios";
import sanitizeHtml from 'sanitize-html';
import { useNavigate } from "react-router-dom";

// improve UI
//add editing the blogs feature using createBlog(use put request)
interface BlogField {
    title: string,
    description: string,
    id: string,
    profile: {
        bio: string,
        id: string,
        name: string,
        userId: string
    }
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
            <div className="border p-3">
                <div className="py-2 " onClick={editThisBlog}>
                    {/* title  */}
                    <div className="text-3xl text-gray-800">{blog.title}</div>

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
                </div>
            </div>
        )
    })

    return (
        <div>
            <Appbar></Appbar>
            <div>
                <div className="w-2/4 mx-auto p-4 ">
                    <h1 className="text-3xl">My Blogs</h1>

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