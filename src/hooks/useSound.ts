import { useCallback, useRef } from "react";

type SoundType = "hover" | "click" | "modal-open" | "modal-close";

const createOscillator = (
  ctx: AudioContext,
  freq: number,
  type: OscillatorType,
  duration: number,
  gain: number,
) => {
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);

  gainNode.gain.setValueAtTime(gain, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  return { osc, gainNode };
};

export const useSound = () => {
  const ctxRef = useRef<AudioContext | null>(null);

  const getCtx = useCallback(() => {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;

    if (!ctxRef.current) {
      ctxRef.current = new AudioContextClass();
    }
    return ctxRef.current;
  }, []);

  const playSound = useCallback(
    (type: SoundType) => {
      try {
        const ctx = getCtx();
        if (ctx.state === "suspended") ctx.resume();

        switch (type) {
          case "hover": {
            // Petit tick subtil ( très court, haute fréquence )
            const { osc } = createOscillator(ctx, 2000, "sine", 0.05, 0.03);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.05);
            break;
          }
          case "click": {
            // Son soft futuriste ( deux tons harmoniques )
            const { osc: osc1 } = createOscillator(
              ctx,
              800,
              "sine",
              0.15,
              0.05,
            );
            const { osc: osc2 } = createOscillator(
              ctx,
              1200,
              "sine",
              0.15,
              0.03,
            );
            osc1.start(ctx.currentTime);
            osc2.start(ctx.currentTime + 0.02);
            osc1.stop(ctx.currentTime + 0.15);
            osc2.stop(ctx.currentTime + 0.15);
            break;
          }
          case "modal-open": {
            // Whoosh ascendant
            const { osc } = createOscillator(ctx, 300, "sine", 0.4, 0.06);
            osc.frequency.exponentialRampToValueAtTime(
              900,
              ctx.currentTime + 0.3,
            );
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.4);
            break;
          }
          case "modal-close": {
            // Whoosh descendant
            const { osc } = createOscillator(ctx, 600, "sine", 0.3, 0.05);
            osc.frequency.exponentialRampToValueAtTime(
              200,
              ctx.currentTime + 0.25,
            );
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.3);
            break;
          }
        }
      } catch (e) {
        console.warn("Audio not available:", e);
      }
    },
    [getCtx],
  );

  return { playSound };
};
