import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { io } from "socket.io-client";
import { ArrowLeft, MessageSquare, Clock } from "lucide-react";

// Connect to the backend
const socket = io("http://localhost:4000");

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
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // 1. Connect and Join Room
    socket.on("connect", () => {
      setIsConnected(true);
      // Important: Join the specific board room
      socket.emit("join_board", id);
    });

    socket.on("disconnect", () => setIsConnected(false));

    // 2. Listen for events
    socket.on("init_wall", (initialNotes) => setNotes(initialNotes));
    socket.on("update_wall", (updatedNotes) => setNotes(updatedNotes));

    // Cleanup
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("init_wall");
      socket.off("update_wall");
    };
  }, [id]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e8e2d9] font-mono pb-20 selection:bg-[#c0392b] selection:text-white">
      {/* Navbar matching Noir Theme */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-[#2a2520]">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-[#5a5550] hover:text-[#e8e2d9] transition-colors uppercase tracking-widest text-xs"
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>
          <h1 className="font-serif font-bold text-xl tracking-wide text-[#f5f0e8]">
            Confess<span className="text-[#c0392b]">IO</span>{" "}
            <span className="text-[#2a2520] mx-2">/</span>{" "}
            <span className="font-mono text-sm text-[#5a5550]">Board {id}</span>
          </h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center mt-32">
            <div className="w-24 h-24 bg-[#1a1a1a] rounded-full flex items-center justify-center border border-[#2a2520] mb-6">
              <MessageSquare className="w-8 h-8 text-[#5a5550]" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-[#f5f0e8] mb-2">
              Silence is loud.
            </h2>
            <p className="text-[#5a5550] tracking-widest text-xs uppercase">
              Share this link to break it.
            </p>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {[...notes].reverse().map((note, i) => (
              <div
                key={note.id || i}
                className="break-inside-avoid bg-[#1a1a1a] rounded-xl p-8 border border-[#2a2520] hover:border-[#c0392b]/30 transition-colors duration-300"
              >
                <div className="flex items-center justify-between mb-6">
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
                    <span className="font-bold text-xs tracking-widest uppercase text-[#e8e2d9]">
                      {note.identity || "Anonymous"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-[#5a5550] font-medium uppercase tracking-widest">
                    <Clock size={10} />
                    {new Date(note.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                <p className="text-[#e8e2d9] text-base leading-relaxed font-serif italic">
                  "{note.text}"
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
