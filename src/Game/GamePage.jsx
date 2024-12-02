import React, { useState, useEffect } from "react";
import Groq from "groq-sdk";
import GenreSelection from "./GenreSelection"; // Import the GenreSelection component

const groq = new Groq({
  apiKey: process.env.REACT_APP_GROQ_API_KEY,
  dangerouslyAllowBrowser: true, // Allow use in the browser (not recommended for production)
});

const GamePage = () => {
  const [genre, setGenre] = useState(null);
  const [storyContext, setStoryContext] = useState("");
  const [aiResponse, setAIResponse] = useState("");
  const [currentPrompt, setCurrentPrompt] = useState(1);
  const [playerAction, setPlayerAction] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isStoryComplete, setIsStoryComplete] = useState(false); // Track if story is complete
  const [isTyping, setIsTyping] = useState(false); // Track typing animation
  const [typedText, setTypedText] = useState(""); // For storing the typed story text
  const [showModal, setShowModal] = useState(false); // Track whether modal is open
  const [modalMessage, setModalMessage] = useState(""); // Message for the modal

  const backgroundImageUrl = "https://via.placeholder.com/1200x800"; // Placeholder image URL

  // Fetch the initial story from the Groq API
  useEffect(() => {
    if (genre) {
      startStory(genre);
    }
  }, [genre]);

  useEffect(() => {
    if (aiResponse && !isStoryComplete) {
      typeStory(aiResponse); // Type out the story if AI response is available
    }
  }, [aiResponse]);

  const startStory = async (genre) => {
    setIsLoading(true);
    try {
      const initialStory = await getGroqChatCompletion([
        {
          role: "system",
          content:
            "You are an AI storyteller creating an interactive adventure game. Provide a dynamic story based on player choices. Each story should be concise and capped at five prompts. Each prompt should be less than 50 words.",
        },
        {
          role: "user",
          content: `Begin a ${genre} adventure story. Set the stage and introduce the first challenge.`,
        },
      ]);

      if (!initialStory || initialStory === "undefined") {
        setError("Error: Unable to fetch story.");
        return;
      }

      setStoryContext(initialStory);
      console.log(initialStory);
      setAIResponse(initialStory);
    } catch (err) {
      console.error("Error starting the story:", err);
      setError("Failed to start the story. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayerAction = async () => {
    if (!playerAction.trim()) return;

    setIsLoading(true);
    setError("");
    setIsStoryComplete(false); // Reset story completion flag

    try {
      const response = await getGroqChatCompletion([
        {
          role: "system",
          content:
            "You are an AI storyteller validating actions in an interactive adventure game. Only progress the story if the action aligns with the narrative's logic. also display ACTION_NOT_POSSIBLE if out of logic",
        },
        {
          role: "user",
          content: `Current story context: ${storyContext}\nPlayer action: ${playerAction}\nContinue the story if the action is valid. If invalid, respond with 'ACTION_NOT_POSSIBLE' and a brief explanation.`,
        },
      ]);

      const content = response.trim();

      if (content.includes("ACTION_NOT_POSSIBLE")) {
        // Trigger modal for invalid action and extract the explanation
        setModalMessage("Action not possible. Try a different approach.");
        setShowModal(true);
      } else {
        // Update the story context and proceed normally
        setStoryContext(
          (prev) => `${prev}\nPlayer action: ${playerAction}\n${content}`
        );
        setAIResponse(content);
        setCurrentPrompt((prev) => prev + 1);
        setIsStoryComplete(false); // Reset on new action
      }
    } catch (err) {
      console.error("Error processing the action:", err);
      setError("Failed to process the action. Please try again.");
    } finally {
      setIsLoading(false);
      setPlayerAction("");
    }
  };

  const getGroqChatCompletion = async (messages) => {
    const response = await groq.chat.completions.create({
      messages,
      model: "llama3-8b-8192",
      temperature: 0.7,
      max_tokens: 50, // Limit story length to 50 words per prompt
    });
    return response.choices[0]?.message?.content || "";
  };

  const typeStory = (story) => {
    if (!story || story === "undefined") {
      setTypedText("Error: Unable to fetch story.");
      setIsTyping(false);
      return;
    }

    let index = 0;
    setIsTyping(true);
    setTypedText(""); // Ensure the text box is cleared before starting typing
    const interval = setInterval(() => {
      setTypedText((prev) => prev + story[index]);
      index++;
      if (index === story.length) {
        clearInterval(interval);
        setIsTyping(false);
        setIsStoryComplete(true); // Mark story as complete
      }
    }, 50); // Typing speed in milliseconds
  };
  const closeModal = () => {
    setShowModal(false); // Close the modal when the button is clicked
  };

  return (
    <div
      className="gameplay-container h-screen flex flex-col items-center justify-center"
      style={{
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {!genre ? (
        <GenreSelection onSelectGenre={setGenre} />
      ) : (
        <div className="relative w-full max-w-3xl bg-white bg-opacity-80 p-8 rounded-lg shadow-xl">
          <h1 className="text-3xl font-bold text-center mb-6">
            {genre} Adventure
          </h1>
          <div className="story-box mb-6">
            <p className="text-lg leading-relaxed whitespace-pre-wrap text-gray-800">
              {typedText || "Loading story..."}
            </p>
          </div>
          // The condition for displaying the input should be adjusted
          {(isStoryComplete || isTyping) && (
            <div className="player-input">
              <input
                type="text"
                value={playerAction}
                onChange={(e) => setPlayerAction(e.target.value)}
                placeholder="What will you do next?"
                className="w-full p-2 rounded-lg bg-gray-200 focus:outline-none"
              />
              <button
                onClick={handlePlayerAction}
                disabled={isLoading}
                className="mt-4 py-2 px-6 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none"
              >
                Submit
              </button>
            </div>
          )}
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </div>
      )}

      {/* Modal for invalid action */}
      {showModal && (
        <div className="modal-overlay fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="modal-content bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h2 className="text-xl font-bold text-red-600">Invalid Action</h2>
            <p className="text-gray-800 mt-2">{modalMessage}</p>
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
