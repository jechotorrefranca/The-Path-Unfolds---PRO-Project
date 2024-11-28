import React from "react";
import { Link } from "react-router-dom";

const TitleScreen = () => {
  const importAll = (requireContext) =>
    requireContext.keys().map(requireContext);
  const backgrounds = importAll(
    require.context("../assets/Game BG", false, /\.(png|jpe?g|svg)$/)
  );

  // Randomly select an image
  const randomBackground =
    backgrounds[Math.floor(Math.random() * backgrounds.length)];

  return (
<div
  className="h-screen w-screen flex flex-col relative"
  style={{
    backgroundImage: `url(${randomBackground})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
  {/* Background Overlay */}
  <div className="absolute inset-0 bg-black opacity-60 z-0"></div>

  {/* Title Text */}
  <h1
    className="font-breatheFire text-[10rem] font-bold text-white ml-[5rem] mt-[3rem] leading-[1] tracking-widest z-10"
    style={{
      textShadow: "0.7rem 0.5rem 0.3rem rgba(0, 0, 0, 0.8)", // Adjust shadow intensity here
    }}
  >
    The <br />Path Unfolds
  </h1>

  {/* Container for buttons */}
  <div className="flex flex-col space-y-6 mt-auto mb-8 items-end font-morris text-[3rem] mr-[5rem] z-10">
    <Link to="/game">
      <button className="px-8 py-4 bg-gray-800 bg-opacity-70 text-white hover:bg-gray-600 hover:bg-opacity-90 rounded-md transition duration-300 shadow-md transform hover:scale-105">
        Start Game
      </button>
    </Link>
    <Link to="/settings">
      <button className="px-8 py-4 bg-gray-800 bg-opacity-70 text-white hover:bg-gray-600 hover:bg-opacity-90 rounded-md transition duration-300 shadow-md transform hover:scale-105">
        Settings
      </button>
    </Link>
    <Link to="/about">
      <button className="px-8 py-4 bg-gray-800 bg-opacity-70 text-white hover:bg-gray-600 hover:bg-opacity-90 rounded-md transition duration-300 shadow-md transform hover:scale-105">
        About
      </button>
    </Link>
  </div>
</div>

  );
};

export default TitleScreen;
