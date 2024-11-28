import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import TitleScreen from "./Pages/TitleScreen";
import Settings from "./Pages/Settings"
import About from "./Pages/About"
import Game from "./Game/Game"

const router = createBrowserRouter([
  {
    path: "/",
    element: <TitleScreen />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/about",
    element: <About />,
  },
  {
    path: "/game",
    element: <Game />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
