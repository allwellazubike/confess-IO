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
  Wifi,
  WifiOff,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Connect to the backend
const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "https://confessio-be.pxxl.click";
const socket = io(BACKEND_URL);

const avatarGradients = [
  "linear-gradient(135deg, #FF9A9E 0%, #FECFEF 100%)",
  "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
  "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
  "linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)",
  "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
];

// #1 FIX: Derive a stable gradient from the note's id/timestamp
// so it never re-randomises on re-renders.
const getStableGradient = (note, index) => {
  const strId = note.id != null ? String(note.id) : null;
  const seed = strId
    ? strId.charCodeAt(0) + strId.charCodeAt(strId.length - 1)
    : note.timestamp
      ? new Date(note.timestamp).getSeconds()
      : index;
  return avatarGradients[seed % avatarGradients.length];
};

const MAX_CHARS = 300;

const Board = () => {
  const { id } = useParams();
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newNoteText, setNewNoteText] = useState("");
  const [copied, setCopied] = useState(false);
  const [idCopied, setIdCopied] = useState(false);

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
      socket.emit("join_board", id);
    });

    socket.on("disconnect", () => setIsConnected(false));
    socket.on("init_wall", (initialNotes) => {
      setNotes(initialNotes);
      setIsLoading(false); // DB has responded — safe to show real state
    });
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

  // #5: Copy wall ID separately
  const handleCopyId = () => {
    navigator.clipboard.writeText(id);
    setIdCopied(true);
    setTimeout(() => setIdCopied(false), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newNoteText.trim() || newNoteText.length > MAX_CHARS) return;

    socket.emit("new_confession", {
      boardId: id,
      text: newNoteText,
    });

    setNewNoteText("");
    setIsModalOpen(false);
  };

  const charsLeft = MAX_CHARS - newNoteText.length;
  const isOverLimit = charsLeft < 0;
  const isNearLimit = charsLeft <= 40 && !isOverLimit;

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

          {/* #5: Wall ID display */}
          <button
            onClick={handleCopyId}
            title="Click to copy wall ID"
            className="hidden md:flex items-center gap-2 text-[#5a5550] hover:text-[#e8e2d9] transition-colors text-[10px] uppercase tracking-widest border border-[#2a2520] px-3 py-1.5 rounded-full hover:border-[#5a5550]"
          >
            {idCopied ? <Check size={10} className="text-green-500" /> : null}
            WALL · {id}
          </button>

          <div className="flex items-center gap-4">
            {/* #2: Connection status indicator */}
            <div
              className={`hidden md:flex items-center gap-1.5 text-[10px] uppercase tracking-widest ${
                isConnected ? "text-green-500/70" : "text-[#5a5550]"
              }`}
            >
              {isConnected ? <Wifi size={11} /> : <WifiOff size={11} />}
              {isConnected ? "Live" : "Connecting…"}
            </div>

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
        {isLoading ? (
          // Pulsing skeleton cards while waiting for Supabase
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="break-inside-avoid bg-[#1a1a1a] rounded-xl p-8 border border-[#2a2520] animate-pulse"
              >
                {/* Avatar + name row */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-[#2a2520]" />
                  <div className="h-2.5 w-24 rounded-full bg-[#2a2520]" />
                </div>
                {/* Text lines */}
                <div className="space-y-3">
                  <div className="h-2.5 w-full rounded-full bg-[#2a2520]" />
                  <div className="h-2.5 w-5/6 rounded-full bg-[#2a2520]" />
                  <div className="h-2.5 w-4/6 rounded-full bg-[#2a2520]" />
                </div>
              </div>
            ))}
          </div>
        ) : notes.length === 0 ? (
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
          // #4 FIX: Wrap list in AnimatePresence so new real-time arrivals animate in
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            <AnimatePresence initial={false}>
              {[...notes].reverse().map((note, i) => (
                <motion.div
                  layout
                  key={note.id || `note-${i}`}
                  initial={{ opacity: 0, y: 24, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.97 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="break-inside-avoid bg-[#1a1a1a] rounded-xl p-8 border border-[#2a2520] hover:border-[#c0392b]/30 transition-colors duration-300 relative group"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      {/* #1 FIX: stable gradient derived from note id/timestamp */}
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-inner"
                        style={{ background: getStableGradient(note, i) }}
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
            </AnimatePresence>
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
                  maxLength={
                    MAX_CHARS + 20
                  } /* soft guard, hard check on submit */
                  className="w-full h-40 bg-[#0a0a0a] border border-[#2a2520] rounded-xl p-4 text-[#e8e2d9] placeholder-[#5a5550] focus:outline-none focus:border-[#c0392b] transition-colors resize-none font-serif italic text-lg"
                  autoFocus
                />

                {/* #3: Character counter */}
                <div className="mt-2 flex justify-between items-center">
                  <span
                    className={`text-[10px] uppercase tracking-widest transition-colors ${
                      isOverLimit
                        ? "text-[#c0392b]"
                        : isNearLimit
                          ? "text-amber-500/80"
                          : "text-[#5a5550]"
                    }`}
                  >
                    {isOverLimit
                      ? `${Math.abs(charsLeft)} over limit`
                      : `${charsLeft} remaining`}
                  </span>

                  <button
                    type="submit"
                    disabled={!newNoteText.trim() || isOverLimit}
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
