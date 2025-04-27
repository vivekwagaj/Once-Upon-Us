import React, { useState } from "react";
import './Moment.css';
import { useNavigate } from "react-router-dom";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db,auth } from "../../firebase/firebaseConfig";
import { useMoments } from '../../context/MomentsContext';
import { uploadToCloudinary } from "../../config/uploadToCloudinary"; // Import the new utility




const Moment = ({ id, imageUrl, videoUrl, text, title, date, audioUrl, fav }) => {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioRef = React.useRef(null);
  const [isFavorite, setIsFavorite] = useState(fav ?? false);
  const { fetchUserMoments } = useMoments();
  const [isEditing, setIsEditing] = useState(false);
  const [mood, setMood] = useState(null);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedText, setEditedText] = useState(text);
  const [editedImageFile, setEditedImageFile] = useState(null);
  const [media, setMedia] = useState({ type: '', file: null, url: '' });
  const [audio, setAudio] = useState({ file: null, url: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioBlob, setRecordedAudioBlob] = useState(null);
  const [recorder, setRecorder] = useState(null);


  const navigate = useNavigate();

  const goBack = () => {
    navigate("/home");
  };

const startRecording = async () => {
  if (!navigator.mediaDevices) {
    alert("Recording not supported in this browser.");
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const chunks = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/webm' });
      setRecordedAudioBlob(blob);
      setAudio({
        file: new File([blob], "recorded-audio.webm", { type: 'audio/webm' }),
        url: URL.createObjectURL(blob),
      });
    };

    mediaRecorder.start();
    setRecorder(mediaRecorder);
    setIsRecording(true);
  } catch (err) {
    console.error("Error accessing microphone:", err);
    alert("Failed to start recording.");
  }
};

const stopRecording = () => {
  if (recorder) {
    recorder.stop();
    setRecorder(null);
    setIsRecording(false);
  }
};

