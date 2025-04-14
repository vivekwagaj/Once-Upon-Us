import Moment from '../components/memory/Moment';

function Memories() {
  const sampleMoment = {
    date: "August 15th, 2022",
    text: "The day I graduated from college. It felt like a dream. I’ll never forget the feeling of walking across the stage.",
    imageUrl: "/logo192.png", // Your image path here

    audioUrl: "/audio/graduation-voiceover.mp3", // Your audio path (optional)
  };

  return (
    <div className="p-6">
      <Moment
        date={sampleMoment.date}
        text={sampleMoment.text}
        imageUrl={sampleMoment.imageUrl}
        videoUrl={sampleMoment.videoUrl}
        audioUrl={sampleMoment.audioUrl}
      />
    </div>
  );
}

export default Memories;
