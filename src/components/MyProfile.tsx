import { useEffect, useState } from "react";
import Appbar from "../utility-components/Appbar";
import axios from "axios";

interface ProfileFields {
    name: string,
    bio: string
}

interface UserFields {
    email: string,
    password: string,
    profile: ProfileFields
}

const MyProfile = () => {
    
    const [userData, setUserData] = useState<UserFields | null>(null);// State to hold the user data fetched from the server
        
    const [fetchProfileData, setFetchProfileData] = useState(false);// State to trigger a refetch of the user profile data

    const [updatedEmail, setUpdatedEmail] = useState(""); // Holds the updated email value during editing
    const [editEmail, setEditEmail] = useState(false);// Boolean state to control whether the email input field is visible for editing

    const [updatedPassword, setUpdatedPassword] = useState(""); // Holds the updated password value during editing    
    const [editPassword, setEditPassword] = useState(false);// Boolean state to control whether the password input field is visible for editing

    const [updatedName, setUpdatedName] = useState("");// Holds the updated name value during editing    
    const [editName, setEditName] = useState(false);// Boolean state to control whether the name input field is visible for editing

    const [updatedBio, setUpdatedBio] = useState("");// Holds the updated bio value during editing    
    const [editBio, setEditBio] = useState(false);// Boolean state to control whether the bio input field is visible for editing

    // Fetch user profile data when the component mounts or when fetchProfileData changes
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/user/myprofile");
                setUserData(response.data);
            } catch (error) {
                console.error("Error fetching profile data: ", error);
            }
        };
        fetchData();
    }, [fetchProfileData]);

    // Display loading state while fetching data
    if (!userData) {
        return <div>Loading...</div>;
    }

    console.log("userData: ", userData);

    // Handle showing input field for editing email
    const showInputEmail = () => {
        setEditEmail(true); // Enable email editing mode
        setUpdatedEmail(userData.email); // Prepopulate the input with the current email
    };

    // Handle saving updated email
    const handleEditEmail = async () => {
        try {
            const response = await axios.put("/api/user/updateemail", {
                updatedEmail,
            }, {
                withCredentials: true // Include credentials (cookies) in the request
            });

            if (response.status === 200) {
                console.log("Email update successful");
                setFetchProfileData(prev => !prev); // Trigger refetch of profile data
            } else {
                console.error("Email update unsuccessful: ", response.data);
            }
            setEditEmail(false); // Exit email editing mode
        } catch (error) {
            console.error("Error during Email update: ", error);
        }
    };

    // Handle showing input field for editing password
    const showInputPassword = () => {
        setEditPassword(true); // Enable password editing mode
    };

    // Handle saving updated password
    const handleEditPassword = async () => {
        try {
            const response = await axios.put("/api/user/updatepassword", {
                updatedPassword,
            }, {
                withCredentials: true // Include credentials (cookies) in the request
            });

            if (response.status === 200) {
                console.log("Password update successful");
                setFetchProfileData(prev => !prev); // Trigger refetch of profile data
            } else {
                console.error("Password update unsuccessful: ", response.data);
                setEditPassword(false); // Exit password editing mode on failure
            }
        } catch (error) {
            console.error("Error during Password update: ", error);
        }
    };

    // Handle showing input field for editing name
    const showInputName = () => {
        setEditName(true); // Enable name editing mode
        setUpdatedName(userData.profile.name); // Prepopulate the input with the current name
    };

    // Handle saving updated name
    const handleEditName = async () => {
        try {
            const response = await axios.put("/api/user/updatename", {
                updatedName,
            }, {
                withCredentials: true // Include credentials (cookies) in the request
            });

            if (response.status === 200) {
                console.log("Name update successful");
                setFetchProfileData(prev => !prev); // Trigger refetch of profile data
            } else {
                console.error("Name update unsuccessful: ", response.data);
            }
            setEditName(false); // Exit name editing mode
        } catch (error) {
            console.error("Error during Name update: ", error);
        }
    };

    // Handle showing input field for editing bio
    const showInputBio = () => {
        setEditBio(true); // Enable bio editing mode
        setUpdatedBio(userData.profile.bio); // Prepopulate the input with the current bio
    };

    // Handle saving updated bio
    const handleEditBio = async () => {
        try {
            const response = await axios.put("/api/user/updatebio", {
                updatedBio,
            }, {
                withCredentials: true // Include credentials (cookies) in the request
            });

            if (response.status === 200) {
                console.log("Bio update successful");
                setFetchProfileData(prev => !prev); // Trigger refetch of profile data
            } else {
                console.error("Bio update unsuccessful: ", response.data);
            }
            setEditBio(false); // Exit bio editing mode
        } catch (error) {
            console.error("Error during Bio update: ", error);
        }
    };

    // Handle cancelling any ongoing edit operation
    const handleCancelEdit = () => {
        try {
            setEditEmail(false); // Exit email editing mode
            setEditName(false); // Exit name editing mode
            setEditBio(false); // Exit bio editing mode
            setEditPassword(false); // Exit password editing mode
            setUpdatedPassword(""); // Clear updated password
        } catch (error) {
            console.error("Error cancelling fields");
        }
    };

    return (
        <div>
            <Appbar></Appbar>
            <div>
                <div className="w-2/4 mx-auto p-4">

                    <h1 className="text-3xl">My Profile</h1>

                    <hr className="h-px mt-4 mb-8 bg-gray-300 border-0 dark:bg-gray-700" />


                    <div className="mt-4">

                        {/* email  */}
                        <div className=" ">
                            <div className="text-lg">Email: </div>

                            {/* before clicking */}
                            {!editEmail && <div className="border-2 px-3 rounded-md border-gray-400 text-slate-700 w-fit" onClick={showInputEmail}>{userData.email}</div>}


                            {/* after clicking  */}
                            {editEmail && <div className="">
                                <input
                                    type="email"
                                    id="email"
                                    value={updatedEmail}
                                    onChange={(e) => setUpdatedEmail(e.target.value)}
                                    className="border-2 px-3 rounded-md border-gray-400 text-slate-700 w-fit"
                                />

                                <div className="my-2">
                                    <button className="border-2 p-1 px-3 bg-night text-slate-50 rounded-lg hover:bg-slate-900" onClick={handleEditEmail} >
                                        Save
                                    </button>
                                    <button className="ml-3 border-2 p-1 px-3 bg-night text-slate-50 rounded-lg hover:bg-slate-900" onClick={handleCancelEdit} >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                            }
                        </div>

                        {/* password  */}
                        <div className=" my-3">
                            <div className="text-lg">Password: </div>

                            {/* before clicking */}
                            {!editPassword && <div className="border-2 px-3 rounded-md border-gray-400 text-slate-700 w-fit" onClick={showInputPassword}>
                                <input type="password"
                                    id="password"
                                    value={updatedPassword}
                                    onChange={(e) => setUpdatedPassword(e.target.value)}
                                />
                            </div>}

                            {/* after clicking  */}
                            {editPassword && <div className="">
                                <input type="password"
                                    id="password"
                                    value={updatedPassword}
                                    onChange={(e) => setUpdatedPassword(e.target.value)}
                                    className="border-2 px-3 rounded-md border-gray-400 text-slate-700 w-fit"
                                />

                                <div className="my-2">
                                    <button className="border-2 p-1 px-3 bg-night text-slate-50 rounded-lg hover:bg-slate-900" onClick={handleEditPassword} >
                                        Save
                                    </button>
                                    <button className="ml-3 border-2 p-1 px-3 bg-night text-slate-50 rounded-lg hover:bg-slate-900" onClick={handleCancelEdit} >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                            }
                        </div>

                        <div className="">
                            {/* name  */}
                            <div className="text-lg">Name: </div>

                            {/* before clicking */}
                            {!editName && <div className="border-2 px-3 rounded-md border-gray-400 text-slate-700 w-fit" onClick={showInputName}>{userData.profile.name}</div>}

                            {/* after clicking  */}
                            {editName && <div className="">
                                <input type="text"
                                    id="name"
                                    value={updatedName}
                                    onChange={(e) => setUpdatedName(e.target.value)}
                                    className="border-2 px-3 rounded-md border-gray-400 text-slate-700 w-fit"
                                />

                                <div className="my-2">
                                    <button className="border-2 p-1 px-3 bg-night text-slate-50 rounded-lg hover:bg-slate-900" onClick={handleEditName} >
                                        Save
                                    </button>
                                    <button className="ml-3 border-2 p-1 px-3 bg-night text-slate-50 rounded-lg hover:bg-slate-900" onClick={handleCancelEdit} >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                            }
                        </div>

                        {/* bio  */}
                        <div className=" my-3">
                            <div className="text-lg">Bio: </div>

                            {/* before clicking */}
                            {!editBio && <div className="border-2 px-3 rounded-md border-gray-400 text-slate-700 w-52 h-fit text-wrap" onClick={showInputBio}>{userData.profile.bio}</div>}

                            {/* after clicking  */}
                            {editBio && <div className="">
                                <textarea
                                    id="bio"
                                    value={updatedBio}
                                    onChange={(e) => setUpdatedBio(e.target.value)}
                                    className="border-2 px-3 rounded-md border-gray-400 text-slate-700 w-fit h-fit"
                                />

                                <div>
                                    <button className="border-2 p-1 px-3 bg-night text-slate-50 rounded-lg hover:bg-slate-900" onClick={handleEditBio} >
                                        Save
                                    </button>
                                    <button className="ml-3 border-2 p-1 px-3 bg-night text-slate-50 rounded-lg hover:bg-slate-900" onClick={handleCancelEdit} >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default MyProfile;
