import { siGmail, siInstagram, siTiktok, siWhatsapp } from "simple-icons";
import linkedin from "devicon/icons/linkedin/linkedin-original.svg";
import github from "devicon/icons/github/github-original.svg";

/*
 * Logos officiels des réseaux (couleurs de marque).
 * LinkedIn & GitHub : Devicon. Gmail, Instagram, TikTok, WhatsApp : Simple Icons.
 */
const SVG_PATHS: Record<string, { path: string; hex: string }> = {
  gmail: siGmail,
  instagram: siInstagram,
  tiktok: siTiktok,
  whatsapp: siWhatsapp,
};
const FILES: Record<string, string> = { linkedin, github };

export function SocialIcon({ id, size = 24 }: { id: string; size?: number }) {
  const file = FILES[id];
  if (file) return <img src={file} alt="" width={size} height={size} className="shrink-0" />;
  const icon = SVG_PATHS[id];
  if (!icon) return null;
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={`#${icon.hex}`} aria-hidden className="shrink-0">
      <path d={icon.path} />
    </svg>
  );
}
