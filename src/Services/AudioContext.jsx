// AudioContext.js
import React, { createContext, useContext, useRef, useState, useEffect } from 'react';
import backgroundMusic from "../assets/TitleScreen Music/TitleScreenBGM.mp3";

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [musicVolume, setMusicVolume] = useState(0.5);
  const [narratorVolume, setNarratorVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const savedMusicVolume = localStorage.getItem("musicVolume");
    const savedNarratorVolume = localStorage.getItem("narratorVolume");
    const savedIsMuted = localStorage.getItem("isMuted");

    if (savedMusicVolume !== null) setMusicVolume(parseFloat(savedMusicVolume));
    if (savedNarratorVolume !== null) setNarratorVolume(parseFloat(savedNarratorVolume));
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
  }, [musicVolume, isMuted]);

  const startMusic = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.loop = true;
      audio.play();
      setIsPlaying(true);
    }
  };

  const stopMusic = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const fadeOutMusic = (callback) => {
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
          setIsPlaying(false);
          if (callback) callback();
        }
      }, interval);
    } else if (callback) {
      callback();
    }
  };

  return (
    <AudioContext.Provider
      value={{
        musicVolume,
        setMusicVolume,
        narratorVolume,
        setNarratorVolume,
        isMuted,
        setIsMuted,
        startMusic,
        stopMusic,
        fadeOutMusic,
        isPlaying
      }}
    >
      <audio ref={audioRef} src={backgroundMusic} />
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);