import { useEffect, useState } from "react";

/**
 * Unlocks when the VTurb smartplayer reaches `revealSeconds` of ACTUAL playback time
 * (not page-open time). Combines 3 strategies for reliability across shadow DOM /
 * cross-origin iframes / late media mounts:
 *   1) window.smartplayer.instances events + live video.currentTime polling
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
    const attachedPlayers = new WeakSet<object>();
    const intervals: number[] = [];

    const unlock = () => {
      if (!cancelled) setUnlocked(true);
    };

    const checkTime = (t: unknown) => {
      const seconds = typeof t === "number" ? t : Number(t);
      if (Number.isFinite(seconds) && seconds >= revealSeconds) unlock();
    };

    const playerMatches = (inst: SmartplayerCompatInstance, totalPlayers: number) => {
      const ids = [
        inst.id,
        inst.instance?.id,
        inst.instance?.getAttribute?.("id"),
        inst.instance?.getAttribute?.("original-id"),
        inst.analytics?.player?.options?.id,
      ].filter(Boolean);

      return (
        totalPlayers === 1 ||
        ids.length === 0 ||
        ids.includes(playerElementId) ||
        ids.includes(playerElementId.replace(/^vid-/, ""))
      );
    };

    const getSmartplayerInstances = (): SmartplayerCompatInstance[] => {
      const instances = (window as unknown as SmartplayerCompatWindow).smartplayer?.instances;
      if (!instances) return [];
      return Array.isArray(instances) ? instances : Object.values(instances);
    };

    const attachSmartplayer = (inst: SmartplayerCompatInstance, totalPlayers: number) => {
      if (!inst || attachedPlayers.has(inst) || !playerMatches(inst, totalPlayers)) return;
      attachedPlayers.add(inst);

      inst.on?.("timeupdate", (p) => {
        checkTime(typeof p === "number" ? p : p?.currentTime ?? p?.time);
      });

      inst.instance?.addEventListener?.("video:timeupdate", (event) => {
        checkTime((event as CustomEvent<{ time?: number }>).detail?.time);
      });

      checkTime(inst.video?.currentTime);
      checkTime(inst.instance?.video?.currentTime);
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

      const players = getSmartplayerInstances();
      const matchingPlayers = players.filter((inst) => playerMatches(inst, players.length));
      if (matchingPlayers.length > 0) {
        matchingPlayers.forEach((inst) => attachSmartplayer(inst, players.length));
        const tick = window.setInterval(() => {
          if (cancelled) return;
          const currentPlayers = getSmartplayerInstances();
          currentPlayers
            .filter((inst) => playerMatches(inst, currentPlayers.length))
            .forEach((inst) => {
              attachSmartplayer(inst, currentPlayers.length);
              checkTime(inst.video?.currentTime);
              checkTime(inst.instance?.video?.currentTime);
            });
        }, 500);
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

type SmartplayerCompatInstance = {
  id?: string;
  on?: (ev: string, cb: (p: { currentTime?: number; time?: number } | number) => void) => void;
  video?: { currentTime?: number };
  analytics?: { player?: { options?: { id?: string } } };
  instance?: HTMLElement & {
    id?: string;
    video?: { currentTime?: number };
    addEventListener?: HTMLElement["addEventListener"];
    getAttribute?: HTMLElement["getAttribute"];
  };
};

type SmartplayerCompatWindow = {
  smartplayer?: {
    instances?: SmartplayerCompatInstance[] | Record<string, SmartplayerCompatInstance>;
  };
};
