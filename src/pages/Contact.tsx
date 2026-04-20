import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Send } from "lucide-react";
import Footer from "../components/Footer";

/* ═══════════════════════════════════════════════════
   SYSTÈME AUDIO (PRÉSERVÉ À L'IDENTIQUE)
═══════════════════════════════════════════════════ */
const playSound = (
  type: "hover" | "click" | "enter" | "success" | "type" = "click",
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
        filter.frequency.setValueAtTime(600, now);
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
        break;
      case "click":
        osc.type = "triangle";
        filter.type = "highpass";
        filter.frequency.setValueAtTime(300, now);
        osc.frequency.setValueAtTime(523, now);
        osc.frequency.exponentialRampToValueAtTime(1046, now + 0.15);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
        break;
      case "enter":
        [329.63, 392.0, 523.25, 659.25].forEach((freq, i) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.connect(g);
          g.connect(ctx.destination);
          o.type = "sine";
          o.frequency.setValueAtTime(freq, now + i * 0.08);
          g.gain.setValueAtTime(0, now + i * 0.08);
          g.gain.linearRampToValueAtTime(0.06, now + i * 0.08 + 0.05);
          g.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
          o.start(now + i * 0.08);
          o.stop(now + 0.8);
        });
        break;
      case "success":
        osc.type = "sine";
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.3);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
        break;
      case "type":
        osc.type = "sine";
        osc.frequency.setValueAtTime(800 + Math.random() * 400, now);
        gain.gain.setValueAtTime(0.02, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
        break;
    }
  } catch {
    /* audio non supporté */
  }
};

/* ═══════════════════════════════════════════════════
   SOCIAL NETWORKS (CODE ORIGINAL INCHANGÉ)
═══════════════════════════════════════════════════ */
const socialNetworks = [
  {
    name: "LinkedIn",
    iconUrl: "https://img.icons8.com/?size=100&id=8808&format=png&color=000000",
    color: "#0077B5",
    link: "https://linkedin.com/in/dakaud",
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
    link: "https://instagram.com/dakaud",
  },
  {
    name: "TikTok",
    iconUrl:
      "https://img.icons8.com/?size=100&id=118638&format=png&color=000000",
    color: "#000000",
    link: "https://tiktok.com/@dakaud",
  },
  {
    name: "Mail",
    iconUrl:
      "https://img.icons8.com/?size=100&id=Y2GfpkgYNp42&format=png&color=000000",
    color: "#EA4335",
    link: "mailto:hello@dak-aud.dev",
  },

  {
    name: "Github",
    iconUrl:
      "https://img.icons8.com/?size=100&id=12599&format=png&color=000000",
    color: "#EA4335",
    link: "mailto:hello@dak-aud.dev",
  },
];

const inputClasses =
  "w-full bg-white/40 border border-white/60 backdrop-blur-md rounded-2xl px-6 py-5 text-lg outline-none transition-all focus:bg-white focus:border-orange-500/50 focus:shadow-[0_0_40px_rgba(255,126,51,0.15)] placeholder:text-slate-400";

/* ═══════════════════════════════════════════════════
   BULLE FLOTTANTE — fidèle au screenshot
═══════════════════════════════════════════════════ */
interface BubbleProps {
  name: string;
  message: string;
  initials: string;
  style: React.CSSProperties;
  delay: number;
  /** Direction de la petite flèche pointante */
  arrowDir?: "top-right" | "bottom-left" | "bottom-right";
  floatY?: number[];
  floatX?: number[];
}

