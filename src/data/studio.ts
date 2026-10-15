/* ════════════════════════════════════════════════════════════
   STUDIO — créations design, motion & 3D
   ------------------------------------------------------------
   AJOUTER UNE CRÉATION
   1. Déposez l'image (ou la vidéo .mp4) dans src/assets/studio/
      puis importez-la ici :
        import monVisuel from "../assets/studio/mon-visuel.webp";
      (une URL Cloudinary fonctionne aussi).
   2. Ajoutez une entrée dans `studio` ci-dessous.
      - media: null → emplacement « Visuel à venir » (temporaire)
      - type "video" → lecture automatique, muette, en boucle
      - published: false → masquée
   ════════════════════════════════════════════════════════════ */

export type StudioCategory = "design" | "motion" | "3d";

export type StudioWork = {
  id: string;
  title: string;
  category: StudioCategory;
  /** Client, structure ou contexte. */
  context?: string | null;
  year?: string | null;
  media: { type: "image" | "video"; src: string; poster?: string; alt: string } | null;
  /** Lien externe facultatif (Behance, YouTube, Figma…). */
  link?: string | null;
  published: boolean;
};

const CDN = "https://res.cloudinary.com/dppzzrley/image/upload";

export const studio: StudioWork[] = [
  {
    id: "blender-scene",
    title: "Scène 3D",
    category: "3d",
    context: "Blender",
    year: "2023",
    media: {
      type: "image",
      src: `${CDN}/v1776781409/WhatsApp_Image_2026-04-21_at_16.22.52_hgwbaf.jpg`,
      alt: "Scène 3D en cours de création dans Blender",
    },
    published: true,
  },
  {
    id: "identite-genie-upb",
    title: "Identité Génie UPB",
    category: "design",
    context: "Génie UPB",
    year: null,
    media: {
      type: "image",
      src: `${CDN}/v1776779652/LOGO_GENIE_UPB_Plan_de_travail_1_copie_5_tun6ea.png`,
      alt: "Logo Génie UPB",
    },
    published: true,
  },
  // Emplacements temporaires : remplacez-les par vos créations.
  { id: "slot-motion", title: "Motion design", category: "motion", media: null, published: true },
  { id: "slot-immobilier", title: "Plans & maquettes 3D", category: "3d", context: "Promotion immobilière", media: null, published: true },
  { id: "slot-branding", title: "Identité visuelle", category: "design", media: null, published: true },
];

export const categoryLabel: Record<StudioCategory, string> = {
  design: "Design",
  motion: "Motion",
  "3d": "3D",
};

/** Teinte RGB par catégorie (emplacements, pastilles). */
export const categoryTint: Record<StudioCategory, string> = {
  design: "244 80 120",
  motion: "139 92 246",
  "3d": "14 165 233",
};

export const publishedStudio = studio.filter((w) => w.published);
