import React, { useState } from "react";

const Moment = ({ imageUrl, videoUrl, text, date, audioUrl }) => {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioRef = React.useRef(null);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isAudioPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsAudioPlaying(!isAudioPlaying);
  };



  return (
   <div
         className="min-h-screen bg-center bg-no-repeat bg-cover p-6 flex justify-center items-center"
         style={{
           backgroundImage: "url('/book-parchment-bg.jpg')", // Parchment-like background
           backgroundSize: "cover",
         }}
       >
         <div className="relative w-full max-w-3xl p-6 rounded-lg shadow-xl">
           {/* Date Box */}
           <div className="absolute top-4 left-4 bg-yellow-700 text-white text-xs p-2 rounded-md">
             {date}
           </div>

           {/* Image or Video */}
           {imageUrl && !videoUrl && (
             <img
               src={imageUrl}
               alt="Moment"
               className="w-full max-h-[400px] object-cover rounded mb-4"
             />
           )}

           {videoUrl && !imageUrl && (
             <video
               controls
               className="w-full max-h-[400px] rounded mb-4"
               src={videoUrl}
             />
           )}

           {/* Moment Text */}
           <p className="text-lg text-gray-800 leading-relaxed mb-4 whitespace-pre-wrap italic font-cursive" style={{ fontFamily: 'Style Script, cursive' }}>
                     {text}
                   </p>

           {/* Optional Voiceover */}
           {audioUrl && (
             <div className="mt-4">
               <button
                 onClick={toggleAudio}
                 className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
               >
                 {isAudioPlaying ? "Pause Voiceover" : "Play Voiceover"}
               </button>
               <audio ref={audioRef} src={audioUrl} className="hidden" />
             </div>
           )}
         </div>
       </div>
  );
};

export default Moment;
