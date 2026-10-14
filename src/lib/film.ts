/* ════════════════════════════════════════════════════════════
   LE RÉALISATEUR — navigation façon montage vidéo
   ------------------------------------------------------------
   Le site est un film découpé en chapitres. Naviguer = monter :
   • chapitre voisin  → « travelling » : la caméra glisse (Lenis)
   • chapitre lointain → « cut » : un volet noir couvre l'écran,
     affiche le numéro et le titre du chapitre, la page saute
     derrière lui, puis le volet se retire sur la nouvelle scène
     qui fait un léger « zoom d'arrivée ».
   • mouvement réduit  → saut direct, sans effet.
   Chaque étape est sonorisée (sound.ts) et le focus clavier est
   déplacé sur le titre du chapitre d'arrivée.
   ════════════════════════════════════════════════════════════ */

import type Lenis from "lenis";
import type { MouseEvent } from "react";
import { chapters, chapterIndex, type Chapter, type ChapterId } from "../data/chapters";
import { createStore } from "./store";
import { sound } from "./sound";
import { dur, glideEasing } from "./motion";

export const activeChapter = createStore<ChapterId>("ouverture");
export const arrival = createStore<{ id: ChapterId; n: number } | null>(null);
export const cut = createStore<{ chapter: Chapter; phase: "in" | "out"; n: number } | null>(null);
/** Nombre de fenêtres modales ouvertes (bloque le défilement). */
export const overlays = createStore(0);


let lenis: Lenis | null = null;
let busy = false;
let counter = 0;

export const setLenis = (instance: Lenis | null) => {
  lenis = instance;
};
export const getLenis = () => lenis;

const reducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const wait = (ms: number) => new Promise((r) => window.setTimeout(r, ms));

const sectionOf = (id: ChapterId) => document.getElementById(id);

const jump = (el: HTMLElement) => {
  if (lenis) lenis.scrollTo(el, { immediate: true, force: true });
  else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: "instant" });
};

const focusHeading = (el: HTMLElement) => {
  const heading = el.querySelector<HTMLElement>("[data-chapter-heading]");
  heading?.focus({ preventScroll: true });
};

const updateHash = (id: ChapterId) => {
  const url = id === "ouverture" ? "/" : `/#${id}`;
  if (window.location.pathname + window.location.hash !== url)
    window.history.replaceState(null, "", url);
};

/** Annonce le chapitre aux lecteurs d'écran. */
export const announcement = createStore("");

export async function goTo(id: ChapterId, opts: { instant?: boolean } = {}) {
  const el = sectionOf(id);
  if (!el || busy) return;
  const target = chapterIndex(id);
  const chapter = chapters[target];
  const from = chapterIndex(activeChapter.get());
  updateHash(id);
  announcement.set(`Chapitre ${chapter.number} — ${chapter.title}`);

  if (opts.instant || reducedMotion()) {
    jump(el);
    focusHeading(el);
    return;
  }

  sound.play("nav");

  // Travelling : chapitre voisin ou même chapitre
  if (Math.abs(target - from) <= 1) {
    busy = true;
    const done = () => {
      busy = false;
      // En avançant, la note est jouée au passage du chapitre (FilmProvider).
      if (target < from) sound.chapter(target);
      focusHeading(el);
    };
    if (lenis) {
      lenis.scrollTo(el, { duration: 1.25, easing: glideEasing, force: true, onComplete: done });
    } else {
      el.scrollIntoView({ behavior: "smooth" });
      window.setTimeout(done, 900);
    }
    return;
  }

  // Cut : volet, saut, révélation
  busy = true;
  const n = ++counter;
  sound.play("cut");
  cut.set({ chapter, phase: "in", n });
  await wait(dur.cut * 1000 + 260);
  jump(el);
  activeChapter.set(id);
  arrival.set({ id, n });
  cut.set({ chapter, phase: "out", n });
  sound.chapter(target);
  await wait(dur.cut * 1000 + 80);
  cut.set(null);
  busy = false;
  focusHeading(el);
}

/** Petit utilitaire pour les liens <a href="#id"> : navigation filmée. */
export const filmLink = (id: ChapterId) => ({
  href: id === "ouverture" ? "/" : `#${id}`,
  onClick: (e: MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    void goTo(id);
  },
});

export const lockScroll = () => {
  overlays.set(overlays.get() + 1);
  lenis?.stop();
  document.documentElement.style.overflow = "hidden";
};

export const unlockScroll = () => {
  const next = Math.max(0, overlays.get() - 1);
  overlays.set(next);
  if (next === 0) {
    lenis?.start();
    document.documentElement.style.overflow = "";
  }
};
