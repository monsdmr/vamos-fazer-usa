import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Lock,
  ShieldCheck,
  BadgeCheck,
  Play,
  ArrowDown,
  Volume2,
} from "lucide-react";
import exclusiveOfferBtn from "@/assets/exclusive-offer-button.png";

// Time in seconds (from video start) when the pitch begins and the CTA unlocks
const PITCH_REVEAL_SECONDS = 600; // 10 minutes — adjust to match your VSL pitch moment

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
  }),
  component: VslPage,
});

function VslPage() {
  const [playing, setPlaying] = useState(false);

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

        {/* Video player */}
        <div className="mt-6 overflow-hidden rounded-xl bg-black shadow-2xl ring-1 ring-black/10">
          <div className="relative aspect-video w-full">
            {!playing ? (
              <button
                type="button"
                onClick={() => setPlaying(true)}
                className="group absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 via-slate-900 to-black"
                aria-label="Play video"
              >
                {/* "Tap to play sound" badge */}
                <div className="mb-6 inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-bold uppercase tracking-wide text-white shadow-lg">
                  <Volume2 className="h-4 w-4" />
                  Tap to play sound
                </div>
                {/* Play button */}
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-600 shadow-2xl transition-transform group-hover:scale-110">
                  <Play className="ml-1 h-12 w-12 fill-white text-white" />
                </div>
                <p className="mt-6 text-sm text-white/70">
                  Click to start the official video
                </p>
              </button>
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-black text-white">
                {/* Replace with real video iframe */}
                <video
                  controls
                  autoPlay
                  className="h-full w-full"
                  poster=""
                >
                  <source src="" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          </div>
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
