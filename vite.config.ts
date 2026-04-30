// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const isVercelStaticBuild =
  process.env.VERCEL_STATIC === "1" || process.env.VERCEL === "1";

// Pre-render (SSG) the funnel routes at build time so they ship as static HTML.
// Near-zero TTFB and the page still loads even if the SSR/edge layer is degraded.
export default defineConfig({
  // Vercel serves this funnel as static files from dist/client. The Cloudflare
  // adapter changes the server bundle name to index.js, while TanStack's
  // prerender preview expects server.js, so disable that adapter only there.
  cloudflare: isVercelStaticBuild ? false : undefined,
  tanstackStart: {
    prerender: {
      enabled: true,
      crawlLinks: true,
      retryCount: 2,
    },
    pages: [
      { path: "/" },
      { path: "/vsl" },
      { path: "/upsell1" },
      { path: "/upsell2" },
      { path: "/upsell3" },
      { path: "/disclaimers/earnings" },
      { path: "/disclaimers/ftc" },
      { path: "/disclaimers/refund" },
    ],
  },
});
