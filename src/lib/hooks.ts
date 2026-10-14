import { useCallback, useSyncExternalStore } from "react";
import { useReducedMotion } from "framer-motion";
import { sound, type SoundName } from "./sound";

/** Écoute une media query (SSR-safe). */
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (cb: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", cb);
      return () => mql.removeEventListener("change", cb);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export const useIsDesktop = () => useMediaQuery("(min-width: 1024px)");
/** Pointeur précis avec survol réel (souris / trackpad). */
export const useFinePointer = () =>
  useMediaQuery("(hover: hover) and (pointer: fine)");

/** Mouvement complet autorisé ? (respecte prefers-reduced-motion) */
export const useMotionOK = () => !useReducedMotion();

export function useSoundSettings() {
  return useSyncExternalStore(sound.subscribe, sound.getSnapshot, sound.getSnapshot);
}

/**
 * Props de survol sonore : actives uniquement avec une souris et
 * sans réduction des animations (évite les sons au tap sur mobile).
 */
export function useHoverSound(name: SoundName = "hover") {
  const fine = useFinePointer();
  const motionOK = useMotionOK();
  if (!fine || !motionOK) return {};
  return { onPointerEnter: () => sound.play(name) };
}
