import type { Project, InfographicItem, Category } from "../types/project";

export const categories: { id: Category; label: string; icon: string }[] = [
  { id: "informatique", label: "Informatique", icon: "⚡" },
  { id: "infographie", label: "Infographie", icon: "🎨" },
  { id: "motion", label: "Motion", icon: "🎬" },
  { id: "3d", label: "3D", icon: "🧊" },
];

export const subCategories: { id: string; label: string }[] = [
  { id: "en-vedette", label: "En vedette" },
  { id: "en-cours", label: "En cours" },
  { id: "a-venir", label: "À venir" },
];

export const projects: Project[] = [
  {
    id: "app-academic",
    title: "Application Academic",
    subtitle: "Pour la gestion des écoles et universités",
    category: "informatique",
    subCategory: "en-vedette",
    thumbnail:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80",
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&q=80",
    ],
    description: `EAGLE VISION est un projet technologique ambitieux visant à déployer un système national intelligent et souverain dédié à la surveillance, la protection et la défense du territoire. En combinant l'intelligence artificielle de pointe et la technologie des drones, le projet apporte une réponse moderne, autonome et hautement réactive aux défis de sécurité à grande échelle en Côte d'Ivoire.`,
    technologies: [
      { name: "Figma", icon: "🎨" },
      { name: "React", icon: "⚛️" },
      { name: "Flutter", icon: "💙" },
      { name: "Firebase", icon: "🔥" },
    ],
    highlights: [
      "Desktop, Mobile",
      "Relation Ecole Etudiant",
      "Résultats Numérique",
      "Digitalisation Campus",
    ],
    status: "en-vedette",
    author: "GAMA LABS",
    authorLogo: "∞",
    links: [{ label: "Links", url: "#" }],
    isPrivate: true,
    createdAt: "2024-01-15",
  },
  {
    id: "fitline-app",
    title: "Fitline Fitness",
    subtitle: "Application de fitness intelligente",
    category: "informatique",
    subCategory: "en-vedette",
    thumbnail:
      "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=1200&q=80",
    ],
    description:
      "Application mobile de fitness avec IA intégrée pour personnaliser les entraînements en temps réel.",
    technologies: [
      { name: "React Native", icon: "⚛️" },
      { name: "TensorFlow", icon: "🧠" },
      { name: "Node.js", icon: "🟢" },
    ],
    highlights: ["IA Personnalisée", "Suivi temps réel", "Communauté"],
    status: "en-vedette",
    author: "GAMA LABS",
    createdAt: "2024-02-20",
  },
  {
    id: "eagle-vision",
    title: "Eagle Vision",
    subtitle: "Système de surveillance par drone",
    category: "informatique",
    subCategory: "en-cours",
    thumbnail:
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1200&q=80",
    ],
    description:
      "Système de surveillance aérienne autonome utilisant l'IA pour la détection d'anomalies.",
    technologies: [
      { name: "Python", icon: "🐍" },
      { name: "OpenCV", icon: "👁️" },
      { name: "AWS", icon: "☁️" },
    ],
    highlights: ["Drones autonomes", "IA embarquée", "Cloud"],
    status: "en-cours",
    author: "GAMA LABS",
    createdAt: "2024-03-10",
  },
  {
    id: "crypto-dashboard",
    title: "Crypto Dashboard",
    subtitle: "Tableau de bord crypto avancé",
    category: "informatique",
    subCategory: "a-venir",
    thumbnail:
      "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=1200&q=80",
    ],
    description:
      "Dashboard crypto avec analytics avancées et alertes intelligentes.",
    technologies: [
      { name: "Next.js", icon: "▲" },
      { name: "Web3", icon: "🔗" },
      { name: "GraphQL", icon: "◈" },
    ],
    highlights: ["Web3", "Analytics", "Alertes IA"],
    status: "a-venir",
    author: "GAMA LABS",
    createdAt: "2024-06-01",
  },
];

export const infographicItems: InfographicItem[] = [
  {
    id: "inf-1",
    src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80",
    alt: "Abstract 1",
    width: 400,
    height: 600,
    tags: ["abstract", "minimal"],
    category: "digital",
  },
  {
    id: "inf-2",
    src: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=600&q=80",
    alt: "Abstract 2",
    width: 600,
    height: 400,
    tags: ["gradient", "modern"],
    category: "digital",
  },
  {
    id: "inf-3",
    src: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=600&q=80",
    alt: "Abstract 3",
    width: 400,
    height: 500,
    tags: ["geometric", "colorful"],
    category: "print",
  },
  {
    id: "inf-4",
    src: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&q=80",
    alt: "Abstract 4",
    width: 500,
    height: 500,
    tags: ["gradient", "smooth"],
    category: "digital",
  },
  {
    id: "inf-5",
    src: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=600&q=80",
    alt: "Abstract 5",
    width: 400,
    height: 700,
    tags: ["fluid", "art"],
    category: "print",
  },
  {
    id: "inf-6",
    src: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=600&q=80",
    alt: "Abstract 6",
    width: 600,
    height: 450,
    tags: ["neon", "futuristic"],
    category: "digital",
  },
  {
    id: "inf-7",
    src: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=600&q=80",
    alt: "Abstract 7",
    width: 400,
    height: 550,
    tags: ["minimal", "clean"],
    category: "print",
  },
  {
    id: "inf-8",
    src: "https://images.unsplash.com/photo-1604076913837-52ab5629fba9?w=600&q=80",
    alt: "Abstract 8",
    width: 500,
    height: 400,
    tags: ["texture", "organic"],
    category: "digital",
  },
];
