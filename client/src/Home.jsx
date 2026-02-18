import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Shield, Zap, Lock, MessageSquare } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  const createWall = () => {
    const uniqueId = Math.random().toString(36).substring(2, 9);
    navigate(`/board/${uniqueId}`);
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      {/* Navbar - Minimalist */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white">
              <MessageSquare size={18} fill="currentColor" />
            </div>
            <span className="text-xl font-bold tracking-tight">ConfessIO</span>
          </div>
          <button
            onClick={createWall}
            className="hidden md:flex bg-black text-white px-6 py-2.5 rounded-full font-medium text-sm hover:scale-105 transition-transform"
          >
            Start a Wall
          </button>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center space-y-8 mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-200 text-sm font-medium text-gray-600"
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Global Anonymous Network
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-[0.9]"
          >
            Truth.
            <br />
            <span className="text-gray-400">Unfiltered.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-500 max-w-2xl font-light leading-relaxed"
          >
            The simplest way to receive honest feedback and anonymous messages
            from your friends.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            onClick={createWall}
            className="group mt-8 bg-black text-white text-lg px-10 py-5 rounded-full font-bold flex items-center gap-3 hover:gap-5 transition-all shadow-xl hover:shadow-2xl"
          >
            Create Your Link
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </section>

        {/* Bento Grid Features */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 bg-gray-50 rounded-[2.5rem] p-10 flex flex-col justify-between border border-gray-100 hover:border-gray-200 transition-colors h-[400px]"
          >
            <div>
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-gray-100">
                <Shield className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-3xl font-bold mb-4">Ironclad Privacy.</h3>
              <p className="text-gray-500 text-lg max-w-md">
                We don't track IP addresses. We don't require accounts. Your
                anonymity is engineered into the core.
              </p>
            </div>
            <div className="w-full h-8 bg-gray-200/50 rounded-full overflow-hidden mt-8">
              <div className="w-2/3 h-full bg-black rounded-full" />
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-black text-white rounded-[2.5rem] p-10 flex flex-col justify-between h-[400px]"
          >
            <div>
              <Zap className="w-10 h-10 mb-6 text-yellow-400" />
              <h3 className="text-3xl font-bold mb-2">Real-time.</h3>
              <p className="text-gray-400">
                Socket.io powered. Messages stream in instantly.
              </p>
            </div>
            <div className="text-4xl font-bold tracking-tighter">0.05s</div>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-[2.5rem] p-10 flex flex-col justify-center border border-gray-200 h-[300px] shadow-sm"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <div className="w-3 h-3 bg-yellow-500 rounded-full" />
              <div className="w-3 h-3 bg-green-500 rounded-full" />
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-100 rounded w-3/4" />
              <div className="h-4 bg-gray-100 rounded w-1/2" />
            </div>
            <h3 className="text-2xl font-bold mt-6">Simple by Design.</h3>
          </motion.div>

          {/* Card 4 */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="md:col-span-2 bg-gradient-to-br from-gray-100 to-white rounded-[2.5rem] p-10 border border-gray-200 h-[300px] flex items-center justify-between"
          >
            <div>
              <Lock className="w-10 h-10 mb-4 text-black" />
              <h3 className="text-3xl font-bold">Secure Vault.</h3>
              <p className="text-gray-500 mt-2">Your data belongs to you.</p>
            </div>
            <div className="text-9xl font-black text-gray-50 opacity-50 select-none">
              KEY
            </div>
          </motion.div>
        </section>

        <footer className="mt-32 border-t border-gray-100 pt-10 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} ConfessIO. Established 2026.</p>
        </footer>
      </main>
    </div>
  );
};

export default Home;
