import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Lock, ShieldCheck, ArrowDown } from "lucide-react";
import exclusiveOfferBtn from "@/assets/exclusive-offer-button.png";

// Time in seconds when the pitch begins and the CTA unlocks
const PITCH_REVEAL_SECONDS = 21 * 60 + 1; // 21:01 — pitch moment in the VSL

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
      },
      {
        rel: "preload",
        href: "https://scripts.converteai.net/lib/js/smartplayer-wc/v4/smartplayer.js",
        as: "script",
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
  const [ctaUnlocked, setCtaUnlocked] = useState(false);

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

  // Player script is injected via the route's head.scripts (SSR) for fastest load.

  // Reveal the CTA when the VTurb player reaches the pitch moment in the video.
  // We poll for the player element + media (video/audio) and listen to timeupdate.
  useEffect(() => {
    if (ctaUnlocked) return;

    let cancelled = false;
    let mediaEl: HTMLMediaElement | null = null;
    let pollId: number | null = null;

    const onTimeUpdate = () => {
      if (mediaEl && mediaEl.currentTime >= PITCH_REVEAL_SECONDS) {
        setCtaUnlocked(true);
      }
    };

    const attach = (el: HTMLMediaElement) => {
      mediaEl = el;
      el.addEventListener("timeupdate", onTimeUpdate);
      // In case the user is already past the mark (resume)
      onTimeUpdate();
    };

    const tryFind = () => {
      if (cancelled) return;
      const player = document.getElementById("ab-69f140ee2e62e594e34723cd");
      // The smartplayer is a custom element that renders a <video> internally.
      // It may use shadow DOM, so we check both light and shadow roots.
      const root: ParentNode | null =
        (player as unknown as { shadowRoot?: ShadowRoot } | null)?.shadowRoot ??
        player;
      const media =
        (root?.querySelector?.("video, audio") as HTMLMediaElement | null) ??
        (document.querySelector("video, audio") as HTMLMediaElement | null);

      if (media) {
        attach(media);
        if (pollId !== null) {
          window.clearInterval(pollId);
          pollId = null;
        }
      }
    };

    pollId = window.setInterval(tryFind, 500);
    tryFind();

    return () => {
      cancelled = true;
      if (pollId !== null) window.clearInterval(pollId);
      if (mediaEl) mediaEl.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, [ctaUnlocked]);

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
            <span className="text-xl sm:text-2xl" aria-hidden>🇺🇸</span>
            <div className="min-w-0 leading-tight">
              <div className="truncate text-sm font-bold sm:text-base">Official Check</div>
              <div className="truncate text-[10px] text-white/70 sm:text-xs">
                Verify if there are restitutions
              </div>
            </div>
          </Link>
          <nav className="hidden items-center gap-6 text-sm sm:flex">
            <Link to="/" className="hover:text-white/80">Home</Link>
            <a href="#" className="hover:text-white/80">About</a>
            <a href="#" className="hover:text-white/80">Contact</a>
          </nav>
          {/* Mobile: only Home link */}
          <Link
            to="/"
            className="rounded-md px-2 py-1 text-xs font-semibold text-white/90 hover:text-white sm:hidden"
          >
            Home
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
            id="ab-69f140ee2e62e594e34723cd"
            style={{ display: "block", margin: "0 auto", width: "100%" }}
          ></vturb-smartplayer>
        </div>

        {/* Pitch CTA area — shows loader until pitch moment, then reveals button */}
        <div className="mt-8 flex flex-col items-center justify-center sm:mt-10">
          {ctaUnlocked ? (
            <a
              href="https://go.centerpag.com/PPU38CQA79I"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full max-w-md animate-in fade-in zoom-in px-2 duration-500 transition-transform hover:scale-105 active:scale-95"
              aria-label="Exclusive offer — only now"
            >
              <img
                src={exclusiveOfferBtn}
                alt="Exclusive Offer! Only Now"
                className="mx-auto h-auto w-full drop-shadow-xl"
                loading="eager"
              />
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

        <div className="mt-8 text-center">
          <Link
            to="/"
            className="text-xs font-semibold text-muted-foreground underline hover:text-foreground"
          >
            ← Back to verification
          </Link>
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
              <span className="text-lg" aria-hidden>🇺🇸</span>
              <span className="font-semibold text-foreground">Official Check</span>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              <a href="#" className="hover:text-foreground">Privacy Policy</a>
              <a href="#" className="hover:text-foreground">Terms of Use</a>
              <a href="#" className="hover:text-foreground">Contact</a>
              <a href="#" className="hover:text-foreground">FAQ</a>
            </div>
          </div>
          <p className="mt-4 leading-relaxed">
            This service is informational only and does not guarantee approval
            of any restitution. © {new Date().getFullYear()} Official Check.
          </p>
        </div>
      </footer>
    </div>
  );
}
