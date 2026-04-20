import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Link, useLocation } from "react-router-dom";
import { Home, User, Briefcase, Send, GalleryVerticalEnd } from "lucide-react";
import Footer from "../components/Footer";

/* ═══════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════ */
interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  color: string;
  image: string;
  height: number;
  year: string;
}

/* ═══════════════════════════════════════════════════
   DONNÉES — Images Pinterest-style variées
═══════════════════════════════════════════════════ */
const ITEMS: PortfolioItem[] = [
  {
    id: 1,
    title: "Neo Interface",
    category: "UI Design",
    color: "#6366f1",
    image:
      "https://images.unsplash.com/photo-1545235617-9465d2a55698?w=600&q=80",
    height: 320,
    year: "2024",
  },
  {
    id: 2,
    title: "Abstract Flow",
    category: "3D Motion",
    color: "#ec4899",
    image:
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&q=80",
    height: 420,
    year: "2024",
  },
  {
    id: 3,
    title: "Minimal Space",
    category: "Branding",
    color: "#f59e0b",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80",
    height: 280,
    year: "2023",
  },
  {
    id: 4,
    title: "Future Tech",
    category: "UX Research",
    color: "#10b981",
    image:
      "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&q=80",
    height: 380,
    year: "2024",
  },
  {
    id: 5,
    title: "Digital Agency",
    category: "UI Design",
    color: "#6366f1",
    image:
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&q=80",
    height: 340,
    year: "2023",
  },
  {
    id: 6,
    title: "Urban Geometry",
    category: "Branding",
    color: "#f59e0b",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80",
    height: 460,
    year: "2024",
  },
  {
    id: 7,
    title: "Mobile XP",
    category: "UX Design",
    color: "#10b981",
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80",
    height: 360,
    year: "2023",
  },
  {
    id: 8,
    title: "Particle Art",
    category: "3D Motion",
    color: "#ec4899",
    image:
      "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=600&q=80",
    height: 400,
    year: "2024",
  },
  {
    id: 9,
    title: "Dashboard Pro",
    category: "UI Design",
    color: "#6366f1",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
    height: 300,
    year: "2024",
  },
  {
    id: 10,
    title: "Typography Haus",
    category: "Branding",
    color: "#f59e0b",
    image:
      "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=600&q=80",
    height: 440,
    year: "2023",
  },
  {
    id: 11,
    title: "Neon Nights",
    category: "3D Motion",
    color: "#ec4899",
    image:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80",
    height: 380,
    year: "2024",
  },
  {
    id: 12,
    title: "Clean UI",
    category: "UI Design",
    color: "#6366f1",
    image:
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&q=80",
    height: 320,
    year: "2024",
  },
  {
    id: 13,
    title: "Brand Identity",
    category: "Branding",
    color: "#f59e0b",
    image:
      "https://images.unsplash.com/photo-1600607686527-6fb886090705?w=600&q=80",
    height: 400,
    year: "2023",
  },
  {
    id: 14,
    title: "Motion Graphics",
    category: "3D Motion",
    color: "#ec4899",
    image:
      "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=600&q=80",
    height: 360,
    year: "2024",
  },
  {
    id: 15,
    title: "App Design",
    category: "UX Design",
    color: "#10b981",
    image:
      "https://images.unsplash.com/photo-1512486130939-2c4f79935e1f?w=600&q=80",
    height: 420,
    year: "2024",
  },
];

/* ═══════════════════════════════════════════════════
   SYSTÈME AUDIO
═══════════════════════════════════════════════════ */
type SoundType = "hover" | "click" | "open" | "close";

