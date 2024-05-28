import { isLoggedIn } from "@/store/atoms/isLoggedIn";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { useCookies } from "react-cookie";
import axios from "axios";

const useAuth = async () => {
    const [auth, setAuth] = useRecoilState(isLoggedIn);
    const [cookie] = useCookies(['jwt']);

    useEffect(() => {
        const checkAuth = async () => {
            if(!cookie.jwt){
                setAuth({isAuthenticated:false});
                return;
            }
            
            try {
                const response = await axios.get('http://localhost:3000/user/check', {
                    withCredentials: true
                })
                if(response.status === 200){
                    setAuth({isAuthenticated:true});
                }
            } catch (error) {
                setAuth({isAuthenticated:false});                
            }
        };
        checkAuth();
    }, [cookie.jwt])

    return auth;
}

export default useAuth;