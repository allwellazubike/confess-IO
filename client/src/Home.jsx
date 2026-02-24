import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useNavigate } from "react-router-dom";

const CONFESSIONS = [
  "I've never told anyone I'm afraid of silence.",
  "I fake confidence every single day.",
  "I miss people I was never supposed to love.",
  "Sometimes I read old messages just to feel something.",
  "I pretend to be fine. I'm not fine.",
];

const Home = () => {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const [confessionIdx, setConfessionIdx] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });

  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroY = useTransform(scrollY, [0, 400], [0, -80]);

  const createWall = async () => {
    try {
      const backendUrl =
        import.meta.env.VITE_BACKEND_URL || "https://confessio-be.pxxl.click";
      const res = await fetch(`${backendUrl}/api/generate-id`);
      const data = await res.json();
      navigate(`/board/${data.id}`);
    } catch (error) {
      console.error("Failed to generate ID", error);
      const uniqueId = Math.random().toString(36).substring(2, 9);
      navigate(`/board/${uniqueId}`);
    }
  };

  // Cycle confessions
  useEffect(() => {
    const id = setInterval(() => {
      setConfessionIdx((i) => (i + 1) % CONFESSIONS.length);
    }, 3200);
    return () => clearInterval(id);
  }, []);

  // Custom cursor
  useEffect(() => {
    const move = (e) => setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <>
      {/* Custom cursor */}
      <div
        className="cursor"
        style={{ left: cursorPos.x - 6, top: cursorPos.y - 6 }}
      />
      <div
        className="cursor-ring"
        style={{ left: cursorPos.x - 20, top: cursorPos.y - 20 }}
      />

      <div className="noise">
        {/* ── NAV ── */}
        <motion.nav
          className="nav"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div>
            <div className="nav-logo">
              Confess<span>IO</span>
            </div>
            <div className="nav-tag">Anonymous · Unfiltered · Secure</div>
          </div>
          <button className="nav-cta" onClick={createWall}>
            Open a Wall
          </button>
        </motion.nav>

        {/* ── HERO ── */}
        <motion.section
          className="hero"
          ref={heroRef}
          style={{ opacity: heroOpacity, y: heroY }}
        >
          <div className="hero-grid" />
          <div className="hero-vignette" />

          <motion.div
            className="hero-eyebrow"
            initial={{ opacity: 0, letterSpacing: "0.5em" }}
            animate={{ opacity: 1, letterSpacing: "0.3em" }}
            transition={{ duration: 1.2 }}
          >
            Anonymous Confessions
          </motion.div>

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 60, skewY: 3 }}
            animate={{ opacity: 1, y: 0, skewY: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            Speak
            <br />
            <em>without</em>
            <br />
            <span className="red">fear.</span>
          </motion.h1>

          <motion.p
            className="hero-sub"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.55 }}
          >
            Create a wall. Share the link. Receive unfiltered truth — completely
            untraceable, beautifully raw.
          </motion.p>

          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <button className="btn-primary" onClick={createWall}>
              Create Your Wall →
            </button>
            <button className="btn-secondary">How it works</button>
          </motion.div>

          {/* Rotating confession ticker */}
          <div className="confession-band">
            <div className="confession-label">Live whispers</div>
            <AnimatePresence mode="wait">
              <motion.div
                key={confessionIdx}
                className="confession-text"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.6 }}
              >
                "{CONFESSIONS[confessionIdx]}"
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.section>

        {/* ── STATS ── */}
        <div className="divider" />
        <motion.div
          className="stats"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, staggerChildren: 0.1 }}
        >
          {[
            { val: "0ms", label: "Identity Stored" },
            { val: "∞", label: "Truths Received" },
            { val: "100%", label: "Untraceable" },
          ].map((s) => (
            <div className="stat" key={s.label}>
              <div className="stat-value">{s.val}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* ── FEATURES ── */}
        <div className="divider" />
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ padding: "5rem 3rem 2rem" }}>
            <div className="section-label">Why ConfessIO</div>
            <div className="section-title">
              Built for
              <br />
              <em
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontStyle: "italic",
                  color: "var(--red)",
                }}
              >
                honest moments.
              </em>
            </div>
          </div>

          <motion.div
            className="features"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          >
            {[
              {
                num: "01",
                icon: (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    width="28"
                    height="28"
                  >
                    <path d="M12 2c0 0-4 4-4 8a4 4 0 0 0 8 0c0-4-4-8-4-8z" />
                    <path d="M12 14v8" />
                    <path d="M9 22h6" />
                  </svg>
                ),
                title: "Zero-Knowledge Privacy",
                desc: "We architect anonymity, not bolt it on. No IP logs, no accounts, no fingerprinting. Your secret is architecturally impossible for us to uncover.",
              },
              {
                num: "02",
                icon: (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    width="28"
                    height="28"
                  >
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                ),
                title: "Real-Time Delivery",
                desc: "Socket.io powers every wall. Messages arrive in under 50ms — the intimacy of a whisper, the speed of lightning.",
              },
              {
                num: "03",
                icon: (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    width="28"
                    height="28"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                ),
                title: "Encrypted Vault",
                desc: "End-to-end encryption wraps every message. Even our servers see only ciphertext. Your data belongs to you alone.",
              },
              {
                num: "04",
                icon: (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    width="28"
                    height="28"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ),
                title: "Mirror of Truth",
                desc: "People say things anonymously they'd never say face-to-face. Unlock honest feedback, unfiltered perspective, real connection.",
              },
            ].map((f) => (
              <motion.div
                key={f.num}
                className="feature"
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
                  },
                }}
              >
                <div className="feature-num">{f.num} ——</div>
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-title">{f.title}</div>
                <p className="feature-desc">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* ── CTA BLOCK ── */}
        <div className="divider" />
        <motion.section
          className="cta-block"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="cta-bg" />
          <h2 className="cta-title">
            The truth
            <br />
            is waiting
            <br />
            <em>for you.</em>
          </h2>
          <p className="cta-sub">
            No sign-up. No traces. Just raw, honest connection.
          </p>
          <div className="cta-btn-wrap">
            <button className="btn-primary" onClick={createWall}>
              Start Your Wall — It's Free →
            </button>
          </div>
        </motion.section>

        {/* ── FOOTER ── */}
        <footer className="footer">
          <div className="footer-logo">ConfessIO</div>
          <div className="footer-copy">
            © {new Date().getFullYear()} — Anonymous. Always.
          </div>
        </footer>
      </div>
    </>
  );
};

export default Home;
