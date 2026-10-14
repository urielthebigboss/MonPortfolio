import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { useLocation } from "react-router-dom";
import { chapters, chapterFromPath, type ChapterId } from "../../data/chapters";
import {
  activeChapter,
  announcement,
  goTo,
  setLenis,
} from "../../lib/film";
import { useStore } from "../../lib/store";
import { sound } from "../../lib/sound";
import { CutOverlay } from "./CutOverlay";

/**
 * Met en place la « régie » : défilement fluide, détection du
 * chapitre actif, calcul de la progression (timeline) et arrivée
 * directe sur un chapitre via #ancre ou ancienne URL (/projets…).
 */
export function FilmProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const live = useStore(announcement);

  /* Défilement fluide — la « caméra ». Coupé si mouvement réduit. */
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;
    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.09,
      smoothWheel: true,
      wheelMultiplier: 0.95,
      anchors: false,
    });
    setLenis(lenis);
    if (import.meta.env.DEV) (window as unknown as { __lenis: Lenis }).__lenis = lenis;
    return () => {
      setLenis(null);
      lenis.destroy();
    };
  }, []);

  /* Chapitre actif : celui qui traverse le centre de l'écran. */
  useEffect(() => {
    const sections = chapters
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id as ChapterId;
            if (activeChapter.get() !== id) activeChapter.set(id);
          }
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  /* Note d'arrivée quand le chapitre change au défilement libre. */
  useEffect(() => {
    let previous = activeChapter.get();
    return activeChapter.subscribe(() => {
      const next = activeChapter.get();
      if (next === previous) return;
      const index = chapters.findIndex((c) => c.id === next);
      const prevIndex = chapters.findIndex((c) => c.id === previous);
      previous = next;
      // On ne joue qu'en avançant, et une seule note : jamais en boucle.
      if (index > prevIndex) sound.chapter(index);
    });
  }, []);

  /* Arrivée directe : #ancre ou ancienne route (/profil, /projets…). */
  useEffect(() => {
    const fromHash = location.hash.replace("#", "") as ChapterId;
    const target = chapters.some((c) => c.id === fromHash)
      ? fromHash
      : chapterFromPath(location.pathname);
    if (!target || target === "ouverture") return;
    const t = window.setTimeout(() => void goTo(target, { instant: true }), 60);
    return () => window.clearTimeout(t);
    // Uniquement au premier chargement.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {children}
      <CutOverlay />
      <p className="sr-only" aria-live="polite">
        {live}
      </p>
    </>
  );
}
