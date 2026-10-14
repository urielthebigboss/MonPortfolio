/* Système de mouvement — mêmes courbes que tokens.css.
   Toute animation du site pioche ici : rythme cohérent garanti. */

export const ease = {
  /** Entrées, révélations : rapide puis très doux (expo-out). */
  out: [0.22, 1, 0.36, 1] as const,
  /** Coupes et transitions de chapitre : symétrique, « montage vidéo ». */
  inOut: [0.76, 0, 0.24, 1] as const,
  /** Survols. */
  soft: [0.33, 1, 0.68, 1] as const,
};

export const dur = {
  fast: 0.18,
  base: 0.45,
  slow: 0.9,
  /** Durée de chaque moitié de la transition « cut ». */
  cut: 0.55,
};

export const spring = {
  /** Pastilles de navigation (layoutId). */
  pill: { type: "spring", stiffness: 420, damping: 34, mass: 0.8 } as const,
  /** Éléments qui suivent le pointeur. */
  follow: { stiffness: 140, damping: 20, mass: 0.6 },
};

/** Courbe de défilement « travelling » utilisée par Lenis. */
export const glideEasing = (t: number) =>
  t < 0.5 ? 16 * t ** 5 : 1 - (-2 * t + 2) ** 5 / 2;
