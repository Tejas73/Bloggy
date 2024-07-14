import { isLoggedIn } from "@/store/atoms/isLoggedIn";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { useCookies } from "react-cookie";
import axios from "axios";


// fix the logout upon refresh problem

const useAuth = async () => {
    const [auth, setAuth] = useRecoilState(isLoggedIn);
    const [cookie,setCookie] = useCookies(['jwt']);
    // const [cookiesUser, setCookies] = useCookies(['user'])
    // console.log('jwt cookie', cookie);
    // console.log("user cookie", cookiesUser);
    useEffect(() => {
        const checkAuth = async () => {
            if(!cookie.jwt){
                setAuth({isAuthenticated:false});
                // console.log("reached hereeeee", cookie)
                return;
            }
            try {
                
                const response = await axios.get('http://localhost:3000/api/user/check', {
                    withCredentials: true
                })
                // console.log("state changed to true",response.status);
                if(response.status === 200){
                    setAuth({isAuthenticated:true});
                }
            } catch (error) {
                setAuth({isAuthenticated:false});                
            }
        };
        checkAuth();
    }, [cookie])

    return auth;
}

export default useAuth;