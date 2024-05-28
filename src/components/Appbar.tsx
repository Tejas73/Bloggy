import { Button } from "@/components/ui/button"
import useAuth from "@/hooks/useAuth"
import { isLoggedIn } from "@/store/atoms/isLoggedIn";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";

const Appbar = () => {
    useAuth();
    const navigate = useNavigate();
    const auth = useRecoilValue(isLoggedIn);

    const handleSignupClick = (): void => {
        navigate("/signup");
    };
    return (
        <div className="flex bg-tgreen justify-around items-center h-20 border-b-2 border-night sticky">
            <div className="flex justify-between items-center">
                <div>
                    <img src="logo-new.png" alt="logo" className="h-14" />
                </div>
                <div className="font-title text-4xl ">
                    Bloggy
                </div>
            </div>
            {auth.isAuthenticated && <div className="flex justify-between items-center w-64 ">
                {/* write */}
                <Button className="bg-tgreen text-night"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
                </Button>

                {/* profile */}
                <Button className="bg-tgreen text-night"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
                </Button>
            </div>}
            {/* if logged out then */}
            <div className="flex justify-between items-center w-64">
                <Button className="bg-transparent text-night hover:bg-tgreen">Write</Button>
                <Button className="bg-transparent text-night hover:bg-tgreen">Signin</Button>
                <Button className="rounded-full" onClick={handleSignupClick}>
                    Get Started
                </Button>
            </div>

        </div>
    )
}

export default Appbar