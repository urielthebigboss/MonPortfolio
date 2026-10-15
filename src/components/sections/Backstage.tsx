import { useCallback, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionStyle,
  type MotionValue,
} from "framer-motion";

import { Scene } from "../film/Scene";
import { PillButton } from "../ui/Pill";
import { Lightbox } from "../projects/Lightbox";
import { gallery, cdn } from "../../data/gallery";
import type { GalleryItem } from "../../types/content";

import { sound } from "../../lib/sound";
import { useIsDesktop, useMotionOK } from "../../lib/hooks";
import { ease } from "../../lib/motion";

/*
 * Galerie « couloir » : une pièce en perspective dont les murs, le sol
 * et le plafond sont quadrillés ; les photos y sont accrochées.
 * La caméra avance au défilement et dérive doucement au repos ;
 * le couloir boucle à l'infini (les photos réapparaissent au fond).
 * Murs fixes, seules les photos et la trame bougent : aucun élément
 * ne traverse le plan de la caméra (rendu stable sur tous navigateurs).
 */

type Wall = "left" | "right" | "bottom" | "top";
const WALLS: Wall[] = ["left", "right", "bottom", "top"];
/** Position transversale sur le mur (0–1) : hauteur pour les côtés, largeur pour sol/plafond. */
const CROSS: Record<Wall, number[]> = {
  left: [0.34, 0.6, 0.46],
  right: [0.58, 0.32, 0.5],
  bottom: [0.3, 0.68, 0.5],
  top: [0.7, 0.28, 0.48],
};

const PHOTOS = gallery.slice(0, 16).map((item, i) => {
  const wall = WALLS[i % 4];
  return { item, wall, cross: CROSS[wall][Math.floor(i / 4) % 3], i };
});

type Config = {
  perspective: number;
  depth: number; // longueur des murs (px)
  loop: number; // longueur de la boucle
  cell: number; // pas de la trame
  w: number;
  h: number;
  travel: number; // avancée de caméra sur tout le défilement
  /** Taille du halo blanc derrière le texte. */
  halo: string;
};

const DESKTOP: Config = { perspective: 760, depth: 2200, loop: 2700, cell: 320, w: 300, h: 200, travel: 2400, halo: "42% 36%" };
const MOBILE: Config = { perspective: 460, depth: 1500, loop: 1900, cell: 220, w: 168, h: 118, travel: 1500, halo: "75% 32%" };

const line = "rgb(var(--c-ink) / 0.13)";
const mod = (n: number, m: number) => ((n % m) + m) % m;

