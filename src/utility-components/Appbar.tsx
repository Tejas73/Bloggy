import { Button } from "@/components/ui/button"
import useAuth from "@/hooks/useAuth"
import { currUserId, isLoggedIn } from "@/store/atoms/isLoggedIn";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useCookies, CookiesProvider } from "react-cookie";
import ProfileMenu from "./ProfileMenu";
import axios from "axios";
import { LogoBLoggy, Logout, WritePencil } from "@/components/ui/svg-elements";

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
            // console.log("response: ", response);
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

   
    // console.log("cookies.jwt from APPBAR: ", cookies.jwt);
    return (
        <CookiesProvider>
            <div className="flex bg-tgreen justify-between items-center h-20 border-b-2 border-night sticky">
                <div className="flex justify-between items-center pl-28">

                    {/* logo  */}
                    <LogoBLoggy />

                    <div className="font-title text-4xl" onClick={handleHome}>
                        Bloggy
                    </div>
                </div>

                {/* if logged in then */}
                {auth.isAuthenticated && <div className="flex items-center w-64 ">

                    {/* write */}
                    <Button className="bg-transparent hover:bg-tgreen hover:text-slate-400 text-night" onClick={handleWrite}>
                        <WritePencil />
                    </Button>

                    {/* profile */}
                    <Button className="bg-transparent hover:bg-tgreen hover:text-slate-400 text-night">
                        <ProfileMenu></ProfileMenu>
                    </Button>

                    {/* logout */}
                    <Button className="bg-transparent hover:bg-tgreen hover:text-slate-400 text-night" onClick={handleLogout}>
                        <Logout />
                    </Button>
                </div>}

                {/* if logged out then */}
                {!auth.isAuthenticated  && <div className="flex justify-around items-center w-64">

                    <Button className="bg-transparent text-night hover:bg-tgreen hover:text-slate-400" onClick={handleSigninClick}>Signin</Button>

                    <Button className="rounded-full" onClick={handleSignupClick}>Get Started</Button>
                </div>
                }

            </div>
        </CookiesProvider>
    )
}

export default Appbar