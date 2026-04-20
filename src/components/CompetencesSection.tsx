import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── SYSTÈME AUDIO (PRÉSERVÉ) ───
const playSound = (type: "hover" | "click" | "switch" = "click") => {
  try {
    const AudioContextClass =
      globalThis.AudioContext ||
      (globalThis as unknown as { webkitAudioContext: typeof AudioContext })
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
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
        break;
      case "click":
        osc.type = "triangle";
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
        break;
      case "switch":
        osc.type = "sine";
        osc.frequency.setValueAtTime(523, now);
        osc.frequency.exponentialRampToValueAtTime(1046, now + 0.15);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
        break;
    }
  } catch {
    console.log("Audio not supported");
  }
};

// ─── TYPES ───
interface TechNode {
  id: string;
  name: string;
  icon: React.ReactNode;
  x: number;
  y: number;
  color: string;
  connections?: string[];
}

interface SkillCategory {
  title: string;
  technologies: TechNode[];
}

interface SkillsData {
  informatique: SkillCategory;
  design: SkillCategory;
  professionnelle: SkillCategory;
}

type TabType = "informatique" | "design" | "professionnelle";

// ─── ICÔNES SVG PROFESSIONNELLES ───

const CodeIcon = () => (
  <svg
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
    className="w-4 h-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const DesignIcon = () => (
  <svg
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
    className="w-4 h-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
    />
  </svg>
);

const BriefcaseIcon = () => (
  <svg
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
    className="w-4 h-4"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const SqlIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
    <path d="M3 5V19A9 3 0 0 0 21 19V5"></path>
    <path d="M3 12A9 3 0 0 0 21 12"></path>
  </svg>
);

const MlIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"></path>
    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"></path>
  </svg>
);

const PowerBiIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="4" height="16" x="6" y="4"></rect>
    <rect width="4" height="8" x="14" y="12"></rect>
  </svg>
);

const GestionIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="8" height="4" x="8" y="2" rx="1" ry="1"></rect>
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
    <path d="M12 11h4"></path>
    <path d="M12 16h4"></path>
    <path d="M8 11h.01"></path>
    <path d="M8 16h.01"></path>
  </svg>
);

const CommIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"></path>
  </svg>
);

const LeadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
    <line x1="4" x2="4" y1="22" y2="15"></line>
  </svg>
);

const AgileIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
    <path d="M3 3v5h5"></path>
    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
    <path d="M16 21v-5h5"></path>
  </svg>
);

