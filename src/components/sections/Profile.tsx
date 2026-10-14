import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Scene, ChapterHeading } from "../film/Scene";
import { ScrubText } from "../ui/KineticText";
import { journey } from "../../data/journey";
import { transversal } from "../../data/domains";
import { goTo } from "../../lib/film";
import { useHoverSound, useMotionOK } from "../../lib/hooks";
import { ease } from "../../lib/motion";

/** Rôles actuels, tirés du parcours (une seule source de vérité). */
const ROLES = ["gama-labs", "sys", "spt2a", "upb-pole-tech"]
  .map((id) => journey.find((j) => j.id === id))
  .filter((j): j is NonNullable<typeof j> => !!j);

function RoleRow({ title, org, index }: { title: string; org: string; index: number }) {
  const hover = useHoverSound("tick");
  const motionOK = useMotionOK();
  return (
    <motion.li
      initial={motionOK ? { opacity: 0, y: 20 } : false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.7, ease: ease.out, delay: index * 0.07 }}
    >
      <button
        type="button"
        onClick={() => void goTo("parcours")}
        className="group grid w-full grid-cols-[1fr_auto] items-center gap-4 border-t border-ink/15 py-5 text-left"
        {...hover}
      >
        <span>
          <span className="h3 block transition-colors duration-300 group-hover:text-signal">{title}</span>
          <span className="mt-1 block text-[0.95rem] text-mute">{org}</span>
        </span>
        <ArrowRight
          size={20}
          strokeWidth={1.6}
          className="-translate-x-2 opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:opacity-100"
          aria-hidden
        />
      </button>
    </motion.li>
  );
}

export function Profile() {
  return (
    <Scene id="profil" tone="white">
      <div className="wrap relative py-[var(--section-y)]">
        <ChapterHeading
          id="profil"
          title={
            <>
              Relier le terrain, la donnée{" "}
              <span className="accent">et l'écran.</span>
            </>
          }
        />

        <ScrubText
          className="lead mt-8 max-w-[24ch] md:mt-20 lg:ml-[16.66%]"
          highlight={["capteur", "décision", "3D"]}
          text="Formé en MIAGE et orienté génie logiciel, je travaille là où les disciplines se rencontrent : une application qui dialogue avec un capteur, une donnée qui devient décision, une idée qui prend forme en 3D. Je ne choisis pas entre le code et le design — je les fais travailler ensemble."
        />

        <div className="mt-12 grid gap-10 md:mt-24 md:gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <p className="meta mb-6 text-mute">Aujourd'hui</p>
            <ul className="border-b border-ink/15">
              {ROLES.map((r, i) => (
                <RoleRow key={r.id} title={r.title} org={r.organization ?? ""} index={i} />
              ))}
            </ul>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <p className="meta mb-6 text-mute">Compétences transverses</p>
            <ul className="flex flex-wrap gap-2">
              {transversal.skills.map((s) => (
                <li key={s} className="glass rounded-full px-4 py-2 text-[0.95rem]">
                  {s}
                </li>
              ))}
            </ul>
            <p className="meta mb-4 mt-8 text-mute md:mb-6 md:mt-10">Langues</p>
            <ul className="flex flex-wrap gap-2">
              <li className="glass rounded-full px-4 py-2 text-[0.95rem]">
                Français
              </li>
              {transversal.languages.map((l) => (
                <li key={l.label} className="glass rounded-full px-4 py-2 text-[0.95rem]">
                  {l.label} <span className="meta ml-1 text-mute">{l.level}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </Scene>
  );
}
