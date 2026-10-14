/* ════════════════════════════════════════════════════════════
   MOTEUR SONORE — identité sonore du portfolio
   ------------------------------------------------------------
   Les recettes ci-dessous reprennent À L'IDENTIQUE les sons de
   l'ancien site (fréquences, formes d'onde, durées, gains) :
     nav / navHover  ← Navbar.tsx      (clic & survol du menu)
     click / hover   ← Profil.tsx      (boutons)
     enter           ← Profil.tsx      (arpège do-mi-sol-do)
     success / tick  ← Profil.tsx
     open / close    ← hooks/useSound  (ouverture/fermeture)
     milestone       ← MonParcours.tsx (jalons du parcours)
   Améliorations techniques, sans changer le timbre :
     • un seul AudioContext partagé (l'ancien en créait un par son,
       ce qui saturait le navigateur au bout de quelques dizaines) ;
     • un bus maître pour couper / régler le volume ;
     • anti-répétition : un même son ne se chevauche pas ;
     • préférence mémorisée localement (aucune donnée envoyée).
   Ajouts cohérents avec cette palette :
     cut      — transition de chapitre (whoosh « open » + tick « nav »)
     chapter  — note d'arrivée : chaque chapitre monte d'un degré
                sur la gamme de l'arpège « enter ».
   ════════════════════════════════════════════════════════════ */

export type SoundName =
  | "nav"
  | "navHover"
  | "hover"
  | "click"
  | "enter"
  | "success"
  | "tick"
  | "open"
  | "close"
  | "milestone"
  | "cut";

type Settings = { enabled: boolean; volume: number };

const STORAGE_KEY = "dk-sound";
/** Gamme d'arrivée des chapitres : do majeur, comme l'arpège « enter ». */
const CHAPTER_SCALE = [523.25, 587.33, 659.25, 783.99, 880, 987.77, 1046.5];
/** Intervalle minimal entre deux occurrences d'un même son (ms). */
const MIN_GAP: Partial<Record<SoundName, number>> = {
  hover: 70,
  navHover: 60,
  tick: 40,
  milestone: 400,
};

const readSettings = (): Settings => {
  const fallback: Settings = { enabled: true, volume: 0.8 };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return {
      enabled: parsed.enabled ?? fallback.enabled,
      volume: Math.min(1, Math.max(0, parsed.volume ?? fallback.volume)),
    };
  } catch {
    return fallback;
  }
};

class SoundEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private last = new Map<SoundName, number>();
  private listeners = new Set<() => void>();
  private settings: Settings = readSettings();
  /** true dès que l'utilisateur a interagi (politique d'autoplay). */
  private unlocked = false;

  constructor() {
    if (typeof window === "undefined") return;
    const unlock = () => {
      this.unlocked = true;
      this.ensureContext();
      if (this.ctx?.state === "suspended") void this.ctx.resume();
    };
    window.addEventListener("pointerdown", unlock, { passive: true });
    window.addEventListener("keydown", unlock);
  }

  /* ── Réglages (lus par React via useSyncExternalStore) ── */
  getSnapshot = () => this.settings;

  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  };

  private update(patch: Partial<Settings>) {
    this.settings = { ...this.settings, ...patch };
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ enabled: this.settings.enabled, volume: this.settings.volume }),
      );
    } catch {
      /* stockage indisponible : la préférence vaut pour la session */
    }
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(
        this.settings.enabled ? this.settings.volume : 0,
        this.ctx.currentTime,
        0.05,
      );
    }
    this.listeners.forEach((fn) => fn());
  }

  setEnabled = (enabled: boolean) => this.update({ enabled });
  setVolume = (volume: number) =>
    this.update({ volume: Math.min(1, Math.max(0, volume)) });

  /* ── Audio ── */
  private ensureContext() {
    if (this.ctx) return this.ctx;
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return null;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.settings.enabled ? this.settings.volume : 0;
    this.master.connect(this.ctx.destination);
    return this.ctx;
  }

  private canPlay(name: SoundName) {
    if (!this.settings.enabled || !this.unlocked) return false;
    const now = performance.now();
    const gap = MIN_GAP[name] ?? 30;
    const prev = this.last.get(name) ?? 0;
    if (now - prev < gap) return false;
    this.last.set(name, now);
    return true;
  }

  /** Oscillateur → (filtre) → gain → bus maître. */
  private voice(
    type: OscillatorType,
    filter?: { type: BiquadFilterType; freq: number },
  ) {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    if (filter) {
      const f = ctx.createBiquadFilter();
      f.type = filter.type;
      f.frequency.value = filter.freq;
      osc.connect(f);
      f.connect(gain);
    } else {
      osc.connect(gain);
    }
    gain.connect(this.master!);
    return { osc, gain, t: ctx.currentTime };
  }

  play = (name: SoundName) => {
    if (!this.canPlay(name)) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.master) return;
    if (ctx.state === "suspended") void ctx.resume();

    try {
      switch (name) {
        case "nav": {
          // Navbar d'origine — clic : sinus 1200 Hz qui chute en 50 ms
          const { osc, gain, t } = this.voice("sine");
          osc.frequency.setValueAtTime(1200, t);
          osc.frequency.exponentialRampToValueAtTime(0.01, t + 0.05);
          gain.gain.setValueAtTime(0.02, t);
          gain.gain.linearRampToValueAtTime(0, t + 0.05);
          osc.start(t);
          osc.stop(t + 0.05);
          break;
        }
        case "navHover": {
          // Navbar d'origine — survol : sinus 900 Hz, 30 ms
          const { osc, gain, t } = this.voice("sine");
          osc.frequency.setValueAtTime(900, t);
          osc.frequency.exponentialRampToValueAtTime(0.01, t + 0.03);
          gain.gain.setValueAtTime(0.01, t);
          gain.gain.linearRampToValueAtTime(0, t + 0.03);
          osc.start(t);
          osc.stop(t + 0.03);
          break;
        }
        case "hover": {
          const { osc, gain, t } = this.voice("sine", { type: "lowpass", freq: 800 });
          osc.frequency.setValueAtTime(600, t);
          osc.frequency.exponentialRampToValueAtTime(800, t + 0.1);
          gain.gain.setValueAtTime(0.08, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
          osc.start(t);
          osc.stop(t + 0.15);
          break;
        }
        case "click": {
          const { osc, gain, t } = this.voice("triangle", { type: "highpass", freq: 400 });
          osc.frequency.setValueAtTime(440, t);
          osc.frequency.exponentialRampToValueAtTime(880, t + 0.12);
          gain.gain.setValueAtTime(0.12, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
          osc.start(t);
          osc.stop(t + 0.2);
          break;
        }
        case "enter": {
          [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
            const { osc, gain, t } = this.voice("sine");
            const at = t + i * 0.08;
            osc.frequency.setValueAtTime(freq, at);
            gain.gain.setValueAtTime(0, at);
            gain.gain.linearRampToValueAtTime(0.06, at + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
            osc.start(at);
            osc.stop(t + 0.6);
          });
          break;
        }
        case "success": {
          const { osc, gain, t } = this.voice("sine");
          osc.frequency.setValueAtTime(523.25, t);
          osc.frequency.exponentialRampToValueAtTime(1046.5, t + 0.3);
          gain.gain.setValueAtTime(0.15, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
          osc.start(t);
          osc.stop(t + 0.4);
          break;
        }
        case "tick": {
          const { osc, gain, t } = this.voice("sine");
          osc.frequency.setValueAtTime(2000, t);
          gain.gain.setValueAtTime(0.03, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
          osc.start(t);
          osc.stop(t + 0.05);
          break;
        }
        case "open": {
          const { osc, gain, t } = this.voice("sine");
          osc.frequency.setValueAtTime(300, t);
          osc.frequency.exponentialRampToValueAtTime(900, t + 0.3);
          gain.gain.setValueAtTime(0.06, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
          osc.start(t);
          osc.stop(t + 0.4);
          break;
        }
        case "close": {
          const { osc, gain, t } = this.voice("sine");
          osc.frequency.setValueAtTime(600, t);
          osc.frequency.exponentialRampToValueAtTime(200, t + 0.25);
          gain.gain.setValueAtTime(0.05, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
          osc.start(t);
          osc.stop(t + 0.3);
          break;
        }
        case "milestone": {
          const { osc, gain, t } = this.voice("sine");
          osc.frequency.setValueAtTime(300, t);
          osc.frequency.linearRampToValueAtTime(600, t + 0.3);
          gain.gain.setValueAtTime(0.05, t);
          gain.gain.linearRampToValueAtTime(0.001, t + 0.35);
          osc.start(t);
          osc.stop(t + 0.35);
          break;
        }
        case "cut": {
          // Whoosh « open » plus doux, filtré, + tick « nav » au moment du cut
          const { osc, gain, t } = this.voice("sine", { type: "lowpass", freq: 1400 });
          osc.frequency.setValueAtTime(260, t);
          osc.frequency.exponentialRampToValueAtTime(820, t + 0.42);
          gain.gain.setValueAtTime(0.0001, t);
          gain.gain.exponentialRampToValueAtTime(0.05, t + 0.18);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
          osc.start(t);
          osc.stop(t + 0.52);
          break;
        }
      }
    } catch {
      /* audio indisponible : le site reste entièrement utilisable */
    }
  };

  /** Note d'arrivée d'un chapitre : monte d'un degré par chapitre. */
  chapter = (index: number) => {
    if (!this.canPlay("tick")) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.master) return;
    const freq = CHAPTER_SCALE[Math.max(0, Math.min(CHAPTER_SCALE.length - 1, index))];
    try {
      [freq, freq * 2].forEach((f, i) => {
        const { osc, gain, t } = this.voice("sine");
        osc.frequency.setValueAtTime(f, t);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(i === 0 ? 0.05 : 0.015, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
        osc.start(t);
        osc.stop(t + 0.56);
      });
    } catch {
      /* noop */
    }
  };

}

export const sound = new SoundEngine();
