import { motion } from "framer-motion";
import { chapters, type ChapterId } from "../../data/chapters";
import { activeChapter, filmLink, goTo } from "../../lib/film";
import { useStore } from "../../lib/store";
import { sound } from "../../lib/sound";
import { useFinePointer } from "../../lib/hooks";
import { ease, spring } from "../../lib/motion";

/** Un lien par chapitre ; l'ouverture s'affiche « Accueil ». */
const LINKS = chapters.map((c) => ({ ...c, label: c.id === "ouverture" ? "Accueil" : c.title }));
/** Masqués sur tablette pour garder une barre lisible. */
const DESKTOP_ONLY: ChapterId[] = ["coulisses", "studio"];

/**
 * Barre de navigation fixe en haut, desktop & tablette uniquement
 * (sur mobile, la navigation passe par la barre d'onglets en bas).
 * Liens vers chaque chapitre avec pastille active glissante ;
 * toujours en verre pour rester lisible sur les photos.
 */
export function TopBar() {
  const active = useStore(activeChapter);
  const fine = useFinePointer();
  const dark = false; // tout le site est sur fond blanc


  return (
    <motion.header
      className={`fixed inset-x-0 top-0 z-[70] hidden transition-colors duration-500 md:block ${dark ? "text-paper" : "text-ink"}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: ease.out, delay: 0.2 }}
    >
      <div className="wrap flex justify-center pt-3">
        <div
          className={`flex h-[60px] items-center gap-1 rounded-full px-1.5 transition-[background,box-shadow] duration-500 ${
            dark ? "glass-dark" : "glass"
          }`}
        >
          <nav aria-label="Chapitres">
            <ul className="flex items-center gap-0.5">
              {LINKS.map((c) => {
                const on = active === c.id;
                return (
                  <li key={c.id} className={DESKTOP_ONLY.includes(c.id) ? "hidden xl:block" : undefined}>
                    <a
                      {...filmLink(c.id)}
                      aria-current={on ? "location" : undefined}
                      onPointerEnter={() => fine && !on && sound.play("navHover")}
                      className={`relative block rounded-full px-3.5 py-2 text-[0.9rem] font-medium tracking-[-0.01em] transition-colors duration-300 xl:px-4 ${
                        on ? (dark ? "text-ink" : "text-paper") : "opacity-75 hover:opacity-100"
                      }`}
                    >
                      {on && (
                        <motion.span
                          layoutId="topbar-active"
                          className={`absolute inset-0 rounded-full ${dark ? "bg-paper" : "btn-solid"}`}
                          transition={spring.pill}
                        />
                      )}
                      <span className="relative flex items-center gap-2">
                        <c.icon size={16} strokeWidth={on ? 2.1 : 1.7} aria-hidden className="shrink-0" />
                        {c.label}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <button
            type="button"
            onClick={() => void goTo("contact")}
            className="ml-2 hidden h-11 items-center whitespace-nowrap rounded-full bg-signal px-5 text-[0.9rem] font-medium text-white shadow-[0_10px_26px_-10px_rgb(var(--c-signal)/0.8)] transition-transform hover:scale-[1.03] lg:flex"
          >
            Me contacter
          </button>
        </div>
      </div>
    </motion.header>
  );
}
