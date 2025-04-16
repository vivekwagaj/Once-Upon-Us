import React, { useState } from "react";
import './Moment.css';
import { useNavigate } from "react-router-dom";


const Moment = ({ imageUrl, videoUrl, text, date, audioUrl }) => {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioRef = React.useRef(null);

  const navigate = useNavigate();

  const goBack = () => {
    navigate("/home");
  };


  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isAudioPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsAudioPlaying(!isAudioPlaying);
  };

  const formatDateParts = (isoDateString) => {
    const d = new Date(isoDateString);
    const day = String(d.getDate()).padStart(2, "0");
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[d.getMonth()];
    const year = d.getFullYear();
    return { day, month, year };
  };

  const { day, month, year } = formatDateParts(date);

  return (
    <div
      className="min-h-screen bg-center bg-no-repeat bg-cover p-6 flex justify-center items-center"
      style={{
        backgroundImage: "url('/book-parchment-bg.jpg')",
        backgroundSize: "cover",
      }}
    >


      <div className="relative w-full max-w-3xl p-6  border-[#d2b48c]  overflow-hidden">
        {/* Media Container with Frame */}
        <div className="relative w-full max-h-[500px] mb-6 border-4 border-[#3e2c1e] rounded-lg shadow-md overflow-hidden">
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Memory"
              className="w-full h-full object-cover"
            />
          )}
          {videoUrl && (
            <video
              controls
              className="w-full h-full object-cover"
              src={videoUrl}
            />
          )}

          {/* Date Box */}
          <div className="absolute top-3 left-3 bg-[#fdf6e3] border-2 border-[#3e2c1e] text-black px-3 py-2 rounded-md shadow-md text-center font-serif text-sm leading-tight date-box-texture tracking-wide">
            <div>{day}</div>
            <div className="uppercase">{month}</div>
            <div>{year}</div>
          </div>
        </div>

        {/* Moment Text */}
        <p
          className="text-lg text-gray-800 leading-relaxed mb-4 whitespace-pre-wrap italic"
          style={{ fontFamily: 'Style Script, cursive' }}
        >
          {text}
        </p>

        {/* Optional Voiceover */}
        {audioUrl && (
          <div className="mt-4 text-center">
            <button
              onClick={toggleAudio}
              className="px-5 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"
            >
              {isAudioPlaying ? "Pause Voiceover" : "Play Voiceover"}
            </button>
            <audio ref={audioRef} src={audioUrl} className="hidden" />
          </div>
        )}
      </div>

      <button
        onClick={goBack}
        className="absolute top-6 left-6 px-4 py-2 bg-yellow-700 text-white rounded-lg shadow-md hover:bg-yellow-800 transition"
      >
        ← Back
      </button>
    </div>
  );
};

export default Moment;