function WallPhoto({
  photo,
  cam,
  cfg,
  onOpen,
  onHover,
}: {
  photo: (typeof PHOTOS)[number];
  cam: MotionValue<number>;
  cfg: Config;
  onOpen: (item: GalleryItem) => void;
  onHover: (on: boolean) => void;
}) {
  const { wall, cross, i, item } = photo;
  const start = (i / PHOTOS.length) * cfg.loop + 160;
  // Distance de la photo au bord proche du mur (diminue quand la caméra avance).
  // Le « saut » de boucle a lieu quand la photo est entièrement hors du mur
  // (derrière le bord de l'écran ou au-delà du fond) : jamais visible.
  const offset = Math.max(cfg.w, cfg.h) + 40;
  const local = useTransform(cam, (c) => mod(start - c, cfg.loop) - offset);
  const along = useTransform(local, (p) => {
    if (wall === "left" || wall === "top") return p;
    return cfg.depth - p - (wall === "right" ? cfg.w : cfg.h);
  });
  const side = wall === "left" || wall === "right";

  return (
    <motion.button
      type="button"
      tabIndex={-1}
      aria-hidden
      onClick={() => onOpen(item)}
      onPointerEnter={() => onHover(true)}
      onPointerLeave={() => onHover(false)}
      className="group absolute left-0 top-0 cursor-zoom-in overflow-hidden rounded-[4px] bg-ink/5 shadow-[0_10px_24px_-12px_rgb(0_0_0/0.4)] will-change-transform"
      style={{
        width: cfg.w,
        height: cfg.h,
        ...(side
          ? { x: along, top: `${cross * 100}%`, marginTop: -cfg.h / 2 }
          : { y: along, left: `${cross * 100}%`, marginLeft: -cfg.w / 2 }),
      }}
    >
      <img
        src={cdn(item.src, 520)}
        alt=""
        loading="eager"
        decoding="async"
        draggable={false}
        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
      />
      <span className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-[11px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
        {item.title}
      </span>
    </motion.button>
  );
}

function Corridor({
  cam,
  cfg,
  photos,
  onOpen,
  onHover,
}: {
  cam: MotionValue<number>;
  cfg: Config;
  photos: typeof PHOTOS;
  onOpen: (item: GalleryItem) => void;
  onHover: (on: boolean) => void;
}) {
  // La trame glisse vers le spectateur. On déplace un calque (transform,
  // géré par la carte graphique) au lieu d'animer background-position,
  // qui obligerait à repeindre les murs à chaque image.
  const shift = useTransform(cam, (c) => -mod(c, cfg.cell));
  const shiftBack = useTransform(cam, (c) => mod(c, cfg.cell) - cfg.cell);

  const sideGrid = {
    backgroundImage: `linear-gradient(to right, ${line} 1px, transparent 1px), linear-gradient(to bottom, ${line} 1px, transparent 1px)`,
    backgroundSize: `${cfg.cell}px 100%, 100% 25%`,
  };
  const flatGrid = {
    backgroundImage: `linear-gradient(to bottom, ${line} 1px, transparent 1px), linear-gradient(to right, ${line} 1px, transparent 1px)`,
    backgroundSize: `100% ${cfg.cell}px, 25% 100%`,
  };

  const walls: Record<Wall, React.CSSProperties> = {
    left: { left: 0, top: 0, width: cfg.depth, height: "100%", transformOrigin: "0% 50%", transform: "rotateY(90deg)" },
    right: { right: 0, top: 0, width: cfg.depth, height: "100%", transformOrigin: "100% 50%", transform: "rotateY(-90deg)" },
    top: { left: 0, top: 0, width: "100%", height: cfg.depth, transformOrigin: "50% 0%", transform: "rotateX(-90deg)" },
    bottom: { left: 0, bottom: 0, width: "100%", height: cfg.depth, transformOrigin: "50% 100%", transform: "rotateX(90deg)" },
  };
  const grids: Record<Wall, MotionStyle> = {
    left: { ...sideGrid, left: 0, top: 0, bottom: 0, width: cfg.depth + cfg.cell, x: shift },
    right: { ...sideGrid, left: 0, top: 0, bottom: 0, width: cfg.depth + cfg.cell, x: shiftBack },
    top: { ...flatGrid, left: 0, right: 0, top: 0, height: cfg.depth + cfg.cell, y: shift },
    bottom: { ...flatGrid, left: 0, right: 0, top: 0, height: cfg.depth + cfg.cell, y: shiftBack },
  };

  return (
    <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
      {WALLS.map((wall) => (
        <div key={wall} className="absolute overflow-hidden" style={walls[wall]}>
          <motion.div aria-hidden className="absolute will-change-transform" style={grids[wall]} />
          {photos
            .filter((p) => p.wall === wall)
            .map((p) => (
              <WallPhoto key={p.item.id} photo={p} cam={cam} cfg={cfg} onOpen={onOpen} onHover={onHover} />
            ))}
        </div>
      ))}
    </div>
  );
}

export function Backstage() {
  const desktop = useIsDesktop();
  const motionOK = useMotionOK();
  const cfg = desktop ? DESKTOP : MOBILE;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "200px 0px" });
  const [viewer, setViewer] = useState<{ index: number; autoplay: boolean } | null>(null);
  const photos = desktop ? PHOTOS : PHOTOS.slice(0, 12);

  /* Caméra = défilement (lissé) + dérive continue, comme un travelling */
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const scrollCam = useSpring(useTransform(scrollYProgress, [0, 1], [0, cfg.travel]), {
    stiffness: 70,
    damping: 24,
    mass: 0.7,
  });
  const drift = useMotionValue(0);
  const speed = useRef(0.03);
  const hovering = useRef(false);
  useAnimationFrame((_, delta) => {
    if (!motionOK || !inView || viewer) return;
    // Ralentit en douceur au survol d'une photo (pour pouvoir cliquer), repart ensuite.
    const target = hovering.current ? 0.004 : 0.03;
    speed.current += (target - speed.current) * Math.min(1, delta / 260);
    drift.set(drift.get() + Math.min(delta, 50) * speed.current);
  });
  const cam = useTransform(() => (motionOK ? scrollCam.get() + drift.get() : 0));


  const open = (item: GalleryItem, autoplay = false) => {
    sound.play("open");
    hovering.current = false;
    setViewer({ index: gallery.findIndex((g) => g.id === item.id), autoplay });
  };
  const move = useCallback((delta: number) => {
    setViewer((v) => (v ? { ...v, index: (v.index + delta + gallery.length) % gallery.length } : v));
  }, []);

  return (
    <Scene id="coulisses" tone="white" frame={false}>
      <div ref={ref} className={`relative ${motionOK ? (desktop ? "h-[240svh]" : "h-[200svh]") : "h-[100svh]"}`}>
        <div
          className="sticky top-0 h-[100svh] overflow-hidden bg-paper-2"
          style={{ perspective: cfg.perspective, contain: "paint" }}
        >
          <Corridor cam={cam} cfg={cfg} photos={photos} onOpen={open} onHover={(on) => (hovering.current = on)} />

          {/* Brume du fond + lisibilité du texte : un seul calque fixe */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background: `radial-gradient(ellipse ${cfg.halo} at 50% 50%, rgb(255 255 255) 40%, rgb(255 255 255 / 0.85) 62%, transparent 100%)` }}
          />

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center">
            <motion.div
              className="pointer-events-auto flex max-w-3xl flex-col items-center"
              initial={motionOK ? { opacity: 0, y: 30, filter: "blur(10px)" } : false}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-20%" }}
              transition={{ duration: 1, ease: ease.out }}
            >
              <h2
                id="coulisses-title"
                data-chapter-heading
                tabIndex={-1}
                className="text-[clamp(2.3rem,5.6vw,5.4rem)] font-medium leading-[1] tracking-[-0.045em]"
              >
                Ce qui ne tient pas dans un CV.
              </h2>
              <p className="mt-5 max-w-[46ch] text-[1.02rem] font-medium leading-snug text-ink/80">
                Une équipes, des compétitions, des sorties terrain : les moments où
                les projets <span className="accent">prennent vie.</span>
              </p>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
                <PillButton
                  onClick={() => open(gallery[0], true)}
                  
                 
                >
                  Voir les images
                </PillButton>
                
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {viewer && (
          <Lightbox
            key="lightbox"
            index={viewer.index}
            autoplay={viewer.autoplay}
            onMove={move}
            onClose={() => {
              sound.play("close");
              setViewer(null);
            }}
          />
        )}
      </AnimatePresence>
    </Scene>
  );
}
