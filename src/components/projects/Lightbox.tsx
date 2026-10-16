import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play, X } from "lucide-react";
import { Dialog } from "../ui/Dialog";
import { gallery, cdn } from "../../data/gallery";
import { sound } from "../../lib/sound";
import { useMotionOK } from "../../lib/hooks";
import { ease } from "../../lib/motion";
import { OrgText } from "../ui/OrgText";

/** Durée d'un plan en lecture automatique (ms). */
const SHOT = 5200;

/**
 * Visionneuse « salle de projection » : fond noir, fondus enchaînés,
 * léger zoom lent sur chaque photo (Ken Burns), sous-titres façon film
 * et lecture automatique. Clavier : ← → pour naviguer, Espace pour
 * lecture/pause, Échap pour sortir. Glisser sur mobile.
 */
export function Lightbox({
  index,
  autoplay = false,
  onClose,
  onMove,
}: {
  index: number;
  autoplay?: boolean;
  onClose: () => void;
  onMove: (delta: number) => void;
}) {
  const item = gallery[index];
  const motionOK = useMotionOK();
  const [playing, setPlaying] = useState(autoplay);

  const step = (delta: number) => {
    sound.play("tick");
    onMove(delta);
  };

  // Lecture automatique : un plan toutes les SHOT ms.
  useEffect(() => {
    if (!playing) return;
    const t = window.setTimeout(() => onMove(1), SHOT);
    return () => window.clearTimeout(t);
  }, [playing, index, onMove]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === " ") {
        e.preventDefault();
        setPlaying((p) => !p);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // Précharge l'image suivante pour un fondu sans attente.
  useEffect(() => {
    const next = new Image();
    next.src = cdn(gallery[(index + 1) % gallery.length].src, 1800);
  }, [index]);

  const drift = index % 2 === 0 ? 1 : -1;

  return (
    <Dialog onClose={onClose} label={`Coulisses : ${item.title}`}>
      <motion.div
        className="fixed inset-0 z-[95] flex flex-col bg-black text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: ease.out }}
      >
        {/* Bandeau haut */}
        <div className="wrap relative z-10 flex items-center justify-between py-4">
          <span className="meta tabular-nums text-white/60">
            Coulisses — {String(index + 1).padStart(2, "0")} / {String(gallery.length).padStart(2, "0")}
          </span>
          <button
            type="button"
            onClick={onClose}
            data-autofocus
            className="grid h-11 w-11 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
            aria-label="Fermer"
          >
            <X size={20} />
          </button>
        </div>

        {/* L'écran : fondus enchaînés entre les plans */}
        <div className="relative min-h-0 flex-1 overflow-hidden">
          <AnimatePresence initial={false}>
            <motion.div
              key={item.id}
              className="absolute inset-0 flex items-center justify-center px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: motionOK ? 1.1 : 0.2, ease: "easeInOut" }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.3}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60) step(1);
                else if (info.offset.x > 60) step(-1);
              }}
            >
              <motion.img
                src={cdn(item.src, 1800)}
                alt={item.alt}
                draggable={false}
                className="max-h-full max-w-full select-none object-contain"
                initial={motionOK ? { scale: 1.0, x: 0 } : false}
                animate={motionOK ? { scale: 1.07, x: drift * 14 } : undefined}
                transition={{ duration: SHOT / 1000 + 1.5, ease: "linear" }}
              />
            </motion.div>
          </AnimatePresence>

          {/* Sous-titre */}
          <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center px-6">
            <AnimatePresence mode="wait">
              <motion.p
                key={item.id}
                className="rounded-md bg-black/55 px-4 py-2 text-center text-[1.05rem] font-medium tracking-[-0.01em] text-white backdrop-blur-sm md:text-[1.2rem]"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
              >
                {item.title}
                <span className="ml-3 text-[0.85em] font-normal text-white/65">
                  <OrgText text={item.tag} invert />
                  {item.year ? ` · ${item.year}` : ""}
                </span>
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* Commandes + barre de lecture */}
        <div className="wrap relative z-10 pb-[calc(16px+var(--safe-bottom))] pt-4">
          <div className="h-[2px] w-full overflow-hidden rounded-full bg-white/15">
            {playing && (
              <motion.div
                key={item.id}
                className="h-full origin-left bg-white"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: SHOT / 1000, ease: "linear" }}
              />
            )}
          </div>
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => step(-1)}
              className="grid h-12 w-12 place-items-center rounded-full bg-white/10 hover:bg-white/20"
              aria-label="Image précédente"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              onClick={() => {
                setPlaying((p) => !p);
                sound.play("click");
              }}
              className="grid h-14 w-14 place-items-center rounded-full bg-white text-black transition-transform hover:scale-105"
              aria-label={playing ? "Mettre en pause" : "Lancer la lecture"}
            >
              {playing ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" className="ml-0.5" />}
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              className="grid h-12 w-12 place-items-center rounded-full bg-white/10 hover:bg-white/20"
              aria-label="Image suivante"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </div>
      </motion.div>
    </Dialog>
  );
}
