/** @type {import('tailwindcss').Config} */
// Toutes les valeurs visuelles proviennent des variables de src/styles/tokens.css.
// Modifier la direction artistique = modifier tokens.css, pas ce fichier.
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "rgb(var(--c-paper) / <alpha-value>)",
        "paper-2": "rgb(var(--c-paper-2) / <alpha-value>)",
        ink: "rgb(var(--c-ink) / <alpha-value>)",
        "ink-2": "rgb(var(--c-ink-2) / <alpha-value>)",
        mute: "rgb(var(--c-mute) / <alpha-value>)",
        "mute-2": "rgb(var(--c-mute-2) / <alpha-value>)",
        signal: "rgb(var(--c-signal) / <alpha-value>)",
        "signal-soft": "rgb(var(--c-signal-soft) / <alpha-value>)",
        warm: "rgb(var(--c-warm) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        serif: ["var(--font-serif)"],
        mono: ["var(--font-mono)"],
      },
      borderRadius: {
        s: "var(--radius-s)",
        m: "var(--radius-m)",
        l: "var(--radius-l)",
      },
      transitionTimingFunction: {
        out: "var(--ease-out)",
        "in-out": "var(--ease-in-out)",
      },
      maxWidth: {
        content: "var(--content-max)",
      },
    },
  },
  plugins: [],
};
