import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./components/Landing";
import Feed from "./components/Feed";
import Signup from "./components/Signup";
import Profile from "./components/Profile";
import axios from 'axios';
// import Appbar from "./components/Appbar";

axios.defaults.baseURL = "http://localhost:3000";  // change this to match the new url for production
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
              <Route path="/profile" element={<Profile />} />
              <Route path="/feed" element={<Feed />} />
            </Routes>
          </div>
        </BrowserRouter>
      </div>
    </>
  )
}