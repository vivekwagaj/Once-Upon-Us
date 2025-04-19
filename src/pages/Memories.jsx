// Memories.js
import React from 'react';
import Moment from '../components/memory/Moment';
import { useMoments } from '../context/MomentsContext';
import { useParams } from 'react-router-dom';

function Memories() {
  const { id } = useParams();
  const { moments } = useMoments();
  const selectedMoment = moments.find(moment => moment.id === id);

  if (!selectedMoment) {
    return (
      <div className="p-6 text-center text-gray-500">
        Moment not found.
      </div>
    );
  }
    console.log(selectedMoment);

  return (
    <div className="p-6 flex justify-center">
      <Moment
        title={selectedMoment.title}
        date={selectedMoment.date}
        text={selectedMoment.text}
        imageUrl={selectedMoment.media}
        audioUrl={selectedMoment.audio?.url}
        videoUrl={selectedMoment.media}
      />
    </div>
  );
}

export default Memories;
