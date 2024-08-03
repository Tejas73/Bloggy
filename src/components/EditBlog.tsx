import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, ContentState, convertFromHTML, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button"
import { useNavigate, useParams } from "react-router-dom";
import draftToHtml from 'draftjs-to-html';
import sanitizeHtml from 'sanitize-html';
import axios from 'axios';
import ProfileMenu from '@/utility-components/ProfileMenu';
import { LogoBLoggy } from './ui/svg-elements';

interface OpenedBlogFields {
    title: string,
    description: string
}

const EditBlog = () => {
    const navigate = useNavigate();
    const { blogId } = useParams();
    const [openedBlog, setOpenedBlog] = useState<OpenedBlogFields | null>(null);
    const [updatedTitle, setUpdatedTitle] = useState("");
    const [editTitle, setEditTitle] = useState(false);
    const [updatedEditorState, setUpdatedEditorState] = useState(() => EditorState.createEmpty());
    const [editEditorState, setEditEditorState] = useState(false);

    useEffect(() => {
        const getBlog = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/blog/feed/${blogId}`)
                const blog = response.data.singleBlog;
                setOpenedBlog(blog);
                setUpdatedTitle(blog.title);

                const blocksFromHTML = convertFromHTML(blog.description);
                const contentState = ContentState.createFromBlockArray(
                    blocksFromHTML.contentBlocks,
                    blocksFromHTML.entityMap
                );
                setUpdatedEditorState(EditorState.createWithContent(contentState));
            } catch (error) {
                console.error("Error fetching blog data: ", error);
            }
        }

        getBlog();
    }, [blogId]);

    const showInputTitle = () => {
        setEditTitle(true);
    }

    const showInputDescription = () => {
        setEditEditorState(true);
    }

    const handleFeed = (): void => {
        navigate("/feed");
    };

    const handlePublish = async (): Promise<void> => {
        const rawContentState = convertToRaw(updatedEditorState.getCurrentContent());
        const contentHtml = draftToHtml(rawContentState);
        const sanitizedHtml = sanitizeHtml(contentHtml);

        try {
            const response = await axios.put(`http://localhost:3000/api/blog/updatemyblog/${blogId}`, {
                title: updatedTitle,
                description: sanitizedHtml
            });
            if (response) {
                console.log("Blog updated successfully", response.data);
                navigate("/myblog");
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const toolbarOptions = {
        options: ['inline', 'list', 'textAlign', 'history'],
        inline: {
            inDropdown: false,
            options: ['bold', 'italic', 'underline', 'strikethrough', 'monospace'],
        },
        list: { inDropdown: false },
        textAlign: { inDropdown: false },
        history: { inDropdown: false },
    };

    return (
        <div>
            {/* appbar */}
            <div className="flex bg-zomp justify-around items-center h-20 border-b-2 border-night sticky">
                <div className=" flex justify-between items-center">
                    {/* logo  */}
                    <LogoBLoggy />
                    <div className="font-title text-4xl mr-40" onClick={handleFeed}>
                        Bloggy
                    </div>
                </div>

                <div className="ml-9 flex items-center w-64 ">
                    {/* publish */}
                    {(updatedTitle === "") ? (<Button className="bg-gray-600 hover:bg-gray-600 text-white  rounded-full ">
                        Save & Publish
                    </Button>) : (
                        <Button className="bg-night text-white hover:bg-slate-900  rounded-full " onClick={handlePublish}>
                            Save & Publish
                        </Button>
                    )}

                    {/* profile */}
                    <Button className="bg-transparent hover:bg-zomp hover:text-slate-500 text-night">
                        <ProfileMenu></ProfileMenu>
                    </Button>
                </div>
            </div>

            {/* editor */}
            <div className="flex justify-center p-4">
                <div className="bg-white p-4 w-full max-w-3xl">
                    {/* title */}
                    {!editTitle && <div className="mb-4 text-5xl font-title p-3" onClick={showInputTitle}>{openedBlog?.title}</div>}

                    {editTitle &&
                        <div className="mb-4 ml-1 text-5xl font-title">
                            <input className="w-full p-2"
                                type="text"
                                value={updatedTitle}
                                onChange={(e) => setUpdatedTitle(e.target.value)}
                            />
                        </div>
                    }

                    {/* description */}
                    {!editEditorState && <div className="mb-4 font-description p-3" onClick={showInputDescription} dangerouslySetInnerHTML={{ __html: openedBlog?.description }}></div>}

                    {editEditorState &&
                        <Editor
                            toolbar={toolbarOptions}
                            wrapperClassName="demo-wrapper"
                            editorState={updatedEditorState}
                            onEditorStateChange={setUpdatedEditorState}
                            editorClassName="demo-editor bg-white p-2 font-description text-xl"
                            placeholder="Start writing your blog here..."
                        />
                    }
                </div>
            </div>
        </div>
    );
}

export default EditBlog;