const FloatingBubble: React.FC<BubbleProps> = ({
  name,
  message,
  initials,
  style,
  delay,
  arrowDir = "bottom-left",
  floatY = [0, -10, 0],
  floatX = [0, 0, 0],
}) => {
  const arrowStyles: Record<string, React.CSSProperties> = {
    "top-right": {
      bottom: "-8px",
      right: "18px",
      borderLeft: "8px solid transparent",
      borderRight: "8px solid transparent",
      borderTop: "10px solid #111827",
    },
    "bottom-left": {
      bottom: "-8px",
      left: "22px",
      borderLeft: "8px solid transparent",
      borderRight: "8px solid transparent",
      borderTop: "10px solid #111827",
    },
    "bottom-right": {
      bottom: "-8px",
      right: "22px",
      borderLeft: "8px solid transparent",
      borderRight: "8px solid transparent",
      borderTop: "10px solid #111827",
    },
  };

  return (
    <motion.div
      className="absolute z-20 pointer-events-none select-none"
      style={style}
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: floatY,
        x: floatX,
      }}
      transition={{
        opacity: { delay, duration: 0.5, ease: "easeOut" },
        scale: {
          delay,
          duration: 0.5,
          type: "spring",
          stiffness: 220,
          damping: 18,
        },
        y: {
          duration: 3.5 + delay * 0.4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay + 0.5,
        },
        x: {
          duration: 4 + delay * 0.3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay + 0.3,
        },
      }}
    >
      <div className="relative flex items-center gap-2.5 bg-black text-white pl-1.5 pr-4 py-1.5 rounded-full shadow-2xl whitespace-nowrap">
        {/* Avatar cercle */}
        <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-[10px] font-black text-white flex-shrink-0">
          {initials}
        </div>
        <div>
          <p className="text-[11px] font-white leading-tight">{name}</p>
          <p className="text-[10px] text-white font-medium leading-tight">
            {message}
          </p>
        </div>
        {/* Flèche pointante */}
        <div className="absolute w-0 h-0" style={arrowStyles[arrowDir]} />
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════════
   HERO SECTION — retranscription exacte du screenshot
