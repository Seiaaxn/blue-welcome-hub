import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tsConfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

// SPA build for Vercel:
// - TanStack Start runs in SPA mode (no Worker/SSR runtime needed)
// - "/" is prerendered into index.html as the shell
// - vercel.json rewrites every path to /index.html so client routing handles
//   dynamic routes like /anime/$animeId, /watch/$episodeId, etc. without 404s.
export default defineConfig({
  plugins: [
    tsConfigPaths(),
    tailwindcss(),
    tanstackStart({
      spa: { enabled: true },
      prerender: { enabled: true, crawlLinks: false, routes: ["/"] },
    }),
    viteReact(),
  ],
});
