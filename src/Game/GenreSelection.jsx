import React, { useState } from "react";
import { motion } from "framer-motion";

const genres = [
  "Childhood",
  "Comedy",
  "CrimeHeist",
  "Cyberpunk",
  "Detective",
  "Dystopian",
  "FairyTale",
  "Fantasy",
  "HistoricalAdventure",
  "Horror",
  "Medieval",
  "Mystery",
  "Mythology",
  "Nostalgia",
  "PostApocalyptic",
  "Romantic",
  "Sad",
  "ScienceFiction",
  "SliceOfLife",
  "Steampunk",
  "Superhero",
  "Survival",
  "Thriller",
  "Tragic",
  "Western",
];

const GenreSelection = ({ onSelectGenre }) => {
  const [customGenre, setCustomGenre] = useState("");

  const handleGenreSelect = (genre) => {
    onSelectGenre(genre);
  };

  const handleCustomGenre = (e) => {
    e.preventDefault();
    if (customGenre.trim() !== "") {
      onSelectGenre(customGenre.trim());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full max-w-3xl"
    >
      <h1 className="text-4xl font-bold text-center mb-8 text-white">
        Choose Your Genre
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        {genres.map((genre) => (
          <motion.button
            key={genre}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleGenreSelect(genre)}
            className="py-2 px-4 bg-purple-600 rounded-lg shadow-md hover:bg-purple-700 text-center text-white"
          >
            {genre}
          </motion.button>
        ))}
      </div>
      <form onSubmit={handleCustomGenre} className="flex flex-col items-center">
        <input
          type="text"
          value={customGenre}
          onChange={(e) => setCustomGenre(e.target.value)}
          placeholder="Or type your own genre..."
          className="w-full max-w-lg py-2 px-4 mb-4 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={() => handleGenreSelect(customGenre)}
          type="submit"
          className="py-2 px-6 bg-purple-600 rounded-lg shadow-md hover:bg-purple-700 text-white"
        >
          Submit
        </button>
      </form>
    </motion.div>
  );
};

export default GenreSelection;
