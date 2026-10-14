import { useRef, type ElementType } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useMotionOK } from "../../lib/hooks";
import { ease } from "../../lib/motion";

type Segment = string | { text: string; className?: string };
type Line = Segment[];

const toWords = (line: Line) =>
  line.flatMap((seg) => {
    const text = typeof seg === "string" ? seg : seg.text;
    const className = typeof seg === "string" ? undefined : seg.className;
    return text
      .split(/(\s+)/)
      .filter((w) => w.length > 0)
      .map((w) => ({ w, className, space: /^\s+$/.test(w) }));
  });

const plain = (lines: Line[]) =>
  lines
    .map((l) => l.map((s) => (typeof s === "string" ? s : s.text)).join(""))
    .join(" ");

/**
 * Typographie cinétique : chaque mot sort d'un masque, ligne après
 * ligne, comme un titre de générique. Le texte complet reste lisible
 * par les lecteurs d'écran (copie sr-only).
 */
export function KineticText({
  as: Tag = "p",
  lines,
  className = "",
  lineClassName = "",
  delay = 0,
  stagger = 0.045,
  trigger = "view",
  id,
  headingProps,
}: {
  as?: ElementType;
  lines: Line[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  /** "mount" pour le hero, "view" pour le reste. */
  trigger?: "mount" | "view";
  id?: string;
  headingProps?: Record<string, unknown>;
}) {
  const motionOK = useMotionOK();
  let wordIndex = 0;

  return (
    <Tag id={id} className={className} {...headingProps}>
      <span className="sr-only">{plain(lines)}</span>
      <span aria-hidden className="block">
        {lines.map((line, li) => (
          <span key={li} className={`block ${lineClassName}`}>
            {toWords(line).map(({ w, className: wc, space }, wi) => {
              if (space) return <span key={wi}> </span>;
              const i = wordIndex++;
              const animateTo = { y: "0%", rotate: 0 };
              return (
                <span
                  key={wi}
                  className="inline-block overflow-hidden pb-[0.08em] pt-[0.16em] -mb-[0.08em] -mt-[0.16em] align-top"
                >
                  <motion.span
                    className={`inline-block will-change-transform ${wc ?? ""}`}
                    initial={motionOK ? { y: "105%", rotate: 3 } : false}
                    {...(trigger === "mount"
                      ? { animate: animateTo }
                      : {
                          whileInView: animateTo,
                          viewport: { once: true, margin: "0px 0px -12% 0px" },
                        })}
                    transition={{
                      duration: 0.95,
                      ease: ease.out,
                      delay: delay + i * stagger,
                    }}
                  >
                    {w}
                  </motion.span>
                </span>
              );
            })}
          </span>
        ))}
      </span>
    </Tag>
  );
}

/**
 * Texte « lu » au défilement : les mots passent du gris à l'encre,
 * comme une voix off synchronisée sur l'image.
 */
export function ScrubText({
  text,
  className = "",
  highlight = [],
}: {
  text: string;
  className?: string;
  /** Mots (exacts) à faire passer en bleu signal. */
  highlight?: string[];
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const motionOK = useMotionOK();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.45"],
  });
  const words = text.split(" ");

  if (!motionOK) return <p className={className}>{text}</p>;

  return (
    <p ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((word, i) => (
          <ScrubWord
            key={i}
            word={word}
            progress={scrollYProgress}
            range={[i / words.length, (i + 1) / words.length]}
            accent={highlight.includes(word.replace(/[.,;:!?]/g, ""))}
          />
        ))}
      </span>
    </p>
  );
}

function ScrubWord({
  word,
  progress,
  range,
  accent,
}: {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
  accent: boolean;
}) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <>
      <motion.span style={{ opacity }} className={accent ? "text-signal" : undefined}>
        {word}
      </motion.span>{" "}
    </>
  );
}
