import React from "react";
import { motion, AnimatePresence } from "framer-motion"; // Import AnimatePresence
import "./Modal.css";

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
          className="fixed inset-0 flex justify-center items-center z-50 p-4"
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {/* Backdrop animation with looping gradient */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-black via-gray-800 to-black opacity-70 animate-gradient-background"
            animate={{ opacity: isOpen ? 0.9 : 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Modal Content */}
          <motion.div
            className="relative border border-white rounded-lg shadow-xl p-4 sm:p-6 w-11/12 max-w-md transform transition duration-300 hover:scale-105"
            variants={modalVariants}
            initial="initial"
            animate={isOpen ? "animate" : ""}
            exit="exit"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.45)" }}
          >
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 sm:mb-4 text-center">
              Welcome to
              <p className="text-blue-400 font-breatheFire tracking-widest text-2xl sm:text-3xl lg:text-4xl mt-2">
                The Path Unfolds
              </p>
            </h2>
            
            <p className="mb-4 sm:mb-6 text-white text-center text-sm sm:text-base">
              Click "Start" to begin your journey!
            </p>

            <div className="flex justify-center space-x-4 font-morris">
              <button
                className="px-6 sm:px-8 py-2 sm:py-3 relative text-white rounded-full group overflow-hidden flex text-xl sm:text-2xl lg:text-3xl"
                onClick={onConfirm}
              >
                <span className="relative z-10">Start</span>
                <span className="absolute inset-0 bg-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
