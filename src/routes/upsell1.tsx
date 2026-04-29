import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { UpsellFooter } from "@/components/UpsellFooter";
import { UpsellProgress } from "@/components/UpsellProgress";

// Reveal CTA after the user has actually watched this many seconds of the video
const CTA_REVEAL_SECONDS = 3 * 60 + 40; // 3:40


// Isolated upsell page — replicates the reference layout (Final Step Before Access)
// vturb player id for this upsell
const PLAYER_ID = "69a9a10b707a2230877f705e";
const PLAYER_SRC = `https://scripts.converteai.net/f60c6c24-93af-4941-ad66-43dcc36feb4a/players/${PLAYER_ID}/v4/player.js`;

const YES_URL = "https://www.checkout-ds24.com/answer/yes?template=25753";
const NO_URL = "https://www.checkout-ds24.com/answer/no";

// <vturb-smartplayer> JSX type is already declared in src/routes/vsl.tsx

export const Route = createFileRoute("/upsell1")({
  head: () => ({
    meta: [
      { title: "Final Step Before Access" },
      { name: "description", content: "Please watch the short video below to unlock the next feature." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Final Step Before Access" },
      { property: "og:description", content: "Please watch the short video below to unlock the next feature." },
    ],
    links: [
      { rel: "preload", href: PLAYER_SRC, as: "script" },
      { rel: "dns-prefetch", href: "https://cdn.converteai.net" },
      { rel: "dns-prefetch", href: "https://scripts.converteai.net" },
      { rel: "dns-prefetch", href: "https://images.converteai.net" },
    ],
  }),
  component: UpsellPage,
});

function UpsellPage() {
  const [ctaUnlocked, setCtaUnlocked] = useState(false);

  useEffect(() => {
    const ID = "vturb-upsell1-script";
    const existing = document.getElementById(ID);
    if (existing) existing.remove();
    const s = document.createElement("script");
    s.id = ID;
    s.src = PLAYER_SRC;
    s.async = true;
    document.head.appendChild(s);
  }, []);

  // Sync CTA reveal with actual video playback time (3:40)
  useEffect(() => {
    if (ctaUnlocked) return;

    let media: HTMLMediaElement | null = null;
    let pollId: number | null = null;

    const onTimeUpdate = () => {
      if (media && media.currentTime >= CTA_REVEAL_SECONDS) {
        setCtaUnlocked(true);
      }
    };

    const tryFind = () => {
      const player = document.getElementById(`vid-${PLAYER_ID}`);
      const root: ParentNode | null =
        (player && (player as HTMLElement & { shadowRoot?: ShadowRoot | null }).shadowRoot) ||
        player ||
        document;
      const found = root.querySelector("video, audio") as HTMLMediaElement | null;
      if (found) {
        media = found;
        media.addEventListener("timeupdate", onTimeUpdate);
        onTimeUpdate();
        if (pollId !== null) {
          window.clearInterval(pollId);
          pollId = null;
        }
      }
    };

    pollId = window.setInterval(tryFind, 500);
    tryFind();

    return () => {
      if (pollId !== null) window.clearInterval(pollId);
      if (media) media.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, [ctaUnlocked]);


  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
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
            <span className="font-semibold truncate">Secure Processing System</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium">Session Active</span>
          </div>
        </div>
      </header>

      <UpsellProgress currentStep={1} />

      {/* Title */}
      <section className="mx-auto w-full max-w-3xl px-4 pt-8 sm:pt-12 text-center">
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
          Your Order Is Not Complete Yet
        </h1>
        <h2 className="mt-2 text-xl sm:text-3xl font-extrabold tracking-tight">
          Please Watch This Important Message Below Now
        </h2>
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

      {/* Processing block — visible until the CTA unlocks */}
      {!ctaUnlocked && (
        <section className="mx-auto w-full max-w-3xl px-4 mt-8 text-center animate-fade-in">
          <h2 className="text-xl sm:text-2xl font-bold">Processing your request...</h2>
          <div className="mt-4 flex justify-center">
            <div className="h-10 w-10 rounded-full border-4 border-slate-200 border-t-[#0e2a3a] animate-spin" />
          </div>
          <p className="mt-4 text-slate-500 text-sm sm:text-base">
            Connecting to financial verification system...
          </p>

          {/* Fake progress bar */}
          <div className="mt-6">
            <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-[#CC1212]"
                style={{ width: "99%", transition: "width 1s ease" }}
              />
            </div>
            <div className="mt-2 text-right text-xs font-semibold text-slate-500">99%</div>
          </div>
        </section>
      )}

      {/* CTA buttons — appear right under the video once 3:40 is reached */}
      {ctaUnlocked && (
        <section className="mx-auto w-full max-w-3xl px-4 mt-6 mb-12 flex flex-col items-center gap-5 animate-fade-in">
          <UpsellPriceBlock price="$47.00" recurring="$47.00 every 30 days, until canceled!" />
          <a
            href={YES_URL}
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white font-extrabold uppercase tracking-wide text-base sm:text-lg shadow-lg shadow-emerald-600/30 transition-transform active:scale-[0.98]"
            style={{
              animation: "upsellPulse 1.6s ease-in-out infinite",
            }}
          >
            INCREASE YOUR BENEFITS! NOW ONLY!!!
          </a>
          <a
            href={NO_URL}
            className="text-slate-400 hover:text-slate-600 underline text-sm"
          >
            I don't want to increase my benefit.
          </a>
        </section>
      )}

      <UpsellFooter />

      <style>{`
        @keyframes upsellPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 10px 25px -5px rgba(22,163,74,0.45); }
          50% { transform: scale(1.03); box-shadow: 0 14px 30px -5px rgba(22,163,74,0.65); }
        }
      `}</style>
    </div>
  );
}
