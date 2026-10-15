import type { LucideIcon } from "lucide-react";
import {
  Boxes,
  BrainCircuit,
  ChartColumn,
  CodeXml,
  Database,
  Film,
  GitBranch,
  GraduationCap,
  Languages,
  LayoutTemplate,
  ListChecks,
  MessagesSquare,
  PenTool,
  Repeat2,
  Server,
  Shapes,
  Sparkles,
  Users,
} from "lucide-react";
import { transversal } from "./domains";

/* ════════════════════════════════════════════════════════════
   COMPÉTENCES — panneaux du défilement horizontal (chapitre Profil)
   ------------------------------------------------------------
   Chaque panneau est un schéma de cartes reliées :
     root   → pastille du haut
     main   → carte principale (tuiles = outils ou icônes)
     side   → carte reliée sur le côté
     back / front → cartes empilées (courbe en pointillés)
     branch → pastille de branche, puis lead et comm
   Toute carte absente (undefined) est simplement masquée, ainsi
   que sa liaison. `tools` = noms des technologies : le logo officiel
   s'affiche s'il existe (src/lib/techLogos.ts), sinon un sigle.
   ════════════════════════════════════════════════════════════ */

export type SkillCard = {
  title: string;
  sub: string;
  badge?: string;
  icon: LucideIcon;
  /** Teinte RGB "r g b" de l'icône et du badge. */
  tint: string;
  tools?: string[];
};

export type SkillPanel = {
  id: string;
  /** Libellé au-dessus du schéma. */
  label: string;
  root: {
    label: string;
    accent: string;
    meta: string;
    icon?: LucideIcon;
    avatar?: boolean;
  };
  main: {
    title: string;
    sub: string;
    badge: string;
    tools?: string[];
    tiles?: SkillCard[];
  };
  side?: SkillCard;
  back?: SkillCard;
  front?: SkillCard;
  branch?: string;
  lead?: SkillCard;
  comm?: SkillCard;
};

const BLUE = "41 82 255";
const VIOLET = "139 92 246";
const GREEN = "22 178 110";
const ORANGE = "242 107 29";
const PINK = "244 80 120";
const CYAN = "14 165 233";

const softTile = (
  title: string,
  icon: LucideIcon,
  tint: string,
): SkillCard => ({ title, sub: "", icon, tint });
const SOFT_ICONS: Record<string, [LucideIcon, string]> = {
  "Gestion de projet": [ListChecks, BLUE],
  "Méthodes agiles": [Repeat2, VIOLET],
  Communication: [MessagesSquare, GREEN],
  Leadership: [Users, ORANGE],
};