const useAudio = () => {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      ctxRef.current = new AC();
    }
    return ctxRef.current;
  }, []);

  const play = useCallback(
    (type: SoundType) => {
      try {
        const ctx = getCtx();
        const now = ctx.currentTime;
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);

        const configs: Record<SoundType, () => void> = {
          hover: () => {
            o.type = "sine";
            o.frequency.setValueAtTime(600, now);
            o.frequency.exponentialRampToValueAtTime(800, now + 0.08);
            g.gain.setValueAtTime(0.03, now);
            g.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
            o.start(now);
            o.stop(now + 0.1);
          },
          click: () => {
            o.type = "triangle";
            o.frequency.setValueAtTime(400, now);
            o.frequency.exponentialRampToValueAtTime(600, now + 0.06);
            g.gain.setValueAtTime(0.05, now);
            g.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
            o.start(now);
            o.stop(now + 0.12);
          },
          open: () => {
            o.type = "sine";
            o.frequency.setValueAtTime(440, now);
            o.frequency.exponentialRampToValueAtTime(880, now + 0.15);
            g.gain.setValueAtTime(0.04, now);
            g.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
            o.start(now);
            o.stop(now + 0.2);
          },
          close: () => {
            o.type = "sine";
            o.frequency.setValueAtTime(660, now);
            o.frequency.exponentialRampToValueAtTime(330, now + 0.1);
            g.gain.setValueAtTime(0.04, now);
            g.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
            o.start(now);
            o.stop(now + 0.15);
          },
        };
        configs[type]?.();
      } catch {
        // Audio context not available
      }
    },
    [getCtx],
  );

  return { play };
};

