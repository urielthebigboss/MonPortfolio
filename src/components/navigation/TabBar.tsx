import { useEffect, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { chapters, tabs } from "../../data/chapters";
import { activeChapter, goTo, overlays } from "../../lib/film";
import { useStore } from "../../lib/store";
import { ease, spring } from "../../lib/motion";

/** Clavier virtuel ouvert ? (la hauteur visible chute fortement) */
function useKeyboardOpen() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const onResize = () => setOpen(window.innerHeight - vv.height > 150);
    vv.addEventListener("resize", onResize);
    return () => vv.removeEventListener("resize", onResize);
  }, []);
  return open;
}

/**
 * Barre d'onglets mobile, inspirée d'iOS : flottante, au pouce,
 * pastille active qui glisse, compactage en défilant vers le bas,
 * zone de sécurité respectée, masquée avec le clavier ou une modale.
 */
export function TabBar() {
  const active = useStore(activeChapter);
  const openOverlays = useStore(overlays);
  const keyboard = useKeyboardOpen();
  const activeTab = chapters.find((c) => c.id === active)?.tab ?? "accueil";
  const { scrollY } = useScroll();
  const [compact, setCompact] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    if (y < 80) setCompact(false);
    else if (y > prev + 8) setCompact(true);
    else if (y < prev - 8) setCompact(false);
  });

  const hidden = keyboard || openOverlays > 0;

  return (
    <motion.nav
      aria-label="Navigation principale"
      className="fixed inset-x-0 z-[70] flex justify-center px-3 md:hidden"
      style={{ bottom: "max(12px, var(--safe-bottom))" }}
      initial={{ y: 120 }}
      animate={{ y: hidden ? 140 : 0 }}
      transition={{ duration: 0.55, ease: ease.out }}
    >
      <motion.ul
        layout
        className="glass flex w-full max-w-[460px] items-stretch justify-between rounded-[32px] p-1.5"
        transition={{ duration: 0.4, ease: ease.out }}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          const Icon = tab.icon;
          return (
            <li key={tab.id} className="flex-1">
              <button
                type="button"
                onClick={() => void goTo(tab.target)}
                aria-current={isActive ? "page" : undefined}
                className="relative flex w-full flex-col items-center justify-center rounded-[24px] text-ink outline-offset-[-2px] transition-[height] duration-300 active:scale-[0.94]"
                style={{ height: compact ? 46 : 56 }}
              >
                {isActive && (
                  <motion.span
                    layoutId="tab-pill"
                    className="btn-solid absolute inset-0 rounded-[26px]"
                    transition={spring.pill}
                  />
                )}
                <motion.span
                  className={`relative ${isActive ? "text-paper" : "text-ink/70"}`}
                  animate={{ y: compact ? 0 : -1, scale: isActive ? 1.06 : 1 }}
                  transition={spring.pill}
                >
                  <Icon size={21} strokeWidth={isActive ? 2.1 : 1.7} aria-hidden />
                </motion.span>
                <motion.span
                  className={`relative overflow-hidden text-[10.5px] font-medium tracking-[-0.01em] ${isActive ? "text-paper" : "text-ink/70"}`}
                  animate={{ height: compact ? 0 : 15, opacity: compact ? 0 : 1, marginTop: compact ? 0 : 3 }}
                  transition={{ duration: 0.3, ease: ease.out }}
                >
                  {tab.label}
                </motion.span>
              </button>
            </li>
          );
        })}
      </motion.ul>
    </motion.nav>
  );
}
