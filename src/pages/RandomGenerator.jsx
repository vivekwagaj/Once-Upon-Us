import React, { useEffect, useState } from "react";
import { useMoments } from '../context/MomentsContext';
import MomentCard from '../components/memory/MomentCard';
import { useNavigate } from "react-router-dom";

const RandomGenerator = () => {
  const { moments } = useMoments();
  const [randomMoments, setRandomMoments] = useState([]);
  const navigate = useNavigate();

  const generateRandomMoments = () => {
    if (moments && moments.length > 0) {
      const shuffled = [...moments].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, 7);
      setRandomMoments(selected);
    }
  };

  useEffect(() => {
    generateRandomMoments();
  }, [moments]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-600 via-purple-300 to-pink-300 flex flex-col items-center justify-start py-10 px-4 animate-floating relative">

      {/* Back Button */}
      <button
        onClick={() => navigate("/home")}
        className="absolute top-6 left-6 px-4 py-2 bg-yellow-700 text-white rounded-lg shadow-md hover:bg-yellow-800 transition z-10"
      >
        ← Back
      </button>

      {/* Title */}
      <h3 className="text-3xl font-bold mb-6 text-center text-black mt-16"> Moments Mash-up!!!</h3>

      {/* Regenerate Button */}
      <button
        onClick={generateRandomMoments}
        className="mb-6 px-5 py-2 bg-purple-400 hover:bg-purple-500 text-white font-semibold rounded-lg shadow-md transition"
      >
        💫
      </button>

      {/* Moments Grid */}
      {randomMoments.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl w-full px-2">
          {randomMoments.map((moment) => (
            <MomentCard key={moment.id} moment={moment} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No memories available yet.</p>
      )}
    </div>
  );
};

export default RandomGenerator;
