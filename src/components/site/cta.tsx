"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from "framer-motion";
import { ArrowUpRight, Mail } from "lucide-react";
import { Magnetic } from "./magnetic";
import { scrollToSection } from "@/lib/scroll";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Final call-to-action — a dramatic full-screen stage. The headline is
 * scrubbed in word-by-word by scroll (with velocity skew), the accent
 * word shimmers, a starburst slowly rotates behind everything and the
 * primary CTA emits pulse rings. Cursor-reactive gradient atmosphere.
 */
export function Cta() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  /* scrubbed entrance — words rise as the stage scrolls in */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  /* content gathers scale as it arrives */
  const contentScale = useTransform(scrollYProgress, [0, 0.75], [0.965, 1]);

  /* velocity skew — the headline shears with scroll momentum */
  const velocity = useVelocity(scrollYProgress);
  const smoothVelocity = useSpring(velocity, { stiffness: 130, damping: 30, mass: 0.4 });
  const skewX = useTransform(smoothVelocity, [-1.4, 1.4], [-4, 4], { clamp: true });

  /* cursor-reactive atmosphere */
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 28, damping: 16 });
  const sy = useSpring(my, { stiffness: 28, damping: 16 });
  const orb1X = useTransform(sx, [0, 1], ["-12%", "12%"]);
  const orb1Y = useTransform(sy, [0, 1], ["-10%", "10%"]);
  const orb2X = useTransform(sx, [0, 1], ["14%", "-14%"]);
  const orb2Y = useTransform(sy, [0, 1], ["12%", "-12%"]);

  const onMouseMove = (e: React.MouseEvent) => {
    if (reduced) return;
    mx.set(e.clientX / window.innerWidth);
    my.set(e.clientY / window.innerHeight);
  };

  const words: { text: string; accent?: boolean }[] = [
    { text: "LET'S" },
    { text: "BUILD" },
    { text: "SOMETHING" },
    { text: "EXTRAORDINARY.", accent: true },
  ];

  return (
    <section
      ref={ref}
      onMouseMove={onMouseMove}
      aria-labelledby="cta-heading"
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden py-28"
    >
      {/* cursor-reactive gradient atmosphere */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(110%_80%_at_50%_110%,#131317_0%,#0a0a0b_60%)]" />
        <motion.div
          style={{ x: orb1X, y: orb1Y }}
          className="absolute left-[8%] top-[12%] h-[38vw] w-[38vw] rounded-full bg-[conic-gradient(from_40deg,#ffc24b,#ff6a3d,#e85d75)] opacity-[0.16] blur-[110px]"
        />
        <motion.div
          style={{ x: orb2X, y: orb2Y }}
          className="absolute bottom-[8%] right-[6%] h-[32vw] w-[32vw] rounded-full bg-[conic-gradient(from_220deg,#e85d75,#ff6a3d,#ffc24b)] opacity-[0.13] blur-[120px]"
        />
        <div className="absolute inset-0 bg-grid opacity-40 mask-fade-b" />
      </div>

      {/* rotating starburst */}
      <svg
        viewBox="0 0 200 200"
        aria-hidden="true"
        className="animate-spin-slow pointer-events-none absolute left-1/2 top-1/2 h-[150vw] w-[150vw] -translate-x-1/2 -translate-y-1/2 opacity-[0.06] sm:h-[80vw] sm:w-[80vw]"
      >
        {Array.from({ length: 12 }).map((_, k) => (
          <line
            key={k}
            x1="100"
            y1="4"
            x2="100"
            y2="196"
            stroke="rgba(244,243,239,0.7)"
            strokeWidth="0.4"
            transform={`rotate(${k * 30} 100 100)`}
          />
        ))}
        <circle cx="100" cy="100" r="62" fill="none" stroke="rgba(244,243,239,0.5)" strokeWidth="0.3" />
      </svg>

      <motion.div
        style={reduced ? undefined : { scale: contentScale }}
        className="relative z-10 mx-auto max-w-6xl px-6 text-center sm:px-8"
      >
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20% 0px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="mb-10 font-mono text-xs uppercase tracking-[0.34em] text-accent"
        >
          Ready when you are
        </motion.p>

        <motion.h2
          id="cta-heading"
          style={reduced ? undefined : { skewX }}
          className="font-display text-[clamp(2.6rem,8.6vw,7.6rem)] font-semibold leading-[1.02] tracking-[-0.02em] text-foreground"
        >
          {words.map((w, i) =>
            reduced ? (
              <span key={w.text} className="block pb-[0.08em]">
                <span className={`block ${w.accent ? "text-shimmer" : ""}`}>{w.text}</span>
              </span>
            ) : (
              <ScrubWord
                key={w.text}
                progress={scrollYProgress}
                i={i}
                total={words.length}
                accent={w.accent}
              >
                {w.text}
              </ScrubWord>
            )
          )}
        </motion.h2>

        <motion.p
          initial={reduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}
          className="mx-auto mt-10 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          Tell us where you want to go. We'll design the journey, engineer the
          vehicle and choreograph every moment in between.
        </motion.p>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-4"
        >
          <Magnetic strength={0.34}>
            <span className="relative inline-flex">
              {/* pulse rings */}
              {!reduced && (
                <>
                  <span
                    className="animate-cta-pulse pointer-events-none absolute inset-0 rounded-full border border-accent/60"
                    aria-hidden="true"
                  />
                  <span
                    className="animate-cta-pulse pointer-events-none absolute inset-0 rounded-full border border-accent-warm/50 [animation-delay:1.1s]"
                    aria-hidden="true"
                  />
                </>
              )}
              <a
                href="mailto:hello@kineticstudio.dev?subject=New%20Project%20—%20KINETIC"
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-foreground px-9 py-4.5 text-sm font-semibold text-primary-foreground transition-colors duration-500 hover:text-accent-foreground"
              >
                <span className="absolute inset-0 translate-y-full bg-gradient-to-r from-accent-warm via-accent to-[#e85d75] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0" />
                <span className="relative z-10">Start a Project</span>
                <ArrowUpRight className="relative z-10 h-4 w-4 transition-transform duration-500 group-hover:rotate-45" />
              </a>
            </span>
          </Magnetic>

          <Magnetic strength={0.34}>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection("#contact");
              }}
              className="inline-flex items-center gap-3 rounded-full border border-white/15 px-9 py-4.5 text-sm font-semibold text-foreground backdrop-blur-sm transition-colors duration-300 hover:border-accent/60 hover:text-accent"
            >
              <Mail className="h-4 w-4" />
              Contact Us
            </a>
          </Magnetic>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  ScrubWord — scroll-scrubbed masked word rise                       */
/* ------------------------------------------------------------------ */

function ScrubWord({
  progress,
  i,
  total,
  accent,
  children,
}: {
  progress: MotionValue<number>;
  i: number;
  total: number;
  accent?: boolean;
  children: string;
}) {
  const start = 0.06 + (i / total) * 0.42;
  const end = start + 0.34;
  const y = useTransform(progress, [start, end], ["115%", "0%"]);

  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span
        style={{ y }}
        className={`block will-change-transform ${accent ? "text-shimmer" : ""}`}
      >
        {children}
      </motion.span>
    </span>
  );
}
