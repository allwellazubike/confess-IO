import React from "react";

const Admin = () => {
  return (
    <div className="min-h-screen bg-[#0f0f10] text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-red-500">Admin Restricted Area</h1>
      <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
        <input
          type="password"
          placeholder="Enter Master Password"
          className="w-full bg-black/50 border border-white/20 rounded px-4 py-2 focus:outline-none focus:border-red-500 transition-colors"
        />
        <button className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors">
          Unlock
        </button>
      </div>
    </div>
  );
};

export default Admin;
