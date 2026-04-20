import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";

// ─── SYSTÈME AUDIO (PRÉSERVÉ) ───
const playSound = (type: "hover" | "click" | "pulse" = "hover") => {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;
    switch (type) {
      case "hover":
        osc.type = "sine";
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
        break;
      case "click":
        osc.type = "triangle";
        osc.frequency.setValueAtTime(523, now);
        osc.frequency.exponentialRampToValueAtTime(1046, now + 0.15);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
        break;
      case "pulse":
        osc.type = "sine";
        osc.frequency.setValueAtTime(300, now);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
        break;
    }
  } catch {
    console.log("Audio not supported");
  }
};

// ─── DONNÉES ÉQUIPE ───
const teamData = {
  name: "GAMA LABS",
  founded: "2025",
  description: "Une start up axé sur le developpement de solutions innovantes",
  members: [
    {
      id: "uriel",
      name: "Dakaud Uriel",
      role: "UI/UX, Backend",
      color: "#F59E0B",
      bgColor: "#FEF3C7",
      x: 15,
      y: 45,
      connections: ["caleb", "backend"],
    },
    {
      id: "caleb",
      name: "Derouz Caleb",
      role: "IA",
      color: "#A855F7",
      bgColor: "#F3E8FF",
      x: 25,
      y: 75,
      connections: ["uriel", "yao"],
    },
    {
      id: "yao",
      name: "Assale Yao",
      role: "Frontend",
      color: "#10B981",
      bgColor: "#D1FAE5",
      x: 45,
      y: 65,
      connections: ["caleb", "kofi"],
    },
    {
      id: "kofi",
      name: "Baidoo Kofi",
      role: "Frontend",
      color: "#10B981",
      bgColor: "#D1FAE5",
      x: 55,
      y: 40,
      connections: ["yao"],
    },
    {
      id: "grace",
      name: "Grace Divine",
      role: "Backend",
      color: "#EC4899",
      bgColor: "#FCE7F3",
      x: 80,
      y: 35,
      connections: ["backend", "uriel"],
    },
    {
      id: "armel",
      name: "Ahoussi Armel",
      role: "Motion",
      color: "#3B82F6",
      bgColor: "#DBEAFE",
      x: 85,
      y: 70,
      connections: ["yao"],
    },
  ],
  skills: [
    {
      id: "backend",
      name: "Backend",
      color: "#FCA5A5",
      bgColor: "#FEE2E2",
      x: 45,
      y: 20,
    },
    {
      id: "frontend",
      name: "Frontend",
      color: "#6EE7B7",
      bgColor: "#D1FAE5",
      x: 42,
      y: 55,
    },
    {
      id: "ia",
      name: "IA",
      color: "#C4B5FD",
      bgColor: "#EDE9FE",
      x: 37,
      y: 85,
    },
    {
      id: "motion",
      name: "Motion",
      color: "#93C5FD",
      bgColor: "#DBEAFE",
      x: 65,
      y: 65,
    },
    {
      id: "uiux",
      name: "UI/UX",
      color: "#FCD34D",
      bgColor: "#FEF3C7",
      x: 12,
      y: 55,
    },
  ],
};

// ─── COMPOSANT LIGNE — flux de données continu ───
const LivingConnection = ({
  start,
  end,
  color,
  delay = 0,
  pulsePhase = 0,
}: {
  start: { x: number; y: number };
  end: { x: number; y: number };
  color: string;
  isActive: boolean;
  delay?: number;
  pulsePhase?: number;
}) => {
  const cpX = (start.x + end.x) / 2;
  const cpY = (start.y + end.y) / 2 - 10;
  const dotPath = `M ${start.x} ${start.y} Q ${cpX} ${cpY} ${end.x} ${end.y}`;
  const uid = `${start.x}-${start.y}-${end.x}-${end.y}`;
  const glowId = `glow-${uid}`;
  const pulseDur = 2.4 + pulsePhase * 0.4;
  const pulseDur2 = pulseDur + 0.8;

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <defs>
        <filter id={glowId} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="0.55" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d={dotPath}
        fill="none"
        stroke={color}
        strokeWidth="0.25"
        strokeOpacity="0.22"
        strokeDasharray="2 3"
      />
      <motion.circle
        r="0.65"
        fill={color}
        filter={`url(#${glowId})`}
        initial={{ offsetDistance: "0%" }}
        animate={{ offsetDistance: ["0%", "100%"] }}
        transition={{
          duration: pulseDur,
          delay,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ offsetPath: `path('${dotPath}')` } as React.CSSProperties}
      />
      <motion.circle
        r="0.35"
        fill={color}
        opacity={0.45}
        initial={{ offsetDistance: "0%" }}
        animate={{ offsetDistance: ["0%", "100%"] }}
        transition={{
          duration: pulseDur,
          delay: delay + 0.12,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ offsetPath: `path('${dotPath}')` } as React.CSSProperties}
      />
      <motion.circle
        r="0.55"
        fill={color}
        filter={`url(#${glowId})`}
        opacity={0.7}
        initial={{ offsetDistance: "0%" }}
        animate={{ offsetDistance: ["0%", "100%"] }}
        transition={{
          duration: pulseDur2,
          delay: delay + pulseDur * 0.5 + pulsePhase * 0.2,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ offsetPath: `path('${dotPath}')` } as React.CSSProperties}
      />
    </svg>
  );
};

