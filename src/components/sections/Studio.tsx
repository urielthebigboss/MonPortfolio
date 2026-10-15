import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Boxes,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Maximize2,
  PenTool,
  X,
  type LucideIcon,
} from "lucide-react";
import { Scene, ChapterHeading } from "../film/Scene";
import { KineticText } from "../ui/KineticText";
import { PillButton } from "../ui/Pill";
import { Dialog } from "../ui/Dialog";
import {
  publishedStudio,
  categoryLabel,
  categoryTint,
  type StudioCategory,
  type StudioWork,
} from "../../data/studio";
import { cdn } from "../../data/gallery";
import { goTo } from "../../lib/film";
import { sound } from "../../lib/sound";
import { useIsDesktop, useMotionOK } from "../../lib/hooks";
import { ease } from "../../lib/motion";

/*
 * STUDIO — design, motion & 3D.
 * Grand titre, puis sélection « Mounty » : carrousel en perspective,
 * l'œuvre centrale nette, les voisines reculent floutées ; avance seul
 * comme une bande-annonce, glisser / flèches / clavier, ouverture en grand.
 */

const ICONS: Record<StudioCategory, LucideIcon> = {
  design: PenTool,
  motion: Clapperboard,
  "3d": Boxes,
};

/* ── Média ou emplacement « Visuel à venir » ── */
function Media({
  work,
  active = true,
  size = 1000,
}: {
  work: StudioWork;
  active?: boolean;
  size?: number;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (active) void v.play().catch(() => {});
    else v.pause();
  }, [active]);

  if (!work.media) {
    const Icon = ICONS[work.category];
    const tint = categoryTint[work.category];
    return (
      <div
        className="absolute inset-0 grid place-items-center"
        style={{ background: `rgb(${tint} / 0.1)`, color: `rgb(${tint})` }}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <Icon size={30} strokeWidth={1.5} aria-hidden />
          <span className="text-[0.8rem] font-medium opacity-80">
            Visuel à venir
          </span>
        </div>
      </div>
    );
  }
  if (work.media.type === "video") {
    return (
      <video
        ref={ref}
        className="absolute inset-0 h-full w-full object-cover"
        src={work.media.src}
        poster={work.media.poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={work.media.alt}
      />
    );
  }
  return (
    <img
      src={cdn(work.media.src, size)}
      alt={work.media.alt}
      loading="lazy"
      decoding="async"
      draggable={false}
      className="absolute inset-0 h-full w-full select-none object-cover"
    />
  );
}

