import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/ui/dropdown-menu"
import { MyBlogPad, MyProfilePerson, ProfileLogo } from "@/ui/svg-elements";
import { useNavigate } from "react-router-dom";

const ProfileMenu = () => {
    const navigate = useNavigate();


    const handleEditMyProfile = (): void => {
        navigate("/myprofile");
    }
    const handleEditMyBlogs = (): void => {
        navigate("/myblog");
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <ProfileLogo />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={handleEditMyProfile}>
                    <MyProfilePerson />
                    Profile
                </DropdownMenuItem>

                <DropdownMenuItem onClick={handleEditMyBlogs}>
                    <MyBlogPad />
                    My Blogs</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

    )
}

export default ProfileMenu