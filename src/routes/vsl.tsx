import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { Lock, ShieldCheck, ArrowDown } from "lucide-react";

import { FlagUS } from "../components/Flag";
import { useVturbWatchTime } from "../hooks/useVturbWatchTime";

// Time in seconds when the pitch begins and the CTA unlocks
const PITCH_REVEAL_SECONDS = 21 * 60 - 40; // 20:20
const PLAYER_ELEMENT_ID = "ab-69f140ee2e62e594e34723cd";
const PLAYER_VARIATION_IDS = [
  PLAYER_ELEMENT_ID,
  "69f0e02d6cda6b6e2e6339e9",
  "69f0e07396260377bd152421",
  "69f0e0ebccff5745f0eccfb6",
];

// Allow the custom element <vturb-smartplayer> in TSX
declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "vturb-smartplayer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & { id?: string },
        HTMLElement
      >;
    }
  }
}

export const Route = createFileRoute("/vsl")({
  // SSG: pre-render this route at build time so it serves as static HTML —
  // near-zero TTFB even if the SSR layer goes down.
  ssr: true,
  head: () => ({
    meta: [
      { title: "Watch the Official Video — Official Check" },
      {
        name: "description",
        content:
          "Watch the official video to learn how to receive the available amount in your name.",
      },
      { property: "og:title", content: "Watch the Official Video — Official Check" },
      {
        property: "og:description",
        content:
          "Watch the official video to learn how to receive the available amount.",
      },
    ],
    links: [
      {
        rel: "preload",
        href: "https://scripts.converteai.net/3d3e08e7-4c37-4616-b881-330803f7b01c/ab-test/69f140ee2e62e594e34723cd/player.js",
        as: "script",
        fetchPriority: "high",
      },
      {
        rel: "preload",
        href: "https://scripts.converteai.net/lib/js/smartplayer-wc/v4/smartplayer.js",
        as: "script",
      },
      {
        rel: "preload",
        href: "https://images.converteai.net/3d3e08e7-4c37-4616-b881-330803f7b01c/players/69f140ee2e62e594e34723cd/thumbnail.jpg",
        as: "image",
        fetchPriority: "high",
      },
      { rel: "dns-prefetch", href: "https://cdn.converteai.net" },
      { rel: "dns-prefetch", href: "https://scripts.converteai.net" },
      { rel: "dns-prefetch", href: "https://images.converteai.net" },
      { rel: "dns-prefetch", href: "https://m3u8.vturb.net" },
      { rel: "dns-prefetch", href: "https://api.vturb.com.br" },
    ],
    scripts: [
      {
        children:
          "!function(i,n){i._plt=i._plt||(n&&n.timeOrigin?n.timeOrigin+n.now():Date.now())}(window,performance);",
      },
    ],
  }),
  component: VslPage,
});

const PLAYER_SRC =
  "https://scripts.converteai.net/3d3e08e7-4c37-4616-b881-330803f7b01c/ab-test/69f140ee2e62e594e34723cd/player.js";