// ─── DONNÉES DES COMPÉTENCES ───
const skillsData: SkillsData = {
  informatique: {
    title: "WORKFLOW DU FRONT AU BACK À L'ANALYSE DE LA DONNÉES",
    technologies: [
      {
        id: "Figma",
        name: "Figma",
        icon: (
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg"
            alt="Figma"
            className="w-7 h-7"
          />
        ),
        x: 10,
        y: 6,
        color: "#F24E1E",
        connections: [],
      },

      {
        id: "VsCode",
        name: "VsCode",
        icon: (
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg"
            alt="VsCode"
            className="w-7 h-7"
          />
        ),
        x: 30,
        y: 15,
        color: "#61DAFB",
        connections: [],
      },

      {
        id: "Oracle",
        name: "Oracle",
        icon: (
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/oracle/oracle-original.svg"
            alt="Oracle"
            className="w-7 h-7"
          />
        ),
        x: 70,
        y: 0,
        color: "#61DAFB",
        connections: [],
      },

      {
        id: "UML",
        name: "UML",
        icon: (
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/d/d5/UML_logo.svg"
            alt="UML"
            className="w-7 h-7"
          />
        ),
        x: 45,
        y: 70,
        color: "#fbc061",
        connections: [],
      },

      {
        id: "react",
        name: "React",
        icon: (
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg"
            alt="React"
            className="w-7 h-7"
          />
        ),
        x: 10,
        y: 85,
        color: "#61DAFB",
        connections: ["next", "js", "firebase"],
      },
      {
        id: "next",
        name: "Next.js",
        icon: (
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg"
            alt="Next.js"
            className="w-7 h-7"
          />
        ),
        x: 30,
        y: 85,
        color: "#000000",
        connections: ["react", "node"],
      },
      {
        id: "js",
        name: "JavaScript",
        icon: (
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg"
            alt="JS"
            className="w-7 h-7"
          />
        ),
        x: 30,
        y: 65,
        color: "#F7DF1E",
        connections: ["react", "vue", "html"],
      },
      {
        id: "vue",
        name: "Vue.js",
        icon: (
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg"
            alt="Vue"
            className="w-7 h-7"
          />
        ),
        x: 30,
        y: 45,
        color: "#4FC08D",
        connections: ["js", "html"],
      },
      {
        id: "html",
        name: "HTML5",
        icon: (
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg"
            alt="HTML5"
            className="w-7 h-7"
          />
        ),
        x: 15,
        y: 50,
        color: "#E34F26",
        connections: ["js", "css"],
      },
      {
        id: "css",
        name: "CSS3",
        icon: (
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg"
            alt="CSS3"
            className="w-7 h-7"
          />
        ),
        x: 8,
        y: 65,
        color: "#1572B6",
        connections: ["html", "js"],
      },
      {
        id: "node",
        name: "Node.js",
        icon: (
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg"
            alt="Node"
            className="w-7 h-7"
          />
        ),
        x: 50,
        y: 50,
        color: "#339933",
        connections: ["next", "github"],
      },
      {
        id: "github",
        name: "GitHub",
        icon: (
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg"
            alt="GitHub"
            className="w-7 h-7"
          />
        ),
        x: 50,
        y: 30,
        color: "#181717",
        connections: ["node", "postman"],
      },
      {
        id: "postman",
        name: "Postman",
        icon: (
          <img
            src="https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg"
            alt="Postman"
            className="w-7 h-7"
          />
        ),
        x: 60,
        y: 20,
        color: "#FF6C37",
        connections: ["github", "sql"],
      },
      {
        id: "sql",
        name: "SQL",
        icon: <SqlIcon />,
        x: 60,
        y: 65,
        color: "#4479A1",
        connections: ["postman", "mysql", "firebase"],
      },
      {
        id: "mysql",
        name: "MySQL",
        icon: (
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg"
            alt="MySQL"
            className="w-7 h-7"
          />
        ),
        x: 75,
        y: 70,
        color: "#4479A1",
        connections: ["sql", "firebase"],
      },
      {
        id: "firebase",
        name: "Firebase",
        icon: (
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-original.svg"
            alt="Firebase"
            className="w-7 h-7"
          />
        ),
        x: 90,
        y: 85,
        color: "#FFCA28",
        connections: ["react", "sql", "python"],
      },
      {
        id: "python",
        name: "Python",
        icon: (
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg"
            alt="Python"
            className="w-7 h-7"
          />
        ),
        x: 85,
        y: 35,
        color: "#3776AB",
        connections: ["firebase", "ml"],
      },
      {
        id: "ml",
        name: "Machine Learning",
        icon: <MlIcon />,
        x: 75,
        y: 25,
        color: "#FF6F00",
        connections: ["python", "java"],
      },
      {
        id: "java",
        name: "Java",
        icon: (
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg"
            alt="Java"
            className="w-7 h-7"
          />
        ),
        x: 90,
        y: 15,
        color: "#007396",
        connections: ["ml"],
      },
      {
        id: "powerbi",
        name: "Power BI",
        icon: <PowerBiIcon />,
        x: 90,
        y: 50,
        color: "#F2C811",
        connections: ["sql", "python"],
      },
    ],
  },
  design: {
    title: "INFOGRAPHIE + MOTION + 3D",
    technologies: [
      {
        id: "figma",
        name: "Figma",
        icon: (
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg"
            alt="Figma"
            className="w-7 h-7"
          />
        ),
        x: 15,
        y: 40,
        color: "#F24E1E",
        connections: ["ae"],
      },
      {
        id: "ae",
        name: "After Effects",
        icon: (
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/aftereffects/aftereffects-original.svg"
            alt="After Effects"
            className="w-7 h-7"
          />
        ),
        x: 50,
        y: 55,
        color: "#9999FF",
        connections: ["figma", "blender"],
      },
      {
        id: "blender",
        name: "Blender",
        icon: (
          <img
            src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/blender/blender-original.svg"
            alt="Blender"
            className="w-7 h-7"
          />
        ),
        x: 85,
        y: 40,
        color: "#F5792A",
        connections: ["ae"],
      },
    ],
  },
  professionnelle: {
    title: "COMPÉTENCES PROFESSIONNELLES",
    technologies: [
      {
        id: "gestion",
        name: "Gestion de Projet",
        icon: <GestionIcon />,
        x: 20,
        y: 50,
        color: "#10B981",
        connections: ["comm", "lead"],
      },
      {
        id: "comm",
        name: "Communication",
        icon: <CommIcon />,
        x: 40,
        y: 30,
        color: "#3B82F6",
        connections: ["gestion"],
      },
      {
        id: "lead",
        name: "Leadership",
        icon: <LeadIcon />,
        x: 60,
        y: 50,
        color: "#F59E0B",
        connections: ["gestion", "agile"],
      },
      {
        id: "agile",
        name: "Méthodes Agiles",
        icon: <AgileIcon />,
        x: 80,
        y: 30,
        color: "#EF4444",
        connections: ["lead", "comm"],
      },
    ],
  },
};

