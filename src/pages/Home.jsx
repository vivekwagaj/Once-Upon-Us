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

    audioPlayer.play().then(() => {
        setIsPlaying(true);
        setIsMuted(false);
      }).catch(err => {
        console.log("Autoplay blocked, user interaction needed.");
      });

      console.log(
          "%cTo the girl this was built for — you're loved more than these pixels can express ❤️",
          "color: pink; font-size: 16px;"
        );

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
    if (window.confirm("Are you sure you want to sign out?")) {
        try {
          await signOut(auth);
          navigate("/"); // Redirect to login page after signing out
        } catch (err) {
          console.error("Sign-out error:", err.message);
        }
    }
  };

  return (
    <div
      className="w-screen h-screen bg-cover bg-center bg-no-repeat flex flex-col justify-center items-center text-white px-4"
      style={{ backgroundImage: "url('/Home-bg.jpeg')" }} // Make sure the image is in /public
    >
      <div className="absolute top-4 bg-black bg-opacity-30 px-4 py-2 rounded-lg shadow-md">
        <div className="flex items-center gap-4 text-sm text-yellow-100 font-medium">
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
        <audio ref={audioPlayerRef} preload="auto">
          <source src="/I Think They Call This Love.mp3" type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
      <div className="bg-black bg-opacity-50 p-8 rounded-lg text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to "Once Upon Us"</h1>
        <p className="text-xl mb-6">Your private library for memories.</p>
        <div className="flex flex-col items-center space-y-4">
          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate("/add-moment")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md"
            >
              Add a Moment
            </button>
            <button
              onClick={() => navigate("/memory-path")}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md"
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

          <button
            onClick={() => navigate("/surprise")}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded-md text-sm shadow-sm transition"
          >
            🎁 Surprise Me!
          </button>
          <button
            onClick={() => navigate("/welcome")}
            className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-1.5 rounded-md text-sm shadow-sm transition"
          >
            View Welcome Page Again
          </button>
        </div>

      </div>
      <div className="absolute bottom-1 w-full px-4 text-center">
        <p className="italic text-yellow-100 mx-auto max-w-3xl leading-snug text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl break-words overflow-hidden">
          “Gravitation cannot be held responsible for people falling in love. How on earth can you explain in terms of chemistry and physics so important a biological phenomenon as love? Put your hand on a stove for a minute and it seems like an hour. Sit with that special girl for an hour and it seems like a minute. That's relativity.”
          <br />
          <span className="block mt-2 text-yellow-200 text-xs sm:text-sm md:text-base">
            Albert Einstein
          </span>
        </p>
      </div>
    </div>
  );
};

export default Home;
