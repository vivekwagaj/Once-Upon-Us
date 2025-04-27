import { useNavigate } from "react-router-dom";

const WelcomePage = () => {
  const navigate = useNavigate();

  const handleGoHome = async () => {
    navigate("/home");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-pink-100 via-rose-200 to-yellow-100 animate-fade-in">
      {/* Cute illustration */}
      <img
        src="./welcome-page.jpeg"
        alt="Welcome Illustration"
        className="w-48 h-48 mb-6 animate-float"
      />

      {/* Heading */}
      <h1 className="text-5xl font-extrabold mb-4 text-pink-600 drop-shadow-md">
        Hey there, munchkin 💖
      </h1>

      {/* Description */}
      <p className="text-lg mb-8 text-center px-8 text-gray-700 max-w-2xl">
        Welcome to our little memory universe! I built this just for us — a space where our goofiest selfies, unexpected adventures, and all our milestone-y magic moments live. Think of it like a digital scrapbook, but cooler (and with less glitter everywhere). Every click is a reminder of how much I love being yours. So dive in, explore, and maybe laugh a little — this is our story, and it’s just getting started.
      </p>

      {/* Button */}
      <button
        onClick={handleGoHome}
        className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 animate-bounce-slow"
      >
        Let's Go Home 🏠
      </button>
    </div>
  );
};

export default WelcomePage;
