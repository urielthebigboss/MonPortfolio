import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { sound } from "../../lib/sound";
import { useMotionOK, useSoundSettings } from "../../lib/hooks";
import { ease } from "../../lib/motion";

/** Égaliseur : 4 barres qui dansent quand le son est actif. */
function Equalizer({ on }: { on: boolean }) {
  const motionOK = useMotionOK();
  return (
    <span className="flex h-3.5 items-end gap-[2px]" aria-hidden>
      {[0.55, 1, 0.7, 0.85].map((h, i) => (
        <motion.span
          key={i}
          className="w-[2px] rounded-full bg-current"
          animate={
            on && motionOK
              ? { height: [`${h * 40}%`, `${h * 100}%`, `${h * 55}%`] }
              : { height: on ? `${h * 100}%` : "18%" }
          }
          transition={
            on && motionOK
              ? { duration: 0.9 + i * 0.12, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }
              : { duration: 0.3 }
          }
        />
      ))}
    </span>
  );
}

function Switch({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  hint?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-s px-3 py-3 text-left transition-colors hover:bg-ink/[0.04]"
    >
      <span>
        <span className="block text-[0.95rem] font-medium">{label}</span>
        {hint && <span className="block text-xs text-mute">{hint}</span>}
      </span>
      <span
        className={`relative h-6 w-10 shrink-0 rounded-full transition-colors duration-300 ${checked ? "bg-signal" : "bg-ink/15"}`}
      >
        <motion.span
          className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow"
          animate={{ left: checked ? 18 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 32 }}
        />
      </span>
    </button>
  );
}

/**
 * Contrôle sonore accessible : effets on/off et volume.
 * Préférence mémorisée localement.
 */
export function SoundControl({ className = "", up = false }: { className?: string; up?: boolean }) {
  const settings = useSoundSettings();
  const [open, setOpen] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const first = panel.current?.querySelector<HTMLElement>("button, input");
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btn.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!panel.current?.contains(t) && !btn.current?.contains(t)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const on = settings.enabled;

  return (
    <div className={`relative ${className}`}>
      <button
        ref={btn}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`Réglages du son (${on ? "activé" : "coupé"})`}
        onClick={() => {
          setOpen((v) => !v);
          sound.play(open ? "close" : "open");
        }}
        className="flex h-10 items-center gap-2.5 rounded-full px-3.5 text-current transition-colors hover:bg-[color-mix(in_srgb,currentColor_12%,transparent)]"
      >
        <Equalizer on={on} />
        <span className="meta hidden sm:inline">{on ? "Son" : "Muet"}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panel}
            id={panelId}
            role="dialog"
            aria-label="Réglages du son"
            className={`absolute right-0 z-[80] w-[min(320px,calc(100vw-32px))] ${up ? "bottom-[calc(100%+10px)] origin-bottom-right" : "top-[calc(100%+10px)] origin-top-right"} rounded-m bg-paper-2 p-2 text-ink shadow-[var(--shadow-2)] ring-1 ring-ink/5`}
            initial={{ opacity: 0, scale: 0.92, y: -6, filter: "blur(6px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.96, y: -4, filter: "blur(4px)" }}
            transition={{ duration: 0.32, ease: ease.out }}
          >
            <Switch
              label="Effets sonores"
              hint="Navigation, boutons, transitions"
              checked={settings.enabled}
              onChange={(v) => {
                sound.setEnabled(v);
                if (v) window.setTimeout(() => sound.play("success"), 60);
              }}
            />
            <label className="block rounded-s px-3 py-3">
              <span className="mb-2 flex items-center justify-between text-[0.95rem] font-medium">
                Volume
                <span className="meta text-mute">{Math.round(settings.volume * 100)}%</span>
              </span>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={Math.round(settings.volume * 100)}
                onChange={(e) => sound.setVolume(Number(e.target.value) / 100)}
                onPointerUp={() => sound.play("tick")}
                className="w-full accent-[rgb(var(--c-signal))]"
                aria-label="Volume"
              />
            </label>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
