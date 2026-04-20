import React, { useState, useEffect, useRef } from "react";
import { motion, useTransform, useSpring, useMotionValue } from "framer-motion";
import { useNavigate } from "react-router-dom";
import me from "../assets/Image1.png";
import Navbar from "../components/Navbar";
import CompetencesSection from "../components/CompetencesSection";
import GamaLabsSection from "../components/GamaLabsSection";
import MonParcoursSection from "../components/MonParcoursSection";
import Footer from "../components/Footer";

// ─── RÉSEAUX SOCIAUX ───
const socialNetworks = [
  {
    name: "LinkedIn",
    iconUrl: "https://img.icons8.com/?size=100&id=8808&format=png&color=000000",
    color: "#0077B5",
    link: "https://www.linkedin.com/in/dakaud-uriel-jean-bedel-194788375?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
  },
  {
    name: "WhatsApp",
    iconUrl:
      "https://img.icons8.com/?size=100&id=16733&format=png&color=000000",
    color: "#25D366",
    link: "https://wa.me/225XXXXXXXX",
  },
  {
    name: "Instagram",
    iconUrl:
      "https://img.icons8.com/?size=100&id=32309&format=png&color=000000",
    color: "#E4405F",
    link: "https://www.instagram.com/p/DMWGL2godrV/?utm_source=ig_web_button_share_sheet&igsh=MzRlODBiNWFlZA==",
  },
  {
    name: "TikTok",
    iconUrl:
      "https://img.icons8.com/?size=100&id=118638&format=png&color=000000",
    color: "#010101",
    link: "https://www.tiktok.com/@urielbeydel?is_from_webapp=1&sender_device=pc",
  },
  {
    name: "Mail",
    iconUrl:
      "https://img.icons8.com/?size=100&id=Y2GfpkgYNp42&format=png&color=000000",
    color: "#EA4335",
    link: "mailto:dakauduriel@gmail.com",
  },
  {
    name: "Github",
    iconUrl:
      "https://img.icons8.com/?size=100&id=12599&format=png&color=000000",
    color: "#333333",
    link: "https://github.com/urielthebigboss",
  },
];

// ─── SYSTÈME AUDIO ORIGINAL (PRÉSERVÉ) ───
const playSound = (
  type: "hover" | "click" | "enter" | "success" | "tick" = "click",
) => {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;
    switch (type) {
      case "hover":
        osc.type = "sine";
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(800, now);
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
        break;
      case "click":
        osc.type = "triangle";
        filter.type = "highpass";
        filter.frequency.setValueAtTime(400, now);
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
        break;
      case "enter":
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.connect(g);
          g.connect(ctx.destination);
          o.type = "sine";
          o.frequency.setValueAtTime(freq, now + i * 0.08);
          g.gain.setValueAtTime(0, now + i * 0.08);
          g.gain.linearRampToValueAtTime(0.06, now + i * 0.08 + 0.05);
          g.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
          o.start(now + i * 0.08);
          o.stop(now + 0.6);
        });
        break;
      case "success":
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.3);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
        break;
      case "tick":
        osc.type = "sine";
        osc.frequency.setValueAtTime(2000, now);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
        break;
    }
  } catch {
    console.log("Audio not supported");
  }
};

// ─── HOOKS ───
const useMousePosition = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setPosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);
  return position;
};

// ─── SCRAMBLE TEXT ───
const ScrambleText: React.FC<{
  text: string;
  className?: string;
  delay?: number;
}> = ({ text, className = "", delay = 0 }) => {
  const [display, setDisplay] = useState(text.split("").map(() => " "));
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*";
  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    text.split("").forEach((char, index) => {
      if (char === " ") {
        setDisplay((prev) => {
          const next = [...prev];
          next[index] = " ";
          return next;
        });
        return;
      }
      for (let i = 0; i < 6; i++) {
        timeouts.push(
          setTimeout(
            () => {
              setDisplay((prev) => {
                const next = [...prev];
                next[index] = chars[Math.floor(Math.random() * chars.length)];
                return next;
              });
            },
            delay * 1000 + index * 40 + i * 25,
          ),
        );
      }
      timeouts.push(
        setTimeout(
          () => {
            setDisplay((prev) => {
              const next = [...prev];
              next[index] = char;
              return next;
            });
          },
          delay * 1000 + index * 40 + 6 * 25,
        ),
      );
    });
    return () => timeouts.forEach(clearTimeout);
  }, [text, delay]);
  return (
    <span className={className}>
      {display.map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + i * 0.01, duration: 0.3 }}
          className="inline-block"
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
};

