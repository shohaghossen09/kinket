"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";

const MARQUEE_ITEMS = [
  "Design",
  "Engineering",
  "AI",
  "Motion",
  "Strategy",
  "Craft",
];

/**
 * Creative showcase — a pinned, full-screen scene where typography,
 * imagery and gradients are choreographed by scroll:
 * 1. Giant display type scales & releases
 * 2. A clipped image iris open from 24% inset to full bleed
 * 3. Gradient layers crossfade for depth
 * 4. A marquee strip anchors continuity
 */
export function Showcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress: p } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // scene choreography
  const typeScale = useTransform(p, [0, 0.5, 1], [1.06, 1, 0.92]);
  const typeY = useTransform(p, [0, 1], ["4%", "-6%"]);
  const typeOpacity = useTransform(p, [0, 0.35, 0.72, 0.9], [0, 1, 1, 0]);
  const imageClip = useTransform(
    p,
    [0.12, 0.62],
    ["inset(18% 14% 18% 14% round 24px)", "inset(0% 0% 0% 0% round 0px)"]
  );
  const imageScale = useTransform(p, [0.12, 1], [1.14, 1.02]);
  const overlayOpacity = useTransform(p, [0.1, 0.6, 1], [0.35, 0.14, 0.6]);
  const midTextY = useTransform(p, [0.45, 1], ["38%", "-14%"]);
  const midTextOpacity = useTransform(p, [0.5, 0.72, 0.95], [0, 1, 0.4]);
  const ringRotate = useTransform(p, [0, 1], [0, 140]);
  const ringScale = useTransform(p, [0, 1], [0.8, 1.35]);

  // reduced-motion static scene
  if (reduced) {
    return (
      <section aria-label="Creative showcase" className="relative py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <h2 className="font-display text-5xl font-semibold tracking-tight text-foreground sm:text-7xl">
            DESIGN <span className="font-serif-accent italic font-normal text-gradient">beyond</span>
            <br />
            THE PIXEL.
          </h2>
          <div className="relative mt-10 aspect-[16/8] overflow-hidden rounded-2xl border border-white/10">
            <Image
              src="/images/showcase-holo.jpg"
              alt="Iridescent holographic 3D particle artwork from the KINETIC visual research lab"
              fill
              sizes="(max-width: 1280px) 100vw, 1200px"
              quality={80}
              className="object-cover"
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      aria-label="Creative showcase"
      className="relative h-[320vh]"
    >
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden">
        {/* gradient atmosphere */}
        <div
          className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_100%,rgba(255,106,61,0.14),transparent_60%),radial-gradient(70%_60%_at_20%_10%,rgba(255,194,75,0.08),transparent_55%)]"
          aria-hidden="true"
        />

        {/* rotating halo ring — sculptural 3D accent */}
        <motion.div
          style={{ rotate: ringRotate, scale: ringScale, opacity: typeOpacity }}
          className="pointer-events-none absolute h-[80vmin] w-[80vmin] rounded-full border border-white/8"
          aria-hidden="true"
        >
          <div className="absolute inset-6 rounded-full border border-white/5" />
          <div className="absolute inset-[18%] rounded-full border border-dashed border-accent/15" />
        </motion.div>

        {/* headline — scales & releases */}
        <motion.div
          style={{ scale: typeScale, y: typeY, opacity: typeOpacity }}
          className="relative z-10 px-6 text-center"
        >
          <p className="mb-6 font-mono text-xs uppercase tracking-[0.34em] text-accent">
            The Craft
          </p>
          <h2 className="font-display text-[clamp(3rem,11vw,10rem)] font-semibold leading-[0.96] tracking-[-0.03em] text-foreground">
            DESIGN
            <br />
            <span className="font-serif-accent italic font-normal tracking-normal text-gradient">
              beyond
            </span>{" "}
            THE
            <br />
            PIXEL.
          </h2>
        </motion.div>

        {/* image iris — opens on scroll */}
        <motion.div
          style={{ clipPath: imageClip }}
          className="absolute inset-0 z-0"
          aria-hidden="true"
        >
          <motion.div style={{ scale: imageScale }} className="absolute inset-0 will-change-transform">
            <Image
              src="/images/showcase-holo.jpg"
              alt=""
              fill
              sizes="100vw"
              quality={72}
              className="object-cover"
            />
          </motion.div>
          <motion.div
            style={{ opacity: overlayOpacity }}
            className="absolute inset-0 bg-[#0a0a0b]"
          />
        </motion.div>

        {/* mid-scene statement that floats over the open image */}
        <motion.div
          style={{ y: midTextY, opacity: midTextOpacity }}
          className="absolute inset-x-0 z-20 text-center"
        >
          <p className="mx-auto max-w-4xl px-6 font-display text-3xl font-medium leading-[1.2] tracking-tight text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.6)] sm:text-5xl">
            Every gradient, every easing curve, every frame —
            <span className="font-serif-accent italic font-normal"> choreographed</span> to guide
            attention and <span className="text-gradient">communicate</span>.
          </p>
        </motion.div>

        {/* bottom marquee — visual continuity into the next act */}
        <div className="absolute inset-x-0 bottom-0 z-20 border-t border-white/8 bg-[#0a0a0b]/60 py-5 backdrop-blur-md">
          <div className="mask-fade-x overflow-hidden">
            <div className="animate-marquee flex w-max items-center gap-10 pr-10" aria-hidden="true">
              {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map(
                (item, i) => (
                  <span key={i} className="flex items-center gap-10">
                    <span className="font-display text-xl font-medium uppercase tracking-[0.14em] text-foreground/80">
                      {item}
                    </span>
                    <span className="h-1.5 w-1.5 rotate-45 bg-accent/70" />
                  </span>
                )
              )}
            </div>
          </div>
          <p className="sr-only">
            Design, engineering, AI, motion, strategy and craft — the disciplines of our studio.
          </p>
        </div>
      </div>
    </section>
  );
}
