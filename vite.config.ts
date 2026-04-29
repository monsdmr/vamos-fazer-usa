// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Pre-render (SSG) the funnel routes at build time so they ship as static HTML.
// Near-zero TTFB and the page still loads even if the SSR/edge layer is degraded.
export default defineConfig({
  tanstackStart: {
    prerender: {
      enabled: true,
      crawlLinks: false,
      retryCount: 2,
    },
    pages: [
      { path: "/", prerender: { enabled: true } },
      { path: "/vsl", prerender: { enabled: true } },
      { path: "/upsell1", prerender: { enabled: true } },
      { path: "/upsell2", prerender: { enabled: true } },
      { path: "/upsell3", prerender: { enabled: true } },
    ],
  },
});
