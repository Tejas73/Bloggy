import { Button } from "@/components/ui/button"
import useAuth from "@/hooks/useAuth"
import { currUserId, isLoggedIn } from "@/store/atoms/isLoggedIn";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useCookies, CookiesProvider } from "react-cookie";
import ProfileMenu from "./ProfileMenu";
import axios from "axios";

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
                    <svg width="56" height="56">
                        <path d="M7,28 A21,21 0 0,1 49,28" stroke="black" stroke-width="3" fill="transparent" transform="rotate(330, 28, 28)" />
                        <path d="M14,28 A14,14 0 0,1 42,28" stroke="black" stroke-width="3" fill="transparent" transform="rotate(150, 28, 28)" />
                        <path d="M14,28 A14,7 0 0,1 42,28" stroke="black" stroke-width="3" fill="transparent" transform="rotate(330, 28, 28)" />
                        <circle cx="28" cy="28" r="7" stroke="black" stroke-width="3" fill="transparent" />
                    </svg>

                    <div className="font-title text-4xl" onClick={handleHome}>
                        Bloggy
                    </div>
                </div>

                {/* if logged in then */}
                {auth.isAuthenticated && <div className="flex items-center w-64 ">
                    {/* write */}
                    <Button className="bg-transparent hover:bg-tgreen hover:text-slate-400 text-night" onClick={handleWrite}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                    </Button>

                    {/* profile */}
                    <Button className="bg-transparent hover:bg-tgreen hover:text-slate-400 text-night">
                        <ProfileMenu></ProfileMenu>
                    </Button>

                    {/* logout */}
                    <Button className="bg-transparent hover:bg-tgreen hover:text-slate-400 text-night" onClick={handleLogout}>
                        <svg className="size-7 " width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" />  <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />  <path d="M7 12h14l-3 -3m0 6l3 -3" /></svg>
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