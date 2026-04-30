import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { UpsellFooter } from "@/components/UpsellFooter";
import { UpsellProgress } from "@/components/UpsellProgress";
import { UpsellPriceBlock } from "@/components/UpsellPriceBlock";
import { useVturbWatchTime } from "@/hooks/useVturbWatchTime";

// Reveal CTA after the user has actually watched this many seconds of the video
const CTA_REVEAL_SECONDS = 2 * 60 + 32; // 2:32 (matches reference pitchTime 152s)

// Isolated upsell #3 page — Step 3 of 3 (Hidden System)
const PLAYER_ID = "69a9a11fa61fe7c3c1d80ec8";
const PLAYER_SRC = `https://scripts.converteai.net/f60c6c24-93af-4941-ad66-43dcc36feb4a/players/${PLAYER_ID}/v4/player.js`;

const YES_URL = "https://www.checkout-ds24.com/answer/yes?template=25753";
const NO_URL = "https://www.checkout-ds24.com/answer/no";

const ACCENT = "#5AA738";

// <vturb-smartplayer> JSX type is already declared in src/routes/vsl.tsx

export const Route = createFileRoute("/upsell3")({
  head: () => ({
    meta: [
      { title: "Congratulations — Final Step" },
      { name: "description", content: "Watch the short video below to enable faster processing." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Congratulations — Final Step" },
      { property: "og:description", content: "Watch the short video below to enable faster processing." },
    ],
    links: [
      { rel: "preload", href: PLAYER_SRC, as: "script" },
      { rel: "dns-prefetch", href: "https://cdn.converteai.net" },
      { rel: "dns-prefetch", href: "https://scripts.converteai.net" },
      { rel: "dns-prefetch", href: "https://images.converteai.net" },
    ],
  }),
  component: Upsell3Page,
});

function Upsell3Page() {
  const ctaUnlocked = useVturbWatchTime([`vid-${PLAYER_ID}`, PLAYER_ID], CTA_REVEAL_SECONDS);

  useEffect(() => {
    const ID = "vturb-upsell3-script";
    const existing = document.getElementById(ID);
    if (existing) existing.remove();
    const s = document.createElement("script");
    s.id = ID;
    s.src = PLAYER_SRC;
    s.async = true;
    document.head.appendChild(s);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-slate-900 flex flex-col">
      {/* Top bar */}
      <header
        className="w-full bg-[#0e2a3a] text-white"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 min-w-0">
            <img
              src="https://flagcdn.com/w40/us.png"
              alt="US"
              width={20}
              height={14}
              className="rounded-sm"
            />
            <span className="font-semibold truncate">U.S. Payment Processing</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium">Secure Channel</span>
          </div>
        </div>
      </header>

      <UpsellProgress currentStep={3} />

      {/* Title */}
      <section className="mx-auto w-full max-w-3xl px-4 pt-6 sm:pt-12 text-center">
        <p className="text-[11px] sm:text-sm font-semibold uppercase tracking-widest text-slate-500">
          Step 3 of 3 — Hidden System
        </p>
        <h1 className="mt-2 text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
          Congratulations, you've reached the final step! 🎉
        </h1>
        <p className="mt-3 text-slate-500 text-sm sm:text-lg">
          Watch the short video below to enable faster processing.
        </p>
      </section>

      {/* Video */}
      <section className="mx-auto w-full max-w-4xl px-3 sm:px-4 mt-6">
        <div className="-mx-3 overflow-hidden shadow-2xl sm:mx-0 sm:rounded-xl bg-black">
          <vturb-smartplayer
            id={`vid-${PLAYER_ID}`}
            style={{ display: "block", margin: "0 auto", width: "100%" }}
          />
        </div>
      </section>

      {/* Initializing block — visible until the CTA unlocks */}
      {!ctaUnlocked && (
        <section className="mx-auto w-full max-w-3xl px-4 mt-8 text-center animate-fade-in">
          <h2 className="text-xl sm:text-2xl font-bold">Initializing Payment Channel...</h2>
          <div className="mt-4 flex justify-center">
            <div
              className="h-10 w-10 rounded-full border-4 border-slate-200 animate-spin"
              style={{ borderTopColor: ACCENT }}
            />
          </div>
          <p className="mt-4 text-slate-500 text-sm sm:text-base">
            Connecting to financial system...
          </p>

          {/* Fake progress bar */}
          <div className="mt-6">
            <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full"
                style={{ width: "80%", backgroundColor: ACCENT, transition: "width 1s ease" }}
              />
            </div>
            <div className="mt-2 text-right text-xs font-semibold text-slate-500">80%</div>
          </div>
        </section>
      )}

      {/* CTA buttons — appear right under the video once the threshold is reached */}
      {ctaUnlocked && (
        <section className="mx-auto w-full max-w-3xl px-4 mt-6 mb-12 flex flex-col items-center gap-5 animate-fade-in">
          <UpsellPriceBlock price="$37.00" recurring="$37.00 every 30 days, until canceled!" />
          <a
            href={YES_URL}
            rel="noreferrer"
            referrerPolicy="no-referrer"
            className="w-full inline-flex items-center justify-center text-center px-4 py-4 sm:px-8 sm:py-5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white font-extrabold uppercase tracking-wide text-sm sm:text-lg shadow-lg shadow-emerald-600/30 transition-transform active:scale-[0.98] break-words"
            style={{
              animation: "upsell3Pulse 1.6s ease-in-out infinite",
            }}
          >
            I WON'T LET IT ESCAPE
          </a>
          <a
            href={NO_URL}
            rel="noreferrer"
            referrerPolicy="no-referrer"
            className="text-slate-400 hover:text-slate-600 underline text-sm text-center"
          >
            No, I'm not going to let this opportunity pass.
          </a>
        </section>
      )}

      <UpsellFooter />

      <style>{`
        @keyframes upsell3Pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 10px 25px -5px rgba(22,163,74,0.45); }
          50% { transform: scale(1.03); box-shadow: 0 14px 30px -5px rgba(22,163,74,0.65); }
        }
      `}</style>
    </div>
  );
}
