"use client";

import { useEffect, useRef, type RefObject } from "react";
import type { LottieHandle } from "lottie-react";

const STALL_CHECK_MS = 2000;

/**
 * Some of our Lottie icons have been observed playing once and then
 * sitting frozen instead of looping - most likely because the heavy
 * Travelpayouts widget script (loaded globally, doing shadow-DOM and
 * document.dir work right as the page mounts) starves the main thread
 * long enough to throw off lottie-web's internal clock. Rather than
 * chase that race precisely, this watches for the current frame not
 * moving between checks and force-restarts playback - recovering
 * regardless of what actually caused the stall.
 */
/**
 * `allowRestAtEnd` - for a one-shot "settle at rest" icon (loop=false),
 * sitting on its final frame is the intended outcome, not a stall; only
 * icons meant to loop forever should be restarted from there too.
 */
export function useLottieWatchdog(lottieRef: RefObject<LottieHandle | null>, options?: { allowRestAtEnd?: boolean }) {
  const lastFrameRef = useRef<number | null>(null);
  const allowRestAtEnd = options?.allowRestAtEnd ?? false;

  useEffect(() => {
    const interval = setInterval(() => {
      const item = lottieRef.current?.animationItem;
      if (!item) return;
      const frame = item.currentFrame;
      const stalled = lastFrameRef.current !== null && Math.abs(frame - lastFrameRef.current) < 0.1;
      const restingAtEnd = allowRestAtEnd && frame >= item.totalFrames - 1;
      if (stalled && !restingAtEnd) {
        item.goToAndPlay(0, true);
      }
      lastFrameRef.current = frame;
    }, STALL_CHECK_MS);
    return () => clearInterval(interval);
  }, [lottieRef, allowRestAtEnd]);
}
