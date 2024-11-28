import React from "react";
import { Link } from "react-router-dom";

const TitleScreen = () => {
  const backgrounds = [
    "https://via.placeholder.com/1920x1080?text=Background+1",
    "https://via.placeholder.com/1920x1080?text=Background+2",
    "https://via.placeholder.com/1920x1080?text=Background+3",
  ];
  const randomBackground =
    backgrounds[Math.floor(Math.random() * backgrounds.length)];

  return (
    <div
      className="h-screen w-screen flex flex-col items-center justify-center text-white"
      style={{
        backgroundImage: `url(${randomBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h1 className="text-4xl font-bold mb-8">The Path Unfolds</h1>
      <div className="flex flex-col space-y-4">
        <Link to="/game">
          <button className="px-6 py-3 bg-gray-800 bg-opacity-70 hover:bg-gray-600 rounded-md text-lg">
            Start Game
          </button>
        </Link>
        <Link to="/settings">
          <button className="px-6 py-3 bg-gray-800 bg-opacity-70 hover:bg-gray-600 rounded-md text-lg">
            Settings
          </button>
        </Link>
        <Link to="/about">
          <button className="px-6 py-3 bg-gray-800 bg-opacity-70 hover:bg-gray-600 rounded-md text-lg">
            About
          </button>
        </Link>
      </div>
    </div>
  );
};

export default TitleScreen;
