import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Hand } from "lucide-react";
import { skillPanels, type SkillCard, type SkillPanel } from "../../data/skills";
import { techLogo } from "../../lib/techLogos";
import { useMediaQuery, useMotionOK } from "../../lib/hooks";
import { ease } from "../../lib/motion";
import portrait from "../../assets/images/portrait-hd.jpeg";

/*
 * Compétences en défilement horizontal : la section reste à l'écran
 * pendant que le défilement vertical fait glisser les panneaux.
 * Chaque panneau est le même schéma de cartes reliées (référence
 * « SaaSflow ») : liaisons qui se dessinent, cartes en cascade,
 * impulsions qui parcourent les liens. Même design sur mobile, avec
 * une disposition des cartes pensée pour un écran étroit.
 */

type Rect = { x: number; y: number; w: number; h: number };
type Layout = {
  W: number;
  H: number;
  root: Rect;
  main: Rect;
  side: Rect;
  back: Rect;
  front: Rect;
  branch: Rect;
  lead: Rect;
  comm: Rect;
  /** Carte d'où part la branche : principale (large) ou latérale (étroit). */
  branchFrom: "main" | "side";
};

const WIDE: Layout = {
  W: 580,
  H: 540,
  root: { x: 112, y: 0, w: 340, h: 52 },
  main: { x: 40, y: 96, w: 300, h: 148 },
  side: { x: 356, y: 128, w: 222, h: 92 },
  back: { x: 6, y: 318, w: 236, h: 92 },
  front: { x: 26, y: 362, w: 236, h: 92 },
  branch: { x: 356, y: 282, w: 150, h: 36 },
  lead: { x: 300, y: 344, w: 262, h: 92 },
  comm: { x: 300, y: 456, w: 262, h: 84 },
  branchFrom: "main",
};

const NARROW: Layout = {
  W: 340,
  H: 720,
  root: { x: 10, y: 0, w: 320, h: 50 },
  main: { x: 0, y: 84, w: 340, h: 148 },
  side: { x: 130, y: 262, w: 210, h: 92 },
  back: { x: 0, y: 392, w: 214, h: 92 },
  front: { x: 12, y: 432, w: 214, h: 92 },
  branch: { x: 232, y: 386, w: 108, h: 34 },
  lead: { x: 116, y: 548, w: 224, h: 92 },
  comm: { x: 116, y: 656, w: 224, h: 64 },
  branchFrom: "side",
};

/* ── Petits éléments ── */
const ABBR: Record<string, string> = { "power bi": "BI", "machine learning": "ML" };

function ToolTile({ name, size }: { name: string; size: number }) {
  const logo = techLogo(name);
  return (
    <span
      title={name}
      className="grid shrink-0 place-items-center rounded-[9px] bg-white ring-1 ring-ink/10"
      style={{ width: size, height: size }}
    >
      {logo ? (
        <img src={logo} alt="" decoding="async" style={{ width: size * 0.62, height: size * 0.62 }} />
      ) : (
        <span className="text-[10px] font-semibold tracking-tight text-ink/70">
          {ABBR[name.toLowerCase()] ?? name.slice(0, 3).toUpperCase()}
        </span>
      )}
      <span className="sr-only">{name}</span>
    </span>
  );
}

function IconTile({ card, size }: { card: SkillCard; size: number }) {
  const Icon = card.icon;
  return (
    <span
      title={card.title}
      className="grid shrink-0 place-items-center rounded-[10px] shadow-[inset_0_1px_0_rgb(255_255_255/0.6)]"
      style={{ width: size, height: size, background: `rgb(${card.tint} / 0.12)`, color: `rgb(${card.tint})` }}
    >
      <Icon size={size * 0.5} strokeWidth={1.9} aria-hidden />
    </span>
  );
}

function Badge({ children, tint }: { children: ReactNode; tint: string }) {
  return (
    <span
      className="shrink-0 rounded-full px-2 py-0.5 text-[0.66rem] font-medium"
      style={{ background: `rgb(${tint} / 0.12)`, color: `rgb(${tint})` }}
    >
      {children}
    </span>
  );
}

const cardCls =
  "rounded-[16px] bg-white shadow-[0_1px_2px_rgb(0_0_0/0.04),0_12px_32px_-12px_rgb(16_18_40/0.18)] ring-1 ring-ink/[0.06]";

