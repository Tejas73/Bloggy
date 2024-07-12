import { useEffect, useState } from "react";
import Appbar from "../utility-components/Appbar";
import axios from "axios";

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
        const CurrBlogs = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/blog/myblogs")
                console.log(response.data);
                setMyblogs(response.data);
            } catch (error) {
                console.error("Error fetching blog data: ", error);
            }
        }
        CurrBlogs();
    }, [])
    console.log("z", myblogs);

    const getMyBLogs = myblogs?.myBlogs.map((blog) => {
        return (
            <div>
                <div dangerouslySetInnerHTML={{ __html: blog.title }} />
                <div dangerouslySetInnerHTML={{ __html: blog.description }} />
                {/* <div>{blog.title}</div>
                <div>{blog.description}</div> */}
            </div>
        )
    })

    return (
        <div>
            <Appbar></Appbar>
            <div>
                <div className="w-2/4 mx-auto p-4 bg-fuchsia-400">
                    <h1 className="text-2xl font-bold">My Blogs</h1>
                    <div className="mt-4">
                        {getMyBLogs}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyBlogs;