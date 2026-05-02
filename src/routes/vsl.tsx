import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Lock, ShieldCheck, ArrowDown } from "lucide-react";

import { FlagUS } from "../components/Flag";
import { useVturbWatchTime } from "../hooks/useVturbWatchTime";

// Time in seconds when the pitch begins and the CTA unlocks
// Reveal CTA 35s earlier than the original pitch moment (20:20 → 19:45).
// Math.max guards against negative values if the offset is ever changed.
// CTA reveals exactly at the pitch moment (21:45).
const PITCH_REVEAL_SECONDS = Math.max(0, 21 * 60 + 45); // 21:45
const PLAYER_ID = "69f0e07396260377bd152421";
const PLAYER_ELEMENT_ID = `vid-${PLAYER_ID}`;
const PLAYER_VARIATION_IDS = [PLAYER_ELEMENT_ID, PLAYER_ID];

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
        href: "https://scripts.converteai.net/3d3e08e7-4c37-4616-b881-330803f7b01c/players/69f0e07396260377bd152421/v4/player.js",
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
        href: "https://images.converteai.net/3d3e08e7-4c37-4616-b881-330803f7b01c/players/69f0e07396260377bd152421/thumbnail.jpg",
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
  "https://scripts.converteai.net/3d3e08e7-4c37-4616-b881-330803f7b01c/players/69f0e07396260377bd152421/v4/player.js";

function VslPage() {
  const watchedTimeUnlocked = useVturbWatchTime(PLAYER_VARIATION_IDS, PITCH_REVEAL_SECONDS);

  // Debug-only bypass: ?debug_unlock=1 reveals the CTA immediately, but ONLY
  // in non-production environments (localhost or lovable preview/sandbox hosts).
  // In production this flag is ignored so users can't skip the video.
  const [debugUnlocked, setDebugUnlocked] = useState(false);
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("debug_unlock") !== "1") return;
      const host = window.location.hostname;
      const isDev =
        host === "localhost" ||
        host === "127.0.0.1" ||
        host.endsWith(".lovable.app") ||
        host.endsWith(".lovableproject.com") ||
        host.endsWith(".lovable.dev");
      if (isDev) setDebugUnlocked(true);
    } catch {}
  }, []);

  const ctaUnlocked = watchedTimeUnlocked || debugUnlocked;
  const [checkoutUrl, setCheckoutUrl] = useState(
    "https://www.checkout-ds24.com/product/687076",
  );
  // Loading state for the checkout CTA — prevents double-click while the
  // dataLayer push is processing and the redirect is in flight.
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Build the Digistore checkout URL.
  // - sid1 is set from the click_id captured on page 1 (fbclid / ttclid)
  //   so Digistore postbacks can attribute the sale to the correct ad click.
  // - Forwards marketing params (utm_*, fbclid, gclid, ttclid, msclkid, etc.)
  //   so Tag Manager and pixel events keep working.
  // - Prefills first_name / last_name from the Full Name entered on page 1.
  // The Referer header itself is stripped (meta name="referrer" + rel="noreferrer"),
  // so Digistore cannot see the originating domain.
  useEffect(() => {
    try {
      const url = new URL("https://www.checkout-ds24.com/product/687076");

      // 1) Set sid1 from click_id stored on page 1 (fbclid || ttclid).
      let clickId = "";
      try {
        clickId = sessionStorage.getItem("click_id") || "";
      } catch {}
      if (!clickId) {
        const incomingNow = new URLSearchParams(window.location.search);
        clickId = incomingNow.get("fbclid") || incomingNow.get("ttclid") || "";
      }
      if (clickId) {
        url.searchParams.set("sid1", clickId);
      }

      // 2) Forward tracking params from the current URL (and persist them so
      // they survive internal navigation between / and /vsl).
      const TRACKING_KEYS = [
        "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
        "utm_id", "fbclid", "gclid", "ttclid", "msclkid", "twclid", "li_fat_id",
        "wbraid", "gbraid", "epik", "yclid", "sub_id", "aff_sub", "click_id",
      ];
      const incoming = new URLSearchParams(window.location.search);
      let stored: Record<string, string> = {};
      try {
        stored = JSON.parse(sessionStorage.getItem("oc_tracking") || "{}");
      } catch {}
      for (const key of TRACKING_KEYS) {
        const v = incoming.get(key) ?? stored[key];
        if (v) {
          stored[key] = v;
          url.searchParams.set(key, v);
        }
      }
      try {
        sessionStorage.setItem("oc_tracking", JSON.stringify(stored));
      } catch {}

      // 3) Prefill first_name / last_name from the home form.
      const fullName = (
        sessionStorage.getItem("lead_name") ||
        sessionStorage.getItem("oc_full_name") ||
        ""
      ).trim();
      if (fullName) {
        const parts = fullName.split(/\s+/);
        const firstName = parts.shift() || "";
        const lastName = parts.join(" ");
        if (firstName) url.searchParams.set("first_name", firstName);
        if (lastName) url.searchParams.set("last_name", lastName);
      }

      setCheckoutUrl(url.toString());
    } catch {}
  }, []);

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
              href={checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              referrerPolicy="no-referrer"
              aria-disabled={isCheckingOut}
              tabIndex={isCheckingOut ? -1 : 0}
              onClick={(e) => {
                // Block double-clicks while the dataLayer push + new-tab open
                // are in flight.
                if (isCheckingOut) {
                  e.preventDefault();
                  return;
                }
                setIsCheckingOut(true);
                try {
                  const w = window as unknown as { dataLayer?: Record<string, unknown>[] };
                  w.dataLayer = w.dataLayer || [];
                  w.dataLayer.push({
                    event: "begin_checkout",
                    lead_phone: sessionStorage.getItem("lead_phone") || "",
                    lead_name: sessionStorage.getItem("lead_name") || "",
                    lead_state: sessionStorage.getItem("lead_state") || "",
                  });
                } catch {}
                // Re-enable after a few seconds in case the user closes the
                // new tab and wants to retry.
                window.setTimeout(() => setIsCheckingOut(false), 4000);
              }}
              aria-label="Exclusive offer — only now"
              className={`exclusive-cta group relative inline-flex w-full max-w-md items-center justify-center overflow-hidden rounded-full px-8 py-5 text-center text-base font-extrabold uppercase tracking-wide text-[#1a2332] shadow-[0_10px_30px_-8px_rgba(245,180,90,0.55)] transition-transform duration-200 hover:scale-[1.03] active:scale-[0.97] sm:text-lg ${
                isCheckingOut ? "pointer-events-none opacity-80" : ""
              }`}
              style={{
                background: "linear-gradient(180deg, #f8c97a 0%, #f0a94a 100%)",
              }}
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
              <span className="relative z-10 flex items-center justify-center gap-2 drop-shadow-sm">
                {isCheckingOut ? (
                  <>
                    <span
                      className="h-5 w-5 animate-spin rounded-full border-[2.5px] border-[#1a2332]/30 border-t-[#1a2332]"
                      role="status"
                      aria-label="Processing"
                    />
                    PROCESSING…
                  </>
                ) : (
                  "EXCLUSIVE OFFER! ONLY NOW"
                )}
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