// ─── MAGNETIC BUTTON ───
const MagneticButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
}> = ({ children, onClick, className = "", variant = "primary" }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { damping: 15, stiffness: 150 });
  const springY = useSpring(y, { damping: 15, stiffness: 150 });
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.3);
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.3);
  };
  const variants = {
    primary: "bg-gray-900 text-white hover:bg-orange-500",
    secondary:
      "bg-white/80 backdrop-blur text-gray-900 border border-gray-200 hover:border-orange-500",
    ghost: "bg-transparent text-gray-900 hover:bg-gray-100",
  };
  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      onMouseEnter={() => playSound("hover")}
      style={{ x: springX, y: springY }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className={`relative overflow-hidden px-8 py-4 rounded-2xl font-bold text-sm tracking-wider uppercase transition-colors duration-300 shadow-lg ${variants[variant]} ${className}`}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: "-100%" }}
        whileHover={{ x: "100%" }}
        transition={{ duration: 0.6 }}
      />
      <span className="relative z-10 flex items-center gap-3">{children}</span>
    </motion.button>
  );
};

// ─── PARTICLE FIELD ───
const ParticleField: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }> = [];
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.3 + 0.1,
      });
    }
    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 126, 51, ${p.opacity})`;
        ctx.fill();
        particles.slice(i + 1).forEach((p2) => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 126, 51, ${0.1 * (1 - dist / 120)})`;
            ctx.stroke();
          }
        });
      });
      animId = requestAnimationFrame(animate);
    };
    animate();
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);
  return (
    <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />
  );
};

