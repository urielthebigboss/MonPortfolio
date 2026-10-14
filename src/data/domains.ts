import type { Domain } from "../types/content";

/* ════════════════════════════════════════════════════════════
   DOMAINES D'INTERVENTION
   Les outils listés proviennent de l'ancien site (section
   compétences) et des projets. Ajoutez/retirez librement.
   ════════════════════════════════════════════════════════════ */

export const domains: Domain[] = [
  {
    id: "software",
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
      "Supabase",
      "Firebase",
      "Postman",
      "GitHub",
      "UML",
    ],
  },
  {
    id: "data",
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
      "Discipline en cours d'approfondissement — prochaine étape : Master 1 Data & IA.",
  },
  {
    id: "iot",
    number: "03",
    title: "IoT & AgriTech",
    short: "IoT & AgriTech",
    statement: "Relier un capteur dans un champ à une décision sur un écran.",
    description:
      "Systèmes connectés appliqués à l'agriculture : collecte de données de capteurs, communication entre équipements et applications, réflexion autour de l'irrigation intelligente et du suivi des cultures.",
    capabilities: [
      "Conception de systèmes IoT",
      "Collecte et remontée de données capteurs",
      "Communication équipements ↔ applications",
      "Irrigation intelligente, suivi des cultures",
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
      "Direction artistique, design d'interface et motion design : je conçois des expériences visuelles où l'esthétique sert la compréhension — ce site en est un exemple.",
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
