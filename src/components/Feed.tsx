import { useEffect, useState } from "react";
import Appbar from "../utility-components/Appbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

//improve UI
// fix the rendering of title and description of the blogs 
interface Blogs {
    id: string,
    title: string,
    description: string
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
            <div className="border" onClick={blog} key={blogs.id}>
                <div>{blogs.title}</div>
                <div>{blogs.description}</div>
            </div>
        )
    })

    return (
        <div>
            <Appbar></Appbar>
            <div>
                <div className="w-2/4 mx-auto p-4 bg-fuchsia-400">
                    <div className="mt-4">
                        {getMyBLogs}
                    </div>
                </div>
            </div>
        </div>
    )

}

export default Feed;