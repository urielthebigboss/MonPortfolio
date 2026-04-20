import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
} from "framer-motion";

// ─── AUDIO ───────────────────────────────────────────────────────────────────
const playSound = (type: "hover" | "click" | "milestone" = "hover") => {
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    const t = ctx.currentTime;
    if (type === "hover") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(500, t);
      osc.frequency.exponentialRampToValueAtTime(700, t + 0.08);
      gain.gain.setValueAtTime(0.03, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
      osc.start(t);
      osc.stop(t + 0.1);
    } else if (type === "click") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(440, t);
      osc.frequency.exponentialRampToValueAtTime(880, t + 0.2);
      gain.gain.setValueAtTime(0.07, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      osc.start(t);
      osc.stop(t + 0.25);
    } else {
      osc.type = "sine";
      osc.frequency.setValueAtTime(300, t);
      osc.frequency.linearRampToValueAtTime(600, t + 0.3);
      gain.gain.setValueAtTime(0.05, t);
      gain.gain.linearRampToValueAtTime(0.001, t + 0.35);
      osc.start(t);
      osc.stop(t + 0.35);
    }
  } catch {
    /* noop */
  }
};

// ─── DATA ─────────────────────────────────────────────────────────────────────
const TIMELINE = [
  {
    id: "2025",
    year: "2025",
    title: "Fondation GAMA LABS",
    subtitle: "CEO & Lead Developer",
    description:
      "Lancement de ma startup tech axée sur l'innovation et les solutions digitales pour l'Afrique.",
    tag: "Startup",

    accent: "#F97316",
    light: "#FFF7ED",
    details: ["6 collaborateurs", "3 projets actifs", "Vision Africa Tech"],
  },
  {
    id: "2024",
    year: "2024",
    title: "Développeur Full Stack",
    subtitle: "Freelance & Projets Personnels",
    description:
      "Développement d'applications web et mobiles pour une clientèle internationale exigeante.",
    tag: "Expérience",
    accent: "#10B981",
    light: "#ECFDF5",
    details: ["React / Next.js", "Node.js", "UI/UX Design"],
  },
  {
    id: "2023",
    year: "2023",
    title: "Licence MIAGE",
    subtitle: "Université Polytechnique de Bingerville",
    description:
      "Formation en Méthodes Informatiques Appliquées à la Gestion des Entreprises.",
    tag: "Diplôme",

    accent: "#6366F1",
    light: "#EEF2FF",
    details: ["Spécialité Dev Web ", "Backend", "Gestion de projet"],
  },

  {
    id: "2022",
    year: "2022",
    title: "Baccalauréat Série D",
    subtitle: "ETABLISSEMENT D'APPLICATION JEAN PIAGET",
    description:
      "Obtention du bac scientifique avec spécialisation en mathématiques et sciences physiques.",
    tag: "Diplôme",
    accent: "#F59E0B",
    light: "#FFFBEB",
    details: ["Mathématiques"],
  },
];

