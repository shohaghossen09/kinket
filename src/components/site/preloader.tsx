"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface PreloaderProps {
  onComplete: () => void;
}

/**
 * Cinematic entrance: brand mark + progress counter, then a clip-path curtain
 * lifts to reveal the hero. Skipped entirely for reduced-motion users.
 */
export function Preloader({ onComplete }: PreloaderProps) {
  const reduced = useReducedMotion();
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (reduced) {
      onComplete();
      return;
    }
    const duration = 1300;
    const start = performance.now();
    let rafId = 0;

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      // ease-out for a satisfying deceleration
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(eased * 100));
      if (t < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setDone(true);
        const timeout = setTimeout(onComplete, 320);
        return () => clearTimeout(timeout);
      }
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [reduced]);

  if (reduced) return null;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-[#0a0a0b]"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
          aria-hidden="true"
        >
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-6"
          >
            <span className="font-display text-2xl font-semibold tracking-[0.32em] text-foreground">
              KINETIC<span className="text-accent">®</span>
            </span>
            <div className="h-px w-40 overflow-hidden bg-white/10">
              <motion.div
                className="h-full bg-gradient-to-r from-accent-warm to-accent"
                style={{ width: `${count}%` }}
              />
            </div>
            <span className="font-mono text-xs tabular-nums tracking-[0.2em] text-muted-foreground">
              {String(count).padStart(3, "0")} — LOADING EXPERIENCE
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