// ─── ORBITING SOCIAL ICONS ───
const OrbitingSocials: React.FC = () => {
  const count = socialNetworks.length;
  const radius = 230; // px depuis le centre de l'avatar

  return (
    // Anneau tournant — counter-rotation sur chaque icône pour les garder droites
    <motion.div
      className="absolute inset-0 pointer-events-none"
      animate={{ rotate: 380 }}
      transition={{ duration: 6, ease: "easeInOut" }}
    >
      {socialNetworks.map((sn, i) => {
        const angle = (i / count) * 360;
        const rad = (angle * Math.PI) / 180;
        const x = radius * Math.cos(rad);
        const y = radius * Math.sin(rad);

        return (
          <motion.div
            key={sn.name}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              x: x - 22,
              y: y - 22,
              pointerEvents: "auto",
            }}
            animate={{ rotate: -360 }}
            transition={{ duration: 6, ease: "easeInOut" }}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <motion.a
              href={sn.link}
              target="_blank"
              rel="noopener noreferrer"
              title={sn.name}
              whileHover={{ scale: 1.3, rotate: 6 }}
              whileTap={{ scale: 0.9 }}
              onHoverStart={() => playSound("hover")}
              onClick={() => playSound("click")}
              className="w-11 h-11 flex items-center justify-center relative"
            >
              {/* Halo glow */}
              <motion.div
                className="absolute inset-0 rounded-full opacity-0"
                whileHover={{ opacity: 0.15, scale: 1.6 }}
              />

              <img
                src={sn.iconUrl}
                alt={sn.name}
                className="w-6 h-6 object-contain relative z-10"
              />
            </motion.a>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

// ─── COMPOSANT PRINCIPAL ───
export default function ProfilePage() {
  const navigate = useNavigate();

  const { x: mouseX, y: mouseY } = useMousePosition();
  const springConfig = { damping: 25, stiffness: 100 };
  const mouseXSpring = useSpring(mouseX, springConfig);
  const mouseYSpring = useSpring(mouseY, springConfig);
  const heroX = useTransform(mouseXSpring, [0, 1], [-30, 30]);
  const heroY = useTransform(mouseYSpring, [0, 1], [-20, 20]);
  const bgX = useTransform(mouseXSpring, [0, 1], [-50, 50]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
      playSound("enter");
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const navNodes = [
    {
      id: "parcours",
      label: "PARCOURS",
      color: "bg-blue-500",
      position: "top-[20%] left-[5%]",
    },
    {
      id: "Mon CV",
      label: "MON CV",
      color: "bg-blue-500",
      position: "top-[50%] left-[5%]",
    },
    {
      id: "startup",
      label: "STARTUP",
      color: "bg-red-500",
      position: "top-[20%] right-[5%]",
    },
    {
      id: "entreprises",
      label: "ENTREPRISES",
      color: "bg-amber-500",
      position: "bottom-[20%] left-[5%]",
    },
    {
      id: "competences",
      label: "COMPETENCES",
      color: "bg-emerald-500",
      position: "bottom-[20%] right-[5%]",
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#fafafa] text-gray-900 font-sans overflow-x-hidden selection:bg-orange-500 selection:text-white">
      <Navbar />
      <ParticleField />

      {/* Grid futuriste */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{ x: bgX }}
      >
        <svg width="100%" height="100%">
          <defs>
            <pattern
              id="grid"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 60 0 L 0 0 0 60"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </motion.div>

      {/* Noise overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-50 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex items-center justify-center px-6 lg:px-12 pt-24 pb-12">
        <div className="max-w-7xl w-full mx-auto grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Colonne texte */}
          <motion.div style={{ x: heroX, y: heroY }} className="relative z-20">
            <div className="mb-8 mt-20">
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 leading-[0.95] mb-4"
              >
                <h3>Uriel DAKAUD Jean-Bedel</h3>
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="space-y-1"
              >
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.95]">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600">
                    <ScrambleText text="Designer," delay={0.7} />
                  </span>
                </h1>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.95] text-gray-900">
                  <ScrambleText text="Full Stack" delay={0.9} />
                </h1>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.95]">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">
                    <ScrambleText text="Developer." delay={1.1} />
                  </span>
                </h1>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.3, duration: 0.8 }}
              className="max-w-lg mb-10"
            >
              <p className="text-gray-600 leading-relaxed text-lg">
                Passionné par l'innovation et les technologies intelligentes. Je
                conçois des expériences numériques à la frontière entre
                <span className="text-orange-500 font-semibold">
                  {" "}
                  design pur
                </span>{" "}
                et
                <span className="text-orange-500 font-semibold">
                  {" "}
                  performance technique
                </span>
                .
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isLoaded ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="flex flex-wrap gap-4"
            >
              <MagneticButton
                onClick={() => {
                  playSound("success");
                  navigate("/contact");
                }}
              >
                Me contacter
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  →
                </motion.span>
              </MagneticButton>
              <MagneticButton
                variant="secondary"
                onClick={() => {
                  playSound("click");
                  navigate("/projets");
                }}
              >
                Voir mes projets
              </MagneticButton>
            </motion.div>
          </motion.div>

          {/* ─── Colonne visuelle — Avatar + orbite ─── */}
          <div className="relative flex items-center justify-center min-h-[600px] lg:min-h-[700px]">
            {/* Anneau décoratif externe (tourne lentement) */}
            <motion.div
              className="absolute w-[500px] h-[500px] rounded-full border border-dashed border-gray-200"
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            />
            {/* Anneau intermédiaire */}
            <motion.div
              className="absolute w-[400px] h-[400px] rounded-full border border-gray-200"
              animate={{ rotate: -360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            />

            {/* ── Orbite des réseaux sociaux ── */}
            <div
              className="absolute w-0 h-0"
              style={{ top: "50%", left: "50%" }}
            >
              <OrbitingSocials />
            </div>

            {/* Avatar central */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.8, duration: 1, type: "spring" }}
              className="relative z-20"
              style={{
                x: useTransform(mouseXSpring, [0, 1], [-15, 15]),
                y: useTransform(mouseYSpring, [0, 1], [-15, 15]),
              }}
            >
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative"
              >
                {/* Glow derrière l'avatar */}
                <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 to-transparent blur-3xl scale-150 -z-10" />

                <div className="w-[300px] h-[300px] lg:w-[320px] lg:h-[320px] rounded-full overflow-hidden bg-gradient-to-br from-orange-100 to-amber-50 border-4 border-white shadow-2xl">
                  <img
                    src={me}
                    alt="Uriel Bedel"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Badge flottant */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.8, type: "spring" }}
                  className="absolute -top-4 -right-4 bg-white px-4 py-2 rounded-full shadow-lg border border-gray-100"
                >
                  <span className="text-xs font-bold text-gray-800">
                    1 an d'exp.
                  </span>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Nœuds de navigation */}
            {navNodes.map((node, index) => (
              <motion.button
                key={node.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={isLoaded ? { opacity: 1, scale: 1 } : {}}
                transition={{
                  delay: 1.2 + index * 0.2,
                  type: "spring",
                  stiffness: 200,
                }}
                whileHover={{ scale: 1.15, y: -5 }}
                onHoverStart={() => playSound("hover")}
                className={`absolute ${node.position} z-30 px-6 py-3 ${node.color} text-white rounded-2xl font-bold text-xs uppercase tracking-wider shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-2xl`}
              >
                {node.label}
                <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
                  <motion.line
                    x1="50%"
                    y1="50%"
                    x2={node.position.includes("left") ? "150%" : "-50%"}
                    y2="50%"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeOpacity="0.3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 1.5 + index * 0.2, duration: 0.8 }}
                  />
                </svg>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center pt-2"
          >
            <motion.div className="w-1.5 h-3 bg-gray-400 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      <div>
        <MonParcoursSection />
        <CompetencesSection />
        <GamaLabsSection />
        <Footer />
      </div>
    </div>
  );
}
