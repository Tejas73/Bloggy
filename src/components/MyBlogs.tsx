import { useEffect, useState } from "react";
import Appbar from "../utility-components/Appbar";
import axios from "axios";
import sanitizeHtml from 'sanitize-html';

// improve UI

interface BlogField {
    title: string,
    description: string
}

interface MyBlogsField {
    myBlogs: Array<BlogField>
}

const MyBlogs = () => {
    const [myblogs, setMyblogs] = useState<MyBlogsField | null>(null);
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
        return (
            <div className="py-2">

                <div className="text-3xl text-gray-800">{blog.title}</div>

                <div className="relative h-11 overflow-hidden">
                    <div
                        className="absolute inset-0 bg-gradient-to-t from-white via-white to-transparent pointer-events-none"
                        
                    ></div>
                    <div
                        className="relative px-6 text-justify text-gray-600"
                        dangerouslySetInnerHTML={{ __html: sanitizeHtml(blog.description || '') }}
                    />
                </div>
            </div>
        )
    })

    return (
        <div>
            <Appbar></Appbar>
            <div>
                <div className="w-2/4 mx-auto py-9">
                    <h1 className="text-3xl font-bold">My Blogs</h1>
                    <div className="mt-4">
                        {getMyBLogs}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyBlogs;