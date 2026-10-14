import type { JSX } from "react";
import { motion } from "framer-motion";
import type { DomainId } from "../../types/content";
import { useMotionOK } from "../../lib/hooks";
import { ease } from "../../lib/motion";

/*
 * Visuels conceptuels (et non des captures de projets) : chaque
 * discipline est résumée par une forme animée en SVG, légère et
 * nette sur tous les écrans. Trait = papier, accent = bleu signal.
 */

const stroke = "rgb(var(--c-paper) / 0.55)";
const faint = "rgb(var(--c-paper) / 0.14)";
const signal = "rgb(var(--c-signal))";

function draw(motionOK: boolean, delay = 0, duration = 1.1) {
  return motionOK
    ? {
        initial: { pathLength: 0, opacity: 0 },
        animate: { pathLength: 1, opacity: 1 },
        transition: { duration, ease: ease.out, delay },
      }
    : {};
}

/** Logiciel : fenêtres d'interface empilées en perspective. */
function Software({ m }: { m: boolean }) {
  return (
    <g>
      {[0, 1, 2].map((i) => (
        <motion.g
          key={i}
          initial={m ? { opacity: 0, x: -20, y: 20 } : false}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.9, ease: ease.out, delay: i * 0.12 }}
        >
          <g transform={`translate(${70 + i * 46} ${150 - i * 38}) skewY(-12)`}>
            <rect width="200" height="130" rx="10" fill="rgb(var(--c-ink-2))" stroke={i === 2 ? stroke : faint} />
            <rect x="12" y="12" width="40" height="5" rx="2.5" fill={i === 2 ? signal : faint} />
            <rect x="12" y="34" width="120" height="6" rx="3" fill={faint} />
            <rect x="12" y="48" width="90" height="6" rx="3" fill={faint} />
            <rect x="12" y="78" width="80" height="38" rx="6" fill="none" stroke={faint} />
            <rect x="104" y="78" width="84" height="38" rx="6" fill={i === 2 ? "rgb(var(--c-signal) / 0.25)" : "none"} stroke={faint} />
          </g>
        </motion.g>
      ))}
    </g>
  );
}

/** Data & IA : un nuage de points qui révèle une tendance. */
function Data({ m }: { m: boolean }) {
  const pts = Array.from({ length: 34 }, (_, i) => {
    const x = 50 + i * 9.5;
    const base = 250 - i * 5.2;
    const jitter = Math.sin(i * 12.9898) * 38;
    return { x, y: base + jitter };
  });
  return (
    <g>
      <line x1="40" y1="290" x2="380" y2="290" stroke={faint} />
      <line x1="40" y1="40" x2="40" y2="290" stroke={faint} />
      {pts.map((p, i) => (
        <motion.circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="3.2"
          fill={stroke}
          initial={m ? { opacity: 0, scale: 0 } : false}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.02 * i }}
        />
      ))}
      <motion.path d="M 50 255 C 160 200, 260 140, 370 78" fill="none" stroke={signal} strokeWidth="2.5" {...draw(m, 0.7, 1.2)} />
      <motion.circle cx="370" cy="78" r="6" fill={signal} initial={m ? { scale: 0 } : false} animate={{ scale: 1 }} transition={{ delay: 1.7 }} />
    </g>
  );
}

/** IoT & AgriTech : rangs de culture, capteurs et passerelle. */
function Iot({ m }: { m: boolean }) {
  const sensors = [
    [90, 230],
    [170, 250],
    [250, 225],
    [130, 175],
    [230, 165],
  ];
  return (
    <g>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <motion.path
          key={i}
          d={`M ${20 + i * 18} ${300 - i * 2} Q 200 ${150 + i * 22} ${380 - i * 18} ${300 - i * 2}`}
          fill="none"
          stroke={faint}
          {...draw(m, i * 0.06, 1)}
        />
      ))}
      <rect x="300" y="60" width="44" height="44" rx="10" fill="rgb(var(--c-ink-2))" stroke={stroke} />
      <path d="M 314 82 h 16 M 322 74 v 16" stroke={signal} strokeWidth="2" />
      {sensors.map(([x, y], i) => (
        <g key={i}>
          <motion.path d={`M ${x} ${y} L 322 104`} stroke="rgb(var(--c-signal) / 0.5)" strokeDasharray="3 5" fill="none" {...draw(m, 0.5 + i * 0.1, 0.8)} />
          <circle cx={x} cy={y} r="5" fill={signal} />
          {m && (
            <motion.circle
              cx={x}
              cy={y}
              r="5"
              fill="none"
              stroke={signal}
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: 3.4, opacity: 0 }}
              transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.4, ease: "easeOut" }}
              style={{ transformOrigin: `${x}px ${y}px` }}
            />
          )}
        </g>
      ))}
    </g>
  );
}

