import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Home, User, Briefcase, Send, GalleryVerticalEnd } from "lucide-react";

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
export default function Navbar() {
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
        className="flex items-center gap-1 p-1.5 bg-white/40 backdrop-blur-2xl border border-white/60 rounded-full shadow-[0_8px_32px_rgba(200,100,30,0.12),0_2px_8px_rgba(0,0,0,0.04)] ring-1 ring-black/5"
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
