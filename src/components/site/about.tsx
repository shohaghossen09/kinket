"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useReducedMotion,
  animate,
} from "framer-motion";
import { Asterisk } from "lucide-react";
import { RevealLine, Reveal } from "./reveal";

/**
 * About — brand philosophy with layered parallax imagery.
 * The studio photograph wipes open via a scroll-scrubbed clip-path,
 * counters tick up on entry, and a rotating stamp orbits the frame.
 */
export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.12, 1.02]);
  const badgeY = useTransform(scrollYProgress, [0, 1], ["18%", "-18%"]);
  const frameY = useTransform(scrollYProgress, [0, 1], ["7%", "-7%"]);

  /* scroll-scrubbed clip-path reveal — the frame wipes open */
  const clip = useTransform(
    scrollYProgress,
    [0.08, 0.42],
    ["inset(16% 13% 16% 13% round 28px)", "inset(0% 0% 0% 0% round 24px)"]
  );

  return (
    <section
      id="about"
      ref={sectionRef}
      aria-labelledby="about-heading"
      className="relative overflow-hidden py-28 sm:py-40"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-14 px-6 sm:px-8 lg:grid-cols-2 lg:gap-20">
        {/* statement */}
        <div>
          <div className="mb-6 flex items-center gap-4">
            <span className="h-px w-10 bg-gradient-to-r from-accent-warm to-accent" aria-hidden="true" />
            <span id="about-heading" className="font-mono text-xs uppercase tracking-[0.28em] text-accent">
              About the Studio
            </span>
          </div>

          <h2 className="font-display text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            <RevealLine>Technology</RevealLine>
            <RevealLine delay={0.08}>should not only</RevealLine>
            <RevealLine delay={0.16}>
              <span className="font-serif-accent italic font-normal">work.</span>
            </RevealLine>
            <RevealLine delay={0.24}>It should feel</RevealLine>
            <RevealLine delay={0.32}>
              <span className="text-gradient">extraordinary.</span>
            </RevealLine>
          </h2>

          <Reveal delay={0.15}>
            <p className="mt-10 max-w-lg text-base leading-relaxed text-muted-foreground">
              We are a collective of designers, engineers and AI specialists who
              believe software is a craft — not a commodity. For nearly a decade
              we have built digital products where every interaction is
              considered, every millisecond is intentional, and every release
              raises the bar for what people expect from technology.
            </p>
          </Reveal>

          <Reveal delay={0.25}>
            <div className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-white/8 pt-8">
              <div>
                <p className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
                  <Counter to={18} />
                </p>
                <p className="mt-1 text-xs leading-snug text-muted-foreground">
                  Senior designers & engineers
                </p>
              </div>
              <div>
                <p className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
                  <Counter to={3} />
                </p>
                <p className="mt-1 text-xs leading-snug text-muted-foreground">
                  Studios across three continents
                </p>
              </div>
              <div>
                <p className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
                  <Counter to={96} suffix="%" />
                </p>
                <p className="mt-1 text-xs leading-snug text-muted-foreground">
                  Clients who return for round two
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* layered imagery */}
        <div className="relative">
          {/* trailing frame — parallaxes opposite the photo for depth */}
          <motion.div
            style={reduced ? undefined : { y: frameY }}
            className="absolute -right-4 -top-4 hidden h-full w-full rounded-3xl border border-white/10 sm:block"
            aria-hidden="true"
          />

          <Reveal>
            <motion.div
              style={reduced ? undefined : { clipPath: clip }}
              className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/10 sm:aspect-[5/5]"
            >
              <motion.div
                style={reduced ? undefined : { y: imgY, scale: imgScale }}
                className="absolute inset-0 will-change-transform"
              >
                <Image
                  src="/images/about-studio.jpg"
                  alt="KINETIC studio — an open-plan creative workspace with glass pods, lounge seating and warm wood accents"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  quality={80}
                  className="object-cover"
                />
              </motion.div>
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b]/50 via-transparent to-transparent"
                aria-hidden="true"
              />
            </motion.div>
          </Reveal>

          {/* rotating philosophy stamp */}
          <motion.div
            style={reduced ? undefined : { y: badgeY }}
            className="absolute -bottom-8 -left-4 z-10 h-32 w-32 sm:-left-12 sm:h-36 sm:w-36"
            aria-hidden="true"
          >
            <div className="glass-strong absolute inset-1 rounded-full" />
            <svg viewBox="0 0 100 100" className="animate-spin-slow absolute inset-0 h-full w-full">
              <defs>
                <path
                  id="stamp-circle"
                  d="M 50,50 m -36,0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"
                />
              </defs>
              <text
                className="fill-foreground font-mono"
                style={{ fontSize: "8px", letterSpacing: "2.4px" }}
              >
                <textPath href="#stamp-circle">
                  CRAFT OVER VOLUME • MOTION WITH MEANING •
                </textPath>
              </text>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Asterisk className="h-7 w-7 text-accent" strokeWidth={1.6} />
            </div>
          </motion.div>

          {/* corner accent */}
          <div
            className="absolute -right-3 -top-3 h-24 w-24 rounded-tr-3xl border-r border-t border-accent/30"
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Counter — ticks up when scrolled into view                         */
/* ------------------------------------------------------------------ */

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduced = useReducedMotion();
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView || reduced) return;
    const controls = animate(0, to, {
      duration: 1.7,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setVal(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to, reduced]);

  return (
    <span ref={ref}>
      {reduced ? to : val}
      {suffix}
    </span>
  );
}
