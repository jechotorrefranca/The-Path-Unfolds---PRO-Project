import React, { useState } from "react";
import { motion } from "framer-motion";

const genres = [
  "Childhood",
  "Comedy",
  "Crime Heist",
  "Cyberpunk",
  "Detective",
  "Dystopian",
  "Fairy Tale",
  "Fantasy",
  "Historical Adventure",
  "Horror",
  "Medieval",
  "Mystery",
  "Mythology",
  "Nostalgia",
  "Post Apocalyptic",
  "Romantic",
  "Sad",
  "Science Fiction",
  "Slice Of Life",
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
      className="w-full h-screen flex justify-center items-center p-5 bg-zinc-950 overflow-auto"
    >
      <div className="border border-purple-600 rounded-lg px-5 py-10 w-full max-w-[60rem]">
        <h1 className="text-4xl font-bold text-center mb-8 text-purple-400">
          Choose Your Genre
        </h1>
        <div className="flex flex-wrap gap-3 justify-center my-5">
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
        <form
          onSubmit={handleCustomGenre}
          className="flex flex-col items-center"
        >
          <input
            type="text"
            value={customGenre}
            onChange={(e) => setCustomGenre(e.target.value)}
            placeholder="Or type your own genre..."
            className="w-full max-w-lg py-2 px-4 mb-4 rounded-full bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={() => handleGenreSelect(customGenre)}
            type="submit"
            className="py-2 px-6 bg-purple-600 rounded-full shadow-md hover:bg-purple-700 text-white"
          >
            Submit
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default GenreSelection;
