import { useEffect, useState } from "react";
import Appbar from "../utility-components/Appbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import sanitizeHtml from 'sanitize-html';

//improve UI
interface Blogs {
    id: string,
    title: string,
    description: string,
    profile: {
        bio: string,
        id: string,
        name: string,
        userId: string
    }
}

interface ShowFeed {
    showBlogs: Array<Blogs>
}

const Feed = () => {
    const [feed, setFeed] = useState<ShowFeed | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const currBlogs = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/blog/allblogs")
                console.log(response.data);
                setFeed(response.data);
            } catch (error) {
                console.error("Error fetching feed data: ", error);
            }
        }
        currBlogs();
    }, [])


    const getMyBLogs = feed?.showBlogs.map((blogs) => {
        const blog = () => {
            navigate(`/feed/${blogs.id}`)
        }

        return (
            <div className="border p-3 ">
                <div className="py-2 " onClick={blog} key={blogs.id}>

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