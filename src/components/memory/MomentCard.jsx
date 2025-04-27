import React from "react";
import { useNavigate } from "react-router-dom";

const MomentCard = ({ moment }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/memories/${moment.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer border border-gray-300 rounded-xl p-4 shadow-sm hover:shadow-lg hover:scale-105 transition transform duration-300 ease-in-out bg-gradient-to-tr from-blue-250 via-purple-150 to-white"
    >
      <h4 className="text-lg font-bold mb-1">{moment.title || "Untitled"}</h4>
      <p className="text-sm text-gray-500 mb-2">
        {moment.date ? new Date(moment.date).toLocaleDateString() : "No Date"}
      </p>
      {moment.mood && (
        <p className="text-sm mb-2">Mood: {moment.mood.emoji}</p>
      )}
      {moment.text && (
        <p className="text-sm text-gray-700 mb-2 line-clamp-3">{moment.text}</p>
      )}

      {/* Media Preview */}
      {moment.media?.type?.startsWith("image") && (
        <img
          src={moment.media.url}
          alt="Moment media"
          className="mt-2 w-full h-40 object-cover rounded-lg"
        />
      )}

      {moment.media?.type?.startsWith("video") && (
        <video
          src={moment.media.url}
          className="mt-2 w-full h-40 object-cover rounded-lg"
          controls
        />
      )}
    </div>
  );
};

export default MomentCard;
