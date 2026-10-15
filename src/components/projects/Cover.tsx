import { useRef, useState } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import type { Project } from "../../types/content";
import { domains } from "../../data/domains";
import { domainIcons, hue } from "../domains/domainIcons";
import { useFinePointer, useMotionOK } from "../../lib/hooks";
import { spring } from "../../lib/motion";

/**
 * Couverture typographique : utilisée tant qu'aucune image n'est
 * fournie. Assumée comme un objet graphique, jamais comme une fausse
 * capture d'écran.
 */
export function TypographicCover({ project, large = false }: { project: Project; large?: boolean }) {
  const domain = domains.find((d) => d.id === project.category);
  const Icon = domainIcons[project.category];
  const initials = project.title
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div
      data-tone="dark"
      className="absolute inset-0 overflow-hidden text-paper"
      style={{
        background: `radial-gradient(80% 70% at 85% 10%, ${hue(project.category, 0.55)} 0%, transparent 60%), radial-gradient(70% 60% at 10% 100%, rgb(var(--c-violet) / 0.35) 0%, transparent 60%), rgb(var(--c-ink))`,
      }}
    >
      <div className="absolute -right-[4%] bottom-[-18%] select-none bg-gradient-to-b from-white/25 to-transparent bg-clip-text text-[clamp(10rem,30vw,26rem)] font-semibold leading-none tracking-[-0.08em] text-transparent">
        {initials}
      </div>
      <div className="absolute left-0 top-0 flex w-full items-center justify-between p-5 sm:p-7">
        <span className="glass badge !py-1.5 !pl-3 text-paper/85">{domain?.short}</span>
        <span className="glass grid h-11 w-11 place-items-center rounded-2xl text-white">
          <Icon size={20} strokeWidth={1.6} aria-hidden />
        </span>
      </div>
      <div className="absolute bottom-0 left-0 p-5 sm:p-7">
        <p className={`${large ? "h2" : "h3"} max-w-[14ch] text-paper`}>{project.title}</p>
        {import.meta.env.DEV && (
          <p className="meta mt-3 inline-block rounded-full bg-warm px-2.5 py-1 text-ink">
            Dev · image à ajouter
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Cadre de projet : révélation cinématographique au défilement
 * (le cadre s'ouvre, l'image glisse en parallaxe) et légère
 * inclinaison 3D au survol sur ordinateur.
 */
export function ProjectFrame({
  project,
  aspect,
  large = false,
}: {
  project: Project;
  aspect: string;
  large?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const motionOK = useMotionOK();
  const fine = useFinePointer();
  const [loaded, setLoaded] = useState(false);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const inset = useTransform(scrollYProgress, [0, 0.35], [14, 0]);
  const clip = useTransform(inset, (v) => `inset(${v}% ${v * 0.6}% ${v}% ${v * 0.6}% round 28px)`);
  const parallax = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, spring.follow);
  const sry = useSpring(ry, spring.follow);

  const tilt = fine && motionOK;

  return (
    <div style={{ perspective: 1200 }}>
      <motion.div
        ref={ref}
        className={`relative w-full overflow-hidden rounded-[28px] bg-ink-2 shadow-[0_30px_80px_-30px_rgb(16_18_40/0.5)] ${aspect}`}
        style={{
          clipPath: motionOK ? clip : undefined,
          rotateX: tilt ? srx : 0,
          rotateY: tilt ? sry : 0,
        }}
        onPointerMove={(e) => {
          if (!tilt) return;
          const r = e.currentTarget.getBoundingClientRect();
          ry.set(((e.clientX - r.left) / r.width - 0.5) * 6);
          rx.set(-((e.clientY - r.top) / r.height - 0.5) * 5);
        }}
        onPointerLeave={() => {
          rx.set(0);
          ry.set(0);
        }}
      >
        {project.cover ? (
          <motion.img
            src={project.cover.src}
            alt={project.cover.alt}
            loading="lazy"
            decoding="async"
            onLoad={() => setLoaded(true)}
            className={`absolute inset-0 h-[114%] w-full -translate-y-[7%] object-cover transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"}`}
            style={{ objectPosition: project.cover.position ?? "50% 50%", ...(motionOK ? { y: parallax } : {}) }}
          />
        ) : (
          <TypographicCover project={project} large={large} />
        )}
      </motion.div>
    </div>
  );
}
