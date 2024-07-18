import { useEffect, useState } from "react";
import Appbar from "../utility-components/Appbar";
import axios from "axios";

// improve UI
// add password field
// make the fields editable
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

    return (
        <div>
            <Appbar></Appbar>
            <div>
                <div className="w-2/4 mx-auto p-4 bg-fuchsia-400">
                    <h1 className="text-2xl font-bold">My Profile</h1>
                    <div className="mt-4">
                        <p><strong>Email:</strong> {userData.email}</p>
                        <p><strong>Name:</strong> {userData.profile.name}</p>
                        <p><strong>Bio:</strong> {userData.profile.bio}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyProfile;