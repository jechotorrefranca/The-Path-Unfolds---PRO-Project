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
      className="h-screen w-screen flex flex-col justify-center items-center text-center"
      style={{
        backgroundImage: `url(${randomBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h1 className="font-breatheFire text-5xl font-extrabold text-white mb-12 drop-shadow-md">
        The Path Unfolds
      </h1>
      <div className="flex flex-col space-y-6">
        <Link to="/game">
          <button className="px-8 py-4 bg-gray-800 bg-opacity-70 text-white hover:bg-gray-600 hover:bg-opacity-90 rounded-md text-xl transition duration-300 shadow-md transform hover:scale-105">
            Start Game
          </button>
        </Link>
        <Link to="/settings">
          <button className="px-8 py-4 bg-gray-800 bg-opacity-70 text-white hover:bg-gray-600 hover:bg-opacity-90 rounded-md text-xl transition duration-300 shadow-md transform hover:scale-105">
            Settings
          </button>
        </Link>
        <Link to="/about">
          <button className="px-8 py-4 bg-gray-800 bg-opacity-70 text-white hover:bg-gray-600 hover:bg-opacity-90 rounded-md text-xl transition duration-300 shadow-md transform hover:scale-105">
            About
          </button>
        </Link>
      </div>
    </div>
  );
};

export default TitleScreen;
