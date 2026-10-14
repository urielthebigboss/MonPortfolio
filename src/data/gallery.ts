import type { GalleryItem } from "../types/content";

/* ════════════════════════════════════════════════════════════
   COULISSES — photos réelles (hébergées sur Cloudinary)
   Reprises de l'ancienne galerie et de la section Gama Labs.
   • Les 16 premières photos sont accrochées dans le couloir 3D ;
     toutes restent visibles dans la visionneuse (« Ouvrir la galerie »).
   • Pensez à préciser `alt` : décrire ce que montre la photo.
   ════════════════════════════════════════════════════════════ */

const CDN = "https://res.cloudinary.com/dppzzrley/image/upload";

export const gallery: GalleryItem[] = [
  { id: "cdci", src: `${CDN}/v1776780399/WhatsApp_Image_2026-04-21_at_16.03.49_1_rvd2sc.jpg`, title: "CDCI-Capital", alt: "Uriel lors d'un événement CDCI-Capital", tag: "Événement", year: "2024", featured: true },
  { id: "gama-1", src: `${CDN}/v1776780399/WhatsApp_Image_2026-04-21_at_16.03.50_wleypp.jpg`, title: "Gama Labs", alt: "L'équipe Gama Labs", tag: "Gama Labs", year: "2024", featured: true },
  { id: "sprint", src: `${CDN}/v1776780399/WhatsApp_Image_2026-04-21_at_16.03.49_2_qku7cs.jpg`, title: "Sprint planning", alt: "Séance de planification d'équipe", tag: "Gama Labs", featured: true },
  { id: "genie-upb", src: `${CDN}/v1776779658/IMG_0962_rzhyfo.jpg`, title: "Génie UPB", alt: "Événement Génie UPB", tag: "UPB", year: "2024", featured: true },
  { id: "3d-art", src: `${CDN}/v1776781409/WhatsApp_Image_2026-04-21_at_16.22.52_hgwbaf.jpg`, title: "3D art", alt: "Création 3D", tag: "3D", year: "2023", featured: true },
  { id: "sysdba", src: `${CDN}/v1776779658/IMG_0455_xabsh9.jpg`, title: "SYSDBA", alt: "Session SYSDBA", tag: "Data", year: "2024", featured: true },
  { id: "proactive", src: `${CDN}/v1776780398/WhatsApp_Image_2026-04-21_at_16.03.51_4_glzvrp.jpg`, title: "Proactive Suisse", alt: "Rencontre Proactive Suisse", tag: "Événement", year: "2024", featured: true },
  { id: "fin-competition", src: `${CDN}/v1776779656/IMG_0961_fil3ma.jpg`, title: "Fin de compétition", alt: "Fin d'une compétition", tag: "Compétition", year: "2023", featured: true },
  { id: "lab", src: `${CDN}/v1776779658/IMG_0960_l1ukza.jpg`, title: "Le lab", alt: "Espace de travail de l'équipe", tag: "Génie UPB", featured: true },
  { id: "devanciers", src: `${CDN}/v1776780398/WhatsApp_Image_2026-04-21_at_16.03.51_1_ehjuzc.jpg`, title: "Avec mes devanciers", alt: "Uriel avec ses aînés de l'université", tag: "UPB", year: "2023", featured: true },
  { id: "planete", src: `${CDN}/v1776779661/IMG_2038_wfyfmz.jpg`, title: "Sur ma planète", alt: "Portrait d'Uriel", tag: "Personnel", year: "2024", featured: true },
  { id: "stage", src: `${CDN}/v1776780399/WhatsApp_Image_2026-04-21_at_16.03.50_1_cr3lc4.jpg`, title: "Recherche de stage", alt: "Démarches de recherche de stage", tag: "Parcours", year: "2023", featured: true },
  { id: "classe-1", src: `${CDN}/c_fill,w_1000,h_1000/v1776780398/WhatsApp_Image_2026-04-21_at_16.03.50_3_n9ym0g.jpg`, title: "En classe", alt: "En cours à l'université", tag: "UPB", year: "2024" },
  { id: "classe-2", src: `${CDN}/v1776780398/WhatsApp_Image_2026-04-21_at_16.03.51_2_ga1wvi.jpg`, title: "En classe", alt: "En cours à l'université", tag: "UPB", year: "2024" },
  { id: "paix", src: `${CDN}/v1776780398/WhatsApp_Image_2026-04-21_at_16.03.51_koirzd.jpg`, title: "Paix et joie", alt: "Moment de détente", tag: "Personnel", year: "2023" },
  { id: "dev", src: `${CDN}/v1776780398/WhatsApp_Image_2026-04-21_at_16.03.51_3_hp5u6h.jpg`, title: "Développement", alt: "Session de développement", tag: "Gama Labs" },
  { id: "logo-genie", src: `${CDN}/v1776779652/LOGO_GENIE_UPB_Plan_de_travail_1_copie_5_tun6ea.png`, title: "Identité Génie UPB", alt: "Logo Génie UPB", tag: "Design" },
  { id: "ia", src: `${CDN}/v1776779653/IMG_3642_gehitr.jpg`, title: "Atelier IA", alt: "Atelier autour de l'intelligence artificielle", tag: "IA" },
  { id: "data", src: `${CDN}/v1776779661/IMG_3634_fuf94r.jpg`, title: "Data", alt: "Session de travail sur les données", tag: "Data" },
  { id: "strategie", src: `${CDN}/v1776779655/IMG_7600_h37dod.jpg`, title: "Stratégie", alt: "Réflexion stratégique en équipe", tag: "Gama Labs" },
  { id: "equipe", src: `${CDN}/v1776779663/IMG_1144_cu8rix.jpg`, title: "Réunion d'équipe", alt: "Réunion de l'équipe", tag: "Gama Labs" },
  { id: "famille", src: `${CDN}/v1776779654/IMG_0764_dxajdc.jpg`, title: "En famille", alt: "Photo de famille", tag: "Personnel", year: "2024" },
  { id: "banco", src: `${CDN}/v1776779654/IMG_3002_icw1uc.jpg`, title: "Banco", alt: "Sortie au parc du Banco", tag: "Personnel", year: "2024" },
];

/** Insère les transformations Cloudinary (format/qualité auto, largeur). */
export const cdn = (src: string, width: number) =>
  src.includes("res.cloudinary.com")
    ? src.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`)
    : src;
