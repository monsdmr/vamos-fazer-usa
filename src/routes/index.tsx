import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Lock,
  BadgeCheck,
  Clock,
  Users,
  Star,
  User,
  MapPin,
  FileCheck2,
  Check,
  Play,
  Download,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming", "Other",
];

function Stepper({ current }: { current: 1 | 2 | 3 }) {
  const steps = [
    { n: 1, label: "Data" },
    { n: 2, label: "Verify" },
    { n: 3, label: "Result" },
  ];
  return (
    <div className="border-b border-border pb-6">
      <div className="flex items-center justify-between gap-2">
        {steps.map((s) => {
          const active = current === s.n;
          const done = current > s.n;
          return (
            <div key={s.n} className="flex flex-1 flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors ${
                  active
                    ? "border-[var(--brand)] text-[var(--brand)]"
                    : done
                      ? "border-[var(--brand)] bg-[var(--brand)] text-white"
                      : "border-muted-foreground/30 text-muted-foreground"
                }`}
              >
                {s.n}
              </div>
              <span
                className={`mt-2 text-xs font-semibold ${
                  active ? "text-[var(--brand)]" : "text-muted-foreground"
                }`}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Index() {
  const [name, setName] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !stateVal || !authorized) {
      setError("Please enter your name, choose a state, and authorize verification.");
      return;
    }
    setError("");
  };

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
      {/* Trust bar */}
      <div className="bg-[#08202e] text-white/80">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-6 py-2 text-xs">
          <div className="flex items-center gap-2">
            <Lock className="h-3.5 w-3.5 text-emerald-400" />
            <span>Secure connection · SSL 256-bit encryption</span>
          </div>
          <div className="hidden items-center gap-4 sm:flex">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              GDPR / CCPA compliant
            </span>
            <span className="flex items-center gap-1">
              <BadgeCheck className="h-3.5 w-3.5 text-emerald-400" />
              Verified provider
            </span>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-[var(--brand)] text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl" aria-hidden>🇺🇸</span>
            <div className="leading-tight">
              <div className="text-base font-bold">Official Check</div>
              <div className="text-xs text-white/70">
                Verify if there are restitutions
              </div>
            </div>
          </div>
          <nav className="flex items-center gap-6 text-sm">
            <a href="#" className="hover:text-white/80">Home</a>
            <a href="#" className="hover:text-white/80">About</a>
            <a href="#" className="hover:text-white/80">Contact</a>
          </nav>
        </div>

        {/* Hero */}
        <div className="mx-auto max-w-6xl px-6 pb-12 pt-6">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-medium text-white/90">
            <BadgeCheck className="h-3.5 w-3.5 text-emerald-400" />
            Official verification system
          </div>
          <h1 className="text-2xl font-bold leading-snug md:text-3xl">
            Check if there are restitutions in your name —
            <span className="text-emerald-300"> response in 10 seconds</span>
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-white/70">
            Enter your details below to securely check eligibility. Your data is
            encrypted and never shared with third parties.
          </p>

          {/* Trust stats */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs">
              <Users className="h-4 w-4 text-emerald-400" />
              <div>
                <div className="font-semibold text-white">+120,000</div>
                <div className="text-white/60">verifications completed</div>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs">
              <Clock className="h-4 w-4 text-emerald-400" />
              <div>
                <div className="font-semibold text-white">~10 seconds</div>
                <div className="text-white/60">average response time</div>
              </div>
            </div>
            <div className="col-span-2 flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs sm:col-span-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <div>
                <div className="font-semibold text-white">4.8 / 5</div>
                <div className="text-white/60">based on 8,400+ reviews</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Card */}
      <main className="mx-auto -mt-6 max-w-3xl px-4 pb-12">
        <div className="rounded-xl bg-white p-6 shadow-lg ring-1 ring-black/5 md:p-8">
          <Stepper current={1} />

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">
                Full Name
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="As shown on your official document"
                  className="w-full rounded-md border border-input bg-white py-2.5 pl-9 pr-3 text-sm shadow-sm outline-none transition-colors focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">
                State
              </label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <select
                  value={stateVal}
                  onChange={(e) => setStateVal(e.target.value)}
                  className="w-full appearance-none rounded-md border border-input bg-white py-2.5 pl-9 pr-3 text-sm shadow-sm outline-none transition-colors focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20"
                >
                  <option value="">Select your state</option>
                  {US_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <label className="flex items-start gap-2 rounded-md bg-muted/40 p-3 text-sm text-foreground">
              <input
                type="checkbox"
                checked={authorized}
                onChange={(e) => setAuthorized(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-input accent-[var(--brand)]"
              />
              <span>
                I authorize the verification of my information in accordance
                with the{" "}
                <a href="#" className="font-semibold text-[var(--brand)] underline">
                  Privacy Policy
                </a>
                .
              </span>
            </label>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-md bg-[var(--brand)] px-4 py-3 text-sm font-semibold text-white shadow transition-opacity hover:opacity-90"
            >
              Verify Now <ArrowRight className="h-4 w-4" />
            </button>

            {error && (
              <p className="text-center text-sm text-destructive">{error}</p>
            )}

            {/* Microcopy under CTA */}
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 pt-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Lock className="h-3 w-3" /> 256-bit encrypted
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" /> No credit card required
              </span>
              <span className="flex items-center gap-1">
                <FileCheck2 className="h-3 w-3" /> Free check
              </span>
            </div>
          </form>
        </div>

        {/* Testimonial strip */}
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {[
            { name: "Sarah M.", state: "TX", text: "Quick and easy process. Got my response in seconds." },
            { name: "James R.", state: "FL", text: "Clear instructions and felt secure throughout." },
            { name: "Linda K.", state: "CA", text: "Professional service. Highly recommended." },
          ].map((t) => (
            <div
              key={t.name}
              className="rounded-lg border border-border bg-white p-4 text-sm shadow-sm"
            >
              <div className="mb-1 flex gap-0.5 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <p className="text-foreground/80">"{t.text}"</p>
              <p className="mt-2 text-xs font-semibold text-muted-foreground">
                — {t.name}, {t.state}
              </p>
            </div>
          ))}
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
            of any restitution. All data is processed securely and never shared
            without your consent. © {new Date().getFullYear()} Official Check.
            All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
