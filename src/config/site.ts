/* ════════════════════════════════════════════════════════════
   CONFIGURATION DU SITE — identité & coordonnées
   ------------------------------------------------------------
   • Une valeur `null` ou vide masque proprement le lien concerné.
   • WhatsApp : numéro au format international, chiffres seuls,
     sans « + » ni espaces. Exemple : "2250700000000".
   ════════════════════════════════════════════════════════════ */

export const site = {
  name: "Uriel Jean-Bedel Dakaud",
  shortName: "Uriel Dakaud",
  monogram: "D",
  edition: "Édition 2026",

  /** Phrase-signature utilisée dans le hero et les métadonnées. */
  signature: "Du signal au système",

  /** Adresse e-mail publique (utilisée en mailto:). À vérifier : l'ancien
   *  site affichait aussi « hello@dak-aud.dev » sur la page contact. */
  email: "dakauduriel@gmail.com",

  /** Numéro WhatsApp international (ex. "2250700000000"). null = masqué. */
  whatsapp: null as string | null,

  /** Message pré-rempli à l'ouverture d'une conversation WhatsApp. */
  whatsappMessage: "Bonjour Uriel, je viens de découvrir votre portfolio.",

  /** Fichier CV à déposer dans /public (ex. "/cv-uriel-dakaud.pdf"). null = masqué. */
  cv: null as string | null,
} as const;

export type SocialLink = {
  id: string;
  label: string;
  /** Identifiant affiché (ex. @urielbeydel). */
  handle: string;
  url: string | null;
};

/** Réseaux & profils. Laissez `url: null` pour masquer une entrée. */
export const socials: SocialLink[] = [
  {
    id: "linkedin",
    label: "LinkedIn",
    handle: "Dakaud Uriel Jean-Bedel",
    url: "https://www.linkedin.com/in/dakaud-uriel-jean-bedel-194788375",
  },
  {
    id: "github",
    label: "GitHub",
    handle: "@urielthebigboss",
    url: "https://github.com/urielthebigboss",
  },
  {
    id: "instagram",
    label: "Instagram",
    handle: "Instagram",
    // L'ancien lien pointait vers une publication et non vers le profil :
    // remplacez par l'URL du profil (https://www.instagram.com/<compte>/).
    url: "https://www.instagram.com/p/DMWGL2godrV/",
  },
  {
    id: "tiktok",
    label: "TikTok",
    handle: "@urielbeydel",
    url: "https://www.tiktok.com/@urielbeydel",
  },
];

export const mailto = (subject?: string, body?: string) => {
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  const query = params.toString().replace(/\+/g, "%20");
  return `mailto:${site.email}${query ? `?${query}` : ""}`;
};

export const whatsappUrl = () =>
  site.whatsapp
    ? `https://wa.me/${site.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(site.whatsappMessage)}`
    : null;
