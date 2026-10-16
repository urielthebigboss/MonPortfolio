import { Fragment } from "react";
import { ORG_LOGOS } from "../../lib/orgLogos";

const NAMES = Object.keys(ORG_LOGOS);
const SPLIT = new RegExp(`(${NAMES.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "g");

/**
 * Affiche un texte en plaçant le logo de chaque structure connue
 * (src/lib/orgLogos.ts) devant son nom. `invert` : logo blanc sur fond sombre.
 */
export function OrgText({ text, invert = false }: { text: string; invert?: boolean }) {
  if (!NAMES.length) return <>{text}</>;
  return (
    <>
      {text.split(SPLIT).map((part, i) =>
        ORG_LOGOS[part] ? (
          <span key={i} className="inline-flex items-center gap-[0.35em] whitespace-nowrap align-bottom">
            <img
              src={ORG_LOGOS[part]}
              alt=""
              aria-hidden
              className={`h-[1em] w-[1em] shrink-0 object-contain ${invert ? "invert" : ""}`}
            />
            {part}
          </span>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}
