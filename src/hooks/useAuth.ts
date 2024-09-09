import { currUserId, isLoggedIn } from "@/store/atoms/isLoggedIn";
import { useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useCookies } from "react-cookie";
import axios from "axios";

//this hook is used for verifying authenticity of a user based on cookie.jwt

const useAuth = async () => {
    const [auth, setAuth] = useRecoilState(isLoggedIn);
    const [cookie] = useCookies(['jwt']);
    const setAuthState = useSetRecoilState(currUserId);

    useEffect(() => {
        const checkAuth = async () => {
            if (!cookie.jwt) {
                const response = await axios.get('http://localhost:3000/api/user/check', {
                    withCredentials: true
                })
                const { token, userId } = response.data;

                if (token) {
                    setAuth({ isAuthenticated: true });
                    setAuthState({ userID: userId })
                } else {
                    setAuth({ isAuthenticated: false });
                }
                return;
            }

            if (cookie.jwt) {
                try {

                    const response = await axios.get('http://localhost:3000/api/user/check', {
                        withCredentials: true
                    })

                    if (response.status === 200) {
                        setAuth({ isAuthenticated: true });
                    }
                } catch (error) {
                    setAuth({ isAuthenticated: false });
                }
            }
        };
        checkAuth();
    }, [cookie])

    return auth;
}

export default useAuth;