// ─── COMPOSANT LIGNE DE CONNEXION ANIMÉE ───
interface ConnectionLineProps {
  start: { x: number; y: number };
  end: { x: number; y: number };
  color: string;
  delay?: number;
  isActive?: boolean;
}

const ConnectionLine = ({
  start,
  end,
  color,
  delay = 0,
  isActive = true,
}: ConnectionLineProps) => {
  const pathRef = useRef<SVGPathElement>(null);

  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2 - 10;

  const path = `M ${start.x}% ${start.y}% Q ${midX}% ${midY}% ${end.x}% ${end.y}%`;

  return (
    <motion.svg
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0.2 }}
      transition={{ duration: 0.5 }}
    >
      <defs>
        <linearGradient
          id={`grad-${start.x}-${end.x}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="50%" stopColor={color} stopOpacity="0.8" />
          <stop offset="100%" stopColor={color} stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <motion.path
        ref={pathRef}
        d={path}
        fill="none"
        stroke={`url(#grad-${start.x}-${end.x})`}
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{
          pathLength: isActive ? 1 : 0.3,
          opacity: isActive ? 1 : 0.3,
        }}
        transition={{
          pathLength: { duration: 1.5, delay, ease: "easeInOut" },
          opacity: { duration: 0.5 },
        }}
        style={{
          filter: isActive ? "drop-shadow(0 0 6px currentColor)" : "none",
        }}
      />
      {isActive && (
        <>
          <motion.circle
            cx={`${start.x}%`}
            cy={`${start.y}%`}
            r="4"
            fill={color}
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay }}
          />
          <motion.circle
            cx={`${end.x}%`}
            cy={`${end.y}%`}
            r="4"
            fill={color}
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: delay + 0.5 }}
          />
        </>
      )}
    </motion.svg>
  );
};

// ─── COMPOSANT TECHNOLOGIE NODE ───
interface TechNodeProps {
  tech: TechNode;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  delay?: number;
}

