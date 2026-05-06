import { useEffect } from "react";

declare global {
  interface Window {
    digistoreUpsell?: () => void;
    __digistoreUpsellFired?: boolean;
  }
}

/**
 * Calls window.digistoreUpsell() once the Digistore script is available
 * AND the CTA links are mounted in the DOM. Retries for a few seconds
 * because the external script loads async and the buttons render
 * conditionally after the user watches enough of the video.
 */
export function useDigistoreUpsell(ready: boolean) {
  useEffect(() => {
    if (!ready) return;
    if (typeof window === "undefined") return;

    let cancelled = false;
    let attempts = 0;
    const MAX_ATTEMPTS = 40; // ~20s at 500ms

    const tryFire = () => {
      if (cancelled) return;
      attempts += 1;
      const fn = window.digistoreUpsell;
      if (typeof fn === "function") {
        try {
          fn();
          window.__digistoreUpsellFired = true;
        } catch {
          /* ignore */
        }
        return;
      }
      if (attempts < MAX_ATTEMPTS) {
        setTimeout(tryFire, 500);
      }
    };

    // Defer one tick so React commits the CTA links before the script
    // rewrites their href with tracking params.
    const t = setTimeout(tryFire, 0);

    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [ready]);
}
