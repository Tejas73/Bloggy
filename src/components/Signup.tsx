import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [_, setCookies] = useCookies(["jwt"]);
  const origin = import.meta.env.VITE_ORIGIN;
  
  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${origin}/api/user/signup`, {
        email,
        password
      });
      const token = response.data.token;
      console.log("token", token)
      if (token) {
        setCookies("jwt", token, { path: "/" });
        console.log("Signup successful: ", token);
        navigate("/profile");
      } else {
        console.error("Signup failed: token not set");
      }
    } catch (error) {
      console.error("Error during signup: ", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Let's get you signed up</h2>

        <form onSubmit={handleSignup}>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
              Email
            </label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
              Password
            </label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your password"
              required
            />

          </div>

          <div className="flex items-center justify-between">
            <Button
              type="submit"
              className="bg-black hover:bg-slate-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Sign Up
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Signup;
