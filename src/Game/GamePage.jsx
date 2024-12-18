import React, { useState, useEffect } from "react";
import Groq from "groq-sdk";
import GenreSelection from "./GenreSelection";
import { usePollinationsImage } from "@pollinations/react";
import { Typewriter } from "react-simple-typewriter";
import "./Game.css";

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
  const [newImage, setNewImage] = useState();
  const [inputShow, setInputShow] = useState(false);

  const backgroundImageUrl = usePollinationsImage(imageGenText, {
    width: 1280,
    height: 720,
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

        // Start a timeout for 10 seconds to restart the loading process
        loadTimeout = setTimeout(() => {
          console.warn("Image loading is taking too long. Restarting...");
          loadImage();
        }, 10000); // 10 seconds

        img.onload = () => {
          clearTimeout(loadTimeout); // Clear the timeout if the image loads successfully
          setNewImage(backgroundImageUrl);
          setCurrentImage(backgroundImageUrl);
          setIsImageLoading(false);
          console.log("Image loaded successfully.");
          setInputShow(true);
        };

        img.onerror = () => {
          clearTimeout(loadTimeout); // Clear the timeout if an error occurs
          console.error("Error loading background image.");
          setIsImageLoading(true);
          retryTimeout = setTimeout(() => {
            console.log("Retrying image load...");
            loadImage();
          }, 3000);
        };
      } else {
        console.warn("Background image URL is invalid or undefined.");
        setIsImageLoading(true);
        retryTimeout = setTimeout(() => {
          console.log("Retrying image load with updated URL...");
          loadImage();
        }, 3000);
      }
    };

    loadImage();

    return () => {
      clearTimeout(retryTimeout);
      clearTimeout(loadTimeout); // Ensure timeouts are cleared to prevent memory leaks
    };
  }, [backgroundImageUrl]);

  useEffect(() => {
    if (newImage) {
      setCurrentImage(newImage);
      setNewImage(null);
      console.log("wahoooo");
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
        return;
      }

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
            "You are an AI validator for an interactive adventure game. Validate if the given genre is appropriate for the game, there should be no inappropriate genre. Respond with 'VALID_GENRE' if the genre is valid or 'INVALID_GENRE' with a reason why it is invalid.",
        },
        {
          role: "user",
          content: `Validate the following genre: ${genre}`,
        },
      ]);

      return response.trim();
    } catch (err) {
      console.error("Error validating genre:", err);
      throw new Error("Failed to validate genre. Please try again.");
    }
  };

  const summarizeStoryForImage = async (story) => {
    const summaryPrompt = `Please summarize the following text into a concise prompt for image generation. 
    Focus on the main character, key themes, and genre, ensuring accuracy and relevance. 
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

  const generateImageFromSummary = async (summary) => {
    try {
      setImageGenText("");
      setImageGenText(summary);
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

  return (
    <div
      className="gameplay-container h-screen flex flex-col items-center justify-center"
      style={{
        backgroundImage: `url(${currentImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {!genre ? (
        <GenreSelection onSelectGenre={setGenre} />
      ) : (
        <div className="bottom-panel">
          <div className="story-box mb-4 px-10">
            <p className="text-2xl leading-relaxed whitespace-pre-wrap text-white text-center">
              <Typewriter
                key={aiResponse || "loading"}
                words={aiResponse ? [aiResponse] : ["Loading story..."]}
                loop={1}
                typeSpeed={50}
                deleteSpeed={50}
              />
            </p>
          </div>
          {!isStoryComplete && currentPrompt <= 5 && inputShow ? (
            <div className="player-input flex justify-center items-center bg-zinc-900 p-3 rounded-full gap-3">
              <input
                type="text"
                value={playerAction}
                onChange={(e) => setPlayerAction(e.target.value)}
                placeholder="What will you do next?"
                className="w-full p-2 rounded-full bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 text-2xl px-5 text-white"
              />
              <button
                onClick={handlePlayerAction}
                disabled={isLoading}
                className="py-2 px-5 bg-purple-600 text-white rounded-full hover:bg-purple-700 focus:outline-none w-fit"
              >
                Submit
              </button>
            </div>
          ) : (
            <div className="flex justify-center text-gray-400 p-10">
              <p>Loading Image...</p>
            </div>
          )}
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </div>
      )}
      {showModal && (
        <div className="modal-overlay fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="modal-content bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h2 className="text-xl font-bold text-red-600">Invalid Action</h2>
            <p className="text-gray-800 mt-2">{modalMessage}</p>
            <p>{invalidContent}</p>
            <button
              onClick={closeModal}
              className="mt-4 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GamePage;
