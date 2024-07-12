import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BlogComment from "../utility-components/BlogComment";

interface OpenedBlogFields {
    title: string | TrustedHTML,
    description: string| TrustedHTML
}

const Blog = () => {
    const { blogId } = useParams();
    console.log(blogId)
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
        <div dangerouslySetInnerHTML={{ __html: openedBlog?.title }} />
        <div dangerouslySetInnerHTML={{ __html: openedBlog?.description }} />
        {/* <div>{openedBlog?.title}</div>
        <div>{openedBlog?.description}</div> */}

        <BlogComment></BlogComment>
    </div>
}

export default Blog