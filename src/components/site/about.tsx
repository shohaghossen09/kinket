"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { SectionHeading, RevealLine, Reveal } from "./reveal";

/**
 * About — brand philosophy with layered parallax imagery.
 * The studio photograph drifts slower than the page, creating depth
 * between the statement typography and the visual evidence.
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
                <p className="font-display text-2xl font-semibold text-foreground">18</p>
                <p className="mt-1 text-xs leading-snug text-muted-foreground">
                  Senior designers & engineers
                </p>
              </div>
              <div>
                <p className="font-display text-2xl font-semibold text-foreground">3</p>
                <p className="mt-1 text-xs leading-snug text-muted-foreground">
                  Studios across three continents
                </p>
              </div>
              <div>
                <p className="font-display text-2xl font-semibold text-foreground">96%</p>
                <p className="mt-1 text-xs leading-snug text-muted-foreground">
                  Clients who return for round two
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* layered imagery */}
        <div className="relative">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/10 sm:aspect-[5/5]">
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
            </div>
          </Reveal>

          {/* floating glass badge */}
          <motion.div
            style={reduced ? undefined : { y: badgeY }}
            className="glass-strong absolute -bottom-6 -left-4 z-10 rounded-2xl p-5 sm:-left-10 sm:p-6"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-accent">
              Philosophy
            </p>
            <p className="mt-2 max-w-[210px] font-display text-lg font-medium leading-snug text-foreground">
              Craft over volume. Motion with meaning.
            </p>
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