const toggleFavorite = async () => {
  try {
    const newFavorite = !isFavorite; // compute it manually
    setIsFavorite(newFavorite); // optimistic update
    const momentRef = doc(db, "moments", id);
    await updateDoc(momentRef, { isFavorite: newFavorite });
  } catch (err) {
    console.error("Error updating favorite status:", err);
    alert("Something went wrong. Please try again.");
    setIsFavorite(fav); // rollback
  }
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

  const deleteMoment = async () => {
    if (window.confirm("Are you sure you want to delete this moment?")) {
      try {
        const momentRef = doc(db, "moments", id);
        await deleteDoc(momentRef);

        await fetchUserMoments();
        navigate("/home"); // Redirect after deletion
      } catch (err) {
        console.error("Error deleting moment:", err);
        alert("Something went wrong. Please try again.");
      }
    }
  };

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

    const saveEdits = async () => {
      setIsSubmitting(true);

      try {
        const user = auth.currentUser;
        if (!user) {
          alert("You're not logged in.");
          return;
        }

        let mediaUrl = media.url || imageUrl?.url || null;
        if (media.file) {
          try {
            mediaUrl = await uploadToCloudinary(media.file);
          } catch (err) {
            console.error("Error uploading media:", err);
            alert("Media upload failed. Please try again.");
            return;
          }
        }

        let updatedAudioUrl = audioUrl || null;

        if (recordedAudioBlob || audio.file) {
          try {
            const audioFile = recordedAudioBlob
              ? new File([recordedAudioBlob], "recorded-audio.webm", { type: 'audio/webm' })
              : audio.file;

            updatedAudioUrl = await uploadToCloudinary(audioFile);
          } catch (err) {
            console.error("Error uploading audio:", err);
            alert("Audio upload failed. Please try again.");
            return;
          }
        }

        const momentRef = doc(db, "moments", id);
        await updateDoc(momentRef, {
          title: editedTitle,
          text: editedText,
          media: mediaUrl
            ? {
                name: media.file?.name || imageUrl?.name,
                type: media.file?.type || imageUrl?.type,
                size: media.file?.size || imageUrl?.size,
                url: mediaUrl,
              }
            : null,
          audio: updatedAudioUrl
            ? {
                name: audio?.file?.name || "recorded-audio.wav",
                type: audio?.file?.type || "audio/wav",
                size: audio?.file?.size || 0,
                url: updatedAudioUrl,
              }
            : null,
        });

        alert("Moment updated successfully!");
        setIsEditing(false);
        await fetchUserMoments();
      } catch (err) {
        console.error("Error saving moment:", err);
        alert("Something went wrong while saving. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    };



  const { day, month, year } = formatDateParts(date);

  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat overflow-auto flex justify-center items-start px-4 py-8"
      style={{
        backgroundImage: "url('/book-parchment-bg.jpg')",
        backgroundSize: "cover",
        backgroundAttachment: "scroll",
        backgroundColor: "#fffbe6",
        zIndex: -1, // Make it a true background
      }}
    >



       {/* Text Box */}
      <div className="relative w-full max-w-3xl p-6  border-[#d2b48c]  overflow-hidden">

      {isEditing ? (
        <input
          type="text"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          className="text-center text-3xl mb-4 border-b-2 border-yellow-800 bg-transparent text-gray-800 w-full"
        />
        ) : (
        <p className="text-center text-gray-800 text-3xl leading-relaxed mb-4 whitespace-pre-wrap">
          {title}
        </p>
      )}

        {/* Media Container with Frame */}
        <div className="relative w-full max-h-[500px] mb-6 border-4 border-[#3e2c1e] rounded-lg shadow-md overflow-hidden bg-black flex items-center justify-center">
          {/* Heart Badge */}
            <div
              className="absolute top-2 right-2 z-10 text-2xl cursor-pointer hover:scale-110 transition-transform"
              onClick={toggleFavorite}
              title={isFavorite ? "Unfavorite" : "Mark as Favorite"}
            >
              {isFavorite ? "💖" : "🤍"}
            </div>

            {isEditing ?
            (
                <>
                <label className="block mb-2">Optional Audio:</label>
                <input type="file" accept="image/*,video/*" onChange={handleMediaChange} />

                {/* Live Preview for Media */}
                    {media.url && (
                      <>
                        {media.type === "image" && (
                          <img
                            src={media.url}
                            alt="Preview"
                            className="mt-2 rounded-lg w-full max-h-[300px] object-contain border-2 border-yellow-400"
                          />
                        )}
                        {media.type === "video" && (
                          <video controls className="mt-2 rounded-lg w-full max-h-[300px] object-contain border-2 border-yellow-400">
                            <source src={media.url} />
                            Your browser does not support the video tag.
                          </video>
                        )}
                      </>
                    )}

                </>
            ) :
            (
                <>
                  {imageUrl?.type?.startsWith("image") && (
                    <img
                      src={imageUrl.url}
                      alt="Memory"
                      className="max-h-[500px] w-full object-contain"
                    />
                  )}
                  {videoUrl?.type?.startsWith("video") && (
                    <video
                      controls
                      className="max-h-[500px] w-full object-contain"
                      src={videoUrl.url}
                    />
                  )}
                </>
            )}

          {/* Date Box */}
          <div className="absolute top-3 left-3 bg-[#fdf6e3] border-2 border-[#3e2c1e] text-black px-3 py-2 rounded-md shadow-md text-center font-serif text-sm leading-tight date-box-texture tracking-wide">
            <div>{day}</div>
            <div className="uppercase">{month}</div>
            <div>{year}</div>
          </div>
        </div>


        {/* Moment Text */}
        {isEditing ? (
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            rows={3}
            className="w-full text-lg text-gray-800 leading-relaxed mb-4 italic border p-2 rounded bg-white"
            style={{ fontFamily: 'Style Script, cursive' }}
          />
        ) : (
          <p
            className="text-lg text-gray-800 leading-relaxed mb-4 whitespace-pre-wrap italic"
            style={{ fontFamily: 'Style Script, cursive' }}
          >
            {text}
          </p>
        )}



        {/* Optional Voiceover */}
        {isEditing ? (
          <>
            <div className="flex flex-col space-y-2 mt-4">
              <label>Upload New Audio or Record:</label>
              <input type="file" accept="audio/*" onChange={handleAudioChange} />

              {!isRecording ? (
                <button
                  type="button"
                  onClick={startRecording}
                  className="bg-yellow-700 hover:bg-yellow-800 text-white px-4 py-2 rounded"
                >
                  Start Recording
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                >
                  Stop Recording
                </button>
              )}

              {audio.url && (
                <audio controls src={audio.url} className="mt-2"></audio>
              )}
            </div>

          </>
          ) : (
            (audio?.url || audioUrl) && (
              <div className="mt-4 text-center">
                <button onClick={toggleAudio} className="px-5 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition">
                  {isAudioPlaying ? "Pause Voiceover" : "Play Voiceover"}
                </button>
                <audio ref={audioRef} src={audio.url || audioUrl} onEnded={() => setIsAudioPlaying(false)} />

              </div>
            )
          )
        }


      </div>

      <button
        onClick={goBack}
        className="absolute top-6 left-6 px-4 py-2 bg-yellow-700 text-white rounded-lg shadow-md hover:bg-yellow-800 transition"
      >
        ← Back
      </button>

      {/* Edit Button */}
      {isEditing ? (
        <>
          <button
            disabled={isSubmitting}
            onClick={saveEdits}
            className={`absolute bottom-6 left-6 px-4 py-2 ${
              isSubmitting ? "bg-green-300 cursor-not-allowed" : "bg-green-700 hover:bg-green-800"
            } text-white rounded-lg shadow-md transition`}
          >
            {isSubmitting ? "Saving..." : "✅ Save"}
          </button>

          <button
            onClick={() => {
              setIsEditing(false);
              setEditedTitle(title);
              setEditedText(text);
            }}
            className="absolute bottom-6 left-32 px-4 py-2 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600 transition"
          >
            ❌ Cancel
          </button>
        </>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="absolute bottom-6 left-6 px-4 py-2 bg-blue-700 text-white rounded-lg shadow-md hover:bg-blue-800 transition"
        >
          ✏️ Edit
        </button>
      )}


      {/* Delete Button */}
      <button
        onClick={deleteMoment}
        className="absolute bottom-6 right-6 px-4 py-2 bg-red-700 text-white rounded-lg shadow-md hover:bg-red-800 transition"
      >
        🗑️ Delete
      </button>

      <button
              onClick={() => navigate("/memory-path")}
              className="absolute top-6 right-6 px-4 py-2 bg-yellow-700 text-white rounded-lg shadow-md hover:bg-yellow-800 transition"
            >
              Memory-Map →
            </button>
    </div>
  );
};

export default Moment;
