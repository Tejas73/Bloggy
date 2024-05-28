import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const Signin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [_, setCookie] = useCookies(["jwt"]);

  const handleSignin = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/user/signin", {
        email,
        password
      });
      const token = response.data.token;
      console.log(token)
      if (token) {
        setCookie("jwt", token, { path: "/", secure: false });
        console.log("Signin successful: ", token);
        navigate("/feed");
      } else {
        console.error("Signin failed: token not set");
      }
    } catch (error) {
      console.error("Error during Signin: ", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Let's get you signed up</h2>

        <form onSubmit={handleSignin}>
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

export default Signin;
// import { Button } from "@/components/ui/button"
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogFooter,
//     DialogHeader,
//     DialogTitle,

// } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import { useState } from "react";
// import axios from "axios"
// import { useCookies } from "react-cookie";

// type CloseDialogFunction = () => void;

// export default function Signin({onDialogClose}: { onDialogClose: CloseDialogFunction }) {
//     const [email, setEmail] = useState("")
//     const [password, setPassword] = useState("")

//     const handleSignin = async (email: string, password: string) => {
//         try {
//             const response = await axios.post("http://localhost:3000/api/user/signin", {
//                 email,
//                 password
//             })
            

//         } catch (error) {

//         }


//     }
//     return (
//         <div>
//             <Dialog open={true}>
//                 <DialogContent className="sm:max-w-[425px]">
//                     <DialogHeader>
//                         <DialogTitle>Welcome back</DialogTitle>
//                         <DialogDescription>
//                             Signin to continue
//                         </DialogDescription>
//                     </DialogHeader>
//                     <div className="grid gap-4 py-4">
//                         <div className="grid grid-cols-4 items-center gap-4">

//                             <Input
//                                 id="email"
//                                 placeholder="Enter email"
//                                 className="col-span-3"
//                                 value={email}
//                                 onChange={e => setEmail(e.target.value)}
//                             />
//                         </div>
//                         <div className="grid grid-cols-4 items-center gap-4">

//                             <Input
//                                 id="password"
//                                 placeholder="Enter password"
//                                 className="col-span-3"
//                                 value={password}
//                                 onChange={e => setPassword(e.target.value)}
//                             />
//                         </div>
//                     </div>
//                     <DialogFooter>
//                         <Button type="submit" className="bg-night" onClick={() => { handleSignin }} >Signin</Button>
//                         <Button onClick={() => onDialogClose()} className="bg-night">Close</Button>
//                     </DialogFooter>
//                 </DialogContent>
//             </Dialog>
//         </div>
//     )
// }