import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Scene, ChapterHeading } from "../film/Scene";
import { ScrubText } from "../ui/KineticText";
import { journey } from "../../data/journey";
import { goTo } from "../../lib/film";
import { useHoverSound, useMotionOK } from "../../lib/hooks";
import { ease } from "../../lib/motion";
import { SkillsReel } from "../profile/SkillsGraph";

/** Rôles actuels, tirés du parcours (une seule source de vérité). */
const ROLES = ["gama-labs", "sys", "spt2a", "upb-pole-tech"]
  .map((id) => journey.find((j) => j.id === id))
  .filter((j): j is NonNullable<typeof j> => !!j);

function RoleRow({
  title,
  org,
  index,
}: {
  title: string;
  org: string;
  index: number;
}) {
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
          <span className="h3 block transition-colors duration-300 group-hover:text-signal">
            {title}
          </span>
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
          className="lead mt-8 max-w-[24ch] md:mt-20 lg:ml-[16.66%] [word-spacing:2px] leading-relaxed"
          highlight={["capteur", "décision", "3D"]}
          text="Formé en MIAGE et orienté génie logiciel, je travaille là où les disciplines se rencontrent : une application connectée, une donnée qui devient décision, une idée qui prend forme en 3D."
        />

        <div className="mt-12 md:mt-24">
          <p className="meta mb-6 text-mute">Aujourd'hui</p>
          <ul className="grid border-b border-ink/15 md:grid-cols-2 md:gap-x-10">
            {ROLES.map((r, i) => (
              <RoleRow
                key={r.id}
                title={r.title}
                org={r.organization ?? ""}
                index={i}
              />
            ))}
          </ul>
        </div>
      </div>

      {/* Compétences : défilement horizontal piloté par le scroll */}
      <SkillsReel />
    </Scene>
  );
}
