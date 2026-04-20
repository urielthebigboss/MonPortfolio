import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Globe } from "lucide-react";
import { SocialIcon } from "react-social-icons";

// ─── TYPES ───
interface FooterLink {
  readonly label: string;
  readonly href: string;
}

interface FooterColumn {
  readonly title: string;
  readonly links: readonly FooterLink[];
}

// ─── FOOTER DATA ───
const footerColumns: readonly FooterColumn[] = [
  {
    title: "NAVIGATION",
    links: [
      { label: "Accueil", href: "#" },
      { label: "Profile", href: "#" },
      { label: "Projets", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Galerie", href: "#" },
    ],
  },
  {
    title: "SUR MOI",
    links: [
      { label: "Parcours", href: "#" },
      { label: "Competences", href: "#" },
      { label: "CV", href: "#" },
      { label: "Gama Labs", href: "#" },
      { label: "Articles publiés", href: "#" },
      { label: "Entreprises", href: "#" },
    ],
  },
  {
    title: "COMMUNAUTÉ",
    links: [{ label: "Gama Labs", href: "#" }],
  },
  {
    title: "SOLUTIONS ",
    links: [
      { label: "Serious Game Catalogue", href: "#" },
      { label: "Bibliothèques", href: "#" },
      { label: "Geni UPB", href: "#" },
    ],
  },
];

// ─── SLOGAN COMPONENT ───
function AnimatedSlogan({
  text,
  className,
}: {
  readonly text: string;
  readonly className?: string;
}) {
  const words = text.split(" ");

  return (
    <motion.div
      className={`flex flex-wrap justify-center gap-x-4 md:gap-x-8 ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      {words.map((word, wordIndex) => (
        <span key={`word-${wordIndex}`} className="flex">
          {word.split("").map((char, charIndex) => (
            <motion.span
              key={`char-${wordIndex}-${charIndex}`}
              custom={wordIndex * 10 + charIndex}
              className="inline-block font-black tracking-tighter text-white"
              style={{
                fontSize: "clamp(2rem, 8vw, 8rem)",
                lineHeight: 0.9,
              }}
            >
              {char === "/" ? (
                <span className="text-white/40 mx-2">/</span>
              ) : (
                char
              )}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.div>
  );
}

// ─── LINK COMPONENT ───
function FooterLinkItem({
  href,
  children,
}: {
  readonly href: string;
  readonly children: React.ReactNode;
}) {
  return (
    <motion.a
      href={href}
      className="group flex items-center gap-1 text-sm text-white/60 hover:text-white transition-colors duration-300"
      whileHover={{ x: 4 }}
    >
      <span>{children}</span>
      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
    </motion.a>
  );
}

// ─── MAIN FOOTER COMPONENT ───
export default function Footer(): React.ReactElement {
  return (
    <footer className="relative bg-[#0a0a0a] text-white overflow-hidden">
      <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12"
        >
          <motion.div className="col-span-2 md:col-span-4 lg:col-span-1 mb-8 lg:mb-0 flex flex-col items-start">
            <motion.nav
              className="sticky top-0 z-50 flex items-center justify-between px-8 py-5 "
              style={{
                background: "rgba(0, 0, 0, 0)",
                backdropFilter: "blur(20px)",
              }}
              initial={{ y: -40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="text-[15px] font-black tracking-[0.15em] uppercase">
                PORTFOLIO <span className="text-orange-500">.</span>
              </div>
            </motion.nav>
            <div className="mb-2 gap-2">
              <SocialIcon
                network="github"
                className="rounded-full"
                bgColor="white"
                fgColor="#0a0a0a"
                style={{ height: 30, width: 30 }}
                href=""
              />
              <SocialIcon
                network="instagram"
                className="rounded-full"
                bgColor="red"
                fgColor="#ffffff"
                style={{ height: 30, width: 30 }}
                href=""
              />
              <SocialIcon
                network="whatsapp"
                className="rounded-full"
                bgColor="green-500"
                fgColor="#fffdfd"
                style={{ height: 30, width: 30 }}
                href=""
              />
              <SocialIcon
                network="snapchat"
                className="rounded-full"
                bgColor="yellow"
                fgColor="#ffffff"
                style={{ height: 30, width: 30 }}
                href=""
              />
              <SocialIcon
                network="linkedin"
                className="rounded-full"
                bgColor="blue/100"
                fgColor="#ffffff"
                style={{ height: 30, width: 30 }}
                href=""
              />
              <SocialIcon
                network="tiktok"
                className="rounded-full"
                bgColor="white"
                fgColor="#0a0a0a"
                style={{ height: 30, width: 30 }}
                href=""
              />
              <SocialIcon
                network="email"
                className="rounded-full"
                bgColor="white"
                fgColor="#0a0a0a"
                style={{ height: 30, width: 30 }}
                href=""
              />
            </div>
            <p className="text-sm text-white/40 mb-6 max-w-xs leading-relaxed">
              Creative Developer & AI Builder. Crafting immersive digital
              experiences.
            </p>

            <motion.button
              className="mt-6 flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors"
              whileHover={{ scale: 1.02 }}
              type="button"
            >
              <Globe className="w-4 h-4" />
              <span>Français</span>
            </motion.button>
            <motion.button
              className="mt-1 flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors"
              whileHover={{ scale: 1.02 }}
              type="button"
            >
              <Globe className="w-4 h-4" />
              <span>Anglais</span>
            </motion.button>
          </motion.div>

          {footerColumns.map((column) => (
            <motion.div key={column.title}>
              <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-6">
                {column.title}
              </h4>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <FooterLinkItem href={link.href}>
                      {link.label}
                    </FooterLinkItem>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        <div className="relative z-10 px-6">
          <AnimatedSlogan text="LOOK FIRST / THEN LEAP." />
        </div>
      </div>
    </footer>
  );
}
