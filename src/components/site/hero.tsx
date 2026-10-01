"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useVelocity,
  useReducedMotion,
  type MotionValue,
  type Variants,
} from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { HeroScene } from "./hero-scene";
import { Magnetic } from "./magnetic";
import { scrollToSection } from "@/lib/scroll";

const EASE = [0.16, 1, 0.3, 1] as const;

/** Pinned scroll-sequence length (total section height in vh). */
const SEQUENCE_VH = 320;

interface HeroProps {
  ready: boolean;
}

/* Mid-sequence capability cascade — giant outline words handed off
   one-by-one as the headline dissolves. */
const CASCADE = [
  { word: "WEB", num: "01" },
  { word: "APPS", num: "02" },
  { word: "AI", num: "03" },
  { word: "SAAS", num: "04" },
  { word: "PRODUCTS", num: "05" },
];

/* Cascade filmstrip layout — every word is scrubbed through a fixed
   [start, start + CASCADE_WORD_SPAN] window of scrollYProgress. Spacing is
   derived so the LAST word's window ends exactly at 1: useTransform keyframe
   offsets must stay within [0,1] or the browser's Element.animate() throws
   "Offsets must be null or in the range [0,1]". */
const CASCADE_START = 0.6;
const CASCADE_WORD_SPAN = 0.16;
const CASCADE_STEP =
  (1 - CASCADE_START - CASCADE_WORD_SPAN) / Math.max(CASCADE.length - 1, 1);

