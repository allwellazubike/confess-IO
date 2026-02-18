import React from "react";
import { useParams } from "react-router-dom";

const Board = () => {
  const { id } = useParams();
  return (
    <div className="min-h-screen bg-[#0f0f10] text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
        Board: {id}
      </h1>
      <p className="mt-4 text-gray-400 animate-pulse">
        Connecting to the void...
      </p>
    </div>
  );
};

export default Board;