/** Design & Motion : courbe de Bézier, poignées et images-clés. */
function Creative({ m }: { m: boolean }) {
  return (
    <g>
      <motion.path d="M 50 250 C 150 250, 170 70, 360 70" fill="none" stroke={signal} strokeWidth="2.5" {...draw(m, 0.1, 1.2)} />
      <line x1="50" y1="250" x2="150" y2="250" stroke={stroke} />
      <line x1="360" y1="70" x2="170" y2="70" stroke={stroke} />
      <circle cx="150" cy="250" r="6" fill="rgb(var(--c-ink))" stroke={stroke} />
      <circle cx="170" cy="70" r="6" fill="rgb(var(--c-ink))" stroke={stroke} />
      <rect x="44" y="244" width="12" height="12" fill={stroke} />
      <rect x="354" y="64" width="12" height="12" fill={stroke} />
      <line x1="40" y1="300" x2="380" y2="300" stroke={faint} />
      {[60, 140, 230, 330].map((x, i) => (
        <motion.rect
          key={x}
          x={x - 6}
          y={294}
          width="12"
          height="12"
          transform={`rotate(45 ${x} 300)`}
          fill={i === 1 ? signal : stroke}
          initial={m ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 + i * 0.12 }}
        />
      ))}
      {m && (
        <motion.circle
          r="7"
          fill="rgb(var(--c-paper))"
          initial={{ offsetDistance: "0%" }}
          animate={{ offsetDistance: "100%" }}
          transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 0.6, ease: [0.76, 0, 0.24, 1] }}
          style={{ offsetPath: "path('M 50 250 C 150 250, 170 70, 360 70')" }}
        />
      )}
    </g>
  );
}

/** 3D : volume isométrique d'un bâtiment, plans en fil de fer. */
function Spatial({ m }: { m: boolean }) {
  const iso = (x: number, y: number, z: number) => {
    const px = 210 + (x - y) * 0.866;
    const py = 230 + (x + y) * 0.5 - z;
    return `${px},${py}`;
  };
  const box = (w: number, d: number, h: number, ox = 0, oy = 0) => {
    const p = (x: number, y: number, z: number) => iso(x + ox, y + oy, z);
    return {
      top: `M ${p(0, 0, h)} L ${p(w, 0, h)} L ${p(w, d, h)} L ${p(0, d, h)} Z`,
      left: `M ${p(0, d, 0)} L ${p(w, d, 0)} L ${p(w, d, h)} L ${p(0, d, h)} Z`,
      right: `M ${p(w, 0, 0)} L ${p(w, d, 0)} L ${p(w, d, h)} L ${p(w, 0, h)} Z`,
    };
  };
  const a = box(110, 90, 120, -60, -40);
  const b = box(60, 60, 70, 60, -10);
  const floors = [30, 60, 90];
  return (
    <g>
      <motion.path d={`M ${iso(-140, -100, 0)} L ${iso(160, -100, 0)} L ${iso(160, 130, 0)} L ${iso(-140, 130, 0)} Z`} fill="none" stroke={faint} {...draw(m, 0, 0.9)} />
      {[a, b].map((s, i) => (
        <motion.g key={i} initial={m ? { opacity: 0, y: 30 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: ease.out, delay: 0.25 + i * 0.15 }}>
          <path d={s.left} fill="rgb(var(--c-ink-2))" stroke={stroke} />
          <path d={s.right} fill="rgb(var(--c-ink))" stroke={stroke} />
          <path d={s.top} fill={i === 0 ? "rgb(var(--c-signal) / 0.3)" : "rgb(var(--c-ink-2))"} stroke={i === 0 ? signal : stroke} />
        </motion.g>
      ))}
      {floors.map((z, i) => (
        <motion.path
          key={z}
          d={`M ${iso(-60, 50, z)} L ${iso(50, 50, z)} L ${iso(50, -40, z)}`}
          fill="none"
          stroke={faint}
          {...draw(m, 0.8 + i * 0.1, 0.6)}
        />
      ))}
    </g>
  );
}

const visuals: Record<DomainId, (p: { m: boolean }) => JSX.Element> = {
  software: Software,
  data: Data,
  iot: Iot,
  creative: Creative,
  spatial: Spatial,
};

export function DomainVisual({ id, className = "" }: { id: DomainId; className?: string }) {
  const m = useMotionOK();
  const Visual = visuals[id];
  return (
    <svg viewBox="0 0 420 340" className={className} role="img" aria-label="Illustration conceptuelle du domaine">
      <Visual m={m} />
    </svg>
  );
}
