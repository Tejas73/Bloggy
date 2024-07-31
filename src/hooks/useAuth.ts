import { isLoggedIn } from "@/store/atoms/isLoggedIn";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { useCookies } from "react-cookie";
import axios from "axios";

const useAuth = async () => {
    const [auth, setAuth] = useRecoilState(isLoggedIn);
    const [cookie, setCookie] = useCookies(['jwt']);
    useEffect(() => {
        const checkAuth = async () => {
            if (!cookie.jwt) {
                const response = await axios.get('http://localhost:3000/api/user/check', {
                    withCredentials: true
                })
                console.log("response.data.token: ", response.data.token);
                const { token } = response.data;

                if (token) {
                    setCookie("jwt", token, { path: "/" });
                    setAuth({ isAuthenticated: true });
                } else {
                    setAuth({ isAuthenticated: false });
                }
                // console.log("reached hereeeee")
                return;
            }

            try {

                const response = await axios.get('http://localhost:3000/api/user/check', {
                    withCredentials: true
                })
                // const { token } = response.data;
                // console.log("token from useAuth: ", token);

                if (response.status === 200) {
                    setAuth({ isAuthenticated: true });
                }
            } catch (error) {
                setAuth({ isAuthenticated: false });
            }
        };
        checkAuth();
    }, [cookie])

    return auth;
}

export default useAuth;