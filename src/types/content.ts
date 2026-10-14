/* Types partagés par les fichiers de src/data. */

export type DomainId = "software" | "data" | "iot" | "creative" | "spatial";

export type Domain = {
  id: DomainId;
  number: string;
  title: string;
  /** Titre court (navigation, filtres). */
  short: string;
  /** Une phrase qui dit ce que la discipline apporte concrètement. */
  statement: string;
  description: string;
  /** Capacités concrètes — pas des niveaux. */
  capabilities: string[];
  /** Outils confirmés. Laisser vide plutôt que d'inventer. */
  tools: string[];
  /** Où en est cette discipline dans mon parcours. */
  stance?: string;
};

export type ProjectStatus = "publie" | "en-cours" | "a-venir";

export type ProjectImage = {
  /** Chemin importé (src/assets/projects/...) ou URL absolue. */
  src: string;
  /** Texte alternatif : décrire ce que montre l'image. Obligatoire. */
  alt: string;
};

export type ProjectLink = { label: string; url: string };

export type Project = {
  /** Identifiant unique, en minuscules et tirets. */
  id: string;
  title: string;
  /** Une phrase de présentation. */
  pitch: string;
  /** Description complète (paragraphes séparés par une ligne vide). */
  description: string;
  category: DomainId;
  year: string | null;
  /** Rôle exercé sur le projet. */
  role: string | null;
  /** Structure ou contexte (ex. « Gama Labs »). */
  context?: string | null;
  technologies: string[];
  /** Image principale. null = couverture typographique automatique. */
  cover: ProjectImage | null;
  /** Images complémentaires affichées dans la fiche détaillée. */
  gallery: ProjectImage[];
  demoUrl: string | null;
  repoUrl: string | null;
  /** Liens additionnels (article, maquette Figma, vidéo…). */
  links?: ProjectLink[];
  status: ProjectStatus;
  /** false = brouillon, non affiché sur le site. */
  published: boolean;
  /** Ordre d'affichage croissant. */
  order: number;
  /** Projet privé / confidentiel : aucun lien n'est affiché. */
  confidential?: boolean;
};

export type JourneyKind = "formation" | "experience" | "engagement";
export type JourneyStatus = "a-venir" | "en-cours" | "termine";

export type JourneyEntry = {
  id: string;
  kind: JourneyKind;
  title: string;
  organization: string | null;
  /** Ex. "2023", "sept. 2025". null = non affiché. */
  start: string | null;
  end: string | null;
  status: JourneyStatus | null;
  location?: string | null;
  summary: string;
  details: string[];
  url?: string | null;
  /** Champs restant à compléter : affichés uniquement en développement. */
  todo?: string[];
};

export type GalleryItem = {
  id: string;
  src: string;
  title: string;
  /** Description de l'image pour les lecteurs d'écran. */
  alt: string;
  tag: string;
  year?: string;
  /** Apparaît dans la pellicule défilante. */
  featured?: boolean;
};
