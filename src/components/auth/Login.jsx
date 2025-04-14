// src/components/Auth/Login.jsx
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/home");
    } catch (err) {
      alert(err.message);
    }
  };

  const provider = new GoogleAuthProvider();

    const handleGoogleSignIn = async () => {
      try {
        await signInWithPopup(auth, provider);
        navigate("/home"); // or redirect to dashboard
      } catch (err) {
        console.error("Google sign-in error:", err.message);
      }
    };

  return (
    <div className="bg-white/10 border border-white/20 backdrop-blur-md p-6 rounded-xl shadow-md text-white">
      <h2 className="text-xl font-bold mb-4">Log In</h2>
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)} className="w-full bg-white/10 border border-white/30 text-white placeholder-white/60 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400" />
        <input type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)} className="w-full bg-white/10 border border-white/30 text-white placeholder-white/60 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400" />
        <button type="submit" className="bg-green-500 text-white p-2 rounded">Log In</button>
      </form>

      <button
        onClick={handleGoogleSignIn}
        className="btn bg-red-500 text-white w-full mt-4"
      >
        Continue with Google
      </button>
    </div>
  );
}
