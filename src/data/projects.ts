import type { Project } from "../types/content";
import bibliothequeCover from "../assets/projects/ma-bibliotheque-upb/cover.webp";
import eagleVisionCover from "../assets/projects/eagle-vision/cover.webp";

/* ════════════════════════════════════════════════════════════
   RÉALISATIONS
   ------------------------------------------------------------
   AJOUTER UN PROJET
   1. Déposez les images dans  src/assets/projects/<id-du-projet>/
      (formats conseillés : .webp ou .jpg, 1600 px de large max).
   2. Importez-les en haut de ce fichier :
        import monCover from "../assets/projects/mon-projet/cover.webp";
   3. Copiez un bloc ci-dessous et remplissez les champs.
      - cover: null  → couverture typographique automatique
      - demoUrl / repoUrl: null → le bouton n'est pas affiché
      - published: false → le projet reste un brouillon invisible
   4. `category` doit correspondre à un domaine de src/data/domains.ts :
      "software" | "data" | "iot" | "creative" | "spatial"
   ════════════════════════════════════════════════════════════ */

export const projects: Project[] = [
  {
    id: "ma-bibliotheque-upb",
    title: "Ma Bibliothèque",
    pitch:
      "La bibliothèque numérique de l'Université Polytechnique de Bingerville.",
    description: `Une plateforme conçue pour moderniser l'accès aux ressources académiques de l'UPB. Elle centralise et organise les documents universitaires, livres, cours, mémoires et articles scientifiques pour en faciliter la consultation par les étudiants et les enseignants.

Grâce à une interface simple, les utilisateurs effectuent des recherches rapides et accèdent directement aux contenus dont ils ont besoin. La solution améliore la gestion documentaire de l'université et accompagne sa transition vers un environnement académique plus numérique et plus accessible.`,
    category: "software",
    year: "2025",
    role: null, // À compléter : votre rôle exact sur ce projet
    context: "Gama Labs",
    technologies: ["Figma", "React", "Supabase"],
    cover: {
      src: bibliothequeCover,
      alt: "Accueil de Ma Bibliothèque : barre de recherche, catégories de documents (examens, cours, TD, TP, mémoires, livres) et derniers cours ajoutés",
      position: "0% 50%",
    },
    gallery: [],
    demoUrl: "https://upbstudents-labibliotheque.com/",
    repoUrl: null,
    status: "publie",
    published: true,
    order: 1,
  },
  {
    id: "eagle-vision",
    title: "Eagle Vision",
    pitch:
      "Un système intelligent et souverain de surveillance du territoire, par drones et IA.",
    description: `Eagle Vision est un projet technologique visant à déployer un système national intelligent et souverain dédié à la surveillance, la protection et la défense du territoire.

En combinant l'intelligence artificielle et la technologie des drones, le projet cherche à apporter une réponse moderne, autonome et réactive aux défis de sécurité à grande échelle en Côte d'Ivoire.`,
    category: "data",
    year: null,
    role: null,
    context: "",
    // À compléter : technologies réellement utilisées.
    technologies: [],
    cover: {
      src: eagleVisionCover,
      alt: "Vue aérienne par drone d'un parc de stationnement : chaque camion et voiture est encadré et étiqueté par le modèle de détection, avec son score de confiance",
    },
    gallery: [],
    demoUrl: null,
    repoUrl: null,
    status: "en-cours",
    published: true,
    order: 2,
    confidential: true,
  },

  /* ── Brouillons hérités de l'ancien site ──────────────────
     Ces deux entrées utilisaient des images Unsplash et des
     dates antérieures à Gama Labs : elles ressemblent à des
     exemples de template. Elles restent invisibles
     (published: false). Complétez-les ou supprimez-les. */
  {
    id: "fitline",
    title: "Fitline Fitness",
    pitch: "Application mobile de fitness avec personnalisation des séances.",
    description:
      "Application mobile de fitness qui personnalise les entraînements.",
    category: "software",
    year: null,
    role: null,
    technologies: [],
    cover: null,
    gallery: [],
    demoUrl: null,
    repoUrl: null,
    status: "publie",
    published: false,
    order: 90,
  },
  {
    id: "crypto-dashboard",
    title: "Crypto Dashboard",
    pitch: "Tableau de bord d'analyse et d'alertes sur les crypto-actifs.",
    description: "Dashboard d'analyse avec alertes intelligentes.",
    category: "data",
    year: null,
    role: null,
    technologies: [],
    cover: null,
    gallery: [],
    demoUrl: null,
    repoUrl: null,
    status: "a-venir",
    published: false,
    order: 91,
  },
];

export const statusLabel: Record<Project["status"], string> = {
  publie: "En ligne",
  "en-cours": "En cours",
  "a-venir": "À venir",
};

export const publishedProjects = projects
  .filter((p) => p.published)
  .sort((a, b) => a.order - b.order);
