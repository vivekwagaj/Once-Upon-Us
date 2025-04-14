// src/components/Home.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig"; // Import Firebase auth
import { signOut } from "firebase/auth";

const Home = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/"); // Redirect to login page after signing out
    } catch (err) {
      console.error("Sign-out error:", err.message);
    }
  };

  return (

    <div
      className="w-screen h-screen bg-cover bg-center bg-no-repeat flex flex-col justify-center items-center text-white px-4"
      style={{ backgroundImage: "url('/Home-bg.jpeg')" }} // Make sure image is in /public
    >
      <div className="bg-black bg-opacity-50 p-8 rounded-lg text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to "Once Upon Us"</h1>
        <p className="text-xl mb-6">Your private library for memories.</p>
        <div className="flex space-x-4 justify-center">
          <button
            onClick={() => navigate("/add-moment")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md"
          >
            Add a Moment
          </button>
          <button
            onClick={handleSignOut}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
