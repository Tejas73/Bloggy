import { Button } from "@/ui/button"
import useAuth from "@/hooks/useAuth"
import { currUserId, isLoggedIn } from "@/store/atoms/isLoggedIn";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useCookies, CookiesProvider } from "react-cookie";
import ProfileMenu from "./ProfileMenu";
import axios from "axios";
import { LogoBLoggy, Logout, WritePencil } from "@/ui/svg-elements";

const Appbar = () => {
    useAuth();
    const auth = useRecoilValue(isLoggedIn);

    const navigate = useNavigate();
    const setAuth = useSetRecoilState(isLoggedIn);
    const setUserId = useSetRecoilState(currUserId)
    const [cookies, setCookie, removeCookie] = useCookies(['jwt']);

    const handleSignupClick = (): void => {
        navigate("/signup");
    };

    const handleLogout = async () => {
        try {
            const response = await axios.put("http://localhost:3000/api/user/logout",);
            if (response) {
                removeCookie('jwt', { path: '/' });
                setAuth({ isAuthenticated: false });
                setUserId({ userID: null })
                navigate("/");
            }
        } catch (error) {
            console.error("Error in logging out: ", error);
        }
    }

    const handleSigninClick = (): void => {
        navigate('/signin')
    }

    const handleWrite = (): void => {
        navigate('/createblog')
    }

    const handleHome = (): void => {
        navigate('/feed')
    }

    return (
        <CookiesProvider>
            <div className="md:h-20 w-screen bg-tgreen flex fixed  justify-between items-center  border-b-2 border-night z-10">
                <div className="flex justify-between items-center pl-4 md:pl-28">

                    {/* logo  */}
                    <LogoBLoggy />

                    {/* name  */}
                    <div className="font-title text-4xl hover:cursor-pointer" onClick={handleHome}>
                        Bloggy
                    </div>
                </div>

                {/* if logged in then */}
                {auth.isAuthenticated && <div className="flex bg-slate-60 place-content-around w-40 md:w-56 md:mr-14">

                    {/* write */}
                    <button className="bg-transparent hover:bg-tgreen hover:text-slate-400 text-night" onClick={handleWrite}>
                        <WritePencil />
                    </button>

                    {/* profile */}
                    <button className="bg-transparent pt-1 hover:bg-tgreen hover:text-slate-400 text-night">
                        <ProfileMenu></ProfileMenu>
                    </button>

                    {/* logout */}
                    <button className="bg-transparent hover:bg-tgreen hover:text-slate-400 text-night" onClick={handleLogout}>
                        <Logout />
                    </button>

                </div>}

                {/* if logged out then */}
                {!auth.isAuthenticated && <div className="flex justify-around items-center w-52 sm:w-64">

                    <Button className="bg-transparent text-night hover:bg-tgreen hover:text-slate-400" onClick={handleSigninClick}>Signin</Button>

                    <Button className="rounded-full" onClick={handleSignupClick}>Get Started</Button>
                </div>
                }

            </div>
        </CookiesProvider>
    )
}

export default Appbar