// ─── 3D TILT CARD ─────────────────────────────────────────────────────────────
const TiltCard = ({
  item,
  index,
  isActive,
  onActivate,
}: {
  item: (typeof TIMELINE)[0];
  index: number;
  isActive: boolean;
  onActivate: () => void;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), {
    stiffness: 300,
    damping: 35,
  });
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), {
    stiffness: 300,
    damping: 35,
  });
  const glowX = useTransform(mx, [-0.5, 0.5], ["5%", "95%"]);
  const glowY = useTransform(my, [-0.5, 0.5], ["5%", "95%"]);
  const liftZ = useSpring(useMotionValue(0), { stiffness: 300, damping: 30 });

  const handleMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const r = cardRef.current.getBoundingClientRect();
      mx.set((e.clientX - r.left) / r.width - 0.5);
      my.set((e.clientY - r.top) / r.height - 0.5);
    },
    [mx, my],
  );

  const handleLeave = useCallback(() => {
    mx.set(0);
    my.set(0);
    liftZ.set(0);
  }, [mx, my, liftZ]);

  const handleEnter = useCallback(() => {
    onActivate();
    playSound("hover");
    liftZ.set(1);
  }, [onActivate, liftZ]);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onMouseEnter={handleEnter}
      style={{
        perspective: 1000,
        rotateX: rotX,
        rotateY: rotY,
        transformStyle: "preserve-3d",
      }}
      initial={{ opacity: 0, y: 70, filter: "blur(14px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{
        duration: 0.95,
        delay: index * 0.11,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="h-full"
    >
      {/* Colored shadow bloom */}
      <motion.div
        className="absolute inset-[-16px] rounded-3xl blur-3xl pointer-events-none"
        style={{ background: item.accent, zIndex: -1 }}
        animate={{ opacity: isActive ? 0.2 : 0, scale: isActive ? 1.06 : 0.9 }}
        transition={{ duration: 0.6 }}
      />

      {/* Card */}
      <motion.div
        className="relative rounded-3xl overflow-hidden cursor-pointer h-full flex flex-col"
        style={{
          background: "#ffffff",
          border: `1.5px solid ${isActive ? item.accent + "60" : "#E5E7EB"}`,
          boxShadow: isActive
            ? `0 32px 80px ${item.accent}28, 0 8px 24px ${item.accent}14, 0 2px 6px rgba(0,0,0,0.05)`
            : "0 4px 20px rgba(0,0,0,0.06)",
          transition: "box-shadow 0.5s ease, border-color 0.5s ease",
          transformStyle: "preserve-3d",
          minWidth: 320,
          maxWidth: 380,
        }}
        whileHover={{ y: -6 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Moving radial glow that follows cursor */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${glowX} ${glowY}, ${item.accent}14 0%, transparent 65%)`,
          }}
          animate={{ opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        />

        {/* Top accent line */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[3px]"
          style={{
            background: `linear-gradient(90deg, ${item.accent}, ${item.accent}55, transparent)`,
          }}
          initial={{ scaleX: 0, transformOrigin: "left" }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: index * 0.1 + 0.35 }}
        />

        {/* Content */}
        <div className="p-6 md:p-7 flex flex-col flex-1">
          {/* Row 1: icon + tag + year */}
          <div className="flex items-start justify-between gap-3 mb-5">
            <div className="flex items-center gap-3">
              <motion.div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 text-xl"
                style={{ background: item.light }}
                animate={{ rotate: isActive ? [0, -8, 8, -4, 0] : 0 }}
                transition={{ duration: 0.5 }}
              ></motion.div>
              <span
                className="text-[10px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full"
                style={{
                  background: item.light,
                  color: item.accent,
                  letterSpacing: "0.13em",
                }}
              >
                {item.tag}
              </span>
            </div>

            <motion.span
              className="shrink-0 text-xs font-black px-3 py-1.5 rounded-xl tabular-nums"
              style={{ fontFamily: "'DM Mono', monospace" }}
              animate={{
                background: isActive ? item.accent : "#F3F4F6",
                color: isActive ? "#fff" : "#9CA3AF",
              }}
              transition={{ duration: 0.35 }}
            >
              {item.year}
            </motion.span>
          </div>

          {/* Title */}
          <h3
            className="text-xl md:text-2xl font-black tracking-tight mb-1.5"
            style={{ color: "#0F172A", lineHeight: 1.2 }}
          >
            {item.title}
          </h3>

          {/* Subtitle */}
          <p
            className="text-[11px] font-black tracking-widest uppercase mb-4"
            style={{
              color: item.accent,
              opacity: 0.85,
              letterSpacing: "0.1em",
            }}
          >
            {item.subtitle}
          </p>

          {/* Description */}
          <p
            className="text-sm leading-relaxed mb-6 flex-1"
            style={{ color: "#6B7280" }}
          >
            {item.description}
          </p>

          {/* Detail chips */}
          <div className="flex flex-wrap gap-2 mb-6">
            {item.details.map((d, i) => (
              <motion.span
                key={d}
                className="text-xs px-3 py-1.5 rounded-full font-medium"
                style={{
                  background: "#F9FAFB",
                  color: "#374151",
                  border: "1px solid #E5E7EB",
                }}
                initial={{ opacity: 0, scale: 0.7, y: 8 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.08 + i * 0.08 + 0.25,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{
                  scale: 1.06,
                  backgroundColor: item.light,
                  color: item.accent,
                  borderColor: item.accent + "55",
                  transition: { duration: 0.2 },
                }}
              >
                {d}
              </motion.span>
            ))}
          </div>

          {/* Progress bar */}
          <div
            className="h-1 rounded-full overflow-hidden"
            style={{ background: "#F3F4F6" }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, ${item.accent}, ${item.accent}88)`,
              }}
              initial={{ width: "0%" }}
              animate={{ width: isActive ? "100%" : "18%" }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── HORIZONTAL TIMELINE NODE ────────────────────────────────────────────────────
const HorizontalNode = ({
  item,

  isActive,
}: {
  item: (typeof TIMELINE)[0];
  index: number;
  isActive: boolean;
  progress: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const nx = useMotionValue(0);
  const ny = useMotionValue(0);
  const sx = useSpring(nx, { stiffness: 350, damping: 28 });
  const sy = useSpring(ny, { stiffness: 350, damping: 28 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fn = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 90) {
        const pull = (1 - dist / 90) * 16;
        nx.set((dx / dist) * pull);
        ny.set((dy / dist) * pull);
      } else {
        nx.set(0);
        ny.set(0);
      }
    };
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, [nx, ny]);

  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy }}
      className="relative z-30 flex items-center justify-center"
    >
      {/* Fast pulse ring */}
      {isActive && (
        <motion.div
          className="absolute rounded-full border-2 pointer-events-none"
          style={{ borderColor: item.accent, width: 50, height: 50 }}
          initial={{ scale: 0.9, opacity: 1 }}
          animate={{ scale: 2.4, opacity: 0 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
        />
      )}
      {/* Slow orbit ring with orbiting dot */}
      {isActive && (
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 72,
            height: 72,
            border: `1.5px dashed ${item.accent}55`,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        >
          <motion.div
            className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full"
            style={{
              background: item.accent,
              boxShadow: `0 0 8px ${item.accent}`,
            }}
          />
        </motion.div>
      )}

      {/* Node */}
    </motion.div>
  );
};

// ─── HORIZONTAL SPINE ─────────────────────────────────────────────────────────
const HorizontalSpine = ({ progress }: { progress: number }) => (
  <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px]">
    {/* Background track */}
    <div
      className="absolute inset-0 rounded-full"
      style={{ background: "#E5E7EB" }}
    />
    {/* Filled portion */}
    <motion.div
      className="absolute top-0 bottom-0 left-0 rounded-full"
      style={{
        width: `${progress}%`,
        background:
          "linear-gradient(to right, #F97316 0%, #EC4899 50%, #6366F1 100%)",
        transition: "width 0.12s ease-out",
      }}
    >
      {/* Glowing tip */}
      <motion.div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full"
        style={{ background: "#6366F1", boxShadow: "0 0 16px #6366F1cc" }}
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </motion.div>
  </div>
);

