import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { io } from "socket.io-client";
import { ArrowLeft, MessageSquare, Clock } from "lucide-react";

const socket = io();

const avatarGradients = [
  "linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%)",
  "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
  "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
  "linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)",
  "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
];

const Board = () => {
  const { id } = useParams();
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    socket.on("init_wall", (initialNotes) => setNotes(initialNotes));
    socket.on("update_wall", (updatedNotes) => setNotes(updatedNotes));
    return () => {
      socket.off("init_wall");
      socket.off("update_wall");
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-20">
      {/* Header - Clean White */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back</span>
          </Link>
          <h1 className="font-bold text-lg tracking-tight">
            ConfessIO / <span className="text-gray-400">Board {id}</span>
          </h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center mt-32">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 mb-6">
              <MessageSquare className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              It's quiet here.
            </h2>
            <p className="text-gray-500">
              Share this page to start receiving messages.
            </p>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {[...notes].reverse().map((note, i) => (
              <div
                key={note.id || i}
                className="break-inside-avoid bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300 ease-in-out"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-inner"
                      style={{
                        background:
                          avatarGradients[
                            Math.floor(Math.random() * avatarGradients.length)
                          ],
                      }}
                    >
                      {note.identity ? note.identity.charAt(0) : "?"}
                    </div>
                    <span className="font-bold text-sm text-gray-900">
                      {note.identity || "Anonymous"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                    <Clock size={12} />
                    {new Date(note.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                <p className="text-gray-800 text-lg leading-relaxed font-medium">
                  {note.text}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Board;
