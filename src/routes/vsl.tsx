import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Lock, ShieldCheck, ArrowDown } from "lucide-react";

import { FlagUS } from "../components/Flag";

const PLAYER_ID = "69f140ee2e62e594e34723cd";
const PLAYER_ELEMENT_ID = `ab-${PLAYER_ID}`;
const PLAYER_SRC =
  "https://scripts.converteai.net/3d3e08e7-4c37-4616-b881-330803f7b01c/ab-test/69f140ee2e62e594e34723cd/player.js";

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
      { title: "How to Claim Your Unclaimed Funds — American System" },
      {
        name: "description",
        content:
          "Watch the short walkthrough and follow the official steps to claim the funds available under your name.",
      },
      { property: "og:title", content: "How to Claim Your Unclaimed Funds" },
      {
        property: "og:description",
        content:
          "Short walkthrough showing exactly how to claim the funds available under your name.",
      },
    ],
    links: [
      {
        rel: "preload",
        href: PLAYER_SRC,
        as: "script",
        fetchPriority: "high",
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
      { rel: "dns-prefetch", href: "https://license.vturb.com" },
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

function VslPage() {
  const [checkoutUrl, setCheckoutUrl] = useState(
    "https://www.checkout-ds24.com/product/687076",
  );
  // Personalized values from the home form (fall back to neutral copy if missing)
  const [leadName, setLeadName] = useState("");
  const [leadAmount, setLeadAmount] = useState("");
  useEffect(() => {
    try {
      setLeadName((sessionStorage.getItem("lead_name") || "").split(/\s+/)[0] || "");
      setLeadAmount(sessionStorage.getItem("lead_amount_formatted") || "");
    } catch {}
  }, []);

  // Loading state for the checkout CTA — prevents double-fire of the
  // dataLayer push while the redirect is in flight.
  const isCheckingOutRef = useRef(false);

  // Stable handler kept in a ref so the click-listener attached to the
  // shadow-DOM anchor always reads the freshest closure without us having
  // to detach/reattach (which is what caused the duplicate-event bug).
  const handleBeginCheckoutRef = useRef(() => {
    if (isCheckingOutRef.current) return false;
    isCheckingOutRef.current = true;
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
    window.setTimeout(() => {
      isCheckingOutRef.current = false;
    }, 4000);
    return true;
  });

  // Latest checkout URL kept in a ref so the click-listener can read it
  // without us re-running the patch effect (which would re-attach listeners).
  const checkoutUrlRef = useRef(checkoutUrl);
  useEffect(() => {
    checkoutUrlRef.current = checkoutUrl;
  }, [checkoutUrl]);

  // Build the Digistore checkout URL.
  // - sid1 is set from the click_id captured on page 1 (fbclid / ttclid)
  //   so Digistore postbacks can attribute the sale to the correct ad click.
  // - Forwards marketing params (utm_*, fbclid, gclid, ttclid, msclkid, etc.)
  // - Prefills first_name / last_name from the Full Name entered on page 1.
  useEffect(() => {
    try {
      const url = new URL("https://www.checkout-ds24.com/product/687076");

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
  useEffect(() => {
    const ID = "vturb-player-script";
    const existing = document.getElementById(ID);
    if (existing) existing.remove();

    const s = document.createElement("script");
    s.id = ID;
    s.src = PLAYER_SRC;
    s.async = true;
    document.head.appendChild(s);
  }, []);

  // Rewrite the VTurb player's built-in CTA button so it points to our
  // tracked checkout URL and fires begin_checkout on click. Runs ONCE —
  // the listener reads the latest URL/handler through refs, so we never
  // re-attach (which previously caused duplicate begin_checkout events).
  useEffect(() => {
    if (typeof window === "undefined") return;

    let cancelled = false;
    const patched = new WeakSet<HTMLAnchorElement>();

    const collectAnchors = (root: ShadowRoot | Document | Element): HTMLAnchorElement[] => {
      const out: HTMLAnchorElement[] = [];
      const walk = (node: ShadowRoot | Document | Element) => {
        node.querySelectorAll?.("a").forEach((a) => out.push(a as HTMLAnchorElement));
        node.querySelectorAll?.("*").forEach((el) => {
          const sr = (el as Element & { shadowRoot?: ShadowRoot | null }).shadowRoot;
          if (sr) walk(sr);
        });
      };
      walk(root);
      return out;
    };

    const patchAnchor = (a: HTMLAnchorElement) => {
      if (patched.has(a)) return;
      const href = a.getAttribute("href") || "";
      if (!/checkout-ds24\.com|digistore24/i.test(href)) return;
      patched.add(a);
      a.href = checkoutUrlRef.current;
      a.target = "_self";
      a.rel = "noopener noreferrer";
      a.addEventListener(
        "click",
        () => {
          a.href = checkoutUrlRef.current;
          handleBeginCheckoutRef.current();
        },
        { capture: true },
      );
    };

    const scan = () => {
      if (cancelled) return;
      const host = document.getElementById(PLAYER_ELEMENT_ID);
      if (!host) return;
      const sr = (host as Element & { shadowRoot?: ShadowRoot | null }).shadowRoot;
      if (sr) collectAnchors(sr).forEach(patchAnchor);
      collectAnchors(host).forEach(patchAnchor);
    };

    const interval = window.setInterval(scan, 600);
    const initial = window.setTimeout(scan, 300);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
      window.clearTimeout(initial);
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
                Check for unclaimed funds
              </div>
            </div>
          </Link>
        </div>

        {/* Hero */}
        <div className="mx-auto max-w-6xl px-4 pb-6 pt-4 sm:px-6 sm:pb-10 sm:pt-6">
          <h1 className="text-xl font-bold leading-snug sm:text-2xl md:text-3xl">
            {leadName ? `Welcome, ${leadName}` : "Welcome"}
          </h1>
          <p className="mt-2 text-xs text-white/80 sm:text-sm">
            {leadAmount ? (
              <>
                Your estimated amount is up to{" "}
                <span className="font-semibold text-emerald-300">{leadAmount}</span>.
              </>
            ) : (
              <>Your estimated amount is ready to review.</>
            )}{" "}
            <span className="block text-[10px] text-white/60 sm:inline sm:text-[11px]">
              * Estimate only — eligibility and final amount are not guaranteed.
            </span>
          </p>
        </div>
      </header>

      {/* Video section */}
      <main className="mx-auto max-w-4xl px-3 py-6 sm:px-4 sm:py-10">
        <div className="text-center">
          <p className="text-sm font-semibold text-foreground sm:text-base md:text-lg">
            Watch the short walkthrough:{" "}
            <span className="underline">
              "How to Claim {leadAmount ? `Up to ${leadAmount}` : "Your Funds"}"
            </span>
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
            of any unclaimed funds. © {new Date().getFullYear()} Official Check.
          </p>
        </div>
      </footer>
    </div>
  );
}
