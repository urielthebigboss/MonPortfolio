import react from "devicon/icons/react/react-original.svg";
import nextjs from "devicon/icons/nextjs/nextjs-original.svg";
import vuejs from "devicon/icons/vuejs/vuejs-original.svg";
import javascript from "devicon/icons/javascript/javascript-original.svg";
import nodejs from "devicon/icons/nodejs/nodejs-original.svg";
import java from "devicon/icons/java/java-original.svg";
import mysql from "devicon/icons/mysql/mysql-original.svg";
import oracle from "devicon/icons/oracle/oracle-original.svg";
import supabase from "devicon/icons/supabase/supabase-original.svg";
import firebase from "devicon/icons/firebase/firebase-original.svg";
import postman from "devicon/icons/postman/postman-original.svg";
import github from "devicon/icons/github/github-original.svg";
import python from "devicon/icons/python/python-original.svg";
import figma from "devicon/icons/figma/figma-original.svg";
import aftereffects from "devicon/icons/aftereffects/aftereffects-original.svg";
import blender from "devicon/icons/blender/blender-original.svg";
import framermotion from "devicon/icons/framermotion/framermotion-original.svg";

/*
 * Logos officiels des technologies (Devicon, embarqués localement).
 * La clé est le nom tel qu'écrit dans src/data (insensible à la casse).
 * Une technologie absente de cette table s'affiche en texte
 * (ex. « Machine Learning », « SQL », « UML », « Power BI »).
 * Pour en ajouter une : importez son SVG depuis devicon/icons/<nom>/
 * et ajoutez une entrée ici.
 */
const LOGOS: Record<string, string> = {
  react,
  "next.js": nextjs,
  "vue.js": vuejs,
  javascript,
  "node.js": nodejs,
  java,
  mysql,
  oracle,
  supabase,
  firebase,
  postman,
  github,
  python,
  figma,
  "after effects": aftereffects,
  blender,
  "framer motion": framermotion,
};

const techLogo = (name: string) => LOGOS[name.trim().toLowerCase()];

/** Liste de technologies : logo officiel si disponible, sinon le nom. */
export function TechList({
  items,
  className = "",
  size = "md",
}: {
  items: string[];
  className?: string;
  size?: "sm" | "md";
}) {
  const box = size === "sm" ? "h-9 min-w-9" : "h-10 min-w-10";
  const img = size === "sm" ? "h-5 w-5" : "h-6 w-6";
  return (
    <ul className={`flex flex-wrap gap-1.5 ${className}`}>
      {items.map((t) => {
        const logo = techLogo(t);
        return (
          <li
            key={t}
            title={t}
            className={`inline-flex items-center justify-center rounded-full bg-white ring-1 ring-ink/10 ${box} ${logo ? "px-2" : "px-3.5 text-sm"}`}
          >
            {logo ? (
              <>
                <img src={logo} alt="" width={24} height={24} decoding="async" className={img} />
                <span className="sr-only">{t}</span>
              </>
            ) : (
              t
            )}
          </li>
        );
      })}
    </ul>
  );
}
