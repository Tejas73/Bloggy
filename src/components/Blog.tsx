import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import sanitizeHtml from 'sanitize-html';
import BlogComment from "../utility-components/BlogComment";

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
    }, [blogId]);

    console.log("openedBlog", openedBlog)
    return (
        <div className="flex justify-center">
            <div className="bg-white p-4 w-full max-w-4xl">
                {/* title  */}
                <div className="mb-4 text-5xl font-title">
                    {openedBlog?.title}
                </div>

                {/* description  */}
                <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(openedBlog?.description || '') }} />

                <BlogComment />
            </div>
        </div>
    );
}

export default Blog;

// import axios from "axios";
// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import BlogComment from "../utility-components/BlogComment";
// // import BlogCommentTest from "@/utility-components/BlogCommentTest";

// //improve UI 
// // fix the rendering of title and description of the blogs 
// interface OpenedBlogFields {
//     title: string,
//     description: string
// }

// const Blog = () => {
//     const { blogId } = useParams();
//     console.log("blogId: ", blogId)
//     const [openedBlog, setOpenedBlog] = useState<OpenedBlogFields | null>(null);

//     useEffect(() => {
//         const getBlog = async () => {
//             try {
//                 const response = await axios.get(`http://localhost:3000/api/blog/feed/${blogId}`)
//                 setOpenedBlog(response.data.singleBlog);
//             } catch (error) {
//                 console.error("Error fetching blog data: ", error);
//             }
//         }

//         getBlog();
//     }, [])
//     console.log("openedBlog", openedBlog)
//     return (
//         <div className="flex justify-center ">
//             <div className="bg-white p-4 w-full max-w-4xl">
//                 {/* title  */}
//                 <div className="mb-4 text-5xl font-title">
//                     {openedBlog?.title}
//                 </div>

//                 {/* description  */}
//                 <div>{openedBlog?.description}</div>

//                 <BlogComment></BlogComment>
//                 {/* <BlogCommentTest></BlogCommentTest> */}
//             </div>
//         </div>
//         )
// }

// export default Blog