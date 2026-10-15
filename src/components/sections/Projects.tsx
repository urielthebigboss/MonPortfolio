import { useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Lock } from "lucide-react";
import { Scene, ChapterHeading } from "../film/Scene";
import { ProjectFrame } from "../projects/Cover";
import { ProjectSheet } from "../projects/ProjectSheet";
import { PillButton, PillLink } from "../ui/Pill";
import { publishedProjects, statusLabel } from "../../data/projects";
import { domains } from "../../data/domains";
import type { DomainId, Project } from "../../types/content";
import { sound } from "../../lib/sound";
import { useMotionOK } from "../../lib/hooks";
import { ease, spring } from "../../lib/motion";
import { TechList } from "../ui/TechList";

/** Même cadre (16:10) pour toutes les réalisations ; seul le côté alterne. */
const LAYOUTS = [
  { aspect: "aspect-[16/10]", frame: "lg:col-span-7", info: "lg:col-span-4 lg:col-start-9" },
  { aspect: "aspect-[16/10]", frame: "lg:col-span-7 lg:col-start-6", info: "lg:col-span-4 lg:col-start-1 lg:row-start-1" },
];

function ProjectEntry({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: () => void;
}) {
  const layout = LAYOUTS[index % LAYOUTS.length];
  const domain = domains.find((d) => d.id === project.category);
  const motionOK = useMotionOK();
  const meta = [project.year, domain?.short, project.context].filter(Boolean);

  return (
    <motion.li
      layout
      className="grid items-center gap-8 lg:grid-cols-12 lg:gap-8"
      initial={false}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
    >
      <button
        type="button"
        onClick={onOpen}
        className={`block rounded-m text-left ${layout.frame}`}
        aria-label={`Ouvrir le projet ${project.title}`}
      >
        <ProjectFrame
          project={project}
          aspect={layout.aspect}
          large={index === 0}
        />
      </button>

      <motion.div
        className={layout.info}
        initial={motionOK ? { opacity: 0, y: 30 } : false}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 0.9, ease: ease.out }}
      >
        <div className="meta flex flex-wrap items-center gap-x-3 gap-y-2 text-mute">
          <span className="tabular-nums text-ink">
            03.{String(index + 1).padStart(2, "0")}
          </span>
          <span
            className={`rounded-full px-2.5 py-1 ${project.status === "publie" ? "bg-signal text-white" : "bg-ink/[0.07] text-ink"}`}
          >
            {statusLabel[project.status]}
          </span>
          {meta.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
        <h3 className="h2 mt-5">{project.title}</h3>
        <p className="mt-4 max-w-[40ch] text-lg text-mute">{project.pitch}</p>
        {project.technologies.length > 0 && (
          <TechList items={project.technologies} className="mt-6" />
        )}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <PillButton onClick={onOpen}>Lire le projet</PillButton>
          {project.confidential ? (
            <span className="flex items-center gap-2 text-sm text-mute">
              <Lock size={15} aria-hidden /> Confidentiel
            </span>
          ) : (
            project.demoUrl && (
              <PillLink href={project.demoUrl} variant="ghost">
                En ligne
              </PillLink>
            )
          )}
        </div>
      </motion.div>
    </motion.li>
  );
}

export function Projects() {
  const [filter, setFilter] = useState<DomainId | "all">("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const categories = useMemo(
    () =>
      domains.filter((d) => publishedProjects.some((p) => p.category === d.id)),
    [],
  );
  const list =
    filter === "all"
      ? publishedProjects
      : publishedProjects.filter((p) => p.category === filter);
  const openIndex = list.findIndex((p) => p.id === openId);
  const open = openIndex >= 0 ? list[openIndex] : null;
  const next =
    open && list.length > 1 ? list[(openIndex + 1) % list.length] : null;

  const openProject = (id: string) => {
    sound.play("open");
    setOpenId(id);
  };

  return (
    <Scene id="realisations" tone="white">
      <div className="wrap relative py-[var(--section-y)]">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <ChapterHeading
            id="realisations"
            title={
              <>
                Des idées devenues <span className="accent">systèmes.</span>
              </>
            }
          />
          <p className="meta text-mute">
            {String(publishedProjects.length).padStart(2, "0")} réalisation
            {publishedProjects.length > 1 ? "s" : ""} documentée
            {publishedProjects.length > 1 ? "s" : ""}
          </p>
        </div>

        {categories.length > 1 && (
          <LayoutGroup id="project-filters">
            <div
              role="group"
              aria-label="Filtrer par domaine"
              className="no-scrollbar -mx-[var(--gutter)] mt-8 flex gap-1 md:mt-12 overflow-x-auto px-[var(--gutter)]"
            >
              {[{ id: "all" as const, short: "Tout" }, ...categories].map(
                (c) => {
                  const on = filter === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => {
                        setFilter(c.id);
                        sound.play("tick");
                      }}
                      className={`relative shrink-0 rounded-full px-4 py-2.5 text-[0.95rem] transition-colors ${on ? "text-paper" : "text-ink hover:bg-ink/[0.05]"}`}
                    >
                      {on && (
                        <motion.span
                          layoutId="filter-pill"
                          className="absolute inset-0 rounded-full bg-ink"
                          transition={spring.pill}
                        />
                      )}
                      <span className="relative">{c.short}</span>
                    </button>
                  );
                },
              )}
            </div>
          </LayoutGroup>
        )}

        <motion.ul layout className="mt-10 space-y-16 md:mt-24 md:space-y-40">
          <AnimatePresence mode="popLayout" initial={false}>
            {list.map((p, i) => (
              <ProjectEntry
                key={p.id}
                project={p}
                index={i}
                onOpen={() => openProject(p.id)}
              />
            ))}
          </AnimatePresence>
        </motion.ul>

      </div>

      <AnimatePresence>
        {open && (
          <ProjectSheet
            key="sheet"
            project={open}
            next={next}
            onClose={() => {
              sound.play("close");
              setOpenId(null);
            }}
            onNext={() => next && setOpenId(next.id)}
          />
        )}
      </AnimatePresence>
    </Scene>
  );
}
