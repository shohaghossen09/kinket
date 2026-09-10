"use client";

import { useRef, type ReactNode } from "react";
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
  as?: "div" | "li" | "span" | "figure";
}

/** Viewport-triggered fade + rise reveal. GPU-only (transform + opacity). */
export function Reveal({ children, className, delay = 0, y = 36, once = true }: RevealProps) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? { opacity: 1 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-12% 0px -12% 0px" }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Masked line reveal — text slides up from behind an overflow clip.
 *
 * NOTE: whileInView sits on the OUTER (unclipped, layout-visible) wrapper
 * and propagates to the inner span via variants. Observing the inner span
 * directly would deadlock: it starts fully outside the overflow clip, so
 * IntersectionObserver would never report it as intersecting.
 */
export function RevealLine({ children, className, delay = 0 }: RevealProps) {
  const reduced = useReducedMotion();
  const lineVariants: Variants = {
    hidden: { y: "110%" },
    show: {
      y: 0,
      transition: { duration: 1, ease: EASE, delay },
    },
  };
  return (
    <motion.span
      className={`block overflow-hidden ${className ?? ""}`}
      initial={reduced ? "show" : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px" }}
    >
      <motion.span className="block will-change-transform" variants={lineVariants}>
        {children}
      </motion.span>
    </motion.span>
  );
}

export const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  id?: string;
  align?: "left" | "split";
}

/** Consistent section header: mono eyebrow with rule + large display title. */
export function SectionHeading({ eyebrow, title, description, id, align = "split" }: SectionHeadingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const reduced = useReducedMotion();

  return (
    <div
      ref={ref}
      className={`flex flex-col gap-8 ${
        align === "split" ? "lg:flex-row lg:items-end lg:justify-between" : ""
      }`}
    >
      <div className="max-w-3xl">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-6 flex items-center gap-4"
        >
          <span className="h-px w-10 bg-gradient-to-r from-accent-warm to-accent" aria-hidden="true" />
          <span id={id} className="font-mono text-xs uppercase tracking-[0.28em] text-accent">
            {eyebrow}
          </span>
        </motion.div>

        <h2
          className="font-display text-4xl font-semibold leading-[1.04] tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance"
        >
          <RevealLine>{title}</RevealLine>
        </h2>
      </div>

      {description && (
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: EASE, delay: 0.18 }}
          className="max-w-sm text-base leading-relaxed text-muted-foreground lg:pb-2 lg:text-right"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