export function Hero({ ready }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  /* --- pinned scroll sequence (0 → 1 across the whole section) --- */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  /* chrome (eyebrow / sub / CTAs / meta) lifts away first */
  const eyebrowO = useTransform(scrollYProgress, [0, 0.09], [1, 0]);
  const eyebrowY = useTransform(scrollYProgress, [0, 0.09], [0, -44]);
  const subO = useTransform(scrollYProgress, [0.01, 0.11], [1, 0]);
  const subY = useTransform(scrollYProgress, [0.01, 0.11], [0, -34]);
  const ctaO = useTransform(scrollYProgress, [0.02, 0.12], [1, 0]);
  const ctaY = useTransform(scrollYProgress, [0.02, 0.12], [0, -26]);
  const metaO = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  /* headline explodes — lines part while the italic word zooms through */
  const line1Y = useTransform(scrollYProgress, [0.1, 0.5], ["0%", "-62%"]);
  const line1X = useTransform(scrollYProgress, [0.1, 0.5], ["0%", "-16%"]);
  const line1O = useTransform(scrollYProgress, [0.3, 0.48], [1, 0]);
  const line2Y = useTransform(scrollYProgress, [0.1, 0.5], ["0%", "-78%"]);
  const line2X = useTransform(scrollYProgress, [0.1, 0.5], ["0%", "18%"]);
  const line2O = useTransform(scrollYProgress, [0.3, 0.48], [1, 0]);
  const line4Y = useTransform(scrollYProgress, [0.1, 0.45], ["0%", "55%"]);
  const line4O = useTransform(scrollYProgress, [0.26, 0.42], [1, 0]);

  /* the zoom-through word — scales toward the camera, then dissolves */
  const zoomScale = useTransform(scrollYProgress, [0.14, 0.6], [1, 16]);
  const zoomRotate = useTransform(scrollYProgress, [0.14, 0.6], [0, 5]);
  const zoomO = useTransform(scrollYProgress, [0.52, 0.68], [1, 0]);

  /* closing veil hands off to the marquee */
  const veilO = useTransform(scrollYProgress, [0.8, 0.98], [0, 1]);

  /* cascade scrim — dims the 3D field while outline words play */
  const scrimO = useTransform(scrollYProgress, [0.57, 0.63], [0, 1]);

  /* scroll-velocity skew on the headline — shears with momentum */
  const velocity = useVelocity(scrollYProgress);
  const smoothVelocity = useSpring(velocity, { stiffness: 140, damping: 32, mass: 0.4 });
  const skewX = useTransform(smoothVelocity, [-1.1, 1.1], [-3.5, 3.5], { clamp: true });

  /* scroll progress ring */
  const RING_C = 2 * Math.PI * 15;
  const ringDash = useTransform(scrollYProgress, [0, 1], [RING_C, 0]);

  /* --- mouse parallax (desktop, motion-safe) --- */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 40, damping: 18 });
  const smy = useSpring(my, { stiffness: 40, damping: 18 });
  const headlineX = useTransform(smx, [-1, 1], [-8, 8]);
  const headlineY = useTransform(smy, [-1, 1], [-5, 5]);
  const orbX = useTransform(smx, [-1, 1], [30, -30]);
  const orbX2 = useTransform(smx, [-1, 1], [-42, 42]);
  const orbY1 = useTransform(scrollYProgress, [0, 1], [0, 320]);
  const orbY2 = useTransform(scrollYProgress, [0, 1], [0, -220]);

  const onMouseMove = (e: React.MouseEvent) => {
    mx.set((e.clientX / window.innerWidth) * 2 - 1);
    my.set((e.clientY / window.innerHeight) * 2 - 1);
  };

  const lineVariants: Variants = {
    hidden: { y: "112%" },
    show: (i: number) => ({
      y: 0,
      transition: { duration: 1.1, ease: EASE, delay: 0.12 + i * 0.11 },
    }),
  };

  const fadeVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    show: (d: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, ease: EASE, delay: d },
    }),
  };

  const state = ready || reduced ? "show" : "hidden";

  return (
    <section
      id="top"
      ref={sectionRef}
      onMouseMove={reduced ? undefined : onMouseMove}
      style={reduced ? undefined : { height: `${SEQUENCE_VH}vh` }}
      className="relative"
      aria-label="Introduction"
    >
      {/* pinned stage — everything below stays fixed while scroll drives the choreography */}
      <div
        className={
          reduced
            ? "relative flex min-h-svh flex-col overflow-hidden"
            : "sticky top-0 flex h-svh flex-col overflow-hidden"
        }
      >
        {/* --- layered background --- */}
        <div className="absolute inset-0" aria-hidden="true">
          {/* vignette base */}
          <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_10%,#101015_0%,#0a0a0b_55%,#080809_100%)]" />

          {/* drifting gradient orbs — dimmed, the 3D sculpture is the star */}
          <motion.div
            style={reduced ? undefined : { y: orbY1, x: orbX }}
            className="absolute -left-[10%] top-[8%] h-[46vw] w-[46vw] rounded-full opacity-[0.16] blur-[110px]"
          >
            <div className="h-full w-full rounded-full bg-[conic-gradient(from_120deg,#ffc24b,#ff6a3d,#e85d75,#ff6a3d,#ffc24b)] animate-drift" />
          </motion.div>
          <motion.div
            style={reduced ? undefined : { y: orbY2, x: orbX2 }}
            className="absolute -right-[14%] bottom-[-18%] h-[40vw] w-[40vw] rounded-full opacity-[0.13] blur-[120px]"
          >
            <div
              className="h-full w-full rounded-full bg-[conic-gradient(from_240deg,#e85d75,#ff6a3d,#ffc24b,#e85d75)] animate-drift"
              style={{ animationDelay: "-8s" }}
            />
          </motion.div>

          {/* blueprint grid, fading with depth */}
          <div className="absolute inset-0 bg-grid mask-fade-b opacity-60" />

          {/* GSAP + Three.js continuous 3D sculpture */}
          <HeroScene ready={ready} className="absolute inset-0 h-full w-full" />

          {/* bottom fade into next section */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
        </div>

        {/* --- hero content --- */}
        <motion.div
          className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-6 pb-14 pt-28 sm:px-8"
        >
          {/* eyebrow */}
          <motion.div style={reduced ? undefined : { opacity: eyebrowO, y: eyebrowY }}>
            <motion.div
              custom={0.05}
              variants={fadeVariants}
              initial="hidden"
              animate={state}
              className="mb-8 flex items-center gap-4"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-muted-foreground sm:text-xs">
                Creative Technology Studio — Est. 2016
              </p>
            </motion.div>
          </motion.div>

          {/* headline — cinematic masked reveal, then scroll-driven explosion */}
          <motion.h1
            style={
              reduced
                ? undefined
                : { x: headlineX, y: headlineY, skewX }
            }
            className="font-display text-[clamp(2.5rem,min(7.6vw,11.6vh),7.6rem)] font-semibold leading-[0.98] tracking-[-0.02em] text-foreground"
          >
            <motion.span
              style={reduced ? undefined : { y: line1Y, x: line1X, opacity: line1O }}
              className="block overflow-hidden pb-[0.08em]"
            >
              <motion.span
                custom={0}
                variants={lineVariants}
                initial="hidden"
                animate={state}
                className="block"
              >
                WE CREATE
              </motion.span>
            </motion.span>
            <motion.span
              style={reduced ? undefined : { y: line2Y, x: line2X, opacity: line2O }}
              className="block overflow-hidden pb-[0.08em]"
            >
              <motion.span
                custom={1}
                variants={lineVariants}
                initial="hidden"
                animate={state}
                className="block"
              >
                DIGITAL
              </motion.span>
            </motion.span>

            {/* the zoom-through word */}
            <motion.span
              style={
                reduced
                  ? undefined
                  : {
                      scale: zoomScale,
                      rotate: zoomRotate,
                      opacity: zoomO,
                      transformOrigin: "50% 50%",
                    }
              }
              className="block overflow-hidden pb-[0.12em] will-change-transform"
            >
              <motion.span
                custom={2}
                variants={lineVariants}
                initial="hidden"
                animate={state}
                className="block font-serif-accent italic font-normal tracking-normal text-gradient pr-2"
              >
                experiences
              </motion.span>
            </motion.span>

            <motion.span
              style={reduced ? undefined : { y: line4Y, opacity: line4O }}
              className="block overflow-hidden pb-[0.08em]"
            >
              <motion.span
                custom={3}
                variants={lineVariants}
                initial="hidden"
                animate={state}
                className="block"
              >
                THAT{" "}
                <span className="text-gradient">MOVE.</span>
              </motion.span>
            </motion.span>
          </motion.h1>

          {/* supporting statement */}
          <motion.div style={reduced ? undefined : { opacity: subO, y: subY }}>
            <motion.p
              custom={0.62}
              variants={fadeVariants}
              initial="hidden"
              animate={state}
              className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              We fuse design, engineering and artificial intelligence into websites,
              apps, SaaS platforms and digital products that feel alive — built for
              brands that refuse to be ordinary.
            </motion.p>
          </motion.div>

          {/* CTAs */}
          <motion.div
            style={reduced ? undefined : { opacity: ctaO, y: ctaY }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <motion.div custom={0.78} variants={fadeVariants} initial="hidden" animate={state}>
              <Magnetic strength={0.32}>
                <a
                  href="#work"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("#work");
                  }}
                  className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-foreground px-8 py-4 text-sm font-semibold text-primary-foreground transition-colors duration-500 hover:text-accent-foreground"
                >
                  <span className="absolute inset-0 -z-0 translate-y-full bg-gradient-to-r from-accent-warm via-accent to-[#e85d75] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0" />
                  <span className="relative z-10">Explore Our Work</span>
                  <ArrowDown className="relative z-10 h-4 w-4 transition-transform duration-500 group-hover:translate-y-0.5" />
                </a>
              </Magnetic>
            </motion.div>

            <motion.div custom={0.88} variants={fadeVariants} initial="hidden" animate={state}>
              <Magnetic strength={0.32}>
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("#contact");
                  }}
                  className="group inline-flex items-center gap-3 rounded-full border border-white/15 px-8 py-4 text-sm font-semibold text-foreground backdrop-blur-sm transition-colors duration-300 hover:border-accent/60 hover:text-accent"
                >
                  Start a Project
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
                </a>
              </Magnetic>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* --- capability cascade (mid-sequence) --- */}
        {!reduced && (
          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center" aria-hidden="true">
            {/* scrim — dims the 3D field so the outline words punch through */}
            <motion.div
              style={{ opacity: scrimO }}
              className="absolute inset-0 bg-[radial-gradient(closest-side,rgba(8,8,10,0.78),rgba(8,8,10,0.35))]"
            />
            {CASCADE.map((c, k) => (
              <CascadeWord
                key={c.word}
                progress={scrollYProgress}
                start={CASCADE_START + k * CASCADE_STEP}
                word={c.word}
                num={c.num}
              />
            ))}
          </div>
        )}

        {/* --- closing veil --- */}
        {!reduced && (
          <motion.div
            style={{ opacity: veilO }}
            className="pointer-events-none absolute inset-0 z-30 bg-[radial-gradient(120%_100%_at_50%_50%,rgba(10,10,11,0.6),#0a0a0b_78%)]"
            aria-hidden="true"
          />
        )}

        {/* --- bottom meta bar --- */}
        <motion.div
          style={reduced ? undefined : { opacity: metaO }}
          className="relative z-10 mx-auto flex w-full max-w-7xl items-end justify-between px-6 pb-8 sm:px-8"
        >
          <motion.div
            custom={1.05}
            variants={fadeVariants}
            initial="hidden"
            animate={state}
            className="flex items-center gap-4"
          >
            {/* scroll progress ring */}
            <div className="relative flex h-9 w-9 items-center justify-center" aria-hidden="true">
              <svg viewBox="0 0 36 36" className="absolute inset-0 h-full w-full -rotate-90">
                <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="1.5" />
                <motion.circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  stroke="#ff6a3d"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeDasharray={RING_C}
                  style={reduced ? undefined : { strokeDashoffset: ringDash }}
                />
              </svg>
              <motion.span
                className="h-1.5 w-1.5 rounded-full bg-accent"
                animate={reduced ? undefined : { scale: [1, 1.6, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Scroll
            </span>
          </motion.div>

          <motion.p
            custom={1.15}
            variants={fadeVariants}
            initial="hidden"
            animate={state}
            className="hidden font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground sm:block"
          >
            Lisbon — Tokyo — New York
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Capability cascade word — scrubbed in/hold/out filmstrip           */
/* ------------------------------------------------------------------ */

function CascadeWord({
  progress,
  start,
  word,
  num,
}: {
  progress: MotionValue<number>;
  start: number;
  word: string;
  num: string;
}) {
  const o = useTransform(
    progress,
    [start, start + 0.05, start + 0.105, start + CASCADE_WORD_SPAN],
    [0, 1, 1, 0],
  );
  const y = useTransform(progress, [start, start + CASCADE_WORD_SPAN], [70, -70]);
  const scale = useTransform(progress, [start, start + CASCADE_WORD_SPAN], [0.92, 1.08]);
  const blur = useTransform(
    progress,
    [start, start + 0.05, start + CASCADE_WORD_SPAN],
    ["blur(14px)", "blur(0px)", "blur(10px)"],
  );

  return (
    <motion.div
      style={{ opacity: o, y, scale, filter: blur }}
      className="absolute inset-0 flex flex-col items-center justify-center will-change-transform"
    >
      <span className="mb-5 font-mono text-xs uppercase tracking-[0.4em] text-accent">
        {num} — Capability
      </span>
      <span className="font-display text-[clamp(3.4rem,12vw,10rem)] font-bold leading-none tracking-tight text-outline-strong">
        {word}
      </span>
      <span className="mt-6 h-px w-24 bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
    </motion.div>
  );
}
