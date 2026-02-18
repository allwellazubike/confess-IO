import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Lock, Zap, EyeOff, ArrowRight, MessageSquare } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  const createWall = () => {
    // Logic to create a unique wall ID - for now simulating
    const uniqueId = Math.random().toString(36).substring(2, 9);
    navigate(`/board/${uniqueId}`);
  };

  return (
    <div className="min-h-screen bg-[#0f0f10] text-white overflow-hidden relative selection:bg-purple-500 selection:text-white">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] left-[30%] w-[40%] h-[40%] bg-indigo-900/10 rounded-full blur-[100px] animate-pulse" />
      </div>

      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex justify-between items-center px-8 py-6 w-full max-w-7xl mx-auto"
      >
        <div className="flex items-center gap-2">
          <MessageSquare className="w-8 h-8 text-purple-500" />
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
            Echo Wall
          </span>
        </div>
        <div>
          <button
            onClick={createWall}
            className="px-6 py-2 rounded-full border border-white/10 hover:bg-white/5 transition-all text-sm font-medium backdrop-blur-sm"
          >
            Create Wall
          </button>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-4 mt-20 md:mt-32 max-w-5xl mx-auto">
        {/* Hero Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm text-gray-400 font-medium">
            Anonymous Messaging Evolved
          </span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8"
        >
          Speak Your Truth, <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-500 animate-gradient-x">
            Unapologetically.
          </span>
        </motion.h1>

        {/* Hero Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-lg md:text-xl text-gray-400 max-w-2xl mb-12 leading-relaxed"
        >
          Create a secure, anonymous space where friends and strangers can share
          their honest thoughts. No logins. No tracking. Just pure expression.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <button
            onClick={createWall}
            className="group relative px-8 py-4 bg-white text-black rounded-full font-bold text-lg flex items-center gap-3 hover:scale-105 transition-transform duration-300 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
          >
            Start Your Wall
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 rounded-full bg-white blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
          </button>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 w-full px-4">
          <FeatureCard
            icon={<EyeOff className="w-8 h-8 text-pink-500" />}
            title="Truly Anonymous"
            description="We don't track IPs or require accounts. Your identity is generated as a fun random alias."
            delay={1.0}
          />
          <FeatureCard
            icon={<Lock className="w-8 h-8 text-purple-500" />}
            title="Secure & Private"
            description="Messages are encrypted in transit and only visible to those with your unique link."
            delay={1.2}
          />
          <FeatureCard
            icon={<Zap className="w-8 h-8 text-blue-500" />}
            title="Real-Time"
            description="See confessions appear instantly as they are typed. No refreshing needed."
            delay={1.4}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-32 py-12 border-t border-white/5 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Echo Wall. All rights reserved.</p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay, duration: 0.5 }}
      className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors text-left"
    >
      <div className="mb-4 p-3 rounded-2xl bg-white/5 w-fit">{icon}</div>
      <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </motion.div>
  );
};

export default Home;
