import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom";
import draftToHtml from 'draftjs-to-html';
import sanitizeHtml from 'sanitize-html';
import axios from 'axios';

//try adding a the description check for publish button
const CreateBlog = () => {
    const navigate = useNavigate();
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    const [title, setTitle] = useState("");

    const handleFeed = (): void => {
        navigate("/feed");
    };
    const handleProfileClick = (): void => {
        navigate("/myprofile");
    };

    const handlePublish = async (): Promise<void> => {
        const rawContentState = convertToRaw(editorState.getCurrentContent());
        console.log("rawContentState: ", rawContentState);
        const contentHtml = draftToHtml(rawContentState);
        console.log("contentHtml: ", contentHtml);
        const sanitizedHtml = sanitizeHtml(contentHtml);
        console.log("sanitizedHtml: ", sanitizedHtml);

        try {
            const response = await axios.post("http://localhost:3000/api/blog/createblog", {
                title: title,
                description: sanitizedHtml
            });
            if (response) {
                console.log("Blog created successfully", response.data);
                navigate("/feed");
            }
        } catch (error) {
            console.error('Error:', error);
        }

    };

    const toolbarOptions = {
        options: ['inline', 'list', 'textAlign', 'history'], //removed 'image'
        inline: {
            inDropdown: false,
            options: ['bold', 'italic', 'underline', 'strikethrough', 'monospace'],
            bold: { className: undefined },
            italic: { className: undefined },
            underline: { className: undefined },
            strikethrough: { className: undefined },
            monospace: { className: undefined },
            subscript: { className: undefined },
            superscript: { className: undefined },
        },
        list: { inDropdown: false },
        textAlign: { inDropdown: false },
        // image: { inDropdown: false },
        history: { inDropdown: false },
    };
    return (
        <div>
            {/* appbar */}
            <div className="flex bg-zomp justify-around items-center h-20 border-b-2 border-night sticky">
                <div className="flex justify-between items-center">
                    <div>
                        <img src="logo-new.png" alt="logo" className="h-14" />
                    </div>
                    <div className="font-title text-4xl" onClick={handleFeed}>
                        Bloggy
                    </div>
                </div>

                <div className="flex items-center w-64 ">

                    {/* publish */}
                    {(title === "") ? (<Button className="bg-gray-600 hover:bg-gray-600 text-white  rounded-full ">
                        Publish
                    </Button>) : (
                        <Button className="bg-night text-white hover:bg-slate-900  rounded-full " onClick={handlePublish}>
                            Publish
                        </Button>
                    )}

                    {/* profile */}
                    <Button onClick={handleProfileClick} className="bg-transparent hover:bg-zomp hover:text-slate-500 text-night">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                    </Button>
                </div>
            </div>

            {/* editor */}
            <div className="flex justify-center p-4">
                <div className="bg-white p-4 w-full max-w-3xl">

                    {/* title */}
                    <div className="mb-4 text-5xl font-title">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-2"
                            placeholder="Title"
                        />
                    </div>

                    {/* description */}
                    <Editor
                        toolbar={toolbarOptions}

                        wrapperClassName="demo-wrapper"
                        editorState={editorState}
                        onEditorStateChange={setEditorState}
                        editorClassName="demo-editor bg-white p-2 font-description text-xl"
                        placeholder="Start writing your blog here..."
                    />
                </div>
            </div>

        </div>

    );
};

export default CreateBlog;