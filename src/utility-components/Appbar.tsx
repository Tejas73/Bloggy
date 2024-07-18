import { Button } from "@/components/ui/button"
import useAuth from "@/hooks/useAuth"
import { currUserId, isLoggedIn } from "@/store/atoms/isLoggedIn";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useCookies, CookiesProvider } from "react-cookie";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

//improve logo

const Appbar = () => {
    useAuth(); // make this hook better to be able to use anywhere, example in handleHome function
    const auth = useRecoilValue(isLoggedIn);
    const navigate = useNavigate();
    const setAuth = useSetRecoilState(isLoggedIn);
    const setUserId = useSetRecoilState(currUserId)
    const [cookies, setCookie, removeCookie] = useCookies(['jwt']);

    const handleSignupClick = (): void => {
        navigate("/signup");
    };

    const handleLogout = (): void => {
        removeCookie('jwt', { path: '/' });
        setAuth({ isAuthenticated: false });
        setUserId({ userID: null })
        navigate("/");
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
    const handleEditMyProfile = (): void => {
        navigate("/myprofile");
    }
    const handleEditMyBlogs = (): void => {
        navigate("/myblog");
    }

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

                    {/* animated logo  */}
                    {/* <svg width="56" height="56">
                        <path id="outer-semi-circle" d="M7,28 A21,21 0 0,1 49,28" stroke="black" stroke-width="2" fill="transparent" transform="rotate(330, 28, 28)">
                            <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="330 28 28" to="690 28 28" dur="3s" repeatCount="indefinite" />
                        </path>

                        <path d="M14,28 A14,14 0 0,1 42,28" stroke="black" stroke-width="3" fill="transparent" transform="rotate(-30, 28, 28)" />
                        <circle cx="28" cy="28" r="7" stroke="black" stroke-width="2" fill="transparent" />
                    </svg> */}




                    <div className="font-title text-4xl" onClick={handleHome}>
                        Bloggy
                    </div>
                </div>
                {/* if logged in then */}
                {auth.isAuthenticated && <div className="flex items-center w-64 ">
                    {/* write */}
                    <Button className="bg-transparent hover:bg-tgreen hover:text-slate-400 text-night" onClick={handleWrite}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                    </Button>

                    {/* profile */}
                    <Button className="bg-transparent hover:bg-tgreen hover:text-slate-400 text-night">

                        <DropdownMenu>
                            <DropdownMenuTrigger><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg></DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem onClick={handleEditMyProfile}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                </svg>  Profile</DropdownMenuItem>
                                <DropdownMenuItem onClick={handleEditMyBlogs}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                                </svg>  My Blogs</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                    </Button>

                    {/* logout */}
                    <Button className="bg-transparent hover:bg-tgreen hover:text-slate-400 text-night" onClick={handleLogout}>
                        <svg className="size-6 " width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" />  <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />  <path d="M7 12h14l-3 -3m0 6l3 -3" /></svg>
                    </Button>
                </div>}

                {/* if logged out then */}
                {!auth.isAuthenticated && <div className="flex justify-around items-center w-64">

                    <Button className="bg-transparent text-night hover:bg-tgreen hover:text-slate-400" onClick={handleSigninClick}>Signin</Button>

                    <Button className="rounded-full" onClick={handleSignupClick}>Get Started</Button>
                </div>
                }

            </div>
        </CookiesProvider>
    )
}

export default Appbar