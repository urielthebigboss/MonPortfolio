import { AnimatePresence, motion } from "framer-motion";
import { cut } from "../../lib/film";
import { useStore } from "../../lib/store";
import { dur, ease } from "../../lib/motion";
import { chapters } from "../../data/chapters";

/**
 * Le volet de montage : couvre l'écran par le bas, affiche le
 * chapitre comme un carton de film, puis se retire par le haut.
 */
export function CutOverlay() {
  const state = useStore(cut);

  return (
    <AnimatePresence>
      {state && (
        <motion.div
          key={state.n}
          aria-hidden
          className="fixed inset-0 z-[90] flex flex-col justify-between bg-paper text-ink"
          initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
          animate={{
            clipPath:
              state.phase === "in" ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)",
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: dur.cut, ease: ease.inOut }}
        >

          <div className="wrap relative flex items-center justify-between pt-6">
            <span className="meta text-mute">Chapitre suivant</span>
            <span className="meta text-mute">
              {state.chapter.number} / {chapters[chapters.length - 1].number}
            </span>
          </div>

          <div className="wrap relative">
            <div className="overflow-hidden">
              <motion.p
                className="display text-ink"
                initial={{ y: "100%" }}
                animate={{ y: state.phase === "in" ? "0%" : "-30%" }}
                transition={{ duration: dur.cut + 0.1, ease: ease.out, delay: 0.12 }}
              >
                <span className="accent">{state.chapter.number}</span>
              </motion.p>
            </div>
            <div className="mt-4 flex flex-wrap items-baseline gap-x-6 gap-y-2">
              <motion.p
                className="h2"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: ease.out, delay: 0.2 }}
              >
                {state.chapter.title}
              </motion.p>
              <motion.p
                className="text-2xl font-medium tracking-[-0.03em] text-mute md:text-4xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {state.chapter.logline}
              </motion.p>
            </div>
          </div>

          <div className="wrap relative pb-[calc(24px+var(--safe-bottom))]">
            <div className="h-px w-full bg-ink/10">
              <motion.div
                className="h-px origin-left bg-signal"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: dur.cut * 2, ease: ease.inOut }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
