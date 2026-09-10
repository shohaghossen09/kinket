"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from "framer-motion";

interface IntroProps {
  text: string;
  highlight?: string[];
}

/**
 * Cinematic editorial introduction. Words brighten from dim to full as
 * scroll progresses through the passage — a "reading spotlight" that
 * makes the paragraph feel narrated rather than static.
 */
export function Intro({ text, highlight = [] }: IntroProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.82", "end 0.42"],
  });

  const words = text.split(" ");

  return (
    <section aria-label="Studio manifesto" className="relative py-28 sm:py-40">
      <div className="relative mx-auto max-w-5xl px-6 sm:px-8">
        <div className="mb-10 flex items-center gap-4">
          <span className="h-px w-10 bg-gradient-to-r from-accent-warm to-accent" aria-hidden="true" />
          <span className="font-mono text-xs uppercase tracking-[0.28em] text-accent">
            The Studio
          </span>
        </div>

        <div ref={ref} className="relative">
          <p className="font-display text-3xl font-medium leading-[1.28] tracking-tight text-foreground sm:text-4xl lg:text-[3.4rem]">
            {words.map((word, i) => (
              <Word
                key={`${word}-${i}`}
                progress={scrollYProgress}
                range={[i / words.length, (i + 1.6) / words.length]}
                accent={highlight.includes(word.replace(/[.,—]/g, ""))}
                reduced={!!reduced}
              >
                {word}
              </Word>
            ))}
          </p>
        </div>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="mt-14 flex flex-col gap-6 border-l border-white/10 pl-6 sm:flex-row sm:items-center sm:gap-12"
        >
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            Every engagement is senior-led and craft-obsessed. We design the
            system, engineer the platform and choreograph the motion — then
            ship it at production scale.
          </p>
          <div className="flex gap-10 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            <div>
              <p className="mb-1 text-accent">Since</p>
              <p className="text-foreground">2016</p>
            </div>
            <div>
              <p className="mb-1 text-accent">Model</p>
              <p className="text-foreground">Studio-Led</p>
            </div>
            <div>
              <p className="mb-1 text-accent">Focus</p>
              <p className="text-foreground">Craft + Scale</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Word({
  children,
  progress,
  range,
  accent,
  reduced,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  accent: boolean;
  reduced: boolean;
}) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  const y = useTransform(progress, range, [8, 0]);

  if (reduced) {
    return (
      <span className={accent ? "text-gradient" : undefined}>{children}&nbsp;</span>
    );
  }

  return (
    <motion.span
      style={{ opacity, y }}
      className={`mr-[0.26em] inline-block will-change-transform ${accent ? "text-gradient" : ""}`}
    >
      {children}
    </motion.span>
  );
}