// ─── CURSOR ORB ───────────────────────────────────────────────────────────────
const CursorOrb = ({
  sectionRef,
}: {
  sectionRef: React.RefObject<HTMLDivElement>;
}) => {
  const ox = useMotionValue(-400);
  const oy = useMotionValue(-400);
  const sx = useSpring(ox, { stiffness: 100, damping: 20 });
  const sy = useSpring(oy, { stiffness: 100, damping: 20 });
  const [color, setColor] = useState("#F97316");
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const move = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      ox.set(e.clientX - rect.left);
      oy.set(e.clientY - rect.top);
      const pct = (e.clientX - rect.left) / rect.width;
      if (pct < 0.2) setColor("#F97316");
      else if (pct < 0.4) setColor("#EC4899");
      else if (pct < 0.6) setColor("#6366F1");
      else if (pct < 0.8) setColor("#10B981");
      else setColor("#F59E0B");
    };
    el.addEventListener("mousemove", move);
    el.addEventListener("mouseenter", () => setShow(true));
    el.addEventListener("mouseleave", () => setShow(false));
    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseenter", () => setShow(true));
      el.removeEventListener("mouseleave", () => setShow(false));
    };
  }, [sectionRef, ox, oy]);

  return (
    <motion.div
      className="absolute z-0 rounded-full pointer-events-none hidden lg:block"
      style={{
        width: 500,
        height: 500,
        x: sx,
        y: sy,
        translateX: "-50%",
        translateY: "-50%",
        background: `radial-gradient(circle, ${color}09 0%, transparent 68%)`,
        opacity: show ? 1 : 0,
        transition: "background 0.6s ease, opacity 0.3s ease",
      }}
    />
  );
};

