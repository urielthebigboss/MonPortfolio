import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Lock, X } from "lucide-react";
import type { Project } from "../../types/content";
import { domains } from "../../data/domains";
import { statusLabel } from "../../data/projects";
import { Dialog } from "../ui/Dialog";
import { PillLink } from "../ui/Pill";
import { TypographicCover } from "./Cover";
import { ease } from "../../lib/motion";
import { sound } from "../../lib/sound";
import { TechList } from "../ui/TechList";
import { OrgText } from "../ui/OrgText";

/**
 * Fiche détaillée : monte depuis le bas comme un plan qui pousse
 * le précédent. « Projet suivant » enchaîne comme un épisode.
 */
export function ProjectSheet({
  project,
  next,
  onClose,
  onNext,
}: {
  project: Project;
  next: Project | null;
  onClose: () => void;
  onNext: () => void;
}) {
  const domain = domains.find((d) => d.id === project.category);
  const scroller = useRef<HTMLElement>(null);
  // « Projet suivant » : on repart du haut de la fiche.
  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 });
  }, [project.id]);
  const facts = [
    { label: "Année", value: project.year },
    { label: "Rôle", value: project.role },
    { label: "Contexte", value: project.context },
    { label: "Domaine", value: domain?.title },
    { label: "Statut", value: statusLabel[project.status] },
  ].filter((f): f is { label: string; value: string } => !!f.value);

  const images = [project.cover, ...project.gallery].filter(
    (i): i is NonNullable<typeof i> => !!i,
  );

  return (
    <Dialog onClose={onClose} label={`Projet : ${project.title}`}>
      <motion.div
        className="fixed inset-0 z-[95] bg-ink/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        onClick={onClose}
        aria-hidden
      />
      <motion.article
        ref={scroller}
        className="fixed inset-x-0 bottom-0 top-3 z-[96] overflow-y-auto overscroll-contain rounded-t-l bg-paper text-ink sm:top-6 lg:inset-x-6"
        data-lenis-prevent
        initial={{ y: "100%" }}
        animate={{ y: "0%" }}
        exit={{ y: "100%" }}
        transition={{ duration: 0.7, ease: ease.inOut }}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between bg-paper/90 px-[var(--gutter)] py-4 backdrop-blur">
          <span className="meta text-mute">Réalisation {domain?.short}</span>
          <button
            type="button"
            onClick={onClose}
            data-autofocus
            className="grid h-11 w-11 place-items-center rounded-full bg-ink text-paper transition-colors hover:bg-signal"
            aria-label="Fermer la fiche projet"
          >
            <X size={20} strokeWidth={1.8} />
          </button>
        </div>

        <div className="wrap pb-[calc(48px+var(--safe-bottom))] pt-6 md:pt-10">
          <motion.h2
            className="display max-w-[12ch] !text-[clamp(3rem,9vw,9rem)]"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: ease.out, delay: 0.25 }}
          >
            {project.title}
          </motion.h2>
          <p className="lead mt-6 max-w-[28ch] text-mute">{project.pitch}</p>

          <div className="mt-12 grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-8">
              {images.length > 0 ? (
                <div className="grid gap-4">
                  {images.map((img, i) => (
                    <img
                      key={img.src + i}
                      src={img.src}
                      alt={img.alt}
                      loading={i === 0 ? "eager" : "lazy"}
                      decoding="async"
                      className="w-full rounded-m bg-ink-2 object-cover"
                    />
                  ))}
                </div>
              ) : (
                <div className="relative aspect-[16/10] overflow-hidden rounded-m">
                  <TypographicCover project={project} large />
                </div>
              )}

              <div className="mt-12 max-w-[62ch] space-y-5 text-[1.1rem] leading-relaxed">
                {project.description.split(/\n\s*\n/).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>

            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-24">
                <dl className="divide-y divide-ink/10 border-y border-ink/10">
                  {facts.map((f) => (
                    <div key={f.label} className="grid grid-cols-[7rem_1fr] gap-4 py-3.5">
                      <dt className="meta pt-1 text-mute">{f.label}</dt>
                      <dd>
                        <OrgText text={f.value} />
                      </dd>
                    </div>
                  ))}
                </dl>

                {project.technologies.length > 0 && (
                  <>
                    <p className="meta mb-3 mt-8 text-mute">Technologies</p>
                    <TechList items={project.technologies} />
                  </>
                )}

                <div className="mt-8 flex flex-wrap gap-3">
                  {project.confidential ? (
                    <p className="flex items-center gap-2 text-mute">
                      <Lock size={16} aria-hidden /> Projet confidentiel — démonstration sur demande.
                    </p>
                  ) : (
                    <>
                      {project.demoUrl && <PillLink href={project.demoUrl}>Voir en ligne</PillLink>}
                      {project.repoUrl && (
                        <PillLink href={project.repoUrl} variant="ghost">
                          Code source
                        </PillLink>
                      )}
                      {project.links?.map((l) => (
                        <PillLink key={l.url} href={l.url} variant="ghost">
                          {l.label}
                        </PillLink>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </aside>
          </div>

          {next && (
            <button
              type="button"
              onClick={() => {
                sound.play("cut");
                onNext();
              }}
              className="group mt-24 flex w-full items-end justify-between gap-6 border-t border-ink/15 pt-8 text-left"
            >
              <span>
                <span className="meta text-mute">Projet suivant</span>
                <span className="h2 mt-3 block transition-colors group-hover:text-signal">{next.title}</span>
              </span>
              <ArrowRight
                size={40}
                strokeWidth={1.2}
                className="mb-2 shrink-0 transition-transform duration-500 ease-out group-hover:translate-x-2"
                aria-hidden
              />
            </button>
          )}
        </div>
      </motion.article>
    </Dialog>
  );
}
