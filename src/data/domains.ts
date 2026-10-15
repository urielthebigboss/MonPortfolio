import type { Domain } from "../types/content";
import softwareImage from "../assets/domains/software.webp";
import dataImage from "../assets/domains/data.webp";
import iotImage from "../assets/domains/iot.webp";
import spatialImage from "../assets/domains/spatial.webp";

/* ════════════════════════════════════════════════════════════
   DOMAINES D'INTERVENTION
   Les outils listés proviennent de l'ancien site (section
   compétences) et des projets. Ajoutez/retirez librement.
   ════════════════════════════════════════════════════════════ */

export const domains: Domain[] = [
  {
    id: "software",
    image: {
      src: softwareImage,
      alt: "Écran d'ordinateur affichant du code Python dans un éditeur, clavier rétroéclairé",
      position: "50% 42%",
    },
    number: "01",
    title: "Software Engineering",
    short: "Logiciel",
    statement: "Transformer un besoin métier en application qui tourne.",
    description:
      "Applications web et mobiles, logiciels de gestion, intégration d'API : je conçois l'architecture, la base de données et l'interface, puis je livre un produit utilisable.",
    capabilities: [
      "Applications web et mobiles",
      "Conception d'architectures et de bases de données",
      "Intégration de services et d'API",
      "Modélisation UML, méthodes MIAGE",
    ],
    tools: [
      "React",
      "Next.js",
      "Vue.js",
      "JavaScript",
      "Node.js",
      "Java",
      "SQL",
      "MySQL",
      "Oracle",
      "Redis",
      "Supabase",
      "Firebase",
      "Postman",
      "GitHub",
      "UML",
    ],
  },
  {
    id: "data",
    image: {
      src: dataImage,
      alt: "Tableau de bord analytique sur un écran d'ordinateur : graphique en anneau, courbes et histogrammes",
      position: "50% 40%",
    },
    number: "02",
    title: "Data & Intelligence Artificielle",
    short: "Data & IA",
    statement: "Faire parler les données pour éclairer une décision.",
    description:
      "Collecte, nettoyage, analyse et visualisation : je structure les données pour qu'elles servent un usage réel, et j'explore les modèles d'apprentissage automatique qui peuvent les exploiter.",
    capabilities: [
      "Analyse et exploitation de données",
      "Data consulting et tableaux de bord",
      "Solutions d'aide à la décision",
      "Apprentissage automatique appliqué",
    ],
    tools: ["Python", "SQL", "Power BI", "Machine Learning"],
    stance:
      "",
  },
  {
    id: "iot",
    image: {
      src: iotImage,
      alt: "Montage Arduino sur plaque d'essai avec écran LCD affichant l'humidité de deux plantes, reliées à des capteurs et à une pompe",
      position: "50% 65%",
    },
    number: "03",
    title: "IoT",
    short: "IoT",
    statement: "Relier un capteur à une décision sur un écran.",
    description:
      "Systèmes connectés : collecte de données de capteurs, communication entre équipements et applications, et remontée de l'information jusqu'à l'utilisateur.",
    capabilities: [
      "Conception de systèmes IoT",
      "Collecte et remontée de données capteurs",
      "Communication équipements ↔ applications",
      "Intégration capteurs, réseau et logiciel",
    ],
    // À compléter : microcontrôleurs, capteurs, protocoles réellement utilisés.
    tools: [],
  },
  {
    id: "creative",
    number: "04",
    title: "Design & Motion",
    short: "Design & Motion",
    statement: "Donner une forme claire à ce qui est complexe.",
    description:
      "Direction artistique, design d'interface et motion design : je conçois des expériences visuelles où l'esthétique sert la compréhension ce site en est un exemple.",
    capabilities: [
      "Design d'interface (UI/UX)",
      "Direction artistique et identité visuelle",
      "Motion design et animation",
      "Expériences interactives (design × code)",
    ],
    tools: ["Figma", "After Effects", "Framer Motion", "React"],
  },
  {
    id: "spatial",
    image: {
      src: spatialImage,
      alt: "Personnage 3D en cours de modélisation dans Blender, affiché en maillage filaire avec ses panneaux de transformation et de matériau",
      position: "50% 35%",
    },
    number: "05",
    title: "3D & Visualisation spatiale",
    short: "3D",
    statement: "Montrer un bâtiment avant qu'il n'existe.",
    description:
      "Modélisation et visualisation 3D, plans et maquettes pour des projets de promotion immobilière : rendre un espace lisible avant sa construction.",
    capabilities: [
      "Modélisation 3D",
      "Plans et maquettes immobilières",
      "Rendus et visualisation",
    ],
    tools: ["Blender"],
  },
];

/** Compétences transverses & langues (affichées dans le Profil). */
export const transversal = {
  skills: ["Gestion de projet", "Méthodes agiles", "Communication", "Leadership"],
  languages: [{ label: "Anglais", level: "B2" }],
};
