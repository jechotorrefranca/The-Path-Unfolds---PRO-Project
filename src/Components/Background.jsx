import React from "react";

const Background = ({ imageUrl }) => {
  return (
    <div
      className="absolute inset-0 bg-black opacity-70 z-0"
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    />
  );
};

export default Background;
