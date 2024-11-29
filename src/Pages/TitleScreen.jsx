import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Modal from "../Components/MusicModal/Modal";
import { motion } from "framer-motion"; // Importing motion for animations
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
  const [isStarted, setIsStarted] = useState(false); // To trigger animation when game starts

  const startMusic = () => {
    audio.loop = true;
    audio.volume = 0.5;
    audio.play();
    setIsModalOpen(false); // Close modal after starting music
    setIsStarted(true); // Start the game animation
  };

  // Animation variants
  const titleVariants = {
    initial: { opacity: 0, y: -50 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, delay: 0.2, ease: "easeOut" },
    },
  };

  const buttonVariants = {
    initial: { opacity: 0, y: 25 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.5, delay: 0.5, ease: "easeOut" },
    },
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
      {/* Background Overlay with animation */}
      <motion.div
        className="absolute inset-0 bg-black opacity-70 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: isStarted ? 0.7 : 0 }}
        transition={{ duration: 1 }}
      />

      {/* Title Text */}
      <motion.div
        className="z-10"
        variants={titleVariants}
        initial="initial"
        animate={isStarted ? "animate" : "initial"}
      >
        <h1
          className="font-breatheFire text-[2.5rem] sm:text-[5rem] lg:text-[10rem] text-white sm:ml-[2rem] mt-[15rem] ml-[1rem] sm:mt-[2rem] lg:ml-[5rem] lg:mt-[3rem] leading-[1] tracking-widest z-10"
          style={{
            textShadow: "0.7rem 0.5rem 0.3rem rgba(0, 0, 0, 0.8)",
          }}
        >
          The <br />
          Path Unfolds
        </h1>
      </motion.div>

      {/* Container for buttons */}
      <motion.div
        className="flex flex-col space-y-1 mt-auto mb-8 items-end font-morris text-[3rem] mr-[2rem] z-10"
        variants={buttonVariants}
        initial="initial"
        animate={isStarted ? "animate" : "initial"}
      >
        <Link to="/game">
          <button className="relative py-10 text-white rounded-full pr-[2rem] pl-[15rem] text-xl group overflow-hidden flex">
            <span className="relative z-10 text-[5rem]">Start Game</span>
            <span className="absolute inset-0 bg-gradient-to-r from-transparent to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </button>
        </Link>
        <Link to="/settings">
          <button className="relative py-10 text-white rounded-full pr-[2rem] pl-[15rem] text-xl group overflow-hidden flex">
            <span className="relative z-10 text-[5rem]">Settings</span>
            <span className="absolute inset-0 bg-gradient-to-r from-transparent to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </button>
        </Link>
        
        <Link to="/about">
          <button className="relative py-10 text-white rounded-full pr-[2rem] pl-[15rem] text-xl group overflow-hidden flex">
            <span className="relative z-10 text-[5rem]">About</span>
            <span className="absolute inset-0 bg-gradient-to-r from-transparent to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </button>
        </Link>
      </motion.div>

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
