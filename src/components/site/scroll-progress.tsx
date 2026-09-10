"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Ultra-thin gradient scroll-progress line pinned to the top of the viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[85] h-[2px] origin-left bg-gradient-to-r from-accent-warm via-accent to-[#e85d75]"
      style={{ scaleX }}
    />
  );
}
