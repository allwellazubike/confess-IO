import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { io } from "socket.io-client";
import {
  ArrowLeft,
  MessageSquare,
  Clock,
  Share2,
  PenLine,
  X,
  Send,
  Copy,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newNoteText, setNewNoteText] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
      socket.emit("join_board", id);
    });

    socket.on("disconnect", () => setIsConnected(false));
    socket.on("init_wall", (initialNotes) => setNotes(initialNotes));
    socket.on("update_wall", (updatedNotes) => setNotes(updatedNotes));

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("init_wall");
      socket.off("update_wall");
    };
  }, [id]);

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    socket.emit("new_confession", {
      boardId: id,
      text: newNoteText,
    });

    setNewNoteText("");
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e8e2d9] font-mono pb-20 selection:bg-[#c0392b] selection:text-white relative">
      {/* Navbar */}
      <header className="sticky top-0 z-40 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-[#2a2520]">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-[#5a5550] hover:text-[#e8e2d9] transition-colors uppercase tracking-widest text-xs"
          >
            <ArrowLeft size={16} />
            <span className="hidden md:inline">Back</span>
          </Link>
          <div className="flex items-center gap-4">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-[#2a2520] hover:bg-[#1a1a1a] transition-all text-xs uppercase tracking-widest"
            >
              {copied ? (
                <Check size={14} className="text-green-500" />
              ) : (
                <Share2 size={14} />
              )}
              {copied ? "Copied" : "Share Link"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center mt-20">
            <div className="w-24 h-24 bg-[#1a1a1a] rounded-full flex items-center justify-center border border-[#2a2520] mb-6 animate-pulse">
              <MessageSquare className="w-8 h-8 text-[#5a5550]" />
            </div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#f5f0e8] mb-4">
              Silence is loud.
            </h2>
            <p className="text-[#5a5550] tracking-widest text-xs uppercase mb-8 max-w-md leading-relaxed">
              This wall is empty. Share the link with friends to let them
              confess anonymously.
            </p>
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-3 bg-[#c0392b] text-white px-8 py-4 rounded-full font-bold hover:bg-[#a93226] transition-transform active:scale-95 shadow-lg shadow-red-900/20"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? "Link Copied!" : "Copy Board Link"}
            </button>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {[...notes].reverse().map((note, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={note.id || i}
                className="break-inside-avoid bg-[#1a1a1a] rounded-xl p-8 border border-[#2a2520] hover:border-[#c0392b]/30 transition-colors duration-300 relative group"
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
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-[#c0392b] rounded-full flex items-center justify-center text-white shadow-2xl hover:bg-[#a93226] transition-colors z-40"
      >
        <PenLine size={24} />
      </motion.button>

      {/* Compose Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-[#1a1a1a] w-full max-w-lg rounded-2xl border border-[#2a2520] shadow-2xl p-6 md:p-8"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-[#5a5550] hover:text-[#e8e2d9]"
              >
                <X size={24} />
              </button>

              <h3 className="font-serif text-2xl font-bold text-[#f5f0e8] mb-2">
                Unburden yourself.
              </h3>
              <p className="text-[#5a5550] text-sm mb-6">
                Your identity will be hidden. Speak freely.
              </p>

              <form onSubmit={handleSubmit}>
                <textarea
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Type your confession here..."
                  className="w-full h-40 bg-[#0a0a0a] border border-[#2a2520] rounded-xl p-4 text-[#e8e2d9] placeholder-[#5a5550] focus:outline-none focus:border-[#c0392b] transition-colors resize-none font-serif italic text-lg"
                  autoFocus
                />
                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    disabled={!newNoteText.trim()}
                    className="flex items-center gap-2 bg-[#c0392b] text-white px-6 py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-[#a93226] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <Send size={14} />
                    Confess
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Board;