// ─── SCROLL INDICATOR ─────────────────────────────────────────────────────────

// ─── MAIN SECTION ─────────────────────────────────────────────────────────────
const MonParcoursSection = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { scrollXProgress } = useScroll({
    container: scrollContainerRef,
  });

  const smoothP = useSpring(scrollXProgress, { stiffness: 75, damping: 24 });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    return smoothP.on("change", (v) => {
      const p = Math.round(v * 100);
      setProgress(p);
      if (p % 25 === 0 && p > 0) playSound("milestone");
    });
  }, [smoothP]);

  // Parallax blobs
  const blobX1 = useTransform(scrollXProgress, [0, 1], ["-5%", "5%"]);
  const blobX2 = useTransform(scrollXProgress, [0, 1], ["5%", "-5%"]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ background: "#FAFAFA", minHeight: "100vh" }}
    >
      {/* Cursor orb */}
      <CursorOrb sectionRef={sectionRef as React.RefObject<HTMLDivElement>} />

      {/* Ambient blobs */}
      <motion.div
        style={{ x: blobX1 }}
        className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none opacity-60"
        aria-hidden
      >
        <div
          className="w-full h-full rounded-full"
          style={{ background: "#FEF3C7" }}
        />
      </motion.div>
      <motion.div
        style={{ x: blobX2 }}
        className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none opacity-50"
        aria-hidden
      >
        <div
          className="w-full h-full rounded-full"
          style={{ background: "#EDE9FE" }}
        />
      </motion.div>

      {/* ╔══════════════════╗
          ║     HEADER       ║
          ╚══════════════════╝ */}
      <div
        className="relative max-w-5xl mx-auto px-6 pt-24 pb-12 md:pt-32 md:pb-16 text-center"
        style={{ perspective: 1000 }}
      >
        {/* Eyebrow pill */}
        <motion.div
          className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full mb-8"
          style={{ background: "#FFF7ED", border: "1.5px solid #FED7AA" }}
          initial={{ opacity: 0, y: 22, scale: 0.88 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <span
            className="text-xs font-black tracking-widest uppercase"
            style={{ color: "#F97316", letterSpacing: "0.15em" }}
          >
            Mon Parcours
          </span>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className="text-base sm:text-lg max-w-lg mx-auto leading-relaxed"
          style={{ color: "#94A3B8" }}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          Une journey de passion, d'apprentissage et de création.{" "}
          <span style={{ color: "#64748B" }}>
            Chaque étape m'a façonné en le développeur que je suis aujourd'hui.
          </span>
        </motion.p>
      </div>

      {/* Divider */}
      <div
        className="max-w-4xl mx-auto px-6 mb-8"
        style={{
          height: 1,
          background:
            "linear-gradient(90deg, transparent, #E2E8F0 30%, #E2E8F0 70%, transparent)",
        }}
      />

      {/* ╔══════════════════╗
          ║  HORIZONTAL      ║
          ║    TIMELINE      ║
          ╚══════════════════╝ */}
      <div className="relative w-full pb-20 md:pb-28">
        {/* Horizontal scroll container */}
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto overflow-y-hidden scrollbar-hide"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <div className="relative min-w-max px-8 md:px-16 py-20">
            {/* Horizontal Spine */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 px-8 md:px-16">
              <HorizontalSpine progress={progress} />
            </div>

            {/* Cards Container - Bottom to Top layout */}
            <div
              className="relative flex items-end gap-8 md:gap-12"
              style={{ minWidth: "max-content" }}
            >
              {TIMELINE.map((item, index) => {
                // Alternating heights: even indices at bottom, odd indices higher
                const isBottom = index % 2 === 0;

                return (
                  <div
                    key={item.id}
                    className="relative flex flex-col items-center"
                    style={{
                      width: 340,
                      marginTop: isBottom ? 0 : -120, // Offset for alternating pattern
                    }}
                  >
                    {/* Connector line to spine */}
                    <motion.div
                      className="absolute left-1/2 -translate-x-1/2 w-px pointer-events-none"
                      style={{
                        top: isBottom ? "auto" : "100%",
                        bottom: isBottom ? "100%" : "auto",
                        height: 60,
                        background:
                          activeIndex === index ? item.accent : "#E2E8F0",
                        transition: "background 0.4s ease",
                      }}
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    />

                    {/* Node on spine */}
                    <div
                      className="absolute left-1/2 -translate-x-1/2 z-20"
                      style={{ top: "50%", marginTop: -24 }}
                    >
                      <HorizontalNode
                        item={item}
                        index={index}
                        isActive={activeIndex === index}
                        progress={progress}
                      />
                    </div>

                    {/* Card */}
                    <div className="relative z-10 pt-8 pb-8">
                      <TiltCard
                        item={item}
                        index={index}
                        isActive={activeIndex === index}
                        onActivate={() => setActiveIndex(index)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-sm"
          style={{ color: "#94A3B8" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <motion.span
            animate={{ x: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            →
          </motion.span>
          <span className="font-medium">Défiler pour explorer</span>
        </motion.div>
      </div>

      {/* ╔══════════════════╗
          ║      CTA         ║
          ╚══════════════════╝ */}
      <motion.div
        className="max-w-3xl mx-auto px-6 pb-24 md:pb-32"
        initial={{ opacity: 0, y: 64, filter: "blur(10px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className="relative rounded-3xl overflow-hidden text-center p-10 md:p-14"
          style={{
            background: "linear-gradient(140deg, #ffffff 0%, #ffffff 100%)",
          }}
        >
          {/* Corner glows */}
          <div
            className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl pointer-events-none"
            style={{ background: "#F9731625" }}
          />
          <div
            className="absolute bottom-0 left-0 w-72 h-72 rounded-full blur-3xl pointer-events-none"
            style={{ background: "#6366F125" }}
          />

          {/* Shimmer border */}
          <motion.div
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{
              border: "1px solid",
              borderColor: "rgba(0, 0, 0, 0.08)",
            }}
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 3.5, repeat: Infinity }}
          />

          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <span
              className="text-[10px] font-black tracking-widest uppercase"
              style={{ color: "#ffa600", letterSpacing: "0.18em" }}
            >
              Chapitre suivant
            </span>

            <h3
              className="text-3xl sm:text-4xl md:text-5xl font-black text-black tracking-tight mt-3 mb-5"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Et la suite ?
            </h3>
            <p
              className="text-sm sm:text-base max-w-md mx-auto leading-relaxed mb-10"
              style={{ color: "#000000" }}
            >
              Toujours en quête de nouveaux défis. Prêt à rejoindre une équipe
              ambitieuse ou à collaborer sur des projets innovants.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => playSound("click")}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-sm"
                style={{
                  background: "linear-gradient(135deg, #F97316, #EC4899)",
                  color: "#fff",
                  boxShadow: "0 14px 40px #F9731655",
                }}
              >
                Discutons de votre projet
                <motion.span
                  animate={{ x: [0, 6, 0] }}
                  transition={{ repeat: Infinity, duration: 1.3 }}
                >
                  →
                </motion.span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04, y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-bold text-sm"
                style={{
                  background: "transparent",
                  color: "#000000",
                  border: "1.5px solid rgba(0, 0, 0, 0.12)",
                }}
                onClick={() => playSound("hover")}
              >
                Voir mes projets
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default MonParcoursSection;
