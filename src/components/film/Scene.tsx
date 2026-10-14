import { useEffect, useRef, type ReactNode } from "react";
import {
  motion,
  useAnimate,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";
import type { ChapterId } from "../../data/chapters";
import { arrival } from "../../lib/film";
import { useIsDesktop, useMotionOK } from "../../lib/hooks";
import { ease } from "../../lib/motion";

const tones = {
  paper: "bg-paper text-ink",
  white: "bg-paper-2 text-ink",
  ink: "bg-ink text-paper",
  signal: "bg-signal text-white",
} as const;

type Props = {
  id: ChapterId;
  tone?: keyof typeof tones;
  className?: string;
  children: ReactNode;
  /** Le cadre qui s'élargit à l'entrée (désactivé pour le hero). */
  frame?: boolean;
};

/**
 * Une scène du film. Deux comportements cinématographiques :
 * 1. Entrée : la scène arrive dans un cadre arrondi qui s'élargit
 *    jusqu'au plein écran (comme un plan qui s'ouvre).
 * 2. Arrivée après un « cut » : zoom de mise au point.
 */
export function Scene({
  id,
  tone = "paper",
  className = "",
  children,
  frame = true,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const motionOK = useMotionOK();
  const desktop = useIsDesktop();

  const { scrollYProgress: enter } = useScroll({
    target: ref,
    offset: ["start end", "start 0.15"],
  });

  const inset = useTransform(enter, [0, 1], [desktop ? 3.2 : 2.4, 0]);
  const radius = useTransform(enter, [0, 1], [desktop ? 40 : 26, 0]);
  const clipPath = useMotionTemplate`inset(0px ${inset}vw 0px ${inset}vw round ${radius}px ${radius}px 0px 0px)`;

  useEffect(() => {
    if (!motionOK) return;
    return arrival.subscribe(() => {
      const a = arrival.get();
      if (!a || a.id !== id || !scope.current) return;
      void animate(
        scope.current,
        { scale: [1.045, 1], opacity: [0.6, 1] },
        { duration: 1.05, ease: ease.out },
      );
    });
  }, [animate, id, motionOK, scope]);

  // Cadre et fondu au noir réservés au desktop : sur mobile/tablette,
  // ils laissaient apparaître des bordures noires autour de l'écran.
  const enhanced = motionOK && frame && desktop;

  return (
    <motion.section
      ref={ref}
      id={id}
      data-chapter={id}
      aria-labelledby={`${id}-title`}
      data-tone={tone === "paper" || tone === "white" ? "light" : "dark"}
      className={`relative ${tones[tone]} ${className}`}
      style={enhanced ? { clipPath } : undefined}
    >
      <div ref={scope} className="relative" style={{ transformOrigin: "50% 0%" }}>
        {children}
      </div>
    </motion.section>
  );
}

/** En-tête de chapitre homogène : titre focalisable et intro. */
export function ChapterHeading({
  id,
  title,
  className = "",
  children,
}: {
  id: ChapterId;
  title: ReactNode;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <header className={className}>
      <h2 id={`${id}-title`} data-chapter-heading tabIndex={-1} className="h1">
        {title}
      </h2>
      {children}
    </header>
  );
}
