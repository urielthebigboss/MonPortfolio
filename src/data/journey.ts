import type { JourneyEntry, JourneyKind, JourneyStatus } from "../types/content";

/* ════════════════════════════════════════════════════════════
   PARCOURS — formation, expériences, responsabilités
   ------------------------------------------------------------
   • L'ordre du tableau = l'ordre d'affichage (du plus récent
     au plus ancien).
   • start / end / status à null → l'information n'est pas
     affichée (aucune date inventée).
   • `todo` liste ce qui reste à compléter : visible uniquement
     en local (npm run dev), jamais en production.
   ════════════════════════════════════════════════════════════ */

export const journey: JourneyEntry[] = [
  {
    id: "master-data-ia",
    kind: "formation",
    title: "Master 1 — Data & Intelligence Artificielle",
    organization: null, // Établissement à compléter
    start: null, // ex. "sept. 2026"
    end: null,
    status: "a-venir", // "a-venir" | "en-cours" | "termine"
    summary:
      "La prochaine étape : approfondir la science des données et l'intelligence artificielle, dans le prolongement de MIAGE et du génie logiciel.",
    details: [], // Spécialisation, cours, projets…
    todo: ["Établissement", "Date de début", "Statut", "Spécialisation"],
  },
  {
    id: "upb-pole-tech",
    kind: "engagement",
    title: "Co-responsable du Pôle Technologie et Innovation",
    organization: "Université Polytechnique de Bingerville — 6ᵉ génération",
    start: null,
    end: null,
    status: null,
    summary:
      "Coordination des initiatives technologiques et d'innovation portées par la sixième génération de l'UPB.",
    details: [],
    todo: ["Période", "Actions menées"],
  },
  {
    id: "spt2a",
    kind: "experience",
    title: "Informaticien",
    organization:
      "SPT2A — Société de Production et de Transformation Animale et Agricole",
    start: null,
    end: null,
    status: null,
    summary:
      "Informatique au sein d'une entreprise de production et de transformation agricole : là où le logiciel rencontre le terrain.",
    details: [],
    todo: ["Période", "Missions principales"],
  },
  {
    id: "sys",
    kind: "experience",
    title: "Fondateur",
    organization: "SYS",
    start: null,
    end: null,
    status: null,
    summary:
      "Mon activité technologique : conception et réalisation de solutions numériques sur mesure.",
    details: [],
    todo: ["Date de création", "Services proposés", "Lien éventuel"],
  },
  {
    id: "gama-labs",
    kind: "experience",
    title: "Cofondateur",
    organization: "Gama Labs",
    start: "2025",
    end: null,
    status: null,
    summary:
      "Initiative technologique dédiée à la conception de solutions numériques — dont la bibliothèque numérique de l'UPB.",
    details: ["Rôle dans l'équipe : UI/UX et backend"],
    todo: ["Statut actuel"],
  },
  {
    id: "miage",
    kind: "formation",
    title: "MIAGE — Méthodes Informatiques Appliquées à la Gestion des Entreprises",
    organization: "Université Polytechnique de Bingerville",
    start: "2023",
    end: null,
    status: null,
    summary:
      "Une formation qui relie informatique et gestion, avec une orientation en génie logiciel.",
    details: ["Orientation génie logiciel", "Développement web et backend", "Gestion de projet"],
    todo: ["Diplôme visé / obtenu", "Année de fin"],
  },
  {
    id: "bac",
    kind: "formation",
    title: "Baccalauréat série D",
    organization: "Établissement d'application Jean Piaget",
    start: null,
    end: "2022",
    status: "termine",
    summary: "Baccalauréat scientifique : mathématiques et sciences physiques.",
    details: [],
  },
];

export const kindLabel: Record<JourneyKind, string> = {
  formation: "Formation",
  experience: "Expérience",
  engagement: "Responsabilité",
};

export const journeyStatusLabel: Record<JourneyStatus, string> = {
  "a-venir": "Prochaine étape",
  "en-cours": "En cours",
  termine: "Obtenu",
};

/** Libellé de période sans jamais inventer de date. */
export const periodLabel = (e: JourneyEntry): string | null => {
  if (e.start && e.end) return `${e.start} — ${e.end}`;
  if (e.start && e.status === "en-cours") return `${e.start} — aujourd'hui`;
  if (e.start) return `Depuis ${e.start}`;
  if (e.end) return e.end;
  return null;
};
