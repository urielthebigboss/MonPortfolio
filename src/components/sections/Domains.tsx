import { useRef, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Scene, ChapterHeading } from "../film/Scene";
import { DomainVisual } from "../domains/DomainVisual";
import { hue } from "../domains/domainIcons";
import { domains } from "../../data/domains";
import type { Domain } from "../../types/content";
import { selectedDomain } from "../../lib/selection";
import { useStore } from "../../lib/store";
import { sound } from "../../lib/sound";
import { useFinePointer, useIsDesktop } from "../../lib/hooks";
import { ease } from "../../lib/motion";
import { TechList } from "../ui/TechList";

function DomainDetail({ domain, compact = false }: { domain: Domain; compact?: boolean }) {
  return (
    <div>
      <p className={`${compact ? "text-lg" : "text-xl"} leading-snug text-ink`}>{domain.description}</p>
      <ul className="mt-6 grid gap-2 sm:grid-cols-2">
        {domain.capabilities.map((c) => (
          <li key={c} className="flex gap-3 text-[0.95rem] text-ink/70">
            <span className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-signal" aria-hidden />
            {c}
          </li>
        ))}
      </ul>
      {domain.tools.length > 0 && (
        <>
          <p className="meta mb-3 mt-8 text-mute">Outils</p>
          <TechList items={domain.tools} />
        </>
      )}
      {domain.stance && (
        <p className="mt-8 border-l-2 border-signal pl-4 text-[0.95rem] text-mute">{domain.stance}</p>
      )}
    </div>
  );
}

export function Domains() {
  const active = useStore(selectedDomain);
  const desktop = useIsDesktop();
  const fine = useFinePointer();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = domains.find((d) => d.id === active) ?? domains[0];

  const select = (id: Domain["id"], withSound = true) => {
    if (id === selectedDomain.get()) return;
    selectedDomain.set(id);
    if (withSound) sound.play("tick");
  };

  /* Navigation clavier façon onglets (flèches haut/bas, début/fin). */
  const onKey = (e: KeyboardEvent, index: number) => {
    const last = domains.length - 1;
    const next =
      e.key === "ArrowDown" ? (index === last ? 0 : index + 1)
      : e.key === "ArrowUp" ? (index === 0 ? last : index - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (next === null) return;
    e.preventDefault();
    tabRefs.current[next]?.focus();
    select(domains[next].id);
  };

  return (
    <Scene id="domaines" tone="white">

      <div className="wrap relative py-[var(--section-y)]">
        <ChapterHeading
          id="domaines"
          title={
            <>
              Cinq disciplines,
              <br />
              <span className="accent">une seule chaîne.</span>
            </>
          }
        >
          <p className="mt-5 max-w-[46ch] text-lg text-mute md:mt-8">
            Du capteur à l'interface, de la donnée à la décision, du plan à la 3D :
            chaque discipline nourrit la suivante. Sélectionnez-en une.
          </p>
        </ChapterHeading>

        {desktop ? (
          <div className="mt-20 grid grid-cols-12 gap-8">
            <div role="tablist" aria-orientation="vertical" aria-label="Domaines" className="col-span-6 border-b border-ink/15">
              {domains.map((d, i) => {
                const on = d.id === active;
                return (
                  <button
                    key={d.id}
                    ref={(el) => {
                      tabRefs.current[i] = el;
                    }}
                    role="tab"
                    id={`tab-${d.id}`}
                    aria-selected={on}
                    aria-controls="domain-panel"
                    tabIndex={on ? 0 : -1}
                    onClick={() => select(d.id)}
                    onPointerEnter={() => fine && select(d.id)}
                    onKeyDown={(e) => onKey(e, i)}
                    className="group grid w-full grid-cols-[3.5rem_1fr] items-baseline border-t border-ink/15 py-6 text-left"
                  >
                    <span className="meta transition-colors" style={{ color: on ? hue(d.id) : "rgb(var(--c-mute))" }}>{d.number}</span>
                    <span>
                      <span
                        className={`block text-[clamp(1.8rem,3.2vw,3.2rem)] font-semibold leading-none tracking-[-0.045em] transition-all duration-500 ease-out ${on ? "translate-x-0 text-ink" : "text-ink/30 group-hover:text-ink/55"}`}
                      >
                        {d.title}
                      </span>
                      <motion.span
                        className="block overflow-hidden text-mute"
                        initial={false}
                        animate={{ height: on ? "auto" : 0, opacity: on ? 1 : 0, marginTop: on ? 12 : 0 }}
                        transition={{ duration: 0.45, ease: ease.out }}
                      >
                        <span className="text-xl font-medium tracking-[-0.02em] text-ink/70">{d.statement}</span>
                      </motion.span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="col-span-6">
              <div
                id="domain-panel"
                role="tabpanel"
                aria-labelledby={`tab-${current.id}`}
                className="sticky top-[12vh] overflow-hidden rounded-[32px] bg-paper p-7 shadow-[var(--shadow-1)] ring-1 ring-ink/[0.07] xl:p-9"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={current.id}
                    initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -12, filter: "blur(6px)" }}
                    transition={{ duration: 0.4, ease: ease.out }}
                  >
                    <div
                      className="mb-7 rounded-[24px] bg-ink p-3"
                    >
                      <DomainVisual id={current.id} className="mx-auto h-[24vh] max-h-[300px] w-full" />
                    </div>
                    <DomainDetail domain={current} />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        ) : (
          /* Mobile & tablette : accordéon, une lecture simple au pouce */
          <ul className="mt-8 border-b border-ink/15 md:mt-14">
            {domains.map((d) => {
              const on = d.id === active;
              return (
                <li key={d.id} className="border-t border-ink/15">
                  <h3>
                    <button
                      type="button"
                      aria-expanded={on}
                      aria-controls={`domain-${d.id}`}
                      onClick={() => select(d.id)}
                      className="grid min-h-[64px] w-full grid-cols-[2.5rem_1fr_auto] items-center py-5 text-left"
                    >
                      <span className={`meta ${on ? "text-signal" : "text-mute"}`}>{d.number}</span>
                      <span className={`text-[1.65rem] font-semibold leading-[1.05] tracking-[-0.04em] ${on ? "text-ink" : "text-ink/45"}`}>
                        {d.title}
                      </span>
                      <Plus
                        size={22}
                        strokeWidth={1.5}
                        className={`transition-transform duration-300 ${on ? "rotate-45" : ""}`}
                        aria-hidden
                      />
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.div
                        id={`domain-${d.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: ease.out }}
                        className="overflow-hidden"
                      >
                        <div className="pb-10">
                          <p className="mb-6 text-xl font-medium tracking-[-0.02em] text-ink/75">{d.statement}</p>
                          <div
                            className="mb-6 rounded-[22px] bg-ink p-3"
                          >
                            <DomainVisual id={d.id} className="mx-auto w-full max-w-[380px]" />
                          </div>
                          <DomainDetail domain={d} compact />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Scene>
  );
}