const TechNodeComponent = ({
  tech,
  isHovered,
  onHover,
  onLeave,
  delay = 0,
}: TechNodeProps) => {
  return (
    <motion.div
      className="absolute cursor-pointer z-20"
      style={{
        left: `${tech.x}%`,
        top: `${tech.y}%`,
        transform: "translate(-50%, -50%)",
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, type: "spring", stiffness: 200, damping: 15 }}
      whileHover={{ scale: 1.2, zIndex: 30 }}
      onMouseEnter={() => {
        onHover();
        playSound("hover");
      }}
      onMouseLeave={onLeave}
    >
      <motion.div
        className="relative flex flex-col items-center gap-2"
        animate={{
          y: isHovered ? [0, -5, 0] : 0,
        }}
        transition={{ duration: 0.5, repeat: isHovered ? Infinity : 0 }}
      >
        <motion.div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold shadow-lg backdrop-blur-sm border border-white/50"
          style={{
            backgroundColor: `${tech.color}20`,
            color: tech.color,
            boxShadow: isHovered
              ? `0 0 30px ${tech.color}50`
              : `0 4px 15px ${tech.color}30`,
          }}
          animate={{
            rotate: isHovered ? [0, -5, 5, 0] : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          <span className="flex items-center justify-center">{tech.icon}</span>
        </motion.div>

        <AnimatePresence>
          {isHovered && (
            <motion.span
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.8 }}
              className="absolute -bottom-8 whitespace-nowrap text-xs font-bold px-3 py-1 rounded-full bg-gray-900 text-white"
            >
              {tech.name}
            </motion.span>
          )}
        </AnimatePresence>

        {isHovered && (
          <motion.div
            className="absolute inset-0 rounded-2xl border-2"
            style={{ borderColor: tech.color }}
            initial={{ scale: 1, opacity: 1 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </motion.div>
    </motion.div>
  );
};

// ─── COMPOSANT PRINCIPAL SECTION COMPÉTENCES ───
const CompetencesSection = () => {
  const [activeTab, setActiveTab] = useState<TabType>("informatique");
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          playSound("switch");
        }
      },
      { threshold: 0.3 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const currentData = skillsData[activeTab];

  const activeConnections = hoveredTech
    ? currentData.technologies.find((t) => t.id === hoveredTech)?.connections ||
      []
    : [];

  const tabs: TabType[] = ["informatique", "design", "professionnelle"];

  const getTabIcon = (tab: TabType) => {
    switch (tab) {
      case "informatique":
        return <CodeIcon />;
      case "design":
        return <DesignIcon />;
      case "professionnelle":
        return <BriefcaseIcon />;
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full bg-[#fafafa] py-20 px-6 overflow-hidden text-center"
    >
      <motion.div
        className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full mb-8"
        style={{ background: "#e3fde0", border: "1.5px solid #69cf15" }}
        initial={{ opacity: 0, y: 22, scale: 0.88 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <span
          className="text-xs font-black tracking-widest uppercase"
          style={{ color: "#069536", letterSpacing: "0.15em" }}
        >
          Mes Compétences
        </span>
      </motion.div>
      <div className="max-w-4xl mx-auto mb-16">
        <motion.div
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 p-1.5 rounded-full bg-white shadow-lg border border-gray-100">
            {tabs.map((tab) => (
              <motion.button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setHoveredTech(null);
                  playSound("switch");
                }}
                className={`
                  relative px-5 py-1.5 rounded-full text-sm font-bold tracking-wide transition-all duration-300 flex items-center gap-2
                  ${
                    activeTab === tab
                      ? "bg-gray-900 text-white shadow-lg"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="flex items-center justify-center w-10 h-8">
                  {getTabIcon(tab)}
                </span>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}

                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gray-900 rounded-full -z-10"
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <AnimatePresence mode="wait">
            <motion.h2
              key={activeTab}
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
              transition={{ duration: 0.5 }}
              className="text-2xl md:text-3xl font-black text-gray-900 tracking-wider uppercase"
            >
              {currentData.title}
            </motion.h2>
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="relative max-w-6xl mx-auto h-[500px] md:h-[600px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            {currentData.technologies.map((tech, i) =>
              tech.connections?.map((connId, j) => {
                const target = currentData.technologies.find(
                  (t) => t.id === connId,
                );
                if (!target || tech.id > connId) return null;

                const isActive =
                  hoveredTech === tech.id ||
                  hoveredTech === connId ||
                  activeConnections.includes(tech.id) ||
                  activeConnections.includes(connId) ||
                  !hoveredTech;

                return (
                  <ConnectionLine
                    key={`${tech.id}-${connId}`}
                    start={{ x: tech.x, y: tech.y }}
                    end={{ x: target.x, y: target.y }}
                    color={
                      hoveredTech === tech.id || hoveredTech === connId
                        ? tech.color
                        : "#9CA3AF"
                    }
                    delay={i * 0.1 + j * 0.05}
                    isActive={isActive}
                  />
                );
              }),
            )}

            {currentData.technologies.map((tech, index) => (
              <TechNodeComponent
                key={tech.id}
                tech={tech}
                isHovered={hoveredTech === tech.id}
                onHover={() => setHoveredTech(tech.id)}
                onLeave={() => setHoveredTech(null)}
                delay={index * 0.08}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {tabs.map((tab) => (
          <motion.div
            key={tab}
            className={`h-2 rounded-full transition-all duration-300 ${
              activeTab === tab ? "bg-gray-900 w-8" : "bg-gray-300 w-2"
            }`}
            whileHover={{ scale: 1.2 }}
          />
        ))}
      </div>
    </section>
  );
};

export default CompetencesSection;
