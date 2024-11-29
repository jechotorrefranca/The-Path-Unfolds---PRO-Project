import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Modal from "../Components/MusicModal/Modal";
import backgroundMusic from "../assets/TitleScreen Music/TitleScreenBGM.mp3";

const TitleScreen = () => {
  const importAll = (requireContext) =>
    requireContext.keys().map(requireContext);
  const backgrounds = importAll(
    require.context("../assets/Game BG", false, /\.(png|jpe?g|svg)$/)
  );

  const randomBackground = backgrounds[Math.floor(Math.random() * backgrounds.length)];
  const [audio] = useState(new Audio(backgroundMusic));
  const [isModalOpen, setIsModalOpen] = useState(true); // Modal state

  const startMusic = () => {
    audio.loop = true;
    audio.volume = 0.5;
    audio.play();
    setIsModalOpen(false); // Close modal after starting music
  };

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
      <div className="absolute inset-0 bg-black opacity-70 z-0"></div>

      {/* Title Text */}
      <div className="z-10">
        <h1
          className="font-breatheFire text-[2.5rem] sm:text-[5rem] lg:text-[10rem] text-white sm:ml-[2rem] mt-[15rem] ml-[1rem] sm:mt-[2rem] lg:ml-[5rem] lg:mt-[3rem] leading-[1] tracking-widest z-10"
          style={{
            textShadow: "0.7rem 0.5rem 0.3rem rgba(0, 0, 0, 0.8)",
          }}
        >
          The <br />
          Path Unfolds
        </h1>
      </div>

      {/* Container for buttons */}
      <div className="flex flex-col space-y-1 mt-auto mb-8 items-end font-morris text-[3rem] mr-[2rem] z-10">
        <Link to="/game">
          <button className="relative py-10 text-white rounded-[100rem] pr-[2rem] pl-[15rem] text-xl group overflow-hidden flex">
            <span className="relative z-10 text-[5rem]">Start Game</span>
            <span className="absolute inset-0 bg-gradient-to-r from-transparent to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </button>
        </Link>
        <Link to="/settings">
          <button className="relative py-10 text-white rounded-[100rem] pr-[2rem] pl-[15rem] text-xl group overflow-hidden flex">
            <span className="relative z-10 text-[5rem]">Settings</span>
            <span className="absolute inset-0 bg-gradient-to-r from-transparent to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </button>
        </Link>
        <Link to="/about">
          <button className="relative py-10 text-white rounded-[100rem] pr-[2rem] pl-[15rem] text-xl group overflow-hidden flex">
            <span className="relative z-10 text-[5rem]">About</span>
            <span className="absolute inset-0 bg-gradient-to-r from-transparent to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </button>
        </Link>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} // Optionally allow closing without starting
        onConfirm={startMusic}
      />
    </div>
  );
};

export default TitleScreen;
