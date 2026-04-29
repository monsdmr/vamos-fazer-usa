import { useEffect, useState } from "react";

/**
 * Unlocks when the VTurb smartplayer reaches `revealSeconds` of ACTUAL playback time
 * (not page-open time). Combines 3 strategies for reliability across shadow DOM /
 * cross-origin iframes / late media mounts:
 *   1) window.smartplayer.instances[playerElementId] events + getCurrentTime()
 *   2) Recursive shadow-DOM scan for the underlying <video>/<audio>
 *   3) currentTime polling as a safety net
 *
 * @param playerElementId The DOM id of the <vturb-smartplayer> element
 * @param revealSeconds   Watched seconds required before unlock
 */
export function useVturbWatchTime(playerElementId: string, revealSeconds: number) {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    if (unlocked) return;

    let cancelled = false;
    let mediaEl: HTMLMediaElement | null = null;
    const intervals: number[] = [];

    const unlock = () => {
      if (!cancelled) setUnlocked(true);
    };

    const checkTime = (t: unknown) => {
      if (typeof t === "number" && t >= revealSeconds) unlock();
    };

    const onTimeUpdate = () => {
      if (mediaEl) checkTime(mediaEl.currentTime);
    };

    const findMediaDeep = (
      root: Document | ShadowRoot | Element
    ): HTMLMediaElement | null => {
      const direct = (root as ParentNode).querySelector?.(
        "video, audio"
      ) as HTMLMediaElement | null;
      if (direct) return direct;
      const all = (root as ParentNode).querySelectorAll?.("*") ?? [];
      for (const el of Array.from(all)) {
        const sr = (el as Element & { shadowRoot?: ShadowRoot | null }).shadowRoot;
        if (sr) {
          const found = findMediaDeep(sr);
          if (found) return found;
        }
      }
      return null;
    };

    const attachMedia = (el: HTMLMediaElement) => {
      if (mediaEl) return;
      mediaEl = el;
      el.addEventListener("timeupdate", onTimeUpdate);
      checkTime(el.currentTime);
    };

    const poll = window.setInterval(() => {
      if (cancelled) return;

      const sp = (window as unknown as {
        smartplayer?: {
          instances?: Record<
            string,
            {
              on?: (
                ev: string,
                cb: (p: { currentTime?: number } | number) => void
              ) => void;
              getCurrentTime?: () => number;
            }
          >;
        };
      }).smartplayer;
      const inst = sp?.instances?.[playerElementId];
      if (inst && typeof inst.on === "function") {
        inst.on("timeupdate", (p) => {
          const t = typeof p === "number" ? p : p?.currentTime;
          checkTime(t);
        });
        const tick = window.setInterval(() => {
          if (cancelled) return;
          checkTime(inst.getCurrentTime?.());
        }, 1000);
        intervals.push(tick);
        window.clearInterval(poll);
        return;
      }

      const media = findMediaDeep(document);
      if (media) {
        attachMedia(media);
        const tick = window.setInterval(() => {
          if (cancelled || !mediaEl) return;
          checkTime(mediaEl.currentTime);
        }, 1000);
        intervals.push(tick);
        window.clearInterval(poll);
      }
    }, 500);
    intervals.push(poll);

    return () => {
      cancelled = true;
      intervals.forEach((id) => window.clearInterval(id));
      if (mediaEl) mediaEl.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, [playerElementId, revealSeconds, unlocked]);

  return unlocked;
}
