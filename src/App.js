import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import TitleScreen from "./Pages/TitleScreen";
// import About from "./Pages/About"
import GamePage from "./Game/GamePage"
import About from "./Pages/About";
import { AudioProvider } from "./Services/AudioContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AudioProvider>
        <TitleScreen />
      </AudioProvider>
    ),
  },
  {
    path: "/about",
    element: (
      <AudioProvider>
        <About />
      </AudioProvider>
    ),
  },
{
  path: "/game",
    element: <GamePage />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