export const skillPanels: SkillPanel[] = [
  {
    id: "transverses",
    label: "Compétences transverses & langues",
    root: { label: "Profil :", accent: "Uriel Dakaud", meta: "", avatar: true },
    main: {
      title: "Compétences transverses",
      sub: "Ce qui fait avancer les projets",
      badge: "Soft skills",
      tiles: transversal.skills.map((s) =>
        softTile(s, ...(SOFT_ICONS[s] ?? [ListChecks, BLUE])),
      ),
    },
    side: {
      title: "Langues",
      sub: [
        "Français",
        ...transversal.languages.map((l) => `${l.label} ${l.level}`),
      ].join(" · "),
      icon: Languages,
      tint: BLUE,
    },
    back: {
      title: "Gestion de projet",
      sub: "Planification & suivi",
      badge: "Méthode",
      icon: ListChecks,
      tint: BLUE,
    },
    front: {
      title: "Méthodes agiles",
      sub: "Itérations & retours",
      badge: "Méthode",
      icon: Repeat2,
      tint: VIOLET,
    },
    branch: "Rôles assumés",
    lead: {
      title: "Leadership",
      sub: "Gama Labs · Pôle Tech UPB",
      badge: "Rôles",
      icon: Users,
      tint: ORANGE,
    },
    comm: {
      title: "Communication",
      sub: "Équipes & partenaires",
      badge: "Rôles",
      icon: MessagesSquare,
      tint: GREEN,
    },
  },
  {
    id: "software",
    label: "Compétences techniques & Logiciel",
    root: {
      label: "Technique :",
      accent: "Logiciel",
      meta: "Web · mobile · IoT",
      icon: CodeXml,
    },
    main: {
      title: "Software Engineering",
      sub: "Du besoin à l'application qui tourne",
      badge: "Tech-stack",
      tools: ["React", "Next.js", "Node.js", "Java", "Supabase"],
    },
    side: {
      title: "Frontend",
      sub: "Interfaces web",
      badge: "Front",
      icon: LayoutTemplate,
      tint: BLUE,
      tools: ["React", "Next.js", "Vue.js", "JavaScript"],
    },
    back: {
      title: "Données",
      sub: "Bases & services",
      badge: "Data",
      icon: Database,
      tint: GREEN,
      tools: ["MySQL", "Oracle", "Redis", "Supabase"],
    },
    front: {
      title: "Backend & API",
      sub: "Logique & intégration",
      badge: "Back",
      icon: Server,
      tint: VIOLET,
      tools: ["Node.js", "Java", "Postman", "Firebase"],
    },
    branch: "Outillage",
    lead: {
      title: "Versioning",
      sub: "Travail en équipe",
      badge: "Outils",
      icon: GitBranch,
      tint: ORANGE,
      tools: ["GitHub"],
    },
    comm: {
      title: "Modélisation",
      sub: "Architecture & conception",
      badge: "MIAGE",
      icon: Shapes,
      tint: CYAN,
      tools: ["UML"],
    },
  },
  {
    id: "data",
    label: "Compétences techniques Data & IA",
    root: {
      label: "Technique :",
      accent: "Data & IA",
      meta: "",
      icon: BrainCircuit,
    },
    main: {
      title: "Data & Intelligence Artificielle",
      sub: "Faire parler les données",
      badge: "Tech-stack",
      tools: ["Python", "SQL", "Power BI", "Machine Learning"],
    },
    side: {
      title: "Analyse",
      sub: "Préparer & explorer",
      badge: "Data",
      icon: Database,
      tint: GREEN,
      tools: ["Python", "SQL"],
    },
    back: {
      title: "Modèles",
      sub: "Apprentissage automatique",
      badge: "IA",
      icon: Sparkles,
      tint: VIOLET,
      tools: ["Machine Learning"],
    },
    front: {
      title: "Visualisation",
      sub: "Tableaux de bord",
      badge: "Dataviz",
      icon: ChartColumn,
      tint: ORANGE,
      tools: ["Power BI"],
    },
    branch: "Prochaine étape",
    lead: {
      title: "Master 1 Data & IA",
      sub: "Approfondissement à venir",
      badge: "Formation",
      icon: GraduationCap,
      tint: BLUE,
    },
  },
  {
    id: "creative",
    label: "Compétences techniques Design, Motion & 3D",
    root: {
      label: "Technique :",
      accent: "Design & 3D",
      meta: "UI · motion · 3D",
      icon: PenTool,
    },
    main: {
      title: "Design, Motion & 3D",
      sub: "Donner forme à ce qui est complexe",
      badge: "Tech-stack",
      tools: ["Figma", "After Effects", "Framer Motion", "Blender"],
    },
    side: {
      title: "Interface",
      sub: "UI / UX",
      badge: "Design",
      icon: LayoutTemplate,
      tint: PINK,
      tools: ["Figma"],
    },
    back: {
      title: "3D & plans",
      sub: "Modélisation, immobilier",
      badge: "3D",
      icon: Boxes,
      tint: CYAN,
      tools: ["Blender"],
    },
    front: {
      title: "Motion",
      sub: "Animation & transitions",
      badge: "Motion",
      icon: Film,
      tint: VIOLET,
      tools: ["After Effects", "Framer Motion"],
    },
    branch: "En pratique",
    lead: {
      title: "Ce portfolio",
      sub: "Conçu et animé en React",
      badge: "Live",
      icon: Sparkles,
      tint: BLUE,
      tools: ["React", "Framer Motion"],
    },
  },
];
