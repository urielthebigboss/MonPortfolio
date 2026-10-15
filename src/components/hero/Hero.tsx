import {
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  BriefcaseBusiness,
  Heart,
  Maximize,
  Menu,
  RotateCcw,
  Search,
  Send,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { goTo } from "../../lib/film";
import { selectedDomain } from "../../lib/selection";
import { sound } from "../../lib/sound";
import { useIsDesktop, useMotionOK } from "../../lib/hooks";
import { ease } from "../../lib/motion";
import type { ChapterId } from "../../data/chapters";
import type { DomainId } from "../../types/content";
import { Scene } from "../film/Scene";
import { KineticText } from "../ui/KineticText";
import { PillButton } from "../ui/Pill";
import hero from "../../assets/images/hero-uriel.webp";
import portrait from "../../assets/images/portrait-hd.jpeg";

/*
 * Ouverture calquée sur la référence « Accenture Song » :
 * texte à gauche ; à droite, UNE seule photo (le portrait d'Uriel sur
 * fond ciel) découpée en continu à travers cinq cartes arrondies,
 * comme le vélo de la référence. Chaque carte est une « fenêtre » sur
 * la même image : la photo reste continue d'une carte à l'autre, même
 * quand les cartes glissent en parallaxe au défilement.
 *
 * Pour changer la photo : remplacez src/assets/images/hero-uriel.webp
 * (ratio conseillé 5:4, 1600 px de large minimum ; plus grand = plus net).
 */

/** Dimensions intrinsèques de l'image (pour le calcul « cover »). */
const IMG = { w: 1600, h: 1280 };

type Tile = {
  id: string;
  label: string;
  target: ChapterId;
  domain?: DomainId;
  desk: string;
  mobile: string;
  speed: number;
  chrome: ReactNode;
};

const ic = "text-white drop-shadow-[0_1px_4px_rgb(0_0_0/0.25)]";

const TILES: Tile[] = [
  {
    id: "a",
    label: "Voir les réalisations",
    target: "realisations",
    desk: "col-start-1 col-span-2 row-start-1",
    mobile: "col-span-2",
    speed: -40,
    chrome: (
      <>
        <Menu
          size={20}
          strokeWidth={1.6}
          className={`absolute left-4 top-4 ${ic}`}
        />
        <BriefcaseBusiness
          size={20}
          strokeWidth={1.6}
          className={`absolute right-4 top-4 ${ic}`}
        />
        <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-white/25 px-4 py-2 text-[0.82rem] text-white backdrop-blur-md">
          <Search size={15} strokeWidth={1.8} /> Uriel Dakaud Jean Bedel
        </span>
      </>
    ),
  },
  {
    id: "b",
    label: "Voir les domaines",
    target: "domaines",
    domain: "software",
    desk: "col-start-3 row-start-1 row-span-2",
    mobile: "",
    speed: -90,
    chrome: (
      <>
        <div className="absolute inset-x-4 top-4 flex gap-1.5">
          <span className="h-[2px] flex-1 overflow-hidden rounded-full bg-white/40">
            <span className="hero-story block h-full origin-left bg-white" />
          </span>
          <span className="h-[2px] flex-1 rounded-full bg-white/40" />
          <span className="h-[2px] flex-1 rounded-full bg-white/40" />
        </div>
        <span className="absolute bottom-4 right-4 flex gap-3">
          <Heart size={19} className={ic} fill="white" />
          <Send size={19} className={ic} />
        </span>
      </>
    ),
  },
  {
    id: "c",
    label: "Voir les coulisses",
    target: "coulisses",
    desk: "col-start-1 row-start-2 row-span-2",
    mobile: "row-span-2",
    speed: 30,
    chrome: (
      <div className="absolute inset-x-4 top-4 flex items-center gap-3 text-[0.78rem] font-medium text-white">
        <span className="rounded-[5px] border border-white/90 px-1 text-[0.6rem] leading-[1.35] tracking-wide">
          LIVE
        </span>
        <span className="hidden opacity-85 sm:inline">Équipe</span>
        <span className="border-b border-white pb-0.5">Projets</span>
        <Search size={16} strokeWidth={1.8} className={`ml-auto ${ic}`} />
      </div>
    ),
  },
  {
    id: "d",
    label: "Voir le domaine data & IA",
    target: "domaines",
    domain: "data",
    desk: "col-start-2 row-start-2",
    mobile: "",
    speed: -15,
    chrome: (
      <>
        <span className="absolute right-4 top-4 rounded-full bg-white/25 px-2.5 py-0.5 text-[0.72rem] text-white backdrop-blur-md">
          1/3
        </span>
        <span className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
        </span>
      </>
    ),
  },
  {
    id: "e",
    label: "Voir le parcours",
    target: "parcours",
    desk: "col-start-2 col-span-2 row-start-3",
    mobile: "col-span-2",
    speed: 55,
    chrome: (
      <>
        <Maximize
          size={18}
          strokeWidth={1.6}
          className={`absolute right-4 top-4 ${ic}`}
        />
        <span className="absolute left-1/2 top-[38%] flex -translate-x-1/2 items-center gap-6">
          <SkipBack size={18} strokeWidth={1.6} className={ic} />
          <span className="grid h-11 w-11 place-items-center rounded-full border-[1.5px] border-white">
            <RotateCcw size={18} strokeWidth={1.6} className={ic} />
          </span>
          <SkipForward size={18} strokeWidth={1.6} className={ic} />
        </span>
      </>
    ),
  },
];

type Frame = { bx: number; by: number; bw: number; bh: number };

/** Calcule, pour chaque carte, la portion de l'image qu'elle doit afficher. */
function useFrames(
  grid: RefObject<HTMLDivElement | null>,
  count: number,
  layout: string,
) {
  const [frames, setFrames] = useState<Frame[]>([]);
  useLayoutEffect(() => {
    const el = grid.current;
    if (!el) return;
    const measure = () => {
      const W = el.clientWidth;
      const H = el.clientHeight;
      // « cover » sur l'ensemble de la mosaïque, visage légèrement remonté
      const scale = Math.max(W / IMG.w, H / IMG.h);
      const bw = IMG.w * scale;
      const bh = IMG.h * scale;
      const ox = (W - bw) / 2;
      const oy = (H - bh) * 0.35;
      const cards = Array.from(el.children).slice(0, count) as HTMLElement[];
      setFrames(
        cards.map((c) => ({
          bx: ox - c.offsetLeft,
          by: oy - c.offsetTop,
          bw,
          bh,
        })),
      );
    };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    measure();
    return () => ro.disconnect();
  }, [grid, count, layout]);
  return frames;
}

function TileCard({
  tile,
  index,
  frame,
  progress,
  parallax,
  desktop,
}: {
  tile: Tile;
  index: number;
  frame?: Frame;
  progress: MotionValue<number>;
  parallax: boolean;
  desktop: boolean;
}) {
  const motionOK = useMotionOK();
  const y = useTransform(progress, [0, 1], [0, parallax ? tile.speed : 0]);
  // La carte bouge, l'image non : on compense le déplacement de la carte.
  const by = useMotionValue(frame?.by ?? 0);
  useLayoutEffect(() => {
    if (frame) by.set(frame.by);
  }, [frame, by]);
  // Image déplacée par transform (carte graphique) : aucun repaint au défilement.
  const imgY = useTransform(() => by.get() - y.get());
  const delay = 0.2 + index * 0.08;

  return (
    <motion.button
      type="button"
      onClick={() => {
        if (tile.domain) selectedDomain.set(tile.domain);
        sound.play("click");
        void goTo(tile.target);
      }}
      aria-label={tile.label}
      className={`group relative overflow-hidden rounded-[18px] bg-[#4f93e6] text-left lg:rounded-[26px] ${desktop ? tile.desk : tile.mobile}`}
      style={{ y }}
      initial={
        motionOK
          ? { clipPath: "inset(14% 14% 14% 14% round 26px)", opacity: 0 }
          : false
      }
      animate={{ clipPath: "inset(0% 0% 0% 0% round 26px)", opacity: 1 }}
      transition={{ duration: 1.1, ease: ease.out, delay }}
    >
      {frame && (
        <motion.img
          src={hero}
          alt=""
          aria-hidden
          draggable={false}
          decoding="async"
          className="pointer-events-none absolute left-0 top-0 max-w-none select-none will-change-transform"
          style={{ width: frame.bw, height: frame.bh, x: frame.bx, y: imgY }}
        />
      )}
      <span
        aria-hidden
        className="absolute inset-0 bg-white/0 transition-colors duration-500 group-hover:bg-white/10"
      />
      <motion.span
        aria-hidden
        className="absolute inset-0"
        initial={motionOK ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: delay + 0.7 }}
      >
        {tile.chrome}
      </motion.span>
    </motion.button>
  );
}

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const grid = useRef<HTMLDivElement>(null);
  const desktop = useIsDesktop();
  const motionOK = useMotionOK();
  const frames = useFrames(grid, TILES.length, desktop ? "desktop" : "mobile");
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const text = (
    <>
      <motion.p
        className="flex items-center gap-3 text-[1.3rem] font-semibold tracking-[-0.03em] lg:mt-[45px] lg:text-[1.45rem]"
        initial={motionOK ? { opacity: 0, y: 10 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: ease.out, delay: 0.1 }}
      >
        {/* Bulle de profil : remplace la mosaïque photo sur mobile */}
        <img
          src={portrait}
          alt="Portrait d'Uriel Jean-Bedel Dakaud"
          width={52}
          height={52}
          className="h-[52px] w-[52px] shrink-0 rounded-full object-cover object-[50%_22%] shadow-[0_6px_18px_-6px_rgb(0_0_0/0.35)] ring-2 ring-white md:hidden"
        />
        <span>
          Uriel <span className="accent">Dakaud</span> Jean-Bedel
        </span>
      </motion.p>

      <div className="mt-8 md:mt-[9vh] lg:mt-0 lg:flex lg:flex-1 lg:flex-col lg:justify-center">
        <KineticText
          as="h1"
          id="ouverture-title"
          headingProps={{ "data-chapter-heading": true, tabIndex: -1 }}
          trigger="mount"
          delay={0.2}
          stagger={0.1}
          className="text-[clamp(3rem,13vw,4.6rem)] font-normal leading-[1.02] tracking-[-0.04em] md:text-[clamp(4rem,8.5vw,5.6rem)] lg:text-[clamp(3.2rem,4.5vw,6rem)]"
          lineClassName="whitespace-nowrap"
          lines={[
            ["Développeur"],
            [{ text: "fullstack,IA", className: "accent pr-[0.04em]" }],
            [
              { text: "& " },
              { text: "designer, 3D", className: "accent pr-[0.04em]" },
            ],
          ]}
        />
        <motion.p
          className="mt-5 max-w-[30ch] text-[0.98rem] font-medium leading-snug lg:text-[1rem]"
          initial={motionOK ? { opacity: 0, y: 12 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: ease.out, delay: 0.7 }}
        >
          D'une idée, je conçois des solutions numériques de bout en bout.
        </motion.p>
        <div className="mt-6 flex flex-wrap gap-3 md:hidden">
          <PillButton onClick={() => void goTo("realisations")}>
            Réalisations
          </PillButton>
          <PillButton variant="ghost" onClick={() => void goTo("parcours")}>
            Parcours
          </PillButton>
        </div>
      </div>
    </>
  );

  return (
    <Scene id="ouverture" tone="white" frame={false}>
      <div ref={ref} className="relative overflow-hidden">
        {desktop ? (
          <div className="wrap grid h-[100svh] min-h-[640px] grid-cols-[29%_1fr] gap-[2.6vw]">
            <div className="flex flex-col pb-[16vh] pt-[13vh]">{text}</div>
            {/* Une seule image, découpée en continu (bord haut et bas débordants) */}
            <div
              ref={grid}
              className="relative -mt-[6svh] grid h-[112svh] grid-cols-3 grid-rows-[0.86fr_1.04fr_1fr] gap-[1.15vw]"
            >
              {TILES.map((t, i) => (
                <TileCard
                  key={t.id}
                  tile={t}
                  index={i}
                  frame={frames[i]}
                  progress={scrollYProgress}
                  parallax={motionOK}
                  desktop
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="wrap pb-6 pt-8 md:pb-tabbar md:pt-28">
            {text}
            <div
              ref={grid}
              className="relative mt-10 hidden auto-rows-[210px] grid-cols-2 gap-3 md:grid"
            >
              {TILES.map((t, i) => (
                <TileCard
                  key={t.id}
                  tile={t}
                  index={i}
                  frame={frames[i]}
                  progress={scrollYProgress}
                  parallax={false}
                  desktop={false}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </Scene>
  );
}
