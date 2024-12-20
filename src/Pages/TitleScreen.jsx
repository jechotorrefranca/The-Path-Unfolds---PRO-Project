import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Modal from "../Components/MusicModal/Modal";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import backgroundMusic from "../assets/TitleScreen Music/TitleScreenBGM.mp3";
import SettingsModal from "../Components/SettingsModal/Settings";
import "./TitleScreen.css";

const TitleScreen = () => {
  const navigate = useNavigate();
  const importAll = (requireContext) =>
    requireContext.keys().map(requireContext);
  const backgrounds = importAll(
    require.context("../assets/Game BG", false, /\.(png|jpe?g|svg)$/)
  );

  const [bgImage, setBgImage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isStarted, setIsStarted] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [musicVolume, setMusicVolume] = useState(0.5);
  const [narratorVolume, setNarratorVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);

  const [isTransitioning, setIsTransitioning] = useState(false);

  const audioRef = useRef(null);

  useEffect(() => {
    const savedMusicVolume = localStorage.getItem("musicVolume");
    const savedNarratorVolume = localStorage.getItem("narratorVolume");
    const savedIsMuted = localStorage.getItem("isMuted");

    if (savedMusicVolume !== null) setMusicVolume(parseFloat(savedMusicVolume));
    if (savedNarratorVolume !== null)
      setNarratorVolume(parseFloat(savedNarratorVolume));
    if (savedIsMuted !== null) setIsMuted(savedIsMuted === "true");
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      if (!isMuted) {
        audio.volume = musicVolume;
      } else {
        audio.volume = 0;
      }
    }
  }, [musicVolume, narratorVolume, isMuted]);

  const startMusic = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.loop = true;
      audio.play();
    }

    setIsModalOpen(false);
    setIsStarted(true);
    setBgImage(backgrounds[Math.floor(Math.random() * backgrounds.length)]);
  };

  const saveSettings = (newMusicVolume, newNarratorVolume, newIsMuted) => {
    setMusicVolume(newMusicVolume);
    setNarratorVolume(newNarratorVolume);
    setIsMuted(newIsMuted);

    localStorage.setItem("musicVolume", newMusicVolume);
    localStorage.setItem("narratorVolume", newNarratorVolume);
    localStorage.setItem("isMuted", newIsMuted);

    const audio = audioRef.current;
    if (!newIsMuted) {
      audio.volume = newMusicVolume;
    } else {
      audio.volume = 0;
    }
  };

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

  const handleStartGame = () => {
    const audio = audioRef.current;

    if (audio) {
      const fadeDuration = 1000;
      const fadeStep = 0.05;
      const interval = fadeDuration / (audio.volume / fadeStep);

      const fadeOut = setInterval(() => {
        if (audio.volume > 0) {
          audio.volume = Math.max(0, audio.volume - fadeStep);
        } else {
          clearInterval(fadeOut);
          audio.pause();
        }
      }, interval);
    }

    setIsTransitioning(true);
    setTimeout(() => {
      navigate("/game");
    }, 1000);
  };

  return (
    <motion.div
  className="min-h-screen w-screen flex flex-col relative"
  style={{
    backgroundImage: bgImage ? `url(${bgImage})` : "none",
    backgroundColor: !bgImage ? "black" : "transparent",
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
  initial={{ opacity: 1 }}
  animate={{ opacity: isTransitioning ? 0 : 1 }}
  transition={{ duration: 0.5 }}
>
  {/* Background overlay */}
  <motion.div
    className="absolute inset-0 bg-black opacity-70 z-0"
    initial={{ opacity: 0 }}
    animate={{ opacity: isStarted ? 0.7 : 0 }}
    transition={{ duration: 1 }}
  />

  {/* Animated title */}
  <motion.div
    className="z-10"
    variants={titleVariants}
    initial="initial"
    animate={isStarted ? "animate" : "initial"}
  >
    <h1 className="font-breatheFire text-3xl sm:text-5xl md:text-7xl lg:text-9xl text-transparent ml-4 sm:ml-8 lg:ml-20 mt-20 sm:mt-8 lg:mt-12 leading-tight tracking-widest gradient-text">
      The <br />
      Path Unfolds
    </h1>
  </motion.div>

  {/* Buttons section */}
  <motion.div
    className="flex flex-col space-y-4 sm:space-y-6 mt-auto mb-6 sm:mb-10 items-end font-morris mr-4 sm:mr-8"
    variants={buttonVariants}
    initial="initial"
    animate={isStarted ? "animate" : "initial"}
  >
    {/* Start Game Button */}
    <motion.div initial="initial" animate="animate">
      <button
        className="relative py-4 sm:py-6 lg:py-8 text-white rounded-full pr-4 sm:pr-8 pl-32 sm:pl-48 group overflow-hidden flex"
        onClick={handleStartGame}
      >
        <span className="relative text-2xl sm:text-3xl lg:text-5xl z-10">Start Game</span>
        <span className="absolute inset-0 bg-gradient-to-r from-transparent to-[#8a6fff] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
      </button>
    </motion.div>

    {/* Settings Button */}
    <button
      className="relative py-4 sm:py-6 lg:py-8 text-white rounded-full pr-4 sm:pr-8 pl-32 sm:pl-48 group overflow-hidden flex"
      onClick={() => setIsSettingsOpen(true)}
    >
      <span className="relative text-2xl sm:text-3xl lg:text-5xl z-10">Settings</span>
      <span className="absolute inset-0 bg-gradient-to-r from-transparent to-[#8a6fff] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
    </button>

    {/* About Button */}
    <Link to="/about">
      <button className="relative py-4 sm:py-6 lg:py-8 text-white rounded-full pr-4 sm:pr-8 pl-32 sm:pl-48 group overflow-hidden flex">
        <span className="relative text-2xl sm:text-3xl lg:text-5xl z-10">About</span>
        <span className="absolute inset-0 bg-gradient-to-r from-transparent to-[#8a6fff] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
      </button>
    </Link>
  </motion.div>

  {/* Modal components */}
  <Modal
    isOpen={isModalOpen}
    onClose={() => setIsModalOpen(false)}
    onConfirm={startMusic}
  />

  <SettingsModal
    isOpen={isSettingsOpen}
    onClose={() => setIsSettingsOpen(false)}
    onSave={saveSettings}
    musicVolume={musicVolume}
    narratorVolume={narratorVolume}
    isMuted={isMuted}
  />

  {/* Background Music */}
  <audio ref={audioRef} src={backgroundMusic} />
</motion.div>

  );
};

export default TitleScreen;
