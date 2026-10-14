import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowUp, Play } from "lucide-react";
import { chapters } from "../../data/chapters";
import { site, socials } from "../../config/site";
import { gallery, cdn } from "../../data/gallery";
import { filmLink, goTo } from "../../lib/film";
import { sound } from "../../lib/sound";
import { useMotionOK } from "../../lib/hooks";
import { ease } from "../../lib/motion";
import { SoundControl } from "../navigation/SoundControl";
import { Lightbox } from "../projects/Lightbox";

/*
 * Générique de fin, sur le modèle de la référence « Strikers » :
 * une grande carte photo arrondie (sortie terrain au Banco), titre blanc
 * en haut à gauche, boutons, carte « vidéo » en verre qui lance le film
 * des coulisses, pastilles de navigation et nom géant translucide en bas.
 */

const BG = `https://res.cloudinary.com/dppzzrley/image/upload/f_auto,q_auto,w_2000/v1776779654/IMG_3002_icw1uc.jpg`;
const FILM_START = Math.max(0, gallery.findIndex((g) => g.id === "equipe"));
const LINKS = chapters.filter((c) => c.id !== "ouverture");

const chip =
  "inline-flex min-h-[38px] items-center rounded-full bg-white/15 px-4 text-[0.85rem] font-medium text-white ring-1 ring-white/20 backdrop-blur-md transition-colors hover:bg-white/30";

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const motionOK = useMotionOK();
  const [film, setFilm] = useState<number | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  // Le fond glisse légèrement et le nom monte : le générique « se pose ».
  const bgY = useTransform(scrollYProgress, [0, 1], ["-8%", "0%"]);
  const wordY = useTransform(scrollYProgress, [0.6, 1], ["26%", "10%"]);
  const year = new Date().getFullYear();
  const move = useCallback((d: number) => {
    setFilm((i) => (i === null ? i : (i + d + gallery.length) % gallery.length));
  }, []);

  return (
    <footer ref={ref} data-tone="light" className="bg-paper px-[max(12px,1.2vw)] pb-tabbar pt-6 md:pb-[max(12px,1.2vw)]">
      <div className="relative isolate flex min-h-[92svh] flex-col overflow-hidden rounded-[22px] bg-[#25301f] text-white md:min-h-[calc(100svh-max(24px,2.4vw))] md:rounded-[28px]">
        {/* Photo plein cadre */}
        <motion.img
          src={BG}
          alt="Sortie terrain en forêt du Banco avec l'équipe"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 -z-10 h-[116%] w-full object-cover object-[50%_58%] will-change-transform"
          style={motionOK ? { y: bgY } : undefined}
        />
        {/* Voile léger pour la lisibilité du texte */}
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-black/45 via-black/10 to-black/40" />

        <div className="relative flex flex-1 flex-col gap-10 p-6 pb-[24vw] sm:p-10 sm:pb-[22vw] md:pb-10 md:pt-28 lg:p-14 lg:pt-28">
          {/* Haut : titre + carte vidéo */}
          <div className="flex flex-wrap items-start justify-between gap-8">
            <div className="max-w-xl">
              <motion.h2
                className="text-[clamp(2.8rem,7vw,6.2rem)] font-medium leading-[0.95] tracking-[-0.045em]"
                initial={motionOK ? { opacity: 0, y: 30 } : false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.9, ease: ease.out }}
              >
                Du signal
                <br />
                au système.
              </motion.h2>
              <p className="mt-5 max-w-[44ch] text-[0.98rem] font-medium leading-snug text-white/90 sm:indent-16">
                Logiciel, données, IoT, design et 3D : des solutions pensées sur le
                terrain et construites en équipe. Merci d'avoir regardé jusqu'au bout.
              </p>
              <div className="mt-7 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => void goTo("contact")}
                  className="inline-flex min-h-[48px] items-center rounded-full bg-white px-6 text-[0.95rem] font-medium text-ink transition-transform hover:scale-[1.03]"
                >
                  Me contacter
                </button>
                <button
                  type="button"
                  onClick={() => void goTo("ouverture")}
                  className="grid h-12 w-12 place-items-center rounded-full bg-white text-ink transition-transform hover:scale-105"
                  aria-label="Revenir en haut"
                >
                  <ArrowUp size={20} strokeWidth={1.8} />
                </button>
              </div>
            </div>

            {/* Carte « vidéo » : lance le film des coulisses */}
            <button
              type="button"
              onClick={() => {
                sound.play("open");
                setFilm(FILM_START);
              }}
              className="group flex w-full max-w-[340px] items-center gap-4 rounded-[16px] bg-white/15 p-2 pr-4 text-left ring-1 ring-white/20 backdrop-blur-md transition-colors hover:bg-white/25"
            >
              <span className="relative h-[72px] w-[116px] shrink-0 overflow-hidden rounded-[11px]">
                <img
                  src={cdn(gallery[FILM_START].src, 300)}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <span className="absolute left-1.5 top-1.5 grid h-5 w-5 place-items-center rounded-full bg-white text-ink">
                  <Play size={10} fill="currentColor" className="ml-px" />
                </span>
              </span>
              <span className="text-[0.88rem] font-medium leading-snug">
                Gama Labs, SYS, UPB : voir le film des coulisses.
              </span>
            </button>
          </div>

          {/* Bas : pastilles de navigation et réseaux */}
          <div className="mt-auto flex flex-col items-start gap-6 md:items-end">
            <nav aria-label="Chapitres (pied de page)" className="hidden md:block">
              <ul className="flex max-w-[520px] flex-wrap gap-2 md:justify-end">
                {LINKS.map((c) => (
                  <li key={c.id}>
                    <a {...filmLink(c.id)} className={chip}>
                      {c.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <ul className="flex flex-wrap gap-2 md:justify-end">
              {socials
                .filter((s) => s.url)
                .map((s) => (
                  <li key={s.id}>
                    <a href={s.url!} target="_blank" rel="noopener noreferrer" className={`${chip} bg-black/20`}>
                      {s.label}
                      <span className="sr-only"> (nouvel onglet)</span>
                    </a>
                  </li>
                ))}
              <li>
                <SoundControl up className="text-white [&>button]:min-h-[38px] [&>button]:bg-black/20 [&>button]:ring-1 [&>button]:ring-white/20" />
              </li>
            </ul>
          </div>

          <p className="meta relative z-10 text-center text-white/85">
            © {year} {site.name}
          </p>
        </div>

        {/* Nom géant translucide, posé sur le bas de la photo (comme « strikers ») */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 -z-[5] select-none overflow-hidden leading-none"
        >
          <motion.p
            className="translate-y-[10%] whitespace-nowrap text-center text-[25vw] font-medium lowercase leading-[0.78] tracking-[-0.065em] text-white/40 md:text-[22vw]"
            style={motionOK ? { y: wordY } : undefined}
          >
            dakaud
          </motion.p>
        </div>
      </div>

      <AnimatePresence>
        {film !== null && (
          <Lightbox
            key="film"
            index={film}
            autoplay
            onMove={move}
            onClose={() => {
              sound.play("close");
              setFilm(null);
            }}
          />
        )}
      </AnimatePresence>
    </footer>
  );
}
