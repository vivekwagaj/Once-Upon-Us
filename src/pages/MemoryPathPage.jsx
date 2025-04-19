import React, { useEffect, useRef, useState } from 'react';
import Moment from '../components/memory/Moment'; // Import Moment component
import { useNavigate, useParams } from 'react-router-dom';
import { useMoments } from '../context/MomentsContext';



// export const mockMoments = Array.from({ length: 100 }, (_, i) => ({
//   id: i + 1,
//   title: `Moment #${i + 1}`,
//   mood: ['😊', '🌈', '🤔', '😢', '😄'][i % 5],
//   date: `2024-0${(i % 9) + 1}-1${i % 9}`,
//   text: `This is a reflection for moment #${i + 1}.`,
//   media: `https://picsum.photos/seed/${i}/400`,
//   voiceover: i % 3 === 0 ? `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${(i % 3) + 1}.mp3` : null,
// }));

function generateDynamicPath(moments, startX = 50, startY = 100, yStep = 60, waveWidth = 300) {
  const points = [];
  let direction = 1;
  let x = startX;
  let y = startY;

  const waveSegments = Math.ceil(moments.length / 2);
  points.push(`M ${x} ${y}`);

  for (let i = 1; i < waveSegments; i++) {
    const controlX = x + direction * waveWidth;
    const controlY = y + yStep / 2;
    y += yStep;
    x += direction * waveWidth;
    points.push(`Q ${controlX} ${controlY}, ${x} ${y}`);
    direction *= -1;
  }

  return points.join(' ');
}

export default function MemoryPath() {
const { id } = useParams();
  const navigate = useNavigate();
  const pathRef = useRef(null);
  const [positions, setPositions] = useState([]);
  const [selectedMoment, setSelectedMoment] = useState(null); // Store selected moment for the modal
  const { moments } = useMoments();

  console.log(moments.length);

  const pathD = generateDynamicPath(moments);
  const svgWidth = window.innerWidth;
  const yMultiplier = 60;
  const waveSegments = Math.ceil(moments.length / 2);
  const svgHeight = waveSegments * yMultiplier + 200;

  useEffect(() => {

  if (!pathRef.current || !moments.length)
  {
//   console.log(moments.length);
return;
}

  if (!moments) {
        return <div className="text-center mt-10 text-gray-500">Loading your memories...</div>;
      }
        console.log("Updated moments in MemoryPath:", moments);
    const timer = setTimeout(() => {
      if (!pathRef.current) return;
      const length = pathRef.current.getTotalLength();
      const step = length / moments.length;

      const newPositions = moments.map((_, i) => {
        const point = pathRef.current.getPointAtLength(i * step);
        return { x: point.x, y: point.y };
      });

      console.log(newPositions);

      setPositions(newPositions);
    }, 10);

    return () => clearTimeout(timer);
  }, [moments]);

  const handleMomentClick = (moment) => {
    setSelectedMoment(moment); // Set the clicked moment to show in the modal
  };

  const closeModal = () => {
    setSelectedMoment(null); // Close the modal by clearing the selected moment
  };

  return (
    <div className="w-full overflow-x-auto relative">
      {/* Background image layer */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/memory-path.jpg')`,
          filter: 'blur(1px)',
          opacity: 0.93,
        }}
      ></div>

      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black opacity-30 z-10"></div>

      {/* Content container */}
      <div className="relative z-20 min-h-screen">

        <button
          onClick={() => navigate("/home")}
          className="fixed top-4 left-4 z-50 bg-green-500 hover:bg-red-600 text-white px-4 py-1 md:px-6 md:py-2 text-sm md:text-base rounded-md shadow-md"
        >
          Home Page
        </button>

        <div
          className="relative"
          style={{
            width: svgWidth,
            height: svgHeight,
          }}
        >
          <svg width={svgWidth} height={svgHeight} className="absolute top-0 left-0 z-0">
            <path ref={pathRef} d={pathD} fill="none" stroke="transparent" />
            <path
              d={pathD}
              fill="none"
              stroke="black"
              strokeDasharray="6 6"
              strokeWidth="4"
              opacity="0.8"
            />
          </svg>

          {positions.map((pos, i) => (
            <div
              key={moments[i].id}
              className="absolute flex flex-col items-center text-center group cursor-pointer"
              style={{ top: pos.y - 30, left: pos.x - 20 }}
              onClick={() => handleMomentClick(moments[i])}
            >
              <div className="text-2xl">{moments[i].mood.emoji}</div>

              <div className="text-xs bg-yellow-300 text-yellow-900 rounded-xl px-2 py-1 shadow-md mt-1 font-medium">
                <div className="text-[10px]">{moments[i].date}</div>
                {moments[i].title}
              </div>
              <div className="absolute -top-16 hidden group-hover:flex flex-col items-center">
                <div className="bg-white p-1 rounded-lg shadow-md border">
                  {moments[i].media?.type?.startsWith("image") && (
                      <img
                        src={moments[i].media.url}
                        alt="Moment Media"
                        className="w-10 h-10 object-cover rounded"
                      />
                  )}

                  {moments[i].media?.type?.startsWith("video") && (
                  <video
                    autoPlay
                    className="w-10 h-10 object-cover rounded"
                  >
                    <source src={moments[i].media.url} type={moments[i].media.type} />
                    Your browser does not support the video tag.
                  </video>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {selectedMoment && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
              <button
                className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl"
                onClick={closeModal}
              >
                ✕
              </button>
              <h2 className="text-xl font-semibold mb-2">{selectedMoment.title}</h2>
              <p className="text-sm text-gray-500 mb-2">
                {selectedMoment.date} — <span className="text-lg">{selectedMoment.mood.emoji}</span>
              </p>
              <p className="mb-4">{selectedMoment.text}</p>
              {selectedMoment.media?.type?.startsWith("image") && (
                <img
                  src={selectedMoment.media.url}
                  alt="Moment Media"
                  className="w-full h-48 object-cover rounded mb-4"
                />
              )}

              {selectedMoment.media?.type?.startsWith("video") && (
                <video
                  muted
                  loop
                  autoPlay
                  className="w-full h-48 object-cover rounded mb-4"
                >
                  <source src={selectedMoment.media.url} type={selectedMoment.media.type} />
                  Your browser does not support the video tag.
                </video>
              )}
              {selectedMoment.audio && (
                <audio controls className="w-full">
                  <source src={selectedMoment.audio.url} type="audio/mpeg" />
                </audio>
              )}
              <button
                onClick={() => navigate(`/memories/${selectedMoment.id}`)}
                className="mt-4 text-blue-500 hover:text-blue-700"
              >
                Open Full Page View
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

}
