import type { LucideIcon } from "lucide-react";
import { House, UserRound, Layers, FolderOpen, Route, Images, Send } from "lucide-react";

/* ════════════════════════════════════════════════════════════
   CHAPITRES — la « timeline » du film
   L'ordre ici = l'ordre des sections à l'écran.
   `tab` rattache chaque chapitre à un onglet de la barre mobile.
   ════════════════════════════════════════════════════════════ */

export type ChapterId =
  | "ouverture"
  | "profil"
  | "domaines"
  | "realisations"
  | "parcours"
  | "coulisses"
  | "contact";

export type Chapter = {
  id: ChapterId;
  number: string;
  title: string;
  /** Phrase courte affichée pendant la transition « cut ». */
  logline: string;
  tab: TabId;
  /** Icône affichée dans la barre de navigation. */
  icon: LucideIcon;
  /** Anciennes routes du site, redirigées vers ce chapitre. */
  legacyPaths?: string[];
};

export type TabId = "accueil" | "domaines" | "projets" | "parcours" | "contact";

export const chapters: Chapter[] = [
  {
    id: "ouverture",
    number: "00",
    title: "Ouverture",
    logline: "Du signal au système",
    tab: "accueil",
    icon: House,
    legacyPaths: ["/"],
  },
  {
    id: "profil",
    number: "01",
    title: "Profil",
    logline: "Relier le terrain, la donnée et l'écran",
    tab: "accueil",
    icon: UserRound,
    legacyPaths: ["/profil"],
  },
  {
    id: "domaines",
    number: "02",
    title: "Domaines",
    logline: "Cinq disciplines, une même chaîne",
    tab: "domaines",
    icon: Layers,
  },
  {
    id: "realisations",
    number: "03",
    title: "Réalisations",
    logline: "Des idées devenues systèmes",
    tab: "projets",
    icon: FolderOpen,
    legacyPaths: ["/projets"],
  },
  {
    id: "parcours",
    number: "04",
    title: "Parcours",
    logline: "Formation, entreprises, responsabilités",
    tab: "parcours",
    icon: Route,
  },
  {
    id: "coulisses",
    number: "05",
    title: "Coulisses",
    logline: "Équipes, compétitions, terrain",
    tab: "parcours",
    icon: Images,
    legacyPaths: ["/galerie"],
  },
  {
    id: "contact",
    number: "06",
    title: "Contact",
    logline: "Écrivons la suite",
    tab: "contact",
    icon: Send,
    legacyPaths: ["/contact"],
  },
];

export const tabs: { id: TabId; label: string; icon: LucideIcon; target: ChapterId }[] = [
  { id: "accueil", label: "Accueil", icon: House, target: "ouverture" },
  { id: "domaines", label: "Domaines", icon: Layers, target: "domaines" },
  { id: "projets", label: "Projets", icon: FolderOpen, target: "realisations" },
  { id: "parcours", label: "Parcours", icon: Route, target: "parcours" },
  { id: "contact", label: "Contact", icon: Send, target: "contact" },
];

export const chapterIndex = (id: ChapterId) =>
  chapters.findIndex((c) => c.id === id);

export const chapterFromPath = (path: string): ChapterId | null => {
  const clean = path.replace(/\/+$/, "") || "/";
  return chapters.find((c) => c.legacyPaths?.includes(clean))?.id ?? null;
};
