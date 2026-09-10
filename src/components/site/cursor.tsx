"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { useFinePointer } from "@/lib/hooks";

type CursorVariant = "default" | "hover" | "view" | "drag";

/**
 * Custom cinematic cursor: crisp dot + lagging ring (mix-blend difference).
 * Grows over interactive elements; shows "VIEW" over portfolio panels;
 * shows "DRAG" over the horizontal work track. Hidden on touch devices
 * and for reduced-motion users.
 */
export function Cursor() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const enabled = fine && !reduced;
  const [variant, setVariant] = useState<CursorVariant>("default");
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 260, damping: 26, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 260, damping: 26, mass: 0.6 });

  useEffect(() => {
    if (!enabled) return;

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    };
    const onLeave = () => setVisible(false);

    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement | null;
      if (!el || typeof el.closest !== "function") return;
      const tagged = el.closest<HTMLElement>("[data-cursor]");
      if (tagged) {
        setVariant((tagged.dataset.cursor as CursorVariant) || "default");
        return;
      }
      const interactive = el.closest("a, button, [role='button'], input, textarea, select");
      setVariant(interactive ? "hover" : "default");
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const size = variant === "view" ? 96 : variant === "drag" ? 88 : variant === "hover" ? 56 : 34;

  return (
    <>
      {/* trailing ring */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[95] flex items-center justify-center rounded-full border border-white/60 mix-blend-difference"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          width: size,
          height: size,
          opacity: visible ? (variant === "default" ? 0.7 : 1) : 0,
          backgroundColor:
            variant === "view" || variant === "drag" ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0)",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
      >
        {(variant === "view" || variant === "drag") && (
          <span className="select-none text-[10px] font-semibold uppercase tracking-[0.18em] text-black">
            {variant === "view" ? "View" : "Drag"}
          </span>
        )}
      </motion.div>

      {/* crisp dot */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[96] h-1.5 w-1.5 rounded-full bg-white mix-blend-difference"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: visible && variant === "default" ? 1 : 0 }}
      />
    </>
  );
}
