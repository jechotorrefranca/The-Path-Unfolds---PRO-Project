import React from "react";
import { motion, AnimatePresence } from "framer-motion"; // Import AnimatePresence
import './Modal.css';

const Modal = ({ isOpen, onClose, onConfirm }) => {
  // Animation variants for modal
  const modalVariants = {
    initial: {
      scale: 0.5,
      opacity: 0,
    },
    animate: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    exit: {
      scale: 0.5,
      opacity: 0,
      transition: { duration: 0.5, ease: "easeIn" },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex justify-center items-center z-50"
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {/* Backdrop animation with looping gradient */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-black via-blue-600 to-black opacity-70 animate-gradient-background"
            animate={{ opacity: isOpen ? 0.7 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Modal Content */}
          <motion.div
            className="relative bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 border border-gray-500 rounded-lg shadow-xl p-6 w-11/12 max-w-md transform transition duration-300 hover:scale-105"
            variants={modalVariants}
            initial="initial"
            animate={isOpen ? "animate" : ""}
            exit="exit"
          >
            <h2 className="text-3xl font-bold text-white mb-4 text-center">
              Welcome to 
              <p className="text-blue-400">The Path Unfolds</p>
            </h2>
            <p className="mb-6 text-white text-center">
              Click "Start Game" to begin your journey and enable background music!
            </p>

            <div className="flex justify-center space-x-4">
              <button
                onClick={onConfirm}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg hover:scale-110 transform transition duration-300 hover:bg-blue-600"
              >
                Start Game
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
