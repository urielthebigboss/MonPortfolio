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
import redis from "devicon/icons/redis/redis-original.svg";
import powerbi from "../assets/logos/powerbi.svg";
import { siUml } from "simple-icons";

/** Logo Simple Icons (monochrome officiel) converti en image, couleur de marque. */
const simpleIcon = (icon: { path: string; hex: string }) =>
  `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#${icon.hex}"><path d="${icon.path}"/></svg>`)}`;

/*
 * Logos officiels des technologies (Devicon, embarqués localement).
 * La clé est le nom tel qu'écrit dans src/data (insensible à la casse).
 * Une technologie absente de cette table s'affiche en texte
 * (ex. « Machine Learning », « SQL »).
 * Pour en ajouter une : importez son SVG depuis devicon/icons/<nom>/
 * et ajoutez une entrée ici.
 */
export const LOGOS: Record<string, string> = {
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
  redis,
  "power bi": powerbi,
  uml: simpleIcon(siUml),
};

export const techLogo = (name: string) => LOGOS[name.trim().toLowerCase()];