function VslPage() {
  const watchedTimeUnlocked = useVturbWatchTime(PLAYER_VARIATION_IDS, PITCH_REVEAL_SECONDS);
  const ctaUnlocked = watchedTimeUnlocked;

  // Inject the VTurb player script on the client AFTER the custom element is in the DOM.
  // Doing this in head.scripts (SSR) breaks on preview refresh / HMR because the script
  // runs once globally and re-mounts of <vturb-smartplayer> end up orphaned.
  useEffect(() => {
    const ID = "vturb-player-script";
    // If already injected (HMR / fast-refresh), force a re-init by removing it first.
    const existing = document.getElementById(ID);
    if (existing) existing.remove();

    const s = document.createElement("script");
    s.id = ID;
    s.src = PLAYER_SRC;
    s.async = true;
    document.head.appendChild(s);

    return () => {
      // leave the script in place across navigations; only the route remount handles it
    };
  }, []);

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={
        {
          backgroundColor: "#f3f6fa",
          ["--brand" as string]: "#0e2a3a",
        } as React.CSSProperties
      }
    >
      {/* Header */}
      <header
        className="bg-[var(--brand)] text-white"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
          <Link to="/" className="flex min-w-0 items-center gap-2 sm:gap-3">
            <FlagUS size={24} />
            <div className="min-w-0 leading-tight">
              <div className="truncate text-sm font-bold sm:text-base">Official Check</div>
              <div className="truncate text-[10px] text-white/70 sm:text-xs">
                Verify if there are restitutions
              </div>
            </div>
          </Link>
          {/* Nav removed to keep focus on the video */}
        </div>

        {/* Hero */}
        <div className="mx-auto max-w-6xl px-4 pb-6 pt-4 sm:px-6 sm:pb-10 sm:pt-6">
          <h1 className="text-xl font-bold leading-snug sm:text-2xl md:text-3xl">
            Welcome
          </h1>
          <p className="mt-2 text-xs text-white/80 sm:text-sm">
            You have{" "}
            <span className="font-semibold text-emerald-300">$2,350.00</span>{" "}
            available for claim.
          </p>
        </div>
      </header>

      {/* Video section */}
      <main className="mx-auto max-w-4xl px-3 py-6 sm:px-4 sm:py-10">
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground sm:text-base md:text-lg">
            Watch the official video:{" "}
            <span className="underline">"How to Receive $2,350.00"</span>
          </p>
          <ArrowDown className="mx-auto mt-3 h-5 w-5 animate-bounce text-muted-foreground" />
        </div>

        {/* Video player (vturb smartplayer) — full-bleed on mobile */}
        <div className="mt-4 -mx-3 overflow-hidden shadow-2xl ring-1 ring-black/10 sm:mx-0 sm:mt-6 sm:rounded-xl">
          <vturb-smartplayer
            id={PLAYER_ELEMENT_ID}
            style={{ display: "block", margin: "0 auto", width: "100%" }}
          ></vturb-smartplayer>
        </div>

        {/* Pitch CTA area — shows loader until pitch moment, then reveals button */}
        <div className="mt-8 flex flex-col items-center justify-center sm:mt-10">
          {ctaUnlocked ? (
            <a
              href="https://www.checkout-ds24.com/product/687076"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Exclusive offer — only now"
              className="exclusive-cta group relative inline-flex w-full max-w-md items-center justify-center overflow-hidden rounded-full px-8 py-5 text-center text-base font-extrabold uppercase tracking-wide text-[#1a2332] shadow-[0_10px_30px_-8px_rgba(245,180,90,0.55)] transition-transform duration-200 hover:scale-[1.03] active:scale-[0.97] sm:text-lg"
              style={{
                background: "linear-gradient(180deg, #f8c97a 0%, #f0a94a 100%)",
              }}
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
              <span className="relative z-10 drop-shadow-sm">
                EXCLUSIVE OFFER! ONLY NOW
              </span>
            </a>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 py-4 sm:gap-6">
              <div
                className="h-12 w-12 animate-spin rounded-full border-[3px] border-[var(--brand)]/20 border-t-[var(--brand)] sm:h-14 sm:w-14"
                role="status"
                aria-label="Loading"
              />
              <p className="text-center text-lg font-bold text-[var(--brand)] sm:text-xl md:text-2xl">
                Required to Follow
              </p>
            </div>
          )}
        </div>

        {/* Microcopy */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground sm:text-xs">
          <span className="flex items-center gap-1">
            <Lock className="h-3 w-3" /> Secure session
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" /> Watch full video to unlock instructions
          </span>
        </div>

      </main>

      {/* Footer */}
      <footer
        className="border-t border-border bg-white"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-muted-foreground sm:px-6 sm:py-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <FlagUS size={20} />
              <span className="font-semibold text-foreground">Official Check</span>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              <a href="#" className="hover:text-foreground">Privacy Policy</a>
            </div>
          </div>
          <p className="mt-4 leading-relaxed">
            This service is informational only and does not guarantee approval
            of any restitution. © {new Date().getFullYear()} Official Check.
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes exclusiveCtaPulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 10px 30px -8px rgba(245, 180, 90, 0.55), 0 0 0 0 rgba(245, 180, 90, 0.6);
          }
          50% {
            transform: scale(1.04);
            box-shadow: 0 14px 36px -8px rgba(245, 180, 90, 0.75), 0 0 0 14px rgba(245, 180, 90, 0);
          }
        }
        .exclusive-cta {
          animation: exclusiveCtaPulse 1.8s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .exclusive-cta { animation: none; }
        }
      `}</style>
    </div>
  );
}
