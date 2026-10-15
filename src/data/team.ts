/* ════════════════════════════════════════════════════════════
   ÉQUIPE — Gama Labs (dernier panneau du défilement « Compétences »)
   ------------------------------------------------------------
   • Logo : déposez-le dans src/assets/team/ puis importez-le :
       import gamaLogo from "../assets/team/gama-labs.svg";
     et remplacez `logo: null` par `logo: gamaLogo`.
   • url : lien vers le portfolio du membre (https://…).
     Tant qu'il vaut null, la carte n'est pas cliquable.
   • photo : même principe que le logo (null = initiales).
   • me: true → la carte ramène au début de ce portfolio.
   ════════════════════════════════════════════════════════════ */

export type TeamRole = "UI/UX" | "IA" | "Backend" | "Frontend" | "Communication";

export type TeamMember = {
  id: string;
  name: string;
  handle?: string;
  roles: TeamRole[];
  url: string | null;
  photo?: string | null;
  me?: boolean;
};

export const team = {
  name: "Gama Labs",
  logo: null as string | null,
  /** Sous-titre de la carte principale. */
  tagline: "Startup tech, cofondée en 2025",
  members: [
    { id: "uriel", name: "Uriel Dakaud", handle: "@sys", roles: ["UI/UX", "Backend"], url: null, me: true },
    { id: "caleb", name: "Deroux Caleb", roles: ["UI/UX", "IA"], url: null },
    { id: "grace", name: "Grace Divine", roles: ["Backend"], url: null },
    { id: "serge", name: "Ahoussi Serge", roles: ["Frontend",], url: null },
    { id: "kofi", name: "Baidoo Kofi", roles: ["Frontend"], url: null },
    { id: "yao", name: "Yao Eliakim", handle: "@dev", roles: ["Frontend"], url: null },
  ] satisfies TeamMember[] as TeamMember[],
};

/** Teinte RGB de chaque rôle (badges, avatars). */
export const roleTint: Record<TeamRole, string> = {
  "UI/UX": "244 80 120",
  IA: "139 92 246",
  Backend: "22 178 110",
  Frontend: "41 82 255",
  Communication: "242 107 29",
};
