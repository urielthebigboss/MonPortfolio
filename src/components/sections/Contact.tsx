import { useId, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { Scene } from "../film/Scene";
import { KineticText } from "../ui/KineticText";
import { site, socials, mailto, whatsappUrl } from "../../config/site";
import { sound } from "../../lib/sound";
import { useHoverSound } from "../../lib/hooks";
import { ease, spring } from "../../lib/motion";

const SUBJECTS = ["Poste / stage", "Master", "Projet", "Collaboration", "Autre"];

function CopyEmail() {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(site.email);
          setCopied(true);
          sound.play("success");
          window.setTimeout(() => setCopied(false), 2200);
        } catch {
          window.location.href = mailto();
        }
      }}
      className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-ink/[0.05] px-4 text-[0.92rem] transition-colors hover:bg-ink/10"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={copied ? "ok" : "copy"}
          className="flex items-center gap-2"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
        >
          {copied ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
          {copied ? "Adresse copiée" : "Copier l'adresse"}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

function SocialRow({ label, handle, url }: { label: string; handle: string; url: string }) {
  const hover = useHoverSound("tick");
  return (
    <li>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => sound.play("click")}
        className="group grid grid-cols-[1fr_auto] items-center gap-4 border-t border-ink/15 py-5"
        {...hover}
      >
        <span className="flex flex-wrap items-baseline gap-x-4">
          <span className="text-[clamp(1.6rem,3vw,2.6rem)] font-semibold tracking-[-0.04em] transition-transform duration-500 ease-out group-hover:translate-x-2">
            {label}
          </span>
          <span className="meta text-mute">{handle}</span>
        </span>
        <ArrowUpRight
          size={28}
          strokeWidth={1.4}
          className="transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:translate-x-1"
          aria-hidden
        />
        <span className="sr-only">(nouvel onglet)</span>
      </a>
    </li>
  );
}

function Compose() {
  const [subject, setSubject] = useState(SUBJECTS[2]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const nameId = useId();
  const msgId = useId();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    sound.play("success");
    const body = `${message.trim()}\n\n— ${name.trim() || "Envoyé depuis le portfolio"}`;
    window.location.href = mailto(`[Portfolio] ${subject}`, body);
  };

  const field =
    "w-full rounded-s bg-ink/[0.03] px-4 py-3.5 text-ink placeholder:text-ink/45 outline-none ring-1 ring-ink/10 transition focus:bg-white focus:ring-2 focus:ring-signal";

  return (
    <form onSubmit={submit} className="rounded-[32px] bg-paper p-5 shadow-[var(--shadow-1)] ring-1 ring-ink/[0.07] sm:p-8">
      <p className="meta text-mute">Écrire un message</p>
      <fieldset className="mt-5">
        <legend className="sr-only">Objet</legend>
        <div className="flex flex-wrap gap-1.5">
          {SUBJECTS.map((s) => {
            const on = s === subject;
            return (
              <button
                key={s}
                type="button"
                aria-pressed={on}
                onClick={() => {
                  setSubject(s);
                  sound.play("tick");
                }}
                className={`relative min-h-[40px] rounded-full px-4 text-[0.92rem] transition-colors ${on ? "text-white" : "text-ink hover:bg-ink/[0.05]"}`}
              >
                {on && <motion.span layoutId="subject-pill" className="absolute inset-0 rounded-full bg-ink" transition={spring.pill} />}
                <span className="relative">{s}</span>
              </button>
            );
          })}
        </div>
      </fieldset>
      <label htmlFor={nameId} className="mb-2 mt-6 block text-[0.92rem] text-ink/75">
        Votre nom
      </label>
      <input id={nameId} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className={field} placeholder="Prénom Nom" />
      <label htmlFor={msgId} className="mb-2 mt-5 block text-[0.92rem] text-ink/75">
        Message
      </label>
      <textarea
        id={msgId}
        required
        rows={5}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className={`${field} resize-none`}
        placeholder="Le contexte, le besoin, l'échéance…"
      />
      <button
        type="submit"
        disabled={!message.trim()}
        className="group mt-6 flex min-h-[52px] w-full items-center justify-center gap-3 rounded-full bg-signal font-medium text-white shadow-[0_14px_34px_-10px_rgb(var(--c-signal)/0.8)] transition-[background-color,opacity,transform] hover:scale-[1.01] hover:bg-[#4d74ff] disabled:opacity-50"
      >
        Ouvrir dans ma messagerie
        <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
      </button>
      <p className="mt-3 text-center text-xs text-mute">
        Aucun envoi automatique : le message s'ouvre dans votre application e-mail.
      </p>
    </form>
  );
}

export function Contact() {
  const wa = whatsappUrl();
  const links = socials.filter((s): s is typeof s & { url: string } => !!s.url);

  return (
    <Scene id="contact" tone="white">
      <div className="wrap relative py-[var(--section-y)]">
        <KineticText
          as="h2"
          id="contact-title"
          headingProps={{ "data-chapter-heading": true, tabIndex: -1 }}
          className="display"
          lines={[["Écrivons"], [{ text: "la suite.", className: "accent" }]]}
        />

        <div className="mt-8 grid gap-10 md:mt-16 md:gap-14 lg:mt-24 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6">
            <p className="max-w-[40ch] text-lg text-ink/80">
              Un poste, une formation, un produit à construire, une collaboration ou de la
              3D : décrivez le besoin, je vous réponds.
            </p>
            <motion.a
              href={mailto()}
              onClick={() => sound.play("click")}
              className="mt-6 block break-all md:mt-10 text-[clamp(1.6rem,4.2vw,3.6rem)] font-semibold leading-tight tracking-[-0.04em] underline decoration-ink/25 decoration-1 underline-offset-[0.18em] transition-[text-decoration-color] hover:decoration-ink"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: ease.out }}
            >
              {site.email}
            </motion.a>
            <div className="mt-5 flex flex-wrap gap-2">
              <CopyEmail />
              {wa && (
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-ink/[0.05] px-4 text-[0.92rem] transition-colors hover:bg-ink/10"
                >
                  WhatsApp <ArrowUpRight size={16} aria-hidden />
                </a>
              )}
              {site.cv && (
                <a
                  href={site.cv}
                  download
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-ink/[0.05] px-4 text-[0.92rem] transition-colors hover:bg-ink/10"
                >
                  Télécharger le CV
                </a>
              )}
            </div>

            {links.length > 0 && (
              <ul className="mt-10 border-b border-ink/15 md:mt-16">
                {links.map((s) => (
                  <SocialRow key={s.id} label={s.label} handle={s.handle} url={s.url} />
                ))}
              </ul>
            )}
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <Compose />
          </div>
        </div>
      </div>
    </Scene>
  );
}