// ─── COMPOSANT MEMBRE ÉQUIPE ───
const TeamNode = ({
  member,
  isHovered,
  onHover,
  onLeave,
  delay = 0,
}: {
  member: (typeof teamData.members)[0];
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  delay?: number;
}) => {
  const controls = useAnimation();

  useEffect(() => {
    if (isHovered) {
      controls.start({
        scale: [1, 1.1, 1],
        transition: { duration: 0.5, repeat: Infinity },
      });
      playSound("pulse");
    } else {
      controls.stop();
      controls.set({ scale: 1 });
    }
  }, [isHovered, controls]);

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{
        left: `${member.x}%`,
        top: `${member.y}%`,
        transform: "translate(-50%, -50%)",
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, type: "spring", stiffness: 200, damping: 20 }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <motion.div
        className="-bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap shadow-lg"
        style={{
          backgroundColor: member.bgColor,
          color: member.color,
          border: `1px solid ${member.color}30`,
        }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: delay + 0.2 }}
      >
        {member.role}
      </motion.div>
      <motion.div
        animate={controls}
        className="relative flex flex-col items-center gap-2"
      >
        <div className="relative">
          {isHovered && (
            <>
              <motion.div
                className="absolute inset-0 rounded-full border-2"
                style={{ borderColor: member.color }}
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <motion.div
                className="absolute inset-0 rounded-full border-2"
                style={{ borderColor: member.color }}
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 1.8, opacity: 0 }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
              />
            </>
          )}

          <motion.div
            className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-xl font-black shadow-xl relative z-10 overflow-hidden"
            style={{
              backgroundColor: member.color,
              boxShadow: isHovered
                ? `0 0 40px ${member.color}60, 0 10px 30px rgba(0,0,0,0.2)`
                : `0 4px 20px ${member.color}40`,
            }}
            whileHover={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-white text-lg md:text-xl">
              {member.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent"
              initial={{ x: "-100%", y: "-100%" }}
              animate={isHovered ? { x: "100%", y: "100%" } : {}}
              transition={{ duration: 0.6 }}
            />
          </motion.div>
        </div>
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.8 }}
              className="absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold whitespace-nowrap shadow-2xl"
            >
              {member.name}
              <motion.div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

// ─── COMPOSANT SKILL NODE ───
const SkillNode = ({
  skill,

  delay = 0,
}: {
  skill: (typeof teamData.skills)[0];
  isConnected: boolean;
  delay?: number;
}) => (
  <motion.div
    className="absolute"
    style={{
      left: `${skill.x}%`,
      top: `${skill.y}%`,
      transform: "translate(-50%, -50%)",
    }}
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ delay, type: "spring", stiffness: 300, damping: 20 }}
  ></motion.div>
);

