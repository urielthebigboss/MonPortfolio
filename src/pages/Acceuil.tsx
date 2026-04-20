import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import NavbarWhite from "../components/NavbarWhite";

/* ── SOUND DESIGN PREMIUM ── */
const playSound = (freq = 600) => {
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext;
  const ctx = new AC();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = "sine";
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  gain.gain.setValueAtTime(0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2);

  osc.start();
  osc.stop(ctx.currentTime + 0.2);
};

export default function LandingUltra() {
  const navigate = useNavigate();
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  const handleEnter = () => {
    playSound(800);
    navigate("/profil");
  };

  return (
    <div
      ref={ref}
      className="relative h-[200vh] bg-[#0b0b0f] text-white overflow-hidden"
    >
      <NavbarWhite />
      {/* 🎬 VIDEO BACKGROUND */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0 "
        style={{ opacity: 0.2 }}
      >
        <source src="/deo.mp4" type="video/mp4" />
      </video>
      {/* ── BACKGROUND GRADIENT ANIMÉ ── */}
      <motion.div style={{ scale }} className="fixed inset-0 z-0"></motion.div>

      {/* ── HERO SECTION ── */}
      <motion.section
        style={{ opacity }}
        className="h-screen flex flex-col items-center justify-center text-center px-6 z-10 relative mt-10"
      >
        <motion.h3
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-5xl tracking-tight"
        >
          URIEL JEAN BEDEL
        </motion.h3>

        <motion.h1
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 1 }}
          className="text-4xl md:text-6xl font-bold mt-4"
        >
          DAKAUD
        </motion.h1>

        <motion.p
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-white/60 mt-4"
        >
          Creative Developer • tech • Visionary
        </motion.p>

        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-5xl font-bold mt-10"
        >
          Welcome into my world
        </motion.h2>

        <motion.button
          onClick={handleEnter}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="mt-10 px-10 py-4 bg-orange-500 text-white rounded-full font-bold tracking-wide shadow-xl hidden"
        >
          DECOUVRIR
        </motion.button>
      </motion.section>

      {/* ── SECTION SCROLL EXPERIENCE ── */}
      <section className="h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center max-w-2xl"
        >
          <h2 className="text-5xl font-bold mb-6">I BUILD EXPERIENCES</h2>
          <p className="text-white/60 text-lg">
            Not just websites. I create immersive digital worlds powered by
            design, motion and intelligence.
          </p>
        </motion.div>
      </section>
    </div>
  );
}
