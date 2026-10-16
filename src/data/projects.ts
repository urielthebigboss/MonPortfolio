import type { Project } from "../types/content";
import bibliothequeCover from "../assets/projects/ma-bibliotheque-upb/cover.webp";
import eagleVisionCover from "../assets/projects/eagle-vision/cover.webp";
import terraCover from "../assets/projects/terra/A1.png";
import spt2aCover from "../assets/projects/spt2a/Spt2A.png";
import sgcCover from "../assets/projects/sgc/sgc.png";

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
    id: "Serious-Games-Catalogue",
    title: "Serious Games Catalogue",
    pitch:
      "La plateforme de gestion et de consultation de jeux éducatifs / Serous Games Society.",
    description: `Le Serious Games Catalogue (SGC) est une plateforme web soutenu par la communauté Serous Games Society (SGS) conçue pour centraliser et faciliter l'accès à une variété de jeux éducatifs aux enseignants aux étudiants et développeurs de jeux. Elle permet aux utilisateurs de rechercher, filtrer et découvrir des jeux sérieux adaptés à différents contextes d'apprentissage.
Grâce à une interface intuitive, les enseignants et les étudiants peuvent explorer des jeux éducatifs qui favorisent l'apprentissage interactif et l'engagement. La plateforme vise à promouvoir l'utilisation des serious games dans l'éducation, en offrant un espace où les ressources sont organisées et facilement accessibles. Elle fait l'effet d"une puublication dans le domaine des serious games, en mettant en avant les meilleures pratiques et les jeux les plus pertinents pour l'apprentissage.`,
    category: "software",
    year: "2026",
    role: "UI/UX Designer & Developpeur", // À compléter : votre rôle exact sur ce projet
    context: "Gama Labs",
    technologies: ["Figma", "HTML", "CSS", "JavaScript", "Render", "Supabase"],
    cover: {
      src: sgcCover,
      alt: "Accueil du Catalogue de Jeux Éducatifs : barre de recherche, catégories de jeux (éducatifs, de simulation, de jeu de rôle) et derniers jeux ajoutés",
      position: "0% 50%",
    },
    gallery: [],
    demoUrl: "",
    repoUrl: null,
    status: "en-cours",
    published: true,
    confidential: true,
    order: 1,
  },

  {
    id: "ma-bibliotheque-upb",
    title: "Ma Bibliothèque",
    pitch:
      "La bibliothèque numérique de l'Université Polytechnique de Bingerville.",
    description: `Une plateforme conçue pour moderniser l'accès aux ressources académiques de l'UPB. Elle centralise et organise les documents universitaires, livres, cours, mémoires et articles scientifiques pour en faciliter la consultation par les étudiants et les enseignants.

Grâce à une interface simple, les utilisateurs effectuent des recherches rapides et accèdent directement aux contenus dont ils ont besoin. La solution améliore la gestion documentaire de l'université et accompagne sa transition vers un environnement académique plus numérique et plus accessible.`,
    category: "software",
    year: "2025",
    role: "UI/UX Designer & Developpeur", // À compléter : votre rôle exact sur ce projet
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
    id: "spt2a",
    title: "Spt2a",
    pitch:
      "Le site officiel de la Société de Production et de Transformation Animale et Agricole.",
    description: `La Société de Production et de Transformation Animale et Agricole, visant à améliorer la communication et la visibilité de l'entreprise. Le site offre des informations détaillées sur les services, les produits et les initiatives de l'entreprise, tout en facilitant l'interaction avec les clients et partenaires.

Grâce à une interface simple, les utilisateurs effectuent des recherches rapides et accèdent directement aux contenus dont ils ont besoin. La solution améliore la gestion documentaire de l'université et accompagne sa transition vers un environnement académique plus numérique et plus accessible.`,
    category: "software",
    year: "2026",
    role: "UI/UX Designer & Developpeur", // À compléter : votre rôle exact sur ce projet
    context: "",
    technologies: ["Figma", "React"],
    cover: {
      src: spt2aCover,
      alt: "",
      position: "0% 50%",
    },
    gallery: [],
    demoUrl: "https://spt2a.com/",
    repoUrl: null,
    status: "publie",
    published: true,
    order: 1,
  },

  {
    id: "terra",
    title: "Terra",
    pitch: "Suiveillez les paramètres nutritiofs des sols.",
    description: `Terra est une application & Iot qui permet de surveiller en temps réel l'humidité et le complexe NPK des sols, facilitant ainsi une gestion agricole plus efficace et durable.

En intégrant des capteurs IoT et une interface utilisateur intuitive, Terra fournit aux agriculteurs des données précises pour optimiser l'irrigation et la fertilisation, contribuant à une meilleure productivité et à la préservation des ressources naturelles.`,
    category: "iot",
    year: "Soutenance 2026",
    role: "Concepteur & développeur", // À compléter : votre rôle exact sur ce projet
    context: "",
    technologies: ["React", "Supabase", "Arduino"],
    cover: {
      src: terraCover,
      alt: "Vue d'ensemble de l'application Terra : affichage des données des capteurs IoT",
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
    year: "Ciade Avril 2026",
    role: "Développeur IA & Backend", // À compléter : votre rôle exact sur ce projet
    context: "",
    // À compléter : technologies réellement utilisées.
    technologies: [
      "Python",
      "TensorFlow",
      "React",
      "PostgreSQL",
      "Yolov8",
      "DeepSort",
    ],
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
];

export const statusLabel: Record<Project["status"], string> = {
  publie: "En ligne",
  "en-cours": "En cours",
  "a-venir": "À venir",
};

export const publishedProjects = projects
  .filter((p) => p.published)
  .sort((a, b) => a.order - b.order);
