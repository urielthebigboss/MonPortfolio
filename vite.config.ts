import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Les logos (SVG) restent des fichiers séparés, mis en cache,
    // au lieu d'alourdir le JavaScript principal.
    assetsInlineLimit: 0,
  },
});
