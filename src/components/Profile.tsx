import axios from "axios";
import { Button } from "@/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/ui/input";

const Profile = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const origin = import.meta.env.VITE_ORIGIN;
  
  const handleProfile = async () => {
    try {
      const response = await axios.put(`${origin}/api/user/profile`, {
        name,
        bio
      }, {
        withCredentials: true // Include credentials (cookies) in the request
      });

      if (response.status === 200) {
        console.log("Profile update successful");
        navigate("/feed");
      } else {
        console.error("Profile update failed: ", response.data);
      }
    } catch (error) {
      console.error("Error during profile update: ", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Tell us about yourself</h2>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
            Name
          </label>
          <Input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your name"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="bio" className="block text-gray-700 font-bold mb-2">
            Bio
          </label>
          <textarea
            id="bio"
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your bio"
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <Button
            onClick={handleProfile}
            className="bg-black hover:bg-slate-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Let's Go
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
