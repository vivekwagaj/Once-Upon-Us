// src/components/auth/AuthPage.jsx
import React, { useState } from "react";
import Login from "../components/auth/Login";
import Signup from "../components/auth/Signup";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
  <div
    className="w-screen h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
    style={{ backgroundImage: "url('/Login-bg.jpg')" }}
  >
    <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl shadow-lg max-w-md w-full mx-4 px-8 py-10 text-white">
      <div className="flex justify-around mb-8 border-b border-white/30 pb-4">
        <button
          className={`transition duration-300 text-lg font-semibold ${
            isLogin
              ? "text-white border-b-2 border-blue-400"
              : "text-gray-300"
          }`}
          onClick={() => setIsLogin(true)}
        >
          Login
        </button>
        <button
          className={`transition duration-300 text-lg font-semibold ${
            !isLogin
              ? "text-white border-b-2 border-blue-400"
              : "text-gray-300"
          }`}
          onClick={() => setIsLogin(false)}
        >
          Sign Up
        </button>
      </div>
      <div className="text-white">{isLogin ? <Login /> : <Signup />}</div>
    </div>
  </div>
  );
};

export default AuthPage;
