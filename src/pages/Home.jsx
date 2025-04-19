import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig"; // Import Firebase auth
import { signOut } from "firebase/auth";

const Home = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioPlayerRef = useRef(null); // Use ref for audio element
  const navigate = useNavigate();

  useEffect(() => {
    const audioPlayer = audioPlayerRef.current;

    const updateTime = () => setCurrentTime(audioPlayer.currentTime);

    const updateDuration = () => setDuration(audioPlayer.duration);

    audioPlayer.addEventListener("timeupdate", updateTime);
    audioPlayer.addEventListener("loadedmetadata", updateDuration);

    return () => {
      audioPlayer.removeEventListener("timeupdate", updateTime);
      audioPlayer.removeEventListener("loadedmetadata", updateDuration);
    };
  }, []);

  const handlePlayPause = () => {
    const audioPlayer = audioPlayerRef.current;
    if (audioPlayer.paused) {
      audioPlayer.play();
      setIsPlaying(true);
    } else {
      audioPlayer.pause();
      setIsPlaying(false);
    }
  };

  const handleMuteToggle = () => {
      const audioPlayer = audioPlayerRef.current;
      audioPlayer.muted = !audioPlayer.muted;
      setIsMuted(audioPlayer.muted);
    };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

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
      style={{ backgroundImage: "url('/Home-bg.jpeg')" }} // Make sure the image is in /public
    >
      <div className="absolute top-4">
        <div className="flex items-center gap-4 text-sm text-gray-200">
          <button
            onClick={handlePlayPause}
            className="px-4 py-2 bg-yellow-500 rounded-md text-white hover:bg-orange-600"
          >
            {isPlaying ? "⏸️ Pause" : "▶️ Play"}
          </button>
          <button
              onClick={handleMuteToggle}
              className="px-4 py-2 bg-yellow-500 rounded-md text-white hover:bg-yellow-600"
            >
              {isMuted ? "🔇" : "🔈"}
            </button>
          <span className="text-gray-400">{formatTime(currentTime)}</span>
          <span>/</span>
          <span className="text-gray-400">{formatTime(duration)}</span>
        </div>
        <audio ref={audioPlayerRef}>
          <source src="/I Think They Call This Love.mp3" type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
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
            onClick={() => navigate("/memory-path")}
            className="bg-green-500 hover:bg-red-600 text-white px-6 py-2 rounded-md"
          >
            Our Story
          </button>
          <button
            onClick={handleSignOut}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md"
          >
            Sign Out
          </button>
        </div>
      </div>
      <div className="absolute bottom-8 text-center w-full px-6">
        <p className="italic text-yellow-100 text-md max-w-3xl mx-auto">
          “Gravitation cannot be held responsible for people falling in love. How on earth can you explain in terms of chemistry and physics so important a biological phenomenon as love? Put your hand on a stove for a minute and it seems like an hour. Sit with that special girl for an hour and it seems like a minute. That's relativity.”
          <br />
          <span className="text-sm text-yellow-200 block mt-2">
            Albert Einstein
          </span>
        </p>
      </div>
    </div>
  );
};

export default Home;
