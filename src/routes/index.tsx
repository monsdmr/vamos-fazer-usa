import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

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
    <div className="flex items-center justify-between gap-2 border-b border-border pb-6">
      {steps.map((s, i) => {
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
          // brand color (deep navy)
          ["--brand" as string]: "#0e2a3a",
        } as React.CSSProperties
      }
    >
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
        <div className="mx-auto max-w-6xl px-6 pb-10 pt-6">
          <h1 className="text-2xl font-bold leading-snug md:text-3xl">
            “Official check: verify if there are restitutions in your name —
            response in 10s”
          </h1>
          <p className="mt-2 text-sm text-white/70">
            Enter your details below to proceed.
          </p>
        </div>
      </header>

      {/* Card */}
      <main className="mx-auto -mt-6 max-w-3xl px-4 pb-16">
        <div className="rounded-xl bg-white p-6 shadow-sm md:p-8">
          <Stepper current={1} />

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-input bg-white px-3 py-2.5 text-sm shadow-sm outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">
                State
              </label>
              <select
                value={stateVal}
                onChange={(e) => setStateVal(e.target.value)}
                className="w-full rounded-md border border-input bg-white px-3 py-2.5 text-sm shadow-sm outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20"
              >
                <option value="">Select your state</option>
                {US_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <input
                type="checkbox"
                checked={authorized}
                onChange={(e) => setAuthorized(e.target.checked)}
                className="h-4 w-4 rounded border-input accent-[var(--brand)]"
              />
              I authorize verification.
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
          </form>
        </div>
      </main>
    </div>
  );
}
