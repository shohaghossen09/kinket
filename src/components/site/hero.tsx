"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { HeroScene } from "./hero-scene";
import { Magnetic } from "./magnetic";
import { scrollToSection } from "@/lib/scroll";

const EASE = [0.16, 1, 0.3, 1] as const;

interface HeroProps {
  ready: boolean;
}

export function Hero({ ready }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  /* --- scroll parallax: content lifts & fades, orbs drift --- */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const orbY1 = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const orbY2 = useTransform(scrollYProgress, [0, 1], [0, -160]);

  /* --- mouse parallax (desktop, motion-safe) --- */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 40, damping: 18 });
  const smy = useSpring(my, { stiffness: 40, damping: 18 });
  const headlineX = useTransform(smx, [-1, 1], [-8, 8]);
  const headlineY = useTransform(smy, [-1, 1], [-5, 5]);
  const orbX = useTransform(smx, [-1, 1], [30, -30]);
  const orbX2 = useTransform(smx, [-1, 1], [-42, 42]);

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
      className="relative flex min-h-svh flex-col overflow-hidden"
      aria-label="Introduction"
    >
      {/* --- layered background --- */}
      <div className="absolute inset-0" aria-hidden="true">
        {/* vignette base */}
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_10%,#101015_0%,#0a0a0b_55%,#080809_100%)]" />

        {/* drifting gradient orbs — dimmed, the 3D sculpture is the star */}
        <motion.div
          style={{ y: orbY1, x: orbX }}
          className="absolute -left-[10%] top-[8%] h-[46vw] w-[46vw] rounded-full opacity-[0.16] blur-[110px]"
        >
          <div className="h-full w-full rounded-full bg-[conic-gradient(from_120deg,#ffc24b,#ff6a3d,#e85d75,#ff6a3d,#ffc24b)] animate-drift" />
        </motion.div>
        <motion.div
          style={{ y: orbY2, x: orbX2 }}
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
        style={reduced ? undefined : { y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-6 pb-14 pt-28 sm:px-8"
      >
        {/* eyebrow */}
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

        {/* headline — cinematic masked line reveals */}
        <motion.h1
          style={reduced ? undefined : { x: headlineX, y: headlineY }}
          className="font-display text-[clamp(2.5rem,min(7.6vw,11.6vh),7.6rem)] font-semibold leading-[0.98] tracking-[-0.02em] text-foreground"
        >
          <span className="block overflow-hidden pb-[0.08em]">
            <motion.span
              custom={0}
              variants={lineVariants}
              initial="hidden"
              animate={state}
              className="block"
            >
              WE CREATE
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-[0.08em]">
            <motion.span
              custom={1}
              variants={lineVariants}
              initial="hidden"
              animate={state}
              className="block"
            >
              DIGITAL
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-[0.12em]">
            <motion.span
              custom={2}
              variants={lineVariants}
              initial="hidden"
              animate={state}
              className="block font-serif-accent italic font-normal tracking-normal text-gradient pr-2"
            >
              experiences
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-[0.08em]">
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
          </span>
        </motion.h1>

        {/* supporting statement */}
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

        {/* CTAs */}
        <motion.div
          custom={0.78}
          variants={fadeVariants}
          initial="hidden"
          animate={state}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
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

      {/* --- bottom meta bar --- */}
      <motion.div
        custom={1.05}
        variants={fadeVariants}
        initial="hidden"
        animate={state}
        className="relative z-10 mx-auto flex w-full max-w-7xl items-end justify-between px-6 pb-8 sm:px-8"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-8 items-start justify-center rounded-full border border-white/15 p-1.5" aria-hidden="true">
            <motion.span
              className="h-2 w-2 rounded-full bg-accent"
              animate={reduced ? undefined : { y: [0, 34, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Scroll
          </span>
        </div>

        <p className="hidden font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground sm:block">
          Lisbon — Tokyo — New York
        </p>
      </motion.div>
    </section>
  );
}
