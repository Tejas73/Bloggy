import { useEffect, useState } from "react";
import Appbar from "../utility-components/Appbar";
import axios from "axios";

// improve UI
// add password field
// make the fields editable
// add cancel confirm buttons when the users are editing the fields 
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
    const [userData, setUserData] = useState<UserFields | null>(null);
    const [updatedName, setUpdatedName] = useState('')
    const [isEditable, setIsEditable] = useState(false);


    const [showName, setShowName] = useState(false);

    useEffect(() => {
        const MyData = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/user/myprofile");
                setUserData(response.data);
            }
            catch (error) {
                console.error("Error fetching profile data: ", error);
            }
        }
        MyData();
    }, [])

    if (!userData) {
        return <div>Loading...</div>;
    }

    console.log("userData: ", userData);

    const showInputName = () => {
        setShowName(true);
    }

    const handleFocus = () => {
        setIsEditable(true);
    };

    const handleBlur = () => {
        setIsEditable(false);
    };

    const handleEditName = async () => {
        try {
            const response = await axios.put("/api/user/updatename", {
                updatedName,
            }, {
                withCredentials: true // Include credentials (cookies) in the request
            });

            if (response.status === 200) {
                console.log("Name update successful");
            } else {
                console.error("Name update unsuccessful: ", response.data);
            }
        } catch (error) {
            console.error("Error during Name update: ", error);
        }
    }

    return (
        <div>
            <Appbar></Appbar>
            <div>
                <div className="w-2/4 mx-auto p-4">
                    <h1 className="text-2xl font-bold">My Profile</h1>
                    <div className="mt-4">
                        <div className="flex">
                            <div>Email: </div>
                            <input type="email"
                                id="comment"
                                defaultValue={userData.email}
                            // onChange={(e) => setComment(e.target.value)}
                            />
                        </div>

                        <div className="flex">
                            <div>Password: </div>
                            <div>{userData.password}</div>
                        </div>

                        <div className="flex">
                            <div>Name: </div>

                            {!showName && <div onClick={showInputName}>{userData.profile.name}</div>}

                            {showName && <div className="flex">
                                <input type="text"
                                    id="name"
                                    // defaultValue={userData.profile.name}
                                    value={updatedName}
                                    onChange={(e) => setUpdatedName(e.target.value)}
                                />

                                {/* <div>{userData.profile.name}</div> */}
                                <div className="bg-green-400" onClick={handleEditName} >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                    </svg>
                                </div>
                            </div>
                            }
                        </div>

                        <div className="flex">
                            <div>Bio: </div>
                            <div>{userData.profile.bio}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyProfile;