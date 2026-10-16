import { useEffect, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useScroll, useSpring } from "framer-motion";
import { Plus } from "lucide-react";
import { Scene, ChapterHeading } from "../film/Scene";
import { journey, journeyStatusLabel, kindLabel, periodLabel } from "../../data/journey";
import type { JourneyEntry, JourneyKind } from "../../types/content";
import { sound } from "../../lib/sound";
import { useIsDesktop, useMotionOK } from "../../lib/hooks";
import { ease, spring } from "../../lib/motion";
import { OrgText } from "../ui/OrgText";

type Filter = JourneyKind | "all";
const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "Tout" },
  { id: "formation", label: "Formation" },
  { id: "experience", label: "Expériences" },
  { id: "engagement", label: "Responsabilités" },
];

function Entry({
  entry,
  active,
  onActive,
}: {
  entry: JourneyEntry;
  active: boolean;
  onActive: (id: string) => void;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const [open, setOpen] = useState(false);
  const motionOK = useMotionOK();
  const period = periodLabel(entry);
  const upcoming = entry.status === "a-venir";

  // Entrée active = celle qui passe au centre de l'écran.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && onActive(entry.id), {
      rootMargin: "-48% 0px -48% 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, [onActive, entry.id]);

  return (
    <motion.li
      ref={ref}
      layout
      initial={motionOK ? { opacity: 0, y: 40 } : false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: ease.out }}
      className="relative pb-10 pl-9 last:pb-0 md:pb-14 md:pl-14"
    >
      {/* Nœud sur la ligne de lecture */}
      <span
        className={`absolute left-0 top-2 grid h-[15px] w-[15px] place-items-center rounded-full border transition-all duration-500 ${active ? "scale-125 border-signal bg-paper-2" : "border-ink/25 bg-paper-2"} ${upcoming ? "border-dashed" : ""}`}
        aria-hidden
      >
        <span className={`h-[7px] w-[7px] rounded-full transition-colors duration-500 ${active ? "bg-signal" : "bg-ink/20"}`} />
      </span>

      <div className={`transition-opacity duration-500 ${active ? "opacity-100" : "opacity-55"}`}>
        <div className="meta flex flex-wrap items-center gap-x-3 gap-y-2 text-mute">
          <span className="text-ink">{kindLabel[entry.kind]}</span>
          {period && <span className="tabular-nums">{period}</span>}
          {entry.status && (
            <span
              className={`rounded-full px-2.5 py-1 ${upcoming ? "bg-signal text-white" : "bg-ink/[0.07] text-ink"}`}
            >
              {journeyStatusLabel[entry.status]}
            </span>
          )}
        </div>
        <h3 className="h3 mt-3 max-w-[28ch]">{entry.title}</h3>
        {entry.organization && (
          <p className="mt-1.5 text-[1.02rem] text-mute">
            <OrgText text={entry.organization} />
          </p>
        )}
        <p className="mt-4 max-w-[52ch]">{entry.summary}</p>

        {entry.details.length > 0 && (
          <>
            <button
              type="button"
              aria-expanded={open}
              aria-controls={`journey-${entry.id}`}
              onClick={() => {
                setOpen((v) => !v);
                sound.play(open ? "close" : "milestone");
              }}
              className="mt-4 inline-flex min-h-[44px] items-center gap-2 text-[0.95rem] font-medium"
            >
              <Plus size={16} className={`transition-transform duration-300 ${open ? "rotate-45" : ""}`} aria-hidden />
              {open ? "Moins de détails" : "Détails"}
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.ul
                  id={`journey-${entry.id}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: ease.out }}
                  className="overflow-hidden"
                >
                  {entry.details.map((d) => (
                    <li key={d} className="flex gap-3 pt-2 text-mute">
                      <span className="mt-[0.65em] h-1 w-1 shrink-0 rounded-full bg-signal" aria-hidden />
                      {d}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </>
        )}

        {import.meta.env.DEV && entry.todo && entry.todo.length > 0 && (
          <p className="meta mt-4 inline-block rounded-md border border-dashed border-warm px-2.5 py-1.5 text-warm">
            Dev · à compléter : {entry.todo.join(", ")}
          </p>
        )}
      </div>
    </motion.li>
  );
}

/** Grand repère à gauche : numéro de l'étape active, période et structure. */
function ActiveMarker({ entry, index, total }: { entry: JourneyEntry; index: number; total: number }) {
  const period = periodLabel(entry);
  return (
    <div className="sticky top-[22vh]">
      <p className="meta text-mute">Position de lecture</p>
      <div className="relative mt-4 flex items-start gap-3">
        <div className="relative h-[clamp(5rem,10vw,9rem)] w-[2.2ch] overflow-hidden text-[clamp(5rem,10vw,9rem)] font-semibold leading-none tracking-[-0.07em] tabular-nums">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={entry.id}
              className="absolute inset-0"
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.6, ease: ease.out }}
            >
              {String(index + 1).padStart(2, "0")}
            </motion.span>
          </AnimatePresence>
        </div>
        <span className="meta mt-3 text-mute">/ {String(total).padStart(2, "0")}</span>
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={entry.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35 }}
        >
          <p className="meta mt-6 text-ink">
            {kindLabel[entry.kind]}
            {period ? ` · ${period}` : ""}
          </p>
          <p className="mt-3 max-w-[20ch] text-2xl font-medium leading-tight tracking-[-0.03em] text-mute">
            <OrgText text={entry.organization ?? entry.title} />
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function Journey() {
  const [filter, setFilter] = useState<Filter>("all");
  const [activeId, setActiveId] = useState(journey[0].id);
  const listRef = useRef<HTMLOListElement>(null);
  const desktop = useIsDesktop();
  const motionOK = useMotionOK();
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 0.5", "end 0.5"] });
  const line = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  const list = filter === "all" ? journey : journey.filter((j) => j.kind === filter);
  const active = list.find((j) => j.id === activeId) ?? list[0];

  return (
    <Scene id="parcours" tone="white">
      <div className="wrap relative py-[var(--section-y)]">
        <ChapterHeading
          id="parcours"
          title={
            <>
              Apprendre, fonder,
              <br />
              <span className="accent">transmettre.</span>
            </>
          }
        >
          <p className="mt-5 max-w-[48ch] text-lg text-mute md:mt-8">
            Formation, entreprises et responsabilités, un parcours qui avance sur
            plusieurs fronts à la fois.
          </p>
        </ChapterHeading>

        <LayoutGroup id="journey-filters">
          <div role="group" aria-label="Filtrer le parcours" className="no-scrollbar -mx-[var(--gutter)] mt-8 flex gap-1 md:mt-12 overflow-x-auto px-[var(--gutter)]">
            {FILTERS.map((f) => {
              const on = filter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => {
                    setFilter(f.id);
                    sound.play("tick");
                  }}
                  className={`relative shrink-0 rounded-full px-4 py-2.5 text-[0.95rem] transition-colors ${on ? "text-paper" : "hover:bg-ink/[0.05]"}`}
                >
                  {on && <motion.span layoutId="journey-pill" className="absolute inset-0 rounded-full bg-ink" transition={spring.pill} />}
                  <span className="relative">{f.label}</span>
                </button>
              );
            })}
          </div>
        </LayoutGroup>

        <div className="mt-10 grid gap-12 md:mt-16 lg:mt-24 lg:grid-cols-12 lg:gap-8">
          {desktop && active && (
            <div className="lg:col-span-5">
              <ActiveMarker entry={active} index={list.indexOf(active)} total={list.length} />
            </div>
          )}

          <div className="relative lg:col-span-7">
            {/* Ligne de lecture : se remplit au défilement */}
            <span className="absolute bottom-2 left-[7px] top-2 w-px bg-ink/[0.12]" aria-hidden />
            {motionOK && (
              <motion.span
                className="absolute bottom-2 left-[7px] top-2 w-px origin-top bg-signal"
                style={{ scaleY: line }}
                aria-hidden
              />
            )}
            <motion.ol ref={listRef} layout className="relative">
              <AnimatePresence mode="popLayout" initial={false}>
                {list.map((entry) => (
                  <Entry
                    key={entry.id}
                    entry={entry}
                    active={entry.id === active?.id}
                    onActive={setActiveId}
                  />
                ))}
              </AnimatePresence>
            </motion.ol>
          </div>
        </div>
      </div>
    </Scene>
  );
}
