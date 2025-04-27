import React, { useState,useRef } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { uploadToCloudinary } from "../config/uploadToCloudinary"; // Import the new utility
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebaseConfig";
import { useMoments } from '../context/MomentsContext';


const moodOptions = [
  { emoji: "😄", label: "Joyful" },
  { emoji: "🥺", label: "Sentimental" },
  { emoji: "🥰", label: "Loving" },
  { emoji: "😆", label: "Playful" },
  { emoji: "😠", label: "Frustrated" },
  { emoji: "🧘‍♀️", label: "Calm" },
];



const CreateMomentForm = () => {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [title,setTitle] = useState("");
  const [text, setText] = useState("");
  const [mood, setMood] = useState(null);
  const [media, setMedia] = useState({ type: null, file: null, url: null });
  const [audio, setAudio] = useState({ file: null, url: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { fetchUserMoments } = useMoments();
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const recordingIntervalRef = useRef(null);

    const navigate = useNavigate();

    const goBack = () => {
      navigate("/home");
    };

    const startRecording = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        const chunks = [];

        mediaRecorder.ondataavailable = (e) => {
          chunks.push(e.data);
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: "audio/webm" });
          setRecordedAudio(blob);
          setAudio({
            file: new File([blob], "recorded-audio.webm", { type: "audio/webm" }),
            url: URL.createObjectURL(blob),
          });
        };

        mediaRecorder.start();
        setIsRecording(true);
        setRecordingTime(0);

        recordingIntervalRef.current = setInterval(() => {
          setRecordingTime(prev => prev + 1);
        }, 1000);

      } catch (err) {
        console.error("Error accessing microphone:", err);
        alert("Microphone access is required to record audio.");
      }
    };

    const stopRecording = () => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        setIsRecording(false);
        clearInterval(recordingIntervalRef.current);
      }
    };



  const handleMediaChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;



    const type = selected.type;
    if (!type.startsWith("image") && !type.startsWith("video")) {
      alert("Only images or videos allowed here.");
      return;
    }

    setMedia({
      type: type.startsWith("image") ? "image" : "video",
      file: selected,
      url: URL.createObjectURL(selected),
    });
  };

  // Audio handler
  const handleAudioChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    if (!selected.type.startsWith("audio")) {
      alert("Please upload a valid audio file.");
      return;
    }

    setAudio({
      file: selected,
      url: URL.createObjectURL(selected),
    });
  };




  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {

      const auth1 = auth;
      const user = auth1.currentUser;

      if (!user) {
        alert("You need to be logged in to create a moment.");
        return;
      }

      // Upload media and audio to Cloudinary if they exist
      const mediaUrl = media.file ? await uploadToCloudinary(media.file) : null;
      const audioUrl = audio.file ? await uploadToCloudinary(audio.file) : null;

      // Save the data to Firestore
      await addDoc(collection(db, "moments"), {
        userId: user.uid,
        date,
        text,
        title,
        isFavorite,
        mood,
        media: mediaUrl
          ? {
              name: media.file.name,
              type: media.file.type,
              size: media.file.size,
              url: mediaUrl,
            }
          : null,
        audio: audioUrl
          ? {
              name: audio.file.name,
              type: audio.file.type,
              size: audio.file.size,
              url: audioUrl,
            }
          : null,
        createdAt: serverTimestamp(),
      });

      await fetchUserMoments();

      // Show toast and reset form
      setShowToast(true);
      setText("");
      setMood(null);
      setMedia({ type: null, file: null, url: null });
      setAudio({ file: null, url: null });

      setTimeout(() => setShowToast(false), 1000);
    } catch (err) {
      console.error("Error saving moment:", err);
      alert("Something went wrong. Try again.");
    }

    setIsSubmitting(false);
  };


  return (
    <div className="max-w-3xl mx-auto p-6 bg-[#fdf6e3] border border-gray-300 rounded-lg shadow-md font-serif">

    <button
      onClick={goBack}
      className="mb-4 text-sm  px-4 py-2 bg-yellow-700 text-white rounded-lg shadow-md hover:bg-yellow-800 transition"
    >
      ← Back to Home
    </button>
      <h2 className="text-2xl font-bold mb-4 text-center">✨ Create a Moment</h2>

      {/* Date */}
      <label className="block mb-2">Date</label>
      <input
        type="date"
        className="w-full mb-4 p-2 border border-gray-300 rounded"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      {/* Mood Picker */}
      <label className="block mb-2">Mood</label>
      <div className="flex gap-3 mb-4">
        {moodOptions.map((option) => (
          <button
            key={option.label}
            onClick={() => setMood(option)}
            className={`text-2xl p-2 rounded-full border ${
              mood?.label === option.label
                ? "bg-yellow-300 border-yellow-500"
                : "border-gray-300"
            } hover:scale-110 transition`}
          >
            {option.emoji}
          </button>
        ))}
      </div>

      <label className="block mb-2">Memory Title</label>
       <textarea
         rows={1}
         className="w-full p-2 border border-gray-300 rounded mb-4"
         placeholder="Write about this moment..."
         value={title}
         onChange={(e) => setTitle(e.target.value)}
      />

      {/* Text */}
      <label className="block mb-2">Memory Text</label>
      <textarea
        rows={5}
        className="w-full p-2 border border-gray-300 rounded mb-4"
        placeholder="Write about this moment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />


      <button
        type="button"
        onClick={() => setIsFavorite((prev) => !prev)}
        className="text-sm transition-transform text-yellow-800 transform  mb-4"
        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        {isFavorite ? "💖 Marked" : "🤍 Mark"}  As Favourite
      </button>



      {/* File Upload */}
      <label className="block mb-2">Photo or Video</label>
      <input
        type="file"
        accept="image/*,video/*"
        className="mb-4"
        onChange={handleMediaChange}
      />

      {/* Audio */}
      {/* Audio Section */}
      <label className="block mb-2">Optional Audio (Record your voice!)</label>

      <div className="flex items-center gap-4 mb-4">
        {!isRecording ? (
          <button
            type="button"
            onClick={startRecording}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            🎙️ Start Recording
          </button>
        ) : (
          <button
            type="button"
            onClick={stopRecording}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            ⏹️ Stop Recording
          </button>
        )}
        {isRecording && <span className="text-gray-600">{recordingTime}s</span>}
      </div>
      {/* Audio Preview */}
      {audio.url && (
        <div className="mb-4">
          <audio controls src={audio.url} className="w-full"></audio>
        </div>
      )}





      {/* Live Preview */}
      {(title || media.url || audio.url || mood || text) && (
        <div className="bg-white border border-gray-200 rounded p-4 mb-4 shadow-sm">
          <h3 className="font-bold mb-2">Preview</h3>

          {mood && <div className="text-2xl mb-2">{mood.emoji} <span className="text-sm">({mood.label})</span></div>}
          {text && <p className="italic text-xl text-gray-700 whitespace-pre-wrap mb-2">{title}</p>}
          {text && <p className="italic text-gray-700 whitespace-pre-wrap mb-2">{text}</p>}

          {media.type === "image" && <img src={media.url} alt="Moment" className="rounded max-h-64" />}
          {media.type === "video" && (
            <video controls className="rounded max-h-64">
              <source src={media.url} />
              Your browser does not support video.
            </video>
          )}

          {audio.url && (
            <div className="mt-3">
              <p className="text-sm mb-1 text-gray-500">Optional Audio</p>
              <audio controls>
                <source src={audio.url} />
                Your browser does not support audio.
              </audio>
            </div>
          )}
        </div>
      )}

      {/* Submit */}
      <div className="w-full mt-4">
        {showToast ? (
          <div className="w-full py-2 bg-yellow-500 text-white text-center rounded shadow-md transition-all duration-300">
            ✨ Moment saved!
          </div>
        ) : (
          <button
            disabled={!title || !text || !mood || !media.file}
            onClick={handleSubmit}
            className="w-full py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save"} Moment
          </button>
        )}
      </div>


    </div>


  );
};

export default CreateMomentForm;