// ─── SECTION PRINCIPALE (INCHANGÉE) ───
const GamaLabsSection = () => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          playSound("click");
        }
      },
      { threshold: 0.2 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const getActiveConnections = () => {
    if (!hoveredNode) return { nodes: [], lines: [] };
    const member = teamData.members.find((m) => m.id === hoveredNode);
    if (!member) return { nodes: [], lines: [] };
    return {
      nodes: [hoveredNode, ...(member.connections || [])],
      lines:
        member.connections?.map((conn, i) => ({
          from: hoveredNode,
          to: conn,
          phase: i * 0.3,
        })) || [],
    };
  };

  const activeConnections = getActiveConnections();

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full bg-[#fafafa] py-20 px-6 overflow-hidden text-center"
    >
      <motion.div
        className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full mb-8"
        style={{ background: "#fde0f3", border: "1.5px solid #cf15a7" }}
        initial={{ opacity: 0, y: 22, scale: 0.88 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <span
          className="text-xs font-black tracking-widest uppercase"
          style={{ color: "rgb(149, 6, 120)", letterSpacing: "0.15em" }}
        >
          Notre Startup
        </span>
      </motion.div>

      <div className="max-w-5xl mx-auto text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-4"
        >
          <motion.div
            className="inline-flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
          >
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-wider uppercase">
              {teamData.name}
            </h2>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-sm font-medium text-gray-500 tracking-wider"
        >
          Fondé en {teamData.founded}
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-lg text-gray-600 font-medium max-w-2xl mx-auto"
        >
          {teamData.description}
        </motion.p>
      </div>

      {/* ─── RÉSEAU ─── */}
      <div className="relative max-w-6xl mx-auto h-[500px] md:h-[600px]">
        {teamData.members.map((member, i) =>
          member.connections?.map((connId, j) => {
            if (
              member.id > connId &&
              teamData.members.find((m) => m.id === connId)
            )
              return null;
            const target =
              teamData.members.find((m) => m.id === connId) ||
              teamData.skills.find((s) => s.id === connId);
            if (!target) return null;
            const lineData = activeConnections.lines.find(
              (l) => l.from === member.id && l.to === connId,
            );
            return (
              <LivingConnection
                key={`${member.id}-${connId}`}
                start={{ x: member.x, y: member.y }}
                end={{ x: target.x, y: target.y }}
                color={member.color}
                isActive={false}
                delay={i * 0.15 + j * 0.1}
                pulsePhase={lineData?.phase || j * 0.5}
              />
            );
          }),
        )}

        {teamData.skills.map((skill, index) => (
          <SkillNode
            key={skill.id}
            skill={skill}
            isConnected={activeConnections.nodes.includes(skill.id)}
            delay={0.5 + index * 0.1}
          />
        ))}

        {teamData.members.map((member, index) => (
          <TeamNode
            key={member.id}
            member={member}
            isHovered={hoveredNode === member.id}
            onHover={() => {
              setHoveredNode(member.id);
              playSound("hover");
            }}
            onLeave={() => setHoveredNode(null)}
            delay={0.3 + index * 0.15}
          />
        ))}

        <AnimatePresence>
          {hoveredNode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-6 py-4 rounded-2xl shadow-2xl border border-gray-100 text-center"
            >
              <p className="text-sm text-gray-600">
                <span className="font-bold text-gray-900">
                  {teamData.members.find((m) => m.id === hoveredNode)?.name}
                </span>{" "}
                collabore avec{" "}
                <span
                  className="font-bold"
                  style={{
                    color: teamData.members.find((m) => m.id === hoveredNode)
                      ?.color,
                  }}
                >
                  {teamData.members
                    .find((m) => m.id === hoveredNode)
                    ?.connections?.map((c) => {
                      const mem = teamData.members.find((m) => m.id === c);
                      const skill = teamData.skills.find((s) => s.id === c);
                      return mem?.name || skill?.name;
                    })
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ═══════════════════════════════════════════
          GALERIE PINTEREST
      ═══════════════════════════════════════════ */}
      <PinterestGallery />
    </section>
  );
};

/* ─────────────────────────────────────────────────
   DONNÉES GALERIE
   Remplacez les `src` par vos vraies URLs d'images.
   Les hauteurs variées reproduisent le masonry Pinterest.
───────────────────────────────────────────────── */
interface GalleryPhoto {
  id: number;
  src: string;
  alt: string;
  label: string;
  tag: string;
  color: string; // couleur de la pastille tag
  height: number; // hauteur en px pour l'effet masonry
}

const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: 1,
    src: "https://res.cloudinary.com/dppzzrley/image/upload/v1776717678/t%C3%A9l%C3%A9chargement_46_qwmcxl.jpg",
    alt: "Équipe au travail",
    label: "Sprint planning",
    tag: "Team",
    color: "#F59E0B",
    height: 280,
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80",
    alt: "Code sur écran",
    label: "Code & Build",
    tag: "Dev",
    color: "#10B981",
    height: 200,
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80",
    alt: "Design UI",
    label: "Interface Design",
    tag: "UI/UX",
    color: "#A855F7",
    height: 340,
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=600&q=80",
    alt: "Intelligence artificielle",
    label: "IA & Data",
    tag: "IA",
    color: "#3B82F6",
    height: 220,
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
    alt: "Tableau de bord",
    label: "Dashboard Analytics",
    tag: "Data",
    color: "#EC4899",
    height: 260,
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80",
    alt: "Brainstorm",
    label: "Idéation & Stratégie",
    tag: "Strategy",
    color: "#F59E0B",
    height: 300,
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&q=80",
    alt: "Réunion équipe",
    label: "Demo Day",
    tag: "Team",
    color: "#10B981",
    height: 230,
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80",
    alt: "Espace de travail",
    label: "Our Lab",
    tag: "Culture",
    color: "#3B82F6",
    height: 310,
  },
];

/* ─── CARTE PHOTO individuelle ─── */
const PhotoCard: React.FC<{ photo: GalleryPhoto; delay: number }> = ({
  photo,
  delay,
}) => {
  const [hovered, setHovered] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.div
      className="relative w-full rounded-3xl overflow-hidden cursor-pointer group"
      style={{ height: photo.height }}
      initial={{ opacity: 0, y: 40, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{
        y: -6,
        scale: 1.02,
        transition: { type: "spring", stiffness: 320, damping: 22 },
      }}
      onMouseEnter={() => {
        setHovered(true);
        playSound("hover");
      }}
      onMouseLeave={() => setHovered(false)}
      onClick={() => playSound("click")}
    >
      {/* Skeleton pendant le chargement */}
      {!loaded && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-3xl" />
      )}

      {/* Image */}
      <img
        src={photo.src}
        alt={photo.alt}
        className="w-full h-full object-cover transition-transform duration-700 ease-out"
        style={{ transform: hovered ? "scale(1.08)" : "scale(1)" }}
        onLoad={() => setLoaded(true)}
      />

      {/* Overlay dégradé */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"
        animate={{ opacity: hovered ? 1 : 0.55 }}
        transition={{ duration: 0.3 }}
      />

      {/* Spotlight hover */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              background: `radial-gradient(circle at 50% 30%, ${photo.color}18 0%, transparent 70%)`,
            }}
          />
        )}
      </AnimatePresence>

      {/* Tag pastille */}
      <motion.div
        className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase backdrop-blur-md"
        style={{
          background: `${photo.color}22`,
          color: photo.color,
          border: `1px solid ${photo.color}44`,
        }}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: delay + 0.2 }}
      >
        {photo.tag}
      </motion.div>

      {/* Save btn style Pinterest */}
      <AnimatePresence>
        {hovered && (
          <motion.button
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
            onClick={(e) => {
              e.stopPropagation();
              playSound("click");
            }}
            aria-label="Sauvegarder"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Label bas */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <motion.p
          className="text-white text-sm font-black tracking-tight leading-tight"
          animate={{ y: hovered ? 0 : 4, opacity: hovered ? 1 : 0.85 }}
          transition={{ duration: 0.25 }}
        >
          {photo.label}
        </motion.p>
        <motion.p
          className="text-white/60 text-[10px] font-medium mt-0.5"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 6 }}
          transition={{ duration: 0.2 }}
        >
          GAMA LABS · {new Date().getFullYear()}
        </motion.p>
      </div>
    </motion.div>
  );
};

/* ─── GALERIE PINTEREST (masonry 4 colonnes) ─── */
const PinterestGallery: React.FC = () => {
  // Répartition en 4 colonnes identique à Pinterest
  const cols: GalleryPhoto[][] = [[], [], [], []];
  GALLERY_PHOTOS.forEach((p, i) => cols[i % 4].push(p));

  return (
    <div className="max-w-6xl mx-auto mt-24 px-2">
      {/* En-tête section */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="text-sm text-gray-500 font-medium mt-2 max-w-md mx-auto">
          Nos projets, notre culture, notre façon de construire le futur
        </p>
      </motion.div>

      {/* Masonry grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-start">
        {cols.map((col, ci) => (
          <div key={ci} className="flex flex-col gap-4">
            {col.map((photo, pi) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                delay={ci * 0.08 + pi * 0.12}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Bouton voir plus style Pinterest */}
      <motion.div
        className="flex justify-center mt-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.6 }}
      ></motion.div>
    </div>
  );
};

export default GamaLabsSection;
