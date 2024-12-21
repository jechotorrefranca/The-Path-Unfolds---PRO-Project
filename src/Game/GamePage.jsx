import React, { useState, useEffect, useRef } from "react";
import Groq from "groq-sdk";
import GenreSelection from "./GenreSelection";
import debounce from "lodash/debounce";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faGear,
  faWindowRestore,
} from "@fortawesome/free-solid-svg-icons";
import { usePollinationsImage } from "@pollinations/react";
import { Typewriter } from "react-simple-typewriter";
import SettingsModal from "../Components/SettingsModal/Settings";
import "./Game.css";
import TalkToSpeech from "../Services/TalkToSpeech";

const groq = new Groq({
  apiKey: process.env.REACT_APP_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

const GamePage = () => {
  const [genre, setGenre] = useState(null);
  const [storyContext, setStoryContext] = useState([]);
  const [aiResponse, setAIResponse] = useState("");
  const [currentPrompt, setCurrentPrompt] = useState(1);
  const [playerAction, setPlayerAction] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isStoryComplete, setIsStoryComplete] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [invalidContent, setInvalidContent] = useState("");
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageGenText, setImageGenText] = useState();
  const [currentImage, setCurrentImage] = useState(
    "/Background/placeholder.jpg"
  );
  const [musicGenre, setMusicGenre] = useState("");
  const [newImage, setNewImage] = useState();
  const [inputShow, setInputShow] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isShowSettings, setIsShowSettings] = useState(false);
  const [shouldPlayTTS, setShouldPlayTTS] = useState(false);

  const [musicVolume, setMusicVolume] = useState(0.5);
  const [narratorVolume, setNarratorVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef(null);

  const [textToSpeech, setTextToSpeech] = useState();
  const voice = { id: "L1aJrPa7pLJEyYlh3Ilq", name: "Olliver Haddington" };

  useEffect(() => {
    const savedMusicVolume = parseFloat(localStorage.getItem("musicVolume"));
    const savedNarratorVolume = parseFloat(
      localStorage.getItem("narratorVolume")
    );
    const savedIsMuted = localStorage.getItem("isMuted") === "true";

    if (!isNaN(savedMusicVolume)) setMusicVolume(savedMusicVolume);
    if (!isNaN(savedNarratorVolume)) setNarratorVolume(savedNarratorVolume);
    setIsMuted(savedIsMuted);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      if (isMuted) {
        audio.volume = 0;
      } else {
        audio.volume = Math.max(0, Math.min(1, musicVolume));
      }
    }
  }, [musicVolume, isMuted]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  const playMusic = (genre) => {
    const audio = new Audio(`/assets/InGame Music/${genre}.mp3`);
    audio.loop = true;
    audio.volume = isMuted ? 0 : musicVolume;
    audioRef.current = audio;
    audio.play().catch((err) => {
      console.error("Error playing audio:", err);
    });
  };

  const saveSettings = (newMusicVolume, newNarratorVolume, newIsMuted) => {
    setMusicVolume(newMusicVolume);
    setNarratorVolume(newNarratorVolume);
    setIsMuted(newIsMuted);

    localStorage.setItem("musicVolume", newMusicVolume);
    localStorage.setItem("narratorVolume", newNarratorVolume);
    localStorage.setItem("isMuted", newIsMuted);

    const audio = audioRef.current;
    if (audio) {
      audio.volume = newIsMuted ? 0 : newMusicVolume;
    }
  };

  const handleShowSettings = () => {
    setIsShowSettings(true);
  };

  const closeSettings = () => {
    setIsShowSettings(false);
  };

  const backgroundImageUrl = usePollinationsImage(imageGenText, {
    width: window.innerWidth,
    height: window.innerHeight,
    model: "flux",
  });

  useEffect(() => {
    let retryTimeout;
    let loadTimeout;

    const loadImage = () => {
      if (backgroundImageUrl && !backgroundImageUrl.includes("undefined")) {
        console.log(`Attempting to load image: ${backgroundImageUrl}`);
        const img = new Image();
        img.src = backgroundImageUrl;

        img.onload = () => {
          clearTimeout(loadTimeout);
          setNewImage(backgroundImageUrl);
          setIsImageLoading(false);
          console.log("Image loaded successfully.");
          setInputShow(true);
          setShouldPlayTTS(true);

          if (!isMusicPlaying && musicGenre) {
            playMusic(musicGenre);
            setIsMusicPlaying(true);
          }
        };

        img.onerror = () => {
          clearTimeout(loadTimeout);
          console.error("Error loading background image.");
          setIsImageLoading(true);
          setShouldPlayTTS(false);
          retryTimeout = setTimeout(() => {
            console.log("Retrying image load...");
            loadImage();
          }, 3000);
        };

        loadTimeout = setTimeout(() => {
          console.warn("Image loading is taking too long. Restarting...");
          loadImage();
        }, 20000);
      }
    };

    loadImage();

    return () => {
      clearTimeout(retryTimeout);
      clearTimeout(loadTimeout);
    };
  }, [backgroundImageUrl]);

  useEffect(() => {
    if (newImage) {
      const delay = setTimeout(() => {
        setCurrentImage(newImage);
        console.log("wahoooo");
      }, 500);

      return () => clearTimeout(delay);
    }
  }, [newImage]);

  useEffect(() => {
    if (genre) {
      handleGenreSelection(genre);
    }
  }, [genre]);

  const handleGenreSelection = async (selectedGenre) => {
    setIsLoading(true);
    setError("");

    try {
      const validationResponse = await validateGenre(selectedGenre);
      if (validationResponse.includes("INVALID_GENRE")) {
        setError("Invalid genre selected. Please choose a valid genre.");
        setGenre(null);
        console.log("GENRE REJECTED");
        return;
      }

      await validateAndPlayGenre(selectedGenre);
      await startStory(selectedGenre);
    } catch (err) {
      console.error("Error handling genre selection:", err);
      setError("Failed to validate genre. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const validateGenre = async (genre) => {
    try {
      const response = await getGroqChatCompletion([
        {
          role: "system",
          content:
            "You are an AI validator for an interactive adventure game. Validate if the given genre is appropriate for the game or the theme, there should be no inappropriate genre. Respond with 'VALID_GENRE' if the genre is valid or 'INVALID_GENRE' with a reason why it is invalid.",
        },
        {
          role: "user",
          content: `Validate the following genre, or a theme genre: ${genre}`,
        },
      ]);

      console.log(response.trim());

      return response.trim();
    } catch (err) {
      console.error("Error validating genre:", err);
      throw new Error("Failed to validate genre. Please try again.");
    }
  };

  const summarizeStoryForImage = async (story) => {
    const summaryPrompt = `Please summarize the following text into a concise prompt for image generation. 
    Focus on the main character, key themes, and genre, ensuring accuracy and relevance, make the artstyle Anime. 
    Keep it detailed yet concise, between 30 and 50 words, highlighting the core elements without including unnecessary information: \n${story}`;

    try {
      const summary = await getGroqChatCompletion([
        {
          role: "system",
          content: `You are an accurate story summarizer for an image generation AI, 
            make the sentence understandable and should match the theme of the story`,
        },
        {
          role: "user",
          content: summaryPrompt,
        },
      ]);

      generateImageFromSummary(summary);
    } catch (err) {
      console.error("Error summarizing the story for image:", err);
    }
  };

  const debounceSetImageGenText = debounce((text) => {
    setImageGenText(text);
  }, 300);

  const generateImageFromSummary = async (summary) => {
    try {
      debounceSetImageGenText(summary);
      console.log("Generated prompt for image:", summary);
    } catch (err) {
      console.error("Error generating image:", err);
    }
  };

  const startStory = async (genre) => {
    setIsLoading(true);
    try {
      const initialStory = await getGroqChatCompletion([
        {
          role: "system",
          content:
            "You are an AI storyteller for an interactive adventure game, use simple wwords to understand easier. Create a dynamic story based on player choices, with prompts under 50 words. Provide hints or subtly indicate actions, such as discovering items or paths within the story.",
        },
        {
          role: "user",
          content: `Begin a ${genre} adventure story. Set the stage and introduce the first challenge. Make sure it is under 75 words.`,
        },
      ]);

      if (!initialStory || initialStory === "undefined") {
        setError("Error: Unable to fetch story.");
        return;
      }

      setStoryContext([initialStory]);
      setAIResponse(initialStory);
      setTextToSpeech(initialStory);
      summarizeStoryForImage(initialStory);
      console.log(initialStory);
    } catch (err) {
      console.error("Error starting the story:", err);
      setError("Failed to start the story. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayerAction = async () => {
    if (!playerAction.trim() || currentPrompt > 5) return;

    setIsLoading(true);
    setError("");
    setShouldPlayTTS(false);

    try {
      const response = await getGroqChatCompletion([
        {
          role: "system",
          content: `You are an AI storyteller validating actions in an interactive adventure 
            game, don't say it's a valid action, if it is, continue the story, and if invalid, 
            respond with 'ACTION_NOT_POSSIBLE' and a brief explanation.`,
        },
        {
          role: "user",
          content: `Current story context: ${storyContext.join(
            "\n"
          )}\nPlayer action: ${playerAction}\nContinue the story if the action is valid, make sure the story is under 50 words. 
          Just narrate the story continuation, use simple wwords to understand easier. Progress the story only if the action aligns 
          with the narrative’s logic and is appropriate. Provide hints or subtly indicate actions, such as discovering items or paths within the story,
           make sure it is noticeable and not too vague. Decide if the player's action results in a positive or negative outcome. 
           If the action is illogical or inappropriate, respond with 'ACTION_NOT_POSSIBLE' and a brief explanation."`,
        },
      ]);

      const content = response.trim();

      if (content.includes("ACTION_NOT_POSSIBLE")) {
        setInvalidContent(content);
        setModalMessage("Action not possible. Try a different approach.");
        setShowModal(true);
      } else {
        if (currentPrompt === 5) {
          setInputShow(false);
          setStoryContext((prev) => [
            ...prev,
            `Player action: ${playerAction}`,
          ]);

          handleEnding();
        } else {
          setInputShow(false);
          setStoryContext((prev) => [
            ...prev,
            `Player action: ${playerAction}`,
            content,
          ]);

          setAIResponse(content);
          setTextToSpeech(content);
          setCurrentPrompt((prev) => prev + 1);
          summarizeStoryForImage(content);
        }
      }
    } catch (err) {
      console.error("Error processing the action:", err);
      setError("Failed to process the action. Please try again.");
    } finally {
      setIsLoading(false);
      setPlayerAction("");
    }
  };

  const handleEnding = async () => {
    try {
      const ending = await getGroqChatCompletion([
        {
          role: "system",
          content:
            "You are an AI storyteller tasked with creating an ending based on the player's actions and the context of the story. Determine whether the player receives a good or bad ending considering their choices without actually saying it's a good/bad ending. Ensure the conclusion is well-defined and appropriate to the narrative, make sure it is under 100 words.",
        },
        {
          role: "user",
          content: `Story context:\n${storyContext.join(
            "\n"
          )}\nGenerate the ending based on the above, make sure to add "The End" at every end.`,
        },
      ]);

      setStoryContext((prev) => [...prev, `Ending: ${ending}`]);
      setAIResponse(ending);
      setTextToSpeech(ending);
      setShouldPlayTTS(false);
      setIsStoryComplete(true);
      summarizeStoryForImage(ending);
      console.log(storyContext);
    } catch (err) {
      console.error("Error generating the ending:", err);
      setError("Failed to generate the ending. Please try again.");
    }
  };

  const getGroqChatCompletion = async (messages) => {
    const response = await groq.chat.completions.create({
      messages,
      model: "llama-3.3-70b-versatile",
    });
    return response.choices[0]?.message?.content || "";
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handlePlayAgain = () => {
    setGenre(null);
    setStoryContext([]);
    setAIResponse("");
    setCurrentPrompt(1);
    setPlayerAction("");
    setInputShow(false);
    setIsLoading(false);
    setError("");
    setIsStoryComplete(false);
    setShowModal(false);
    setInvalidContent("");
    setCurrentImage("/Background/placeholder.jpg");
    setShouldPlayTTS(false);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }

    setIsMusicPlaying(false);
  };

  const validateAndPlayGenre = async (selectedGenre) => {
    const allowedGenres = [
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

    try {
      const response = await getGroqChatCompletion([
        {
          role: "system",
          content: `You are an AI that selects genres for an interactive story game. You must choose the most appropriate genre from the following list:\n${allowedGenres.join(
            ", "
          )}. Always pick a genre from the list, even if the user's input is not an exact match.`,
        },
        {
          role: "user",
          content: `Choose the closest genre to this input: ${selectedGenre}, only output the word of the genre and nothing else`,
        },
      ]);

      const genreResponse = response.trim();
      console.log("GENRE MUSIC", genreResponse);
      console.log(allowedGenres);

      if (allowedGenres.includes(genreResponse)) {
        setMusicGenre(genreResponse);
        console.log("GENRE MUSIC", genreResponse);
      }
    } catch (err) {
      console.error("Error validating and playing genre:", err);
      setError("Failed to validate genre. Please try again.");
    }
  };

  return (
    <div
      className="gameplay-container min-h-screen h-full flex flex-col relative bg-no-repeat bg-cover bg-center"
      style={{
        backgroundImage: `url(${currentImage})`,
      }}
    >
      <div
        className="text-purple-400 absolute top-0 left-0 m-4 cursor-pointer text-2xl md:text-4xl z-10"
        onClick={handleShowSettings}
      >
        <FontAwesomeIcon icon={faGear} />
      </div>

      {!genre ? (
        <GenreSelection onSelectGenre={setGenre} />
      ) : (
        <div className="bottom-panel w-full flex-1 flex flex-col justify-end pb-4 px-4 md:px-8">
          <div className="story-box max-h-[60vh] overflow-y-auto mb-4 px-4 md:px-8 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-transparent">
            <p className="text-lg md:text-2xl leading-relaxed whitespace-pre-wrap text-white text-center">
              {inputShow && (
                <Typewriter
                  key={aiResponse || "loading"}
                  words={aiResponse ? [aiResponse] : ["Loading story..."]}
                  loop={1}
                  typeSpeed={50}
                  deleteSpeed={50}
                />
              )}
            </p>
          </div>

          {!isStoryComplete && currentPrompt <= 5 && inputShow ? (
            <div className="player-input flex justify-center items-center bg-zinc-900/90 p-2 md:p-3 rounded-full gap-2 md:gap-3 mx-4">
              <input
                type="text"
                value={playerAction}
                onChange={(e) => setPlayerAction(e.target.value)}
                placeholder="What will you do next?"
                className="w-full p-2 rounded-full bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg md:text-2xl px-3 md:px-5 text-white"
              />
              <button
                onClick={handlePlayerAction}
                disabled={isLoading}
                className="p-4 md:p-6 bg-purple-600 text-white rounded-full hover:bg-purple-700 focus:outline-none w-4 h-4 md:w-5 md:h-5 flex justify-center items-center"
              >
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>
          ) : (
            <>
              {isStoryComplete && inputShow ? (
                <div className="flex justify-center mt-4">
                  <button
                    onClick={handlePlayAgain}
                    className="py-2 px-5 bg-purple-600 text-white rounded-full hover:bg-purple-700 focus:outline-none"
                  >
                    Play Again
                  </button>
                </div>
              ) : (
                <div className="flex justify-center text-gray-400 p-4 md:p-8">
                  <p>Loading...</p>
                </div>
              )}
            </>
          )}

          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
          <TalkToSpeech
            text={textToSpeech}
            voice={voice}
            shouldPlayTTS={shouldPlayTTS}
          />
        </div>
      )}

      {showModal && (
        <div className="modal-overlay fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="modal-content bg-white p-4 md:p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
            <h2 className="text-lg md:text-xl font-bold text-red-600">
              Invalid Action
            </h2>
            <p className="text-gray-800 mt-2">{modalMessage}</p>
            <p>{invalidContent}</p>
            <button
              onClick={closeModal}
              className="mt-4 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <SettingsModal
        isOpen={isShowSettings}
        onClose={closeSettings}
        onSave={saveSettings}
        musicVolume={musicVolume}
        narratorVolume={narratorVolume}
        isMuted={isMuted}
      />
    </div>
  );
};

export default GamePage;
