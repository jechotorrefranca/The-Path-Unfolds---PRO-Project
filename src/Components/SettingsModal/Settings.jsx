import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Settings.css";

const SettingsModal = ({
  isOpen,
  onClose,
  onSave,
  musicVolume,
  narratorVolume,
  isMuted,
}) => {
  const [currentMusicVolume, setCurrentMusicVolume] = useState(musicVolume);
  const [currentNarratorVolume, setCurrentNarratorVolume] =
    useState(narratorVolume);
  const [currentIsMuted, setCurrentIsMuted] = useState(isMuted);

  useEffect(() => {
    setCurrentMusicVolume(musicVolume);
    setCurrentNarratorVolume(narratorVolume);
    setCurrentIsMuted(isMuted);
  }, [musicVolume, narratorVolume, isMuted]);

  const handleVolumeChange = (e, setter) => {
    setter(e.target.value);
  };

  const handleSave = () => {
    onSave(currentMusicVolume, currentNarratorVolume, currentIsMuted);
    onClose();
  };

  const handleReset = () => {
    setCurrentMusicVolume(0.5);
    setCurrentNarratorVolume(0.5);
    setCurrentIsMuted(false);
  };

  const modalVariants = {
    initial: { opacity: 0, scale: 0.5 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      scale: 0.5,
      transition: { duration: 0.3, ease: "easeIn" },
    },
  };

  return (
    <AnimatePresence>
  {isOpen && (
    <motion.div
      className="modal-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={modalVariants}
    >
      <div className="modal-content bg-white p-6 rounded-lg w-full max-w-lg">
        <h1 className="modal-header text-xl font-bold mb-4">Settings</h1>

        <div className="setting-section mb-6">
          <h2 className="section-title text-lg font-semibold mb-2 mt-10">Audio Settings</h2>
          <label className="setting-label flex flex-col mb-4">
            Music Volume:
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={currentMusicVolume}
              onChange={(e) => handleVolumeChange(e, setCurrentMusicVolume)}
              className="modal-input mt-2"
            />
          </label>
          <label className="setting-label flex flex-col mb-4">
            Narrator Volume:
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={currentNarratorVolume}
              onChange={(e) => handleVolumeChange(e, setCurrentNarratorVolume)}
              className="modal-input mt-2"
            />
          </label>
          <label className="setting-label flex items-center">
            Mute All:
            <input
              type="checkbox"
              checked={currentIsMuted}
              onChange={() => setCurrentIsMuted(!currentIsMuted)}
              className="modal-checkbox ml-2"
            />
          </label>
        </div>

        <div className="setting-section button-container flex flex-col md:flex-row gap-4 justify-center">
          <button
            onClick={handleReset}
            className="reset-button px-4 py-2 bg-gray-200 hover:bg-gray-300 text-black rounded-md"
          >
            Reset to Default
          </button>
          <button
            onClick={handleSave}
            className="save-button px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
          >
            Save Settings
          </button>
        </div>
      </div>
    </motion.div>
  )}
</AnimatePresence>

  );
};

export default SettingsModal;