/* ── Carrousel en perspective ── */
function Coverflow({
  works,
  onOpen,
}: {
  works: StudioWork[];
  onOpen: (w: StudioWork) => void;
}) {
  const motionOK = useMotionOK();
  const desktop = useIsDesktop();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const [index, setIndex] = useState(0);
  const [hover, setHover] = useState(false);
  const n = works.length;

  const go = useCallback(
    (d: number) => {
      setIndex((i) => (i + d + n) % n);
      sound.play("tick");
    },
    [n],
  );

  // Avance seul, comme une bande-annonce (pause au survol).
  useEffect(() => {
    if (!motionOK || !inView || hover || n < 2) return;
    const t = window.setTimeout(() => setIndex((i) => (i + 1) % n), 4200);
    return () => window.clearTimeout(t);
  }, [index, inView, hover, motionOK, n]);

  const cardW = desktop ? 560 : 290;
  const cardH = desktop ? 360 : 200;
  const step = cardW * (desktop ? 0.66 : 0.6);

  return (
    <div
      ref={ref}
      className="relative -mx-[var(--gutter)] overflow-x-clip px-[var(--gutter)] py-2"
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
    >
      <motion.div
        className="relative mx-auto touch-pan-y"
        style={{ height: cardH + 40, perspective: 1400 }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={(_, info) => {
          if (info.offset.x < -50) go(1);
          else if (info.offset.x > 50) go(-1);
        }}
      >
        {works.map((w, i) => {
          let off = i - index;
          if (off > n / 2) off -= n;
          if (off < -n / 2) off += n;
          const abs = Math.abs(off);
          const center = off === 0;
          return (
            <motion.article
              key={w.id}
              className={`absolute left-1/2 top-5 overflow-hidden rounded-[22px] shadow-[0_30px_70px_-30px_rgb(16_18_40/0.55)] md:rounded-[28px] ${w.media ? "bg-ink-2" : "bg-white ring-1 ring-ink/10"}`}
              style={{
                width: cardW,
                height: cardH,
                marginLeft: -cardW / 2,
                zIndex: 20 - abs,
              }}
              initial={false}
              animate={{
                x: off * step,
                scale: center ? 1 : 0.8,
                rotateY: Math.max(-35, Math.min(35, -off * 22)),
                opacity: abs > 2 ? 0 : center ? 1 : 0.55,
                filter: motionOK
                  ? `blur(${center ? 0 : Math.min(abs * 5, 10)}px)`
                  : "blur(0px)",
              }}
              transition={
                motionOK
                  ? { type: "spring", stiffness: 120, damping: 22, mass: 0.9 }
                  : { duration: 0 }
              }
              onClick={() => (center ? onOpen(w) : go(off))}
              aria-hidden={!center}
            >
              <Media work={w} active={center} />
              {w.media && (
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-black/20"
                />
              )}
              {/* Interface de la carte (référence « Mounty ») */}
              <div
                className={`absolute inset-0 flex flex-col justify-between p-4 md:p-6 ${w.media ? "text-white" : "text-ink"}`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="rounded-full px-2.5 py-1 text-[0.72rem] font-medium backdrop-blur-sm"
                    style={{
                      background: w.media
                        ? "rgb(255 255 255 / 0.18)"
                        : `rgb(${categoryTint[w.category]} / 0.15)`,
                    }}
                  >
                    {categoryLabel[w.category]}
                  </span>
                  {w.year && (
                    <span className="text-[0.75rem] opacity-80">{w.year}</span>
                  )}
                </div>
                <div className="flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-[1.05rem] font-semibold tracking-[-0.02em] md:text-[1.35rem]">
                      {w.title}
                    </p>
                    {w.context && (
                      <p className="mt-0.5 truncate text-[0.82rem] opacity-80">
                        {w.context}
                      </p>
                    )}
                  </div>
                  {center && w.media && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpen(w);
                      }}
                      className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white/20 px-3.5 py-2 text-[0.8rem] font-medium backdrop-blur-md transition-colors hover:bg-white/35"
                    >
                      <Maximize2 size={14} aria-hidden /> Voir
                    </button>
                  )}
                </div>
              </div>
            </motion.article>
          );
        })}
      </motion.div>

      {/* Commandes */}
      <div className="mt-4 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => go(-1)}
          className="grid h-11 w-11 place-items-center rounded-full bg-ink/[0.05] transition-colors hover:bg-ink/10"
          aria-label="Création précédente"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex gap-1.5" role="tablist" aria-label="Créations">
          {works.map((w, i) => (
            <button
              key={w.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={w.title}
              onClick={() => setIndex(i)}
              className="grid h-6 place-items-center"
            >
              <span
                className={`block h-1.5 rounded-full transition-all duration-500 ${i === index ? "w-6 bg-ink" : "w-1.5 bg-ink/25"}`}
              />
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(1)}
          className="grid h-11 w-11 place-items-center rounded-full bg-ink/[0.05] transition-colors hover:bg-ink/10"
          aria-label="Création suivante"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      <p className="sr-only" aria-live="polite">
        {works[index]?.title}
      </p>
    </div>
  );
}

/* ── Visionneuse ── */
function Viewer({ work, onClose }: { work: StudioWork; onClose: () => void }) {
  return (
    <Dialog onClose={onClose} label={`Création : ${work.title}`}>
      <motion.div
        className="fixed inset-0 z-[95] flex flex-col bg-black text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="wrap flex items-center justify-between py-4">
          <p className="text-[0.95rem] font-medium">
            {work.title}
            <span className="ml-2 text-white/60">
              {categoryLabel[work.category]}
              {work.year ? ` · ${work.year}` : ""}
            </span>
          </p>
          <button
            type="button"
            onClick={onClose}
            data-autofocus
            className="grid h-11 w-11 place-items-center rounded-full bg-white/10 hover:bg-white/20"
            aria-label="Fermer"
          >
            <X size={20} />
          </button>
        </div>
        <motion.div
          className="relative mx-4 mb-6 flex-1 overflow-hidden rounded-[20px]"
          initial={{ scale: 0.94, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: ease.out }}
        >
          {work.media?.type === "video" ? (
            <video
              className="absolute inset-0 h-full w-full object-contain"
              src={work.media.src}
              poster={work.media.poster}
              controls
              autoPlay
              playsInline
            />
          ) : (
            work.media && (
              <img
                src={cdn(work.media.src, 2000)}
                alt={work.media.alt}
                className="absolute inset-0 h-full w-full object-contain"
              />
            )
          )}
        </motion.div>
        {work.link && (
          <a
            href={work.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[0.9rem] font-medium text-black"
          >
            Voir le projet <ArrowRight size={16} aria-hidden />
          </a>
        )}
      </motion.div>
    </Dialog>
  );
}

export function Studio() {
  const motionOK = useMotionOK();
  const [open, setOpen] = useState<StudioWork | null>(null);
  const works = publishedStudio;

  return (
    <Scene id="studio" tone="white">
      <div className="py-[var(--section-y)]">
        {/* ── Ouverture ── */}
        <div className="wrap grid items-end gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <ChapterHeading
              id="studio"
              title={
                <span className="sr-only">Studio — design, motion & 3D</span>
              }
            />
            <KineticText
              as="p"
              headingProps={{ "aria-hidden": true }}
              className="text-[clamp(3rem,7.4vw,7.2rem)] font-bold leading-[0.9] tracking-[-0.05em]"
              lines={[
                ["Design,"],
                [{ text: "Motion", className: "accent" }],
                ["& 3D."],
              ]}
            />
          </div>
          <motion.div
            className="lg:col-span-5 lg:pb-2"
            initial={motionOK ? { opacity: 0, y: 14 } : false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: ease.out, delay: 0.3 }}
          >
            <p className="max-w-[40ch] text-[1.02rem] font-medium leading-snug text-ink/80">
              Identités visuelles, animations et visualisations 3D dont des
              plans et maquettes pour la promotion immobilière.
            </p>
            <div className="mt-6">
              <PillButton variant="ghost" onClick={() => void goTo("contact")}>
                Me contacter
              </PillButton>
            </div>
          </motion.div>
        </div>

        {/* ── Sélection ── */}
        <div className="wrap mt-12 md:mt-16">
          <p className="mb-4 text-right text-[0.9rem] text-mute">
            Glissez, ou laissez défiler.
          </p>
          <Coverflow
            works={works}
            onOpen={(w) => {
              if (!w.media) return;
              sound.play("open");
              setOpen(w);
            }}
          />
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <Viewer
            key="viewer"
            work={open}
            onClose={() => {
              sound.play("close");
              setOpen(null);
            }}
          />
        )}
      </AnimatePresence>
    </Scene>
  );
}
