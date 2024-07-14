import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BlogComment from "../utility-components/BlogComment";

//improve UI
// fix the rendering of title and description of the blogs 
interface OpenedBlogFields {
    title: string,
    description: string
}

const Blog = () => {
    const { blogId } = useParams();
    console.log("blogId: ", blogId)
    const [openedBlog, setOpenedBlog] = useState<OpenedBlogFields | null>(null);

    useEffect(() => {
        const getBlog = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/blog/feed/${blogId}`)
                setOpenedBlog(response.data.singleBlog);
            } catch (error) {
                console.error("Error fetching blog data: ", error);
            }
        }

        getBlog();
    }, [])

    return <div>
        Blog here
        <div>{openedBlog?.title}</div>
        <div>{openedBlog?.description}</div>

        <BlogComment></BlogComment>
    </div>
}

export default Blog