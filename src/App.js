import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import TitleScreen from "./Pages/TitleScreen";
// import About from "./Pages/About"
// import Game from "./Game/Game"

const router = createBrowserRouter([
  {
    path: "/",
    element: <TitleScreen />,
  },
  // {
  //   path: "/about",
  //   element: <About />,
  // },
  // {
  //   path: "/game",
  //   element: <Game />,
  // },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
