export type Category = "informatique" | "infographie" | "motion" | "3d";
export type SubCategory = "en-vedette" | "en-cours" | "a-venir";

export interface Technology {
  name: string;
  icon: string; // emoji ou SVG path
}

export interface Project {
  id: string;
  title: string;
  subtitle?: string;
  category: Category;
  subCategory: SubCategory;
  thumbnail: string;
  images: string[];
  description: string;
  technologies: Technology[];
  highlights: string[];
  status: SubCategory;
  author: string;
  authorLogo?: string;
  links?: { label: string; url: string }[];
  isPrivate?: boolean;
  createdAt: string;
}

export interface InfographicItem {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  tags: string[];
  category: string;
}
