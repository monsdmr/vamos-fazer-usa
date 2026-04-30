import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Lock,
  Check,
  User,
  MapPin,
  Play,
  Phone,
} from "lucide-react";
import { FlagUS } from "../components/Flag";

// Lazy-load non-critical icons (only used on step 3 / footer info).
// Keeps initial JS bundle smaller for first paint.
const ShieldCheck = lazy(() =>
  import("lucide-react").then((m) => ({ default: m.ShieldCheck })),
);
const BadgeCheck = lazy(() =>
  import("lucide-react").then((m) => ({ default: m.BadgeCheck })),
);
const FileCheck2 = lazy(() =>
  import("lucide-react").then((m) => ({ default: m.FileCheck2 })),
);
const Star = lazy(() =>
  import("lucide-react").then((m) => ({ default: m.Star })),
);
const Download = lazy(() =>
  import("lucide-react").then((m) => ({ default: m.Download })),
);

const IconFallback = () => <span className="inline-block h-3 w-3" />;

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
  const progress = current === 1 ? 0 : current === 2 ? 50 : 100;
  return (
    <div className="pb-5 sm:pb-6">
      <div className="flex items-center justify-between gap-1 sm:gap-2">
        {steps.map((s) => {
          const active = current === s.n;
          const done = current > s.n;
          return (
            <div key={s.n} className="flex flex-1 flex-col items-center min-w-0">
              <div
                className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border-2 text-xs sm:text-sm font-semibold transition-colors ${
                  done
                    ? "border-emerald-500 bg-emerald-50 text-emerald-600"
                    : active
                      ? "border-[var(--brand)] text-[var(--brand)]"
                      : "border-muted-foreground/30 text-muted-foreground"
                }`}
              >
                {done ? <Check className="h-4 w-4 sm:h-5 sm:w-5" /> : s.n}
              </div>
              <span
                className={`mt-1.5 sm:mt-2 text-[11px] sm:text-xs font-semibold text-center ${
                  done
                    ? "text-emerald-600"
                    : active
                      ? "text-[var(--brand)]"
                      : "text-muted-foreground"
                }`}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-emerald-500 transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

const LOADING_MESSAGES = [
  "Initializing secure session…",
  "Connecting to verification database…",
  "Cross-checking your information…",
  "Almost done…",
];

function generateRecordId() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let id = "";
  for (let i = 0; i < 10; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return `FR-${id}`;
}

const VSL_THUMB =
  "https://images.converteai.net/3d3e08e7-4c37-4616-b881-330803f7b01c/players/69f140ee2e62e594e34723cd/thumbnail.jpg";

// Format a digit string into US phone mask: (XXX) XXX-XXXX
function formatUSPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  const len = digits.length;
  if (len === 0) return "";
  if (len < 4) return `(${digits}`;
  if (len < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

// Validate a US phone (NANP) raw input. Returns { ok, e164, error }.
// Rules per NANP:
//  - Strip optional leading "+1" or "1"
//  - Must be exactly 10 digits after stripping
//  - Area code (NPA): first digit 2-9, second digit 0-9, third digit 0-9
//  - Exchange code (NXX): first digit 2-9
//  - Reject inputs containing letters or invalid characters
function validateUSPhone(raw: string): {
  ok: boolean;
  e164: string;
  formatted: string;
  error: string;
} {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { ok: false, e164: "", formatted: "", error: "Phone number is required." };
  }
  // Reject letters explicitly (common typo: typing words instead of numbers)
  if (/[a-zA-Z]/.test(trimmed)) {
    return {
      ok: false,
      e164: "",
      formatted: "",
      error: "Phone number cannot contain letters. Use digits only, e.g. (555) 123-4567.",
    };
  }
  // Allow only digits, spaces, parentheses, hyphens, dots and leading +
  if (!/^[+\d\s().\-]+$/.test(trimmed)) {
    return {
      ok: false,
      e164: "",
      formatted: "",
      error: "Phone number contains invalid characters. Use digits only.",
    };
  }
  let digits = trimmed.replace(/\D/g, "");
  // Strip optional country code "1"
  if (digits.length === 11 && digits.startsWith("1")) {
    digits = digits.slice(1);
  }
  if (digits.length < 10) {
    return {
      ok: false,
      e164: "",
      formatted: "",
      error: `Phone number is too short (${digits.length}/10 digits). Use US format: (XXX) XXX-XXXX.`,
    };
  }
  if (digits.length > 10) {
    return {
      ok: false,
      e164: "",
      formatted: "",
      error: "Phone number has too many digits. US numbers have 10 digits.",
    };
  }
  const areaCode = digits.slice(0, 3);
  const exchange = digits.slice(3, 6);
  if (areaCode[0] === "0" || areaCode[0] === "1") {
    return {
      ok: false,
      e164: "",
      formatted: "",
      error: "Invalid area code. US area codes cannot start with 0 or 1.",
    };
  }
  if (exchange[0] === "0" || exchange[0] === "1") {
    return {
      ok: false,
      e164: "",
      formatted: "",
      error: "Invalid phone number. The 4th digit cannot be 0 or 1.",
    };
  }
  return {
    ok: true,
    e164: `+1${digits}`,
    formatted: formatUSPhone(digits),
    error: "",
  };
}

function Index() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [loadingIdx, setLoadingIdx] = useState(0);
  const [recordId, setRecordId] = useState("");
  
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const phoneInputRef = useRef<HTMLInputElement | null>(null);
  const stateSelectRef = useRef<HTMLSelectElement | null>(null);
  const authorizedRef = useRef<HTMLInputElement | null>(null);

  // Preload the /vsl route + player + thumbnail as soon as we enter step 2.
  // By the time the user lands on step 3 and clicks, everything is cached.
  useEffect(() => {
    if (step !== 2) return;
    setLoadingIdx(0);

    // 1. Preload the /vsl route bundle
    router.preloadRoute({ to: "/vsl" }).catch(() => {});

    // 2. Preload the VSL player script
    const PLAYER_SRC =
      "https://scripts.converteai.net/3d3e08e7-4c37-4616-b881-330803f7b01c/ab-test/69f140ee2e62e594e34723cd/player.js";
    if (!document.querySelector(`link[data-vsl-preload]`)) {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "script";
      link.href = PLAYER_SRC;
      link.setAttribute("data-vsl-preload", "true");
      document.head.appendChild(link);
    }

    // 3. Preload the video thumbnail (first frame) — appears instantly on /vsl
    if (!document.querySelector(`link[data-vsl-thumb]`)) {
      const imgLink = document.createElement("link");
      imgLink.rel = "preload";
      imgLink.as = "image";
      imgLink.href = VSL_THUMB;
      imgLink.setAttribute("fetchpriority", "high");
      imgLink.setAttribute("data-vsl-thumb", "true");
      document.head.appendChild(imgLink);
    }

    const interval = setInterval(() => {
      setLoadingIdx((i) => Math.min(i + 1, LOADING_MESSAGES.length - 1));
    }, 700);
    const timeout = setTimeout(() => {
      setRecordId(generateRecordId());
      setStep(3);
    }, 2800);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [step, router]);

  // No auto-redirect — user must click "Watch Video" button.

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Read live values from the DOM as a fallback in case React state is stale
    // (e.g. mobile autofill or race between checkbox toggle and submit click).
    const liveName = (nameInputRef.current?.value ?? name).trim();
    const livePhoneRaw = phoneInputRef.current?.value ?? phone;
    const liveState = stateSelectRef.current?.value ?? stateVal;
    const liveAuthorized = authorizedRef.current?.checked ?? authorized;

    // Validate name + state + consent first
    if (!liveName) {
      setError("Please enter your full name.");
      return;
    }
    if (!liveState) {
      setError("Please select your state.");
      return;
    }
    if (!liveAuthorized) {
      setError("You must authorize the verification to continue.");
      return;
    }

    // Validate phone (NANP/E.164). Block submit on any failure with specific message.
    const phoneCheck = validateUSPhone(livePhoneRaw);
    if (!phoneCheck.ok) {
      setPhoneError(phoneCheck.error);
      setError(phoneCheck.error);
      // Focus the phone field so the user can correct it immediately
      phoneInputRef.current?.focus();
      return;
    }

    const formattedPhone = phoneCheck.formatted;
    const phoneE164 = phoneCheck.e164; // e.g. +15551234567
    const livePhoneDigits = phoneE164.slice(2); // 10 digits, no country code

    // Sync state back in case fallback values were used
    if (liveName !== name) setName(liveName);
    if (liveState !== stateVal) setStateVal(liveState);
    if (liveAuthorized !== authorized) setAuthorized(liveAuthorized);
    if (formattedPhone !== phone) setPhone(formattedPhone);
    setPhoneError("");

    // Hide mobile keyboard so the loader/CTA isn't pushed off-screen
    nameInputRef.current?.blur();
    phoneInputRef.current?.blur();
    stateSelectRef.current?.blur();
    if (typeof document !== "undefined" && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setError("");
    // Capture click_id (Facebook / TikTok) from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const clickId = urlParams.get("fbclid") || urlParams.get("ttclid") || "";

    // Persist lead data for the next step (VSL / checkout)
    try {
      if (typeof window !== "undefined") {
        // Canonical keys consumed by /vsl checkout
        sessionStorage.setItem("lead_phone", formattedPhone);
        sessionStorage.setItem("lead_name", liveName);
        sessionStorage.setItem("lead_state", liveState);
        sessionStorage.setItem("click_id", clickId);
        // Legacy/extra keys still used by other components for prefill
        sessionStorage.setItem("oc_full_name", liveName);
        sessionStorage.setItem("oc_phone", formattedPhone);
        sessionStorage.setItem("oc_phone_e164", phoneE164);
      }
    } catch {}

    // GTM dataLayer push — fired BEFORE any redirect/step change
    try {
      if (typeof window !== "undefined") {
        const w = window as unknown as { dataLayer?: Record<string, unknown>[] };
        w.dataLayer = w.dataLayer || [];
        w.dataLayer.push({
          event: "lead_submitted",
          lead_phone: formattedPhone,
          lead_phone_e164: phoneE164,
          lead_phone_digits: livePhoneDigits,
          lead_name: liveName,
          lead_state: liveState,
          click_id: clickId,
        });
      }
    } catch {}

    setStep(2);
  };

  const resetFlow = () => {
    setStep(1);
    setError("");
  };

  const focusMode = step === 2;

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
      {/* Header — hidden on mobile during verify */}
      <header className={`bg-[var(--brand)] text-white ${focusMode ? "hidden md:block" : ""}`}>
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <FlagUS size={24} />
            <div className="min-w-0 leading-tight">
              <div className="truncate text-sm font-bold sm:text-base">Official Check</div>
              <div className="truncate text-[10px] text-white/70 sm:text-xs">
                Verify if there are restitutions
              </div>
            </div>
          </div>
          {/* Nav removed to reduce exit links */}
        </div>

        {/* Hero */}
        <div className="mx-auto max-w-6xl px-4 pb-8 pt-4 sm:px-6 sm:pb-12 sm:pt-6">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-white/90 sm:px-3 sm:text-xs">
            <Suspense fallback={<IconFallback />}>
              <BadgeCheck className="h-3.5 w-3.5 text-emerald-400" />
            </Suspense>
            Official verification system
          </div>
          <h1 className="text-xl font-bold leading-snug sm:text-2xl md:text-3xl">
            Check if there are restitutions in your name —
            <span className="text-emerald-300"> response in 10 seconds</span>
          </h1>
          <p className="mt-2 max-w-2xl text-xs text-white/70 sm:text-sm">
            Enter your details below to securely check eligibility. Your data is
            encrypted and never shared with third parties.
          </p>
        </div>
      </header>

      {/* Card */}
      <main
        className={`mx-auto max-w-3xl px-3 pb-10 sm:px-4 sm:pb-12 ${
          focusMode
            ? "flex min-h-screen items-center justify-center md:-mt-6 md:block md:min-h-0"
            : "-mt-6"
        }`}
      >
        <div className="w-full rounded-xl bg-white p-4 shadow-lg ring-1 ring-black/5 sm:p-6 md:p-8">
          <Stepper current={step} />

          {step === 1 && (
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              {error && (
                <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm font-medium text-destructive">
                  {error}
                </div>
              )}
              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">
                  Full Name
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    ref={nameInputRef}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="As shown on your official document"
                    className="w-full rounded-md border border-input bg-white py-2.5 pl-9 pr-3 text-sm shadow-sm outline-none transition-colors focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20"
                    autoComplete="name"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <span className="pointer-events-none absolute left-9 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                    +1
                  </span>
                  <input
                    ref={phoneInputRef}
                    type="tel"
                    inputMode="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(formatUSPhone(e.target.value));
                      if (phoneError) setPhoneError("");
                    }}
                    onBlur={(e) => {
                      const v = e.target.value;
                      if (!v) return;
                      const check = validateUSPhone(v);
                      setPhoneError(check.ok ? "" : check.error);
                    }}
                    placeholder="(555) 123-4567"
                    maxLength={14}
                    aria-invalid={phoneError ? true : undefined}
                    aria-describedby="phone-help phone-error"
                    className={`w-full rounded-md border bg-white py-2.5 pl-16 pr-3 text-sm shadow-sm outline-none transition-colors focus:ring-2 ${
                      phoneError
                        ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                        : "border-input focus:border-[var(--brand)] focus:ring-[var(--brand)]/20"
                    }`}
                    autoComplete="tel-national"
                  />
                </div>
                {phoneError ? (
                  <p id="phone-error" className="mt-1 text-[12px] font-medium text-destructive">
                    {phoneError}
                  </p>
                ) : (
                  <p id="phone-help" className="mt-1 text-[11px] text-muted-foreground">
                    US format: (XXX) XXX-XXXX
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-foreground">
                  State
                </label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <select
                    ref={stateSelectRef}
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
                  ref={authorizedRef}
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

              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 pt-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Lock className="h-3 w-3" /> 256-bit encrypted
                </span>
                <span className="flex items-center gap-1">
                  <Suspense fallback={<IconFallback />}>
                    <ShieldCheck className="h-3 w-3" />
                  </Suspense>{" "}
                  No credit card required
                </span>
                <span className="flex items-center gap-1">
                  <Suspense fallback={<IconFallback />}>
                    <FileCheck2 className="h-3 w-3" />
                  </Suspense>{" "}
                  Free check
                </span>
              </div>
            </form>
          )}

          {step === 2 && (
            <div className="mt-10 flex flex-col items-center text-center">
              <div className="relative h-20 w-20">
                <div className="absolute inset-0 rounded-full border-4 border-muted" />
                <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-[var(--brand)]" />
              </div>
              <h2 className="mt-6 text-2xl font-bold text-foreground">
                Connecting…
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Please wait while we verify your information…
              </p>
              <p className="mt-4 text-sm font-medium text-foreground/70">
                {LOADING_MESSAGES[loadingIdx]}
              </p>
              <button
                onClick={resetFlow}
                className="mt-8 inline-flex items-center gap-2 rounded-md bg-muted px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted/70"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="mt-6 sm:mt-8 flex flex-col items-center text-center">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight text-foreground break-words">
                Congratulations{name ? `, ${name}` : ""} — there are{" "}
                <span className="text-emerald-600">$2,350.00</span> available in
                your name.
              </h2>
              {stateVal && (
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
                  State selected: {stateVal}.
                </p>
              )}

              <div className="my-6 sm:my-8 text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-emerald-600">
                $2,350.00
              </div>
              <p className="text-xs font-medium text-muted-foreground break-all">
                Record #: {recordId}
              </p>

              <Link
                to="/vsl"
                preload="intent"
                className="mt-6 flex w-full animate-pulse items-center justify-center gap-2 rounded-md bg-[var(--brand)] px-3 py-3 text-xs sm:text-sm font-semibold text-white shadow ring-2 ring-emerald-400/60 ring-offset-2 transition-transform hover:scale-[1.02] hover:opacity-90 text-center"
              >
                <Play className="h-4 w-4 shrink-0" />
                <span className="leading-tight">Watch Official Video: How to Receive</span>
              </Link>
              <button
                type="button"
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-md bg-muted px-3 py-3 text-xs sm:text-sm font-semibold text-muted-foreground hover:bg-muted/70 text-center"
              >
                <Suspense fallback={<IconFallback />}>
                  <Download className="h-4 w-4 shrink-0" />
                </Suspense>{" "}
                <span className="leading-tight">Download Instructions (PDF) — Watch video first</span>
              </button>

              <button
                onClick={resetFlow}
                className="mt-6 text-xs font-semibold text-muted-foreground underline hover:text-foreground"
              >
                Start a new verification
              </button>
            </div>
          )}
        </div>

        {/* Testimonial strip — hidden on mobile during verify */}
        <div className={`mt-6 grid gap-3 md:grid-cols-3 ${focusMode ? "hidden md:grid" : ""}`}>
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
                  <Suspense key={i} fallback={<IconFallback />}>
                    <Star className="h-3.5 w-3.5 fill-current" />
                  </Suspense>
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

      {/* Footer — only Privacy Policy, hidden on mobile during verify */}
      <footer className={`border-t border-border bg-white ${focusMode ? "hidden md:block" : ""}`}>
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-muted-foreground sm:px-6 sm:py-8">
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center sm:gap-4">
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
            of any restitution. All data is processed securely and never shared
            without your consent. © {new Date().getFullYear()} Official Check.
            All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
