
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMoments } from '../context/MomentsContext';

function generateDynamicPath(moments, startX = 35, startY = 100, yStep = 60, waveWidth = 300) {
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
  const [selectedMoment, setSelectedMoment] = useState(null);
  const { moments } = useMoments();



  const [filter, setFilter] = useState("all");
  const [moodFilter, setMoodFilter] = useState("");
  const [searchTitle, setSearchTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10));

  const milestoneKeywords = [
    "anniversary", "birthday", "trip", "proposal", "first",
    "valentine", "engagement", "celebration", "wedding", "new",
  ];

  const isMilestone = (title = "") =>
    milestoneKeywords.some((keyword) =>
      title.toLowerCase().includes(keyword)
    );


  const filteredMoments = moments.filter(moment => {
    if (filter === "favorites" && !moment.isFavorite) return false;
    if (moodFilter && moment.mood?.label !== moodFilter) return false;
    if (searchTitle && !moment.title?.toLowerCase().includes(searchTitle.toLowerCase())) return false;

    const momentDate = new Date(moment.date);
      if (startDate && momentDate < new Date(startDate)) return false;
      if (endDate && momentDate > new Date(endDate)) return false;

      return true;
  });

  const pathD = generateDynamicPath(filteredMoments);
  const svgWidth = window.innerWidth;
  const yMultiplier = 60;
  const waveSegments = Math.ceil(filteredMoments.length / 2);
  const svgHeight = waveSegments * yMultiplier + 200;

  useEffect(() => {
    if (!pathRef.current || !filteredMoments.length) return;

    const timer = setTimeout(() => {
      const length = pathRef.current.getTotalLength();
      const step = length / filteredMoments.length;

      const newPositions = filteredMoments.map((_, i) => {
        const point = pathRef.current.getPointAtLength(i * step);
        return { x: point.x, y: point.y };
      });

      setPositions(newPositions);
    }, 10);

    return () => clearTimeout(timer);
  }, [filteredMoments]);

  const handleMomentClick = (moment) => {
    setSelectedMoment(moment);
  };

  const closeModal = () => {
    setSelectedMoment(null);
  };

  return (
    <div className="w-full overflow-x-auto relative">
      <div className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('/memory-path.jpg')`, filter: 'blur(1px)', opacity: 0.93 }}></div>
      <div className="absolute inset-0 bg-black opacity-30 z-10"></div>

      <div className="relative z-20 min-h-screen">
        <button onClick={() => navigate("/home")} className="fixed top-4 left-4 z-50 bg-green-500 hover:bg-red-600 text-white px-4 py-1 md:px-6 md:py-2 text-sm md:text-base rounded-md shadow-md">Home Page</button>
        <button onClick={() => navigate("/add-moment")} className="fixed top-4 right-4 z-50 bg-blue-500 hover:bg-red-600 text-white px-4 py-1 md:px-6 md:py-2 text-sm md:text-base rounded-md shadow-md">Add a Moment</button>

        <div className="sticky top-16 left-0 w-full bg-white/80 backdrop-blur-md border-b border-yellow-200 z-40 shadow-sm">
          <div className="flex flex-nowrap gap-2 px-4 py-2 justify-start items-center overflow-x-auto scrollbar-hide whitespace-nowrap">
            <button
              onClick={() => setFilter("all")}
              className={`flex-shrink-0 px-3 py-1 text-xs md:text-sm rounded ${
                filter === "all" ? "bg-yellow-500 text-white" : "bg-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("favorites")}
              className={`flex-shrink-0 px-3 py-1 text-xs md:text-sm rounded ${
                filter === "favorites" ? "bg-pink-500 text-white" : "bg-gray-200"
              }`}
            >
              💖 Favorites
            </button>
            <select
              value={moodFilter}
              onChange={(e) => setMoodFilter(e.target.value)}
              className="flex-shrink-0 px-2 py-1 text-xs md:text-sm border rounded bg-white"
            >
              <option value="">All Moods</option>
              <option value="Joyful">😄 Joyful</option>
              <option value="Sentimental">🥺 Sentimental</option>
              <option value="Loving">🥰 Loving</option>
              <option value="Playful">😆 Playful</option>
              <option value="Frustrated">😠 Frustrated</option>
              <option value="Calm">🧘‍♀️ Calm</option>
            </select>
            <input
              type="text"
              placeholder="Search Title"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              className="flex-shrink min-w-0 max-w-[140px] md:max-w-xs px-2 py-1 text-xs md:text-sm border rounded"
            />
            <input
              type="date"
              placeholder="From Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="flex-shrink-0 px-2 py-1 text-xs md:text-sm border rounded bg-white"
            />
            <input
              type="date"
              placeholder="To Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="flex-shrink-0 px-2 py-1 text-xs md:text-sm border rounded bg-white"
            />
          </div>
        </div>



        <div className="relative mt-10" style={{ width: svgWidth, height: svgHeight }}>
          <svg width={svgWidth} height={svgHeight} className="absolute top-0 left-0 z-0">
            <path ref={pathRef} d={pathD} fill="none" stroke="transparent" />
            <path d={pathD} fill="none" stroke="black" strokeDasharray="6 6" strokeWidth="4" opacity="0.8" />
          </svg>

          {filteredMoments.map((moment, i) => {
            const pos = positions[i];
            if (!pos) return null;
            return (
                <div
                  key={moment.id}
                  className={`absolute flex flex-col items-center text-center group cursor-pointer

                  `}
                  style={{ top: pos.y - 30, left: pos.x - 20 }}
                  onClick={() => handleMomentClick(moment)}
                  >
                    <div className="text-2xl">
                        {moment.mood?.emoji} {moment.isFavorite && "💖"} {isMilestone(moment.title) && "🌠🥂"}
                    </div>

                    <div
                      className={`
                        text-xs rounded-lg px-2 py-1 shadow-md mt-1 font-medium
                        ${isMilestone(moment.title) && moment.isFavorite
                          ? "bg-gradient-to-r from-pink-300 to-orange-300 text-pink-900"
                          : isMilestone(moment.title)
                          ? "bg-orange-400 text-pink-900"
                          : moment.isFavorite
                          ? "bg-pink-300 text-pink-900"
                          : "bg-yellow-300 text-yellow-900"
                        }
                      `}
                      >
                        <div className="text-[10px]">{moment.date}</div>
                        {moment.title}
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
                              autoPlay muted
                              className="w-10 h-10 object-cover rounded"
                            >
                              <source src={moments[i].media.url} type={moments[i].media.type} />
                              Your browser does not support the video tag.
                            </video>
                            )}
                          </div>
                    </div>
                </div>

            );
          })}
        </div>

        {selectedMoment && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className={`p-6 rounded-lg shadow-lg max-w-md w-full relative ${selectedMoment?.isFavorite ? "bg-pink-50 border-pink-300 border" : "bg-white"}`}>
              <button className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl" onClick={closeModal}>✕</button>
              <h2 className="text-xl font-semibold mb-2">{selectedMoment.title} {isMilestone(selectedMoment.title) && " -- It's a milestone!!!"}</h2>
              {selectedMoment?.isFavorite && (
                <div className="text-pink-500 text-sm font-semibold mb-2">💖 Favorite Moment</div>
              )}
              <p className="text-sm text-gray-500 mb-2">
                {selectedMoment.date} — <span className="text-lg">{selectedMoment.mood.emoji}</span>
              </p>
              <p className="mb-4">{selectedMoment.text}</p>

              {selectedMoment.media?.type?.startsWith("image") && (
                <img src={selectedMoment.media.url} alt="Moment Media" className="w-full h-48 object-cover rounded mb-4" />
              )}

              {selectedMoment.media?.type?.startsWith("video") && (
                <video muted loop autoPlay className="w-full h-48 object-cover rounded mb-4">
                  <source src={selectedMoment.media.url} type={selectedMoment.media.type} />
                </video>
              )}

              {selectedMoment.audio && (
                <audio controls className="w-full">
                  <source src={selectedMoment.audio.url} type="audio/mpeg" />
                </audio>
              )}
              {isMilestone(selectedMoment.title) && (
                                  <div className="mt-6 text-center text-green-600 font-medium">
                                    This moment is extra special. Don’t forget to celebrate it again!
                                  </div>
                                )}
              <button onClick={() => navigate(`/memories/${selectedMoment.id}`)} className="mt-4 text-blue-500 hover:text-blue-700">Open Full Page View</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