/* ═══════════════════════════════════════════════════
   LIGHTBOX
═══════════════════════════════════════════════════ */
const Lightbox: React.FC<{
  item: PortfolioItem | null;
  onClose: () => void;
}> = ({ item, onClose }) => (
  <AnimatePresence>
    {item && (
      <motion.div
        className="fixed inset-0 z-[500] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
          onClick={onClose}
        />

        {/* Close btn */}
        <motion.button
          onClick={onClose}
          className="absolute top-6 right-6 z-20 w-11 h-11 rounded-full bg-white/10 border border-white/15 text-white flex items-center justify-center text-lg hover:bg-white/20 transition-colors"
          whileHover={{ rotate: 90, scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          ✕
        </motion.button>

        {/* Content */}
        <motion.div
          className="relative z-10 flex flex-col items-center gap-6 px-6 max-w-5xl w-full"
          initial={{ scale: 0.88, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.88, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
        >
          <img
            src={item.image}
            alt={item.title}
            className="max-h-[70vh] w-auto rounded-xl object-contain shadow-[0_40px_80px_rgba(0,0,0,0.8)]"
          />
          <div className="text-center">
            <h3 className="text-white text-2xl font-black tracking-tight">
              {item.title}
            </h3>
            <p
              className="mt-1 text-xs font-bold tracking-[0.2em] uppercase"
              style={{ color: item.color }}
            >
              {item.category} · {item.year}
            </p>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

/* ═══════════════════════════════════════════════════
   PINTEREST-STYLE CARD
═══════════════════════════════════════════════════ */
const PinterestCard: React.FC<{
  item: PortfolioItem;
  index: number;
  onOpen: (item: PortfolioItem) => void;
  play: (type: SoundType) => void;
}> = ({ item, index, onOpen, play }) => {
  const [loaded, setLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="relative rounded-2xl overflow-hidden bg-[#111] mb-4 group cursor-zoom-in"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.05,
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ scale: 1.02 }}
      onMouseEnter={() => {
        setHovered(true);
        play("hover");
      }}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onOpen(item)}
    >
      {/* Skeleton */}
      {!loaded && (
        <div
          className="w-full animate-pulse bg-white/10 relative overflow-hidden"
          style={{ height: item.height }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_1.5s_ease_infinite]" />
        </div>
      )}

      {/* Image */}
      <img
        src={item.image}
        alt={item.title}
        className="w-full object-cover transition-all duration-500 ease-out"
        style={{
          height: item.height,
          display: loaded ? "block" : "none",
          transform: hovered ? "scale(1.05)" : "scale(1)",
        }}
        onLoad={() => setLoaded(true)}
      />

      {/* Pinterest-style Overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: hovered ? 0 : 10, opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.2, delay: 0.05 }}
        >
          <h3 className="text-white font-bold text-sm mb-1">{item.title}</h3>
          <p className="text-white/70 text-xs">{item.category}</p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════
   COMPOSANT PRINCIPAL
═══════════════════════════════════════════════════ */
export default function PortfolioGallery() {
  const [lightbox, setLightbox] = useState<PortfolioItem | null>(null);
  const [scrollPct, setScrollPct] = useState(0);
  const { play } = useAudio();

  /* Pinterest Masonry: 5 colonnes desktop, 3 tablet, 2 mobile */
  const [, setCols] = useState(4);

  useEffect(() => {
    const updateCols = () => {
      const width = globalThis.innerWidth;

      if (width >= 1280) setCols(5);
      else if (width >= 768) setCols(3);
      else setCols(2);
    };

    updateCols();
    globalThis.addEventListener("resize", updateCols);

    return () => globalThis.removeEventListener("resize", updateCols);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const pct =
        (window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)) *
        100;
      setScrollPct(Math.round(pct));
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLightbox(null);
        play("close");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [play]);

  const openLightbox = useCallback(
    (item: PortfolioItem) => {
      play("open");
      setLightbox(item);
    },
    [play],
  );

  const closeLightbox = useCallback(() => {
    play("close");
    setLightbox(null);
  }, [play]);

  /* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
  interface MenuItem {
    name: string;
    path: string;
    icon: React.ElementType;
    tooltip: string;
  }

  /* ─────────────────────────────────────────
   Sons
───────────────────────────────────────── */
  function playHoverSound() {
    try {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new AC();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(900, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.03);
      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.03);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    } catch {
      // Audio context not available
    }
  }

  function playClickSound() {
    try {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new AC();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // Audio context not available
    }
  }

  /* ─────────────────────────────────────────
   Ripple
───────────────────────────────────────── */
  interface RippleItem {
    id: number;
    x: number;
    y: number;
  }

  function RippleEffect({ ripples }: { ripples: RippleItem[] }) {
    return (
      <>
        {ripples.map((r) => (
          <motion.span
            key={r.id}
            className="absolute rounded-full bg-orange-400/20 pointer-events-none"
            style={{ left: r.x - 20, top: r.y - 20, width: 40, height: 40 }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 4, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        ))}
      </>
    );
  }

  /* ─────────────────────────────────────────
   Navbar
───────────────────────────────────────── */
  function Navbar() {
    const location = useLocation();
    const [ripples, setRipples] = useState<Record<string, RippleItem[]>>({});
    const [hoveredPath, setHoveredPath] = useState<string | null>(null);
    const rippleCounter = useRef(0);

    const menuItems: MenuItem[] = [
      { name: "ACCUEIL", path: "/", icon: Home, tooltip: "Accueil" },
      { name: "PROFIL", path: "/profil", icon: User, tooltip: "Profil" },
      { name: "PROJET", path: "/projets", icon: Briefcase, tooltip: "Projet" },
      {
        name: "GALERIE",
        path: "/galerie",
        icon: GalleryVerticalEnd,
        tooltip: "Galerie",
      },
      { name: "CONTACT", path: "/contact", icon: Send, tooltip: "Contact" },
    ];

    /* Ripple trigger */
    function handleClick(path: string, e: React.MouseEvent<HTMLAnchorElement>) {
      playClickSound();
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = ++rippleCounter.current;

      setRipples((prev) => ({
        ...prev,
        [path]: [...(prev[path] ?? []), { id, x, y }],
      }));

      setTimeout(() => {
        setRipples((prev) => ({
          ...prev,
          [path]: (prev[path] ?? []).filter((r) => r.id !== id),
        }));
      }, 600);
    }

    return (
      <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-[100]">
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="flex items-center gap-1 p-1.5 bg-white backdrop-blur-2xl border border-white rounded-full shadow-[0_8px_32px_rgba(200,100,30,0.12),0_2px_8px_rgba(0,0,0,0.04)] ring-1 "
        >
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                onMouseEnter={() => {
                  setHoveredPath(item.path);
                  if (!isActive) playHoverSound();
                }}
                onMouseLeave={() => setHoveredPath(null)}
                onClick={(e) => handleClick(item.path, e)}
                className="relative flex items-center gap-2 px-5 py-2.5 rounded-full transition-transform duration-150 active:scale-95 select-none outline-none focus-visible:ring-2 focus-visible:ring-orange-400/50"
              >
                {/* Hover pill */}
                <AnimatePresence>
                  {hoveredPath === item.path && !isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-black/[0.05]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    />
                  )}
                </AnimatePresence>

                {/* Active orange pill */}
                {isActive && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-orange-500"
                    style={{
                      boxShadow:
                        "0 4px 16px rgba(249,115,22,0.4), inset 0 1px 0 rgba(255,180,80,0.3)",
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 28,
                      mass: 0.8,
                    }}
                  />
                )}

                {/* Ripples */}
                <RippleEffect ripples={ripples[item.path] ?? []} />

                {/* Icon */}
                <motion.div
                  className="relative z-10 flex-shrink-0"
                  animate={{ scale: isActive ? 1.1 : 1 }}
                  whileHover={{ scale: 1.18 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <Icon
                    size={15}
                    strokeWidth={2.2}
                    className={`transition-colors duration-200 ${
                      isActive
                        ? "text-white"
                        : "text-slate-400 group-hover:text-slate-600"
                    }`}
                  />
                </motion.div>

                {/* Label */}
                <span
                  className={`relative z-10 text-[10px] font-black tracking-[0.18em] transition-colors duration-200 ${
                    isActive
                      ? "text-white"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {item.name}
                </span>

                {/* Tooltip */}
                <AnimatePresence>
                  {hoveredPath === item.path && (
                    <motion.div
                      className="absolute -top-9 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-md pointer-events-none whitespace-nowrap"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.15 }}
                    >
                      {item.tooltip}
                      {/* Arrow */}
                      <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black/80" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </motion.div>
      </nav>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden">
      <Navbar />
      <Lightbox item={lightbox} onClose={closeLightbox} />

      {/* Scroll progress */}
      <div
        className="fixed top-0 left-0 h-[2px] z-[100] transition-[width] duration-100"
        style={{
          width: `${scrollPct}%`,
          background: "linear-gradient(90deg, #6366f1, #ec4899)",
        }}
      />

      {/* Grain */}
      <div
        className="fixed inset-0 pointer-events-none z-[60] opacity-[0.033]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Nav */}
      <motion.nav
        className="sticky top-0 z-50 flex items-center justify-between px-8 py-5 bg-[#050505]"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="text-[15px] font-black tracking-[0.15em] uppercase">
          STUDIO<span className="text-indigo-500">.</span>
        </div>
      </motion.nav>

      {/* Hero */}
      <div className="relative flex flex-col items-center text-center px-8 pt-20 pb-12 overflow-hidden">
        {/* Background orb */}
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(99,102,241,0.14) 0%, transparent 65%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="overflow-hidden mb-2">
          <motion.h1
            className="font-black tracking-[-0.04em] leading-[0.88]"
            style={{
              fontSize: "clamp(48px, 9vw, 96px)",
              background:
                "linear-gradient(135deg,  #fae4b4 0%, #edad4d 70%, #ffae00 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ delay: 0.25, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            CRÉATIF
          </motion.h1>
        </div>
        <div className="overflow-hidden mb-6">
          <motion.h1
            className="font-black tracking-[-0.04em] leading-[0.88]"
            style={{
              fontSize: "clamp(48px, 9vw, 96px)",
              background:
                "linear-gradient(135deg,  #fae4b4 0%, #edad4d 70%, #ffae00 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ delay: 0.38, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            NUMÉRIQUE
          </motion.h1>
        </div>
      </div>

      {/* ═══ PINTEREST-STYLE MASONRY GALLERY ═══ */}
      <div className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="columns-2 md:columns-3 xl:columns-5 gap-4 space-y-4">
          {ITEMS.map((item, index) => (
            <div key={item.id} className="break-inside-avoid">
              <PinterestCard
                item={item}
                index={index}
                onOpen={openLightbox}
                play={play}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Counter */}
      <motion.p
        className="text-center text-[10px] font-bold tracking-[0.2em] uppercase text-white/25 pb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {ITEMS.length} projets · Portfolio 2024
      </motion.p>

      <style>{`
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        ::selection { background: #6366f1; color: #fff; }
      `}</style>
      <Footer />
    </div>
  );
}
