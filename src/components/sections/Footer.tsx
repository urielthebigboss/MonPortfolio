import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";


import { site } from "../../config/site";
import { gallery } from "../../data/gallery";

import { sound } from "../../lib/sound";
import { useMotionOK } from "../../lib/hooks";
import { ease } from "../../lib/motion";

import { Lightbox } from "../projects/Lightbox";

/*
 * Générique de fin, sur le modèle de la référence « Strikers » :
 * une grande carte photo arrondie (sortie terrain au Banco), titre blanc
 * en haut à gauche, boutons, carte « vidéo » en verre qui lance le film
 * des coulisses, pastilles de navigation et nom géant translucide en bas.
 */

const BG = `https://res.cloudinary.com/dppzzrley/image/upload/f_auto,q_auto,w_2000/v1776779654/IMG_3002_icw1uc.jpg`;




export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const motionOK = useMotionOK();
  const [film, setFilm] = useState<number | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  // Le fond glisse légèrement et le nom monte : le générique « se pose ».
  const bgY = useTransform(scrollYProgress, [0, 1], ["-8%", "0%"]);
  const wordY = useTransform(scrollYProgress, [0.6, 1], ["26%", "10%"]);
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
                Le ciel c'est ma fin, <br /> donc les cieux
                <br /> 
               c'est ma limite.
              </motion.h2>
              <p className="mt-5 max-w-[44ch] text-[0.98rem] font-medium leading-snug text-white/90 sm:indent-16">
                
              </p>
              
            </div>

            {/* Carte « vidéo » : lance le film des coulisses */}
            
          </div>

          

          <p className="meta relative z-10 text-center text-white/85">
           {site.name}
          </p>
        </div>

        {/* Nom géant translucide, posé sur le bas de la photo (comme « strikers ») */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 -z-[5] select-none overflow-hidden leading-none"
        >
          <motion.p
            className="translate-y-[10%] whitespace-nowrap text-center text-[25vw] font-medium leading-[0.78] tracking-[-0.065em] text-white/40 md:text-[22vw]"
            style={motionOK ? { y: wordY } : undefined}
          >
            SYS
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