═══════════════════════════════════════════════════ */
const HeroSection: React.FC<{ onContactClick: () => void }> = ({
  onContactClick,
}) => {
  const navigate = useNavigate();
  console.log("navigate function:", navigate); // Debug log
  console.log("onContactClick function:", onContactClick); // Debug log
  const heroRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const rect = heroRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseX.set((e.clientX - rect.left) / rect.width);
      mouseY.set((e.clientY - rect.top) / rect.height);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  /* Orbes qui suivent légèrement la souris */

  return (
    <div
      ref={heroRef}
      className=" h-200 min-h-screen bg-white flex flex-col items-center justify-center overflow-hidden"
    >
      {/* ── ORB ORANGE (bas-gauche) ── */}
      <motion.div
        className="absolute pointer-events-none rounded-full"
        style={{
          width: "55vw",
          height: "55vw",
          maxWidth: 700,
          maxHeight: 700,
          bottom: "-10%",
          left: "-8%",

          x: useSpring(
            /* légère parallax opposée */ {
              stiffness: 25,
              damping: 18,
            } as never,
            { stiffness: 25, damping: 18 },
          ),
        }}
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ── ORB VIOLET (centre-droite) ── */}
      <motion.div
        className="absolute pointer-events-none rounded-full"
        style={{
          width: "60vw",
          height: "60vw",
          maxWidth: 780,
          maxHeight: 780,
          top: "-15%",
          right: "-12%",
          background:
            "radial-gradient(circle, rgba(200,150,255,0.45) 0%, rgba(180,120,255,0.2) 50%, transparent 42%)",
          filter: "blur(50px)",
        }}
        animate={{ scale: [1.05, 1, 1.05], x: [0, -15, 0], y: [0, -15, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ── BULLES FLOTTANTES (3 comme sur le screenshot) ── */}
      {/* Top-right */}
      <FloatingBubble
        name="Dakaud uriel"
        message="Good Job ! Amazing !"
        initials="DU"
        delay={0.6}
        arrowDir="bottom-right"
        floatY={[0, -12, 0]}
        floatX={[0, 6, 0]}
        style={{ top: "18%", right: "7%" }}
      />
      {/* Bottom-left */}
      <FloatingBubble
        name="Dakaud uriel"
        message="Good Job ! Amazing !"
        initials="DU"
        delay={1.0}
        arrowDir="bottom-left"
        floatY={[0, -8, 0]}
        floatX={[0, -5, 0]}
        style={{ bottom: "28%", left: "4%" }}
      />
      {/* Bottom-right */}
      <FloatingBubble
        name="Dakaud uriel"
        message="Good Job ! Amazing !"
        initials="DU"
        delay={1.4}
        arrowDir="bottom-right"
        floatY={[0, -10, 0]}
        floatX={[0, 8, 0]}
        style={{ bottom: "18%", right: "10%" }}
      />

      {/* ── CONTENU CENTRÉ ── */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto">
        {/* Titre principal — typographie massive fidèle au screenshot */}
        <div className="overflow-hidden mb-2">
          <motion.h1
            className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 leading-[0.95] leading-[0.88] tracking-tighter"
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <h3>Restez connectés</h3>
          </motion.h1>
        </div>

        {/* Sous-titre — uppercase compact fidèle au screenshot */}
        <motion.p
          className="text-[11px] font-black tracking-[0.28em] uppercase mb-12 mt-5"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.6, ease: "easeOut" }}
        >
          Pour tous les projets relatives à la tech et l'entrepreneuriat
        </motion.p>

        {/* Boutons — layout exactement comme le screenshot */}
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.6, ease: "easeOut" }}
        ></motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
      >
        <motion.div
          className="w-[1px] h-10 bg-gradient-to-b from-gray-400 to-transparent"
          animate={{ scaleY: [0, 1, 0], y: [0, 8, 16] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <span className="text-[9px] font-bold tracking-[0.3em] uppercase text-gray-400">
          Scroll
        </span>
      </motion.div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   SECTION FORMULAIRE — code original inchangé
   (PremiumFluidContactPage, sans la div wrapper externe)
═══════════════════════════════════════════════════ */
const ContactFormSection: React.FC = () => {
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    playSound("click");
    await new Promise((r) => setTimeout(r, 2200));
    setIsSubmitting(false);
    setIsSuccess(true);
    playSound("success");
    setTimeout(() => setIsSuccess(false), 4000);
  };

  return (
    <div className="relative min-h-screen bg-white flex items-center justify-center p-6 overflow-hidden">
      {/* ── BACKDROP (code original) ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div
          animate={{
            scale: focusedField ? 1.2 : 1,
            opacity: focusedField ? 0.5 : 0.22,
          }}
          transition={{ duration: 0.6 }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-300 rounded-full blur-[120px]"
        />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-200 rounded-full blur-[120px] opacity-15" />
      </div>

      {/* ── CARTE PRINCIPALE (code original) ── */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-6xl grid lg:grid-cols-12 gap-12 bg-white/20 p-4 rounded-[3rem] border border-white/40 backdrop-blur-2xl shadow-2xl"
      >
        {/* ── LEFT (code original) ── */}
        <div className="lg:col-span-6 p-10 flex flex-col justify-between space-y-16">
          <div>
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 280, damping: 18 }}
              className="px-4 py-1.5 bg-orange-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full"
            >
              Contact
            </motion.span>
            <h2 className="text-5xl font-black mt-8 leading-[1.1] text-slate-900 tracking-tight">
              Parlons de votre <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
                prochain projet.
              </span>
            </h2>
            <p className="mt-6 text-slate-500 text-lg font-medium leading-relaxed max-w-md">
              Une idée à Abidjan ou ailleurs ? Je réponds généralement en moins
              de 2h.
            </p>
          </div>

          {/* Réseaux sociaux (code original) */}
          <div className="space-y-6">
            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">
              Retrouvez-moi sur
            </h4>
            <div className="grid grid-cols-5 gap-4">
              {socialNetworks.map((net, i) => (
                <motion.a
                  key={net.name}
                  href={net.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative aspect-square rounded-3xl flex items-center justify-center p-4 transition-all duration-300 hover:shadow-xl"
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: i * 0.08,
                    type: "spring",
                    stiffness: 220,
                    damping: 18,
                  }}
                  whileHover={{
                    y: -10,
                    scale: 1.05,
                    borderColor: `${net.color}30`,
                  }}
                  onMouseEnter={() => playSound("hover")}
                  onClick={() => playSound("click")}
                >
                  <div className="absolute inset-0 rounded-3xl transition-opacity opacity-0 group-hover:opacity-100 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.1)]" />
                  <motion.img
                    src={net.iconUrl}
                    alt={net.name}
                    className="w-full h-full object-contain relative z-10"
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT : FORMULAIRE (code original) ── */}
        <div className="lg:col-span-6 bg-white/60 rounded-[2.5rem] p-12">
          <form className="space-y-5">
            {["Nom Complet", "Email"].map((label) => (
              <motion.div
                key={label}
                animate={{
                  opacity: focusedField && focusedField !== label ? 0.5 : 1,
                  scale: focusedField === label ? 1.01 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                <input
                  type="text"
                  placeholder={label}
                  className={inputClasses}
                  onFocus={() => {
                    setFocusedField(label);
                    playSound("hover");
                  }}
                  onBlur={() => setFocusedField(null)}
                  onChange={() => playSound("type")}
                />
              </motion.div>
            ))}

            <motion.div
              animate={{
                opacity: focusedField && focusedField !== "Message" ? 0.5 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              <textarea
                rows={5}
                placeholder="Votre Message..."
                className={`${inputClasses} resize-none`}
                onFocus={() => {
                  setFocusedField("Message");
                  playSound("hover");
                }}
                onBlur={() => setFocusedField(null)}
                onChange={() => playSound("type")}
              />
            </motion.div>

            <motion.button
              disabled={isSubmitting}
              whileHover={{
                scale: 1.02,
                boxShadow: "0 20px 40px -10px rgba(255, 255, 255, 0.4)",
              }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              onMouseEnter={() => playSound("hover")}
              className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg transition-all relative overflow-hidden group disabled:opacity-70"
            >
              {/* Shimmer */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.55 }}
              />
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.span
                    key="success"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className="flex items-center justify-center gap-2 text-green-400"
                  >
                    ✓ Message envoyé !
                  </motion.span>
                ) : !isSubmitting ? (
                  <motion.span
                    key="text"
                    exit={{ y: -20, opacity: 0 }}
                    className="flex items-center justify-center gap-2 relative z-10"
                  >
                    Envoyer{" "}
                    <span className="group-hover:translate-x-1 transition-transform inline-block">
                      <Send size={18} />
                    </span>
                  </motion.span>
                ) : (
                  <motion.div
                    key="loader"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="flex justify-center items-center gap-2"
                  >
                    <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce" />
                    <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce [animation-delay:0.4s]" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </form>

          {/* Toast succès */}
          <AnimatePresence>
            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ type: "spring", stiffness: 280, damping: 20 }}
                className="mt-5 p-4 bg-green-50 border border-green-200 rounded-2xl text-center"
              >
                <p className="text-green-700 font-bold text-sm">
                  🎉 Message reçu ! Réponse sous 2h.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   EXPORT PRINCIPAL — page complète unifiée
═══════════════════════════════════════════════════ */
export default function PremiumFluidContactPage() {
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    playSound("enter");
  }, []);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="bg-white selection:bg-orange-100 font-sans">
      <Navbar />

      {/* ── SECTION 1 : HERO (design du screenshot) ── */}
      <HeroSection onContactClick={scrollToForm} />

      {/* ── SECTION 2 : FORMULAIRE (code original) ── */}
      <div ref={formRef}>
        <ContactFormSection />
        <Footer />
      </div>
    </div>
  );
}
