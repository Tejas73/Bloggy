import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./components/Landing";
import Feed from "./components/Feed";
import Signup from "./components/Signup";
import Profile from "./components/Profile";
import axios from 'axios';
import Signin from "./components/Signin";
import CreateBlog from "./components/CreateBlog";
import MyProfile from "./components/MyProfile";
import MyBlogs from "./components/MyBlogs";
import Blog from "./components/Blog";
import EditBlog from "./components/EditBlog";

const origin = import.meta.env.VITE_ORIGIN;

axios.defaults.baseURL = origin; 
axios.defaults.withCredentials = true;

export default function App() {

  return (
    <>
      <div className="App">
        <BrowserRouter>
          <div >
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/createblog" element={<CreateBlog />} />
              <Route path="/myprofile" element={<MyProfile />} />
              <Route path="/myblog" element={<MyBlogs />} />
              <Route path="/myblog/:blogId" element={<EditBlog />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/feed/:blogId" element={<Blog />} />
            </Routes>
          </div>
        </BrowserRouter>
      </div>
    </>
  )
}