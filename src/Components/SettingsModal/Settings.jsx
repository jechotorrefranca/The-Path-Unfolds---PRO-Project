import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Settings.css"; // Scoped styles for the visual novel style

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
          className="modal-overlay"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={modalVariants}
        >
          <div className="modal-content">
            <h1 className="modal-header">Settings</h1>

            <div className="setting-section">
              <h2 className="section-title">Audio Settings</h2>
              <label className="setting-label">
                Music Volume:
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={currentMusicVolume}
                  onChange={(e) => handleVolumeChange(e, setCurrentMusicVolume)}
                  className="modal-input"
                />
              </label>
              <label className="setting-label">
                Narrator Volume:
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={currentNarratorVolume}
                  onChange={(e) =>
                    handleVolumeChange(e, setCurrentNarratorVolume)
                  }
                  className="modal-input"
                />
              </label>
              <label className="setting-label">
                Mute All:
                <input
                  type="checkbox"
                  checked={currentIsMuted}
                  onChange={() => setCurrentIsMuted(!currentIsMuted)}
                  className="modal-checkbox"
                />
              </label>
            </div>

            <div className="setting-section button-container">
              <button onClick={handleReset} className="reset-button">
                Reset to Default
              </button>
              <button onClick={handleSave} className="save-button">
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
