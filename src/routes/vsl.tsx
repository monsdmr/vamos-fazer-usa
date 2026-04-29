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
      {
        src: "https://scripts.converteai.net/3d3e08e7-4c37-4616-b881-330803f7b01c/ab-test/69f140ee2e62e594e34723cd/player.js",
        async: true,
      },
    ],
  }),
  component: VslPage,
});

function VslPage() {
  const [ctaUnlocked, setCtaUnlocked] = useState(false);

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
      className="min-h-screen"
      style={
        {
          backgroundColor: "#f3f6fa",
          ["--brand" as string]: "#0e2a3a",
        } as React.CSSProperties
      }
    >
      {/* Header */}
      <header className="bg-[var(--brand)] text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3">
            <span className="text-2xl" aria-hidden>🇺🇸</span>
            <div className="leading-tight">
              <div className="text-base font-bold">Official Check</div>
              <div className="text-xs text-white/70">
                Verify if there are restitutions
              </div>
            </div>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link to="/" className="hover:text-white/80">Home</Link>
            <a href="#" className="hover:text-white/80">About</a>
            <a href="#" className="hover:text-white/80">Contact</a>
          </nav>
        </div>

        {/* Hero */}
        <div className="mx-auto max-w-6xl px-6 pb-10 pt-6">
          <h1 className="text-2xl font-bold leading-snug md:text-3xl">
            Welcome
          </h1>
          <p className="mt-2 text-sm text-white/80">
            You have{" "}
            <span className="font-semibold text-emerald-300">$2,350.00</span>{" "}
            available for claim.
          </p>
        </div>
      </header>

      {/* Video section */}
      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="text-center">
          <p className="text-base font-semibold text-foreground md:text-lg">
            Watch the official video:{" "}
            <span className="underline">"How to Receive $2,350.00"</span>
          </p>
          <ArrowDown className="mx-auto mt-3 h-5 w-5 animate-bounce text-muted-foreground" />
        </div>

        {/* Video player (vturb smartplayer) */}
        <div className="mt-6 overflow-hidden rounded-xl shadow-2xl ring-1 ring-black/10">
          <vturb-smartplayer
            id="ab-69f140ee2e62e594e34723cd"
            style={{ display: "block", margin: "0 auto", width: "100%" }}
          ></vturb-smartplayer>
        </div>

        {/* Pitch CTA area — shows loader until pitch moment, then reveals button */}
        <div className="mt-10 flex flex-col items-center justify-center">
          {ctaUnlocked ? (
            <a
              href="https://www.xamericansystem.online/-us"
              target="_blank"
              rel="noopener noreferrer"
              className="animate-in fade-in zoom-in duration-500 transition-transform hover:scale-105 active:scale-95"
              aria-label="Exclusive offer — only now"
            >
              <img
                src={exclusiveOfferBtn}
                alt="Exclusive Offer! Only Now"
                className="h-auto w-full max-w-md drop-shadow-xl"
              />
            </a>
          ) : (
            <div className="flex flex-col items-center justify-center gap-6 py-4">
              <div
                className="h-14 w-14 animate-spin rounded-full border-[3px] border-[var(--brand)]/20 border-t-[var(--brand)]"
                role="status"
                aria-label="Loading"
              />
              <p className="text-xl font-bold text-[var(--brand)] md:text-2xl">
                Required to Follow
              </p>
            </div>
          )}
        </div>

        {/* Microcopy */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
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
      <footer className="border-t border-border bg-white">
        <div className="mx-auto max-w-6xl px-6 py-8 text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-lg" aria-hidden>🇺🇸</span>
              <span className="font-semibold text-foreground">Official Check</span>
            </div>
            <div className="flex flex-wrap gap-4">
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