function CardBody({ card }: { card: SkillCard }) {
  return (
    <div className="flex h-full items-center gap-3 px-3.5">
      <IconTile card={card} size={38} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[0.92rem] font-semibold tracking-[-0.01em]">{card.title}</p>
        {card.sub && <p className="mt-0.5 truncate text-[0.74rem] text-mute">{card.sub}</p>}
        {(card.badge || card.tools?.length) && (
          <div className="mt-1.5 flex min-w-0 items-center gap-1 overflow-hidden">
            {card.badge && <Badge tint={card.tint}>{card.badge}</Badge>}
            {card.tools?.slice(0, 4).map((t) => <ToolTile key={t} name={t} size={20} />)}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Liaisons calculées depuis la disposition ── */
type Link = { d: string; solid: boolean; a: [number, number]; b: [number, number] };
const cxOf = (r: Rect) => r.x + r.w / 2;
const elbowV = (x1: number, y1: number, x2: number, y2: number): Link => {
  const ym = (y1 + y2) / 2;
  return { d: `M ${x1} ${y1} V ${ym} H ${x2} V ${y2}`, solid: true, a: [x1, y1], b: [x2, y2] };
};

function linksFor(p: SkillPanel, L: Layout): Link[] {
  const out: Link[] = [elbowV(cxOf(L.root), L.root.y + L.root.h, cxOf(L.main), L.main.y)];
  if (p.side) {
    if (L.side.x >= L.main.x + L.main.w) {
      const y1 = L.side.y + L.side.h / 2;
      out.push({ d: `M ${L.main.x + L.main.w} ${y1} H ${L.side.x}`, solid: true, a: [L.main.x + L.main.w, y1], b: [L.side.x, y1] });
    } else {
      out.push(elbowV(cxOf(L.side), L.main.y + L.main.h, cxOf(L.side), L.side.y));
    }
  }
  if (p.back) {
    const x1 = L.main.x + 70;
    const y1 = L.main.y + L.main.h;
    const x2 = cxOf(L.back);
    const y2 = L.back.y;
    out.push({ d: `M ${x1} ${y1} C ${x1} ${y1 + 60}, ${x2} ${y2 - 50}, ${x2} ${y2}`, solid: false, a: [x1, y1], b: [x2, y2] });
  }
  if (p.lead && p.branch) {
    const from = L.branchFrom === "side" && p.side ? L.side : L.main;
    out.push(elbowV(L.branchFrom === "side" ? cxOf(L.branch) : cxOf(from), from.y + from.h, cxOf(L.branch), L.branch.y));
    out.push(elbowV(cxOf(L.branch), L.branch.y + L.branch.h, cxOf(L.branch), L.lead.y));
  }
  if (p.lead && p.comm) {
    const x = Math.min(cxOf(L.branch), L.lead.x + L.lead.w - 30);
    out.push(elbowV(x, L.lead.y + L.lead.h, x, L.comm.y));
  }
  return out;
}

function Node({
  r,
  delay,
  className = "",
  children,
}: {
  r: Rect;
  delay: number;
  className?: string;
  children: ReactNode;
}) {
  const motionOK = useMotionOK();
  return (
    <motion.div
      className={`absolute ${cardCls} transition-shadow duration-300 hover:shadow-[0_18px_40px_-14px_rgb(16_18_40/0.28)] ${className}`}
      style={{ left: r.x, top: r.y, width: r.w, height: r.h }}
      initial={motionOK ? { opacity: 0, y: 18, scale: 0.96 } : false}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: ease.out, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Un panneau : le schéma complet, mis à l'échelle. */
function Diagram({ panel, L, scale }: { panel: SkillPanel; L: Layout; scale: number }) {
  const motionOK = useMotionOK();
  const links = linksFor(panel, L);
  const tiles = panel.main.tiles;
  const tools = panel.main.tools ?? [];
  const RootIcon = panel.root.icon;

  return (
    <div className="relative" style={{ width: L.W * scale, height: L.H * scale }}>
      <div className="absolute left-0 top-0 origin-top-left" style={{ width: L.W, height: L.H, transform: `scale(${scale})` }}>
        {/* Trame de points */}
        <div
          aria-hidden
          className="absolute -inset-6 opacity-70"
          style={{ backgroundImage: "radial-gradient(rgb(var(--c-ink) / 0.13) 1px, transparent 1.3px)", backgroundSize: "18px 18px" }}
        />

        <svg className="absolute inset-0 overflow-visible" width={L.W} height={L.H} aria-hidden>
          {links.map((l, i) => (
            <g key={i}>
              <motion.path
                d={l.d}
                fill="none"
                stroke="rgb(var(--c-signal) / 0.55)"
                strokeWidth={1.5}
                strokeDasharray={l.solid ? undefined : "5 6"}
                strokeLinecap="round"
                initial={motionOK ? { pathLength: 0, opacity: 0 } : false}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.9, ease: ease.inOut, delay: 0.3 + i * 0.16 }}
              />
              {motionOK && l.solid && (
                <circle r={3} fill="rgb(var(--c-signal))">
                  <animateMotion dur={`${2.4 + i * 0.4}s`} repeatCount="indefinite" path={l.d} begin={`${1.4 + i * 0.3}s`} />
                </circle>
              )}
              {[l.a, ...(l.solid ? [l.b] : [])].map(([x, y], j) => (
                <motion.circle
                  key={j}
                  cx={x}
                  cy={y}
                  r={4.5}
                  fill="white"
                  stroke="rgb(var(--c-signal))"
                  strokeWidth={1.5}
                  initial={motionOK ? { scale: 0 } : false}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.4, delay: 0.45 + i * 0.14 }}
                />
              ))}
            </g>
          ))}
        </svg>

        <Node r={L.root} delay={0.05} className="!rounded-full">
          <div className="flex h-full items-center gap-3 px-3">
            {panel.root.avatar ? (
              <img src={portrait} alt="" className="h-8 w-8 shrink-0 rounded-full object-cover object-[50%_22%]" />
            ) : (
              RootIcon && (
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-signal/10 text-signal">
                  <RootIcon size={16} strokeWidth={1.9} aria-hidden />
                </span>
              )
            )}
            <p className="truncate whitespace-nowrap text-[0.9rem] font-medium">
              {panel.root.label} <span className="accent">{panel.root.accent}</span>
            </p>
            <span className="ml-auto whitespace-nowrap text-[0.7rem] text-mute">{panel.root.meta}</span>
          </div>
        </Node>

        <Node r={L.main} delay={0.2}>
          <div className="p-4">
            <p className="truncate text-[1.02rem] font-semibold tracking-[-0.02em]">{panel.main.title}</p>
            <p className="mt-0.5 truncate text-[0.8rem] text-mute">{panel.main.sub}</p>
            <div className="mt-4 flex items-center gap-2">
              <Badge tint="242 107 29">{panel.main.badge}</Badge>
              <div className="flex gap-1.5">
                {tiles?.slice(0, 5).map((t) => <IconTile key={t.title} card={t} size={32} />)}
                {tools.slice(0, 5).map((t) => <ToolTile key={t} name={t} size={32} />)}
              </div>
            </div>
          </div>
        </Node>

        {panel.side && (
          <Node r={L.side} delay={0.4}>
            <CardBody card={panel.side} />
          </Node>
        )}
        {panel.back && (
          <Node r={L.back} delay={0.6} className="-rotate-[4deg] opacity-80">
            <CardBody card={panel.back} />
          </Node>
        )}
        {panel.front && (
          <Node r={L.front} delay={0.72} className="-rotate-[2deg]">
            <CardBody card={panel.front} />
          </Node>
        )}
        {motionOK && panel.front && (
          <motion.span
            aria-hidden
            className="absolute text-ink/80"
            style={{ left: L.front.x + L.front.w - 18, top: L.front.y - 26 }}
            animate={{ x: [0, -10, 0], y: [0, 8, 0], rotate: [0, -8, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Hand size={26} strokeWidth={1.5} />
          </motion.span>
        )}
        {panel.lead && panel.branch && (
          <Node r={L.branch} delay={0.6} className="!rounded-full">
            <p className="flex h-full items-center justify-center whitespace-nowrap px-2 text-[0.78rem] font-medium text-ink/70">
              {panel.branch}
            </p>
          </Node>
        )}
        {panel.lead && (
          <Node r={L.lead} delay={0.8}>
            <CardBody card={panel.lead} />
          </Node>
        )}
        {panel.lead && panel.comm && (
          <Node r={L.comm} delay={0.95} className="opacity-80">
            <CardBody card={panel.comm} />
          </Node>
        )}
      </div>
    </div>
  );
}

/** Taille d'écran (mise à jour au redimensionnement). */
function useViewport() {
  const [v, setV] = useState({ w: 1280, h: 800 });
  useLayoutEffect(() => {
    const on = () => setV({ w: window.innerWidth, h: window.innerHeight });
    on();
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return v;
}

export function SkillsReel() {
  const motionOK = useMotionOK();
  const wide = useMediaQuery("(min-width: 768px)");
  const L = wide ? WIDE : NARROW;
  const vp = useViewport();
  const ref = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  // Dimensions d'un panneau : il tient dans l'écran, sous la barre et l'en-tête.
  const gutter = Math.max(16, Math.min(56, vp.w * 0.04));
  const panelW = wide ? Math.min(720, vp.w - gutter * 2) : vp.w - gutter * 2;
  const top = wide ? 170 : 120;
  const bottom = wide ? 40 : 100; // barre d'onglets sur mobile
  const scale = Math.max(0.55, Math.min(1.1, panelW / L.W, (vp.h - top - bottom) / L.H));

  useLayoutEffect(() => {
    const el = track.current;
    if (!el) return;
    const measure = () => setDistance(Math.max(0, el.scrollWidth - window.innerWidth));
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    measure();
    return () => ro.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);

  return (
    <div
      ref={ref}
      className="relative"
      style={{ height: motionOK ? `calc(100svh + ${distance}px)` : undefined }}
    >
      <div
        className={`${motionOK ? "sticky top-0 h-[100svh] overflow-hidden" : "overflow-x-auto"} flex flex-col`}
        style={{ paddingTop: wide ? 104 : 40 }}
      >
        <div className="wrap">
          <h3 className="h3">Compétences</h3>
          <p className="mt-1 text-[0.95rem] text-mute">
            Transverses, puis techniques.
          </p>
        </div>

        <motion.div
          ref={track}
          className="mt-6 flex w-max items-start will-change-transform"
          style={{ x: motionOK ? x : 0, gap: wide ? 80 : 32, paddingInline: gutter }}
        >
          {skillPanels.map((p) => (
            <section key={p.id} aria-label={p.label} className="shrink-0" style={{ width: panelW }}>
              <p className="meta mb-5 text-mute">{p.label}</p>
              <div className="flex justify-center">
                <Diagram panel={p} L={L} scale={scale} />
              </div>
            </section>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
