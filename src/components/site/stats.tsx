"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";

interface Stat {
  value: number;
  suffix: string;
  label: string;
  detail: string;
}

const STATS: Stat[] = [
  {
    value: 250,
    suffix: "+",
    label: "Projects completed",
    detail: "Across web, mobile, AI and SaaS",
  },
  {
    value: 48,
    suffix: "+",
    label: "Technologies used",
    detail: "From WebGL to LLM orchestration",
  },
  {
    value: 120,
    suffix: "+",
    label: "Global clients",
    detail: "In 26 countries and 12 industries",
  },
  {
    value: 10,
    suffix: "yrs",
    label: "Years of experience",
    detail: "Shipping since 2016",
  },
];

/**
 * Statistics — numbers count up smoothly when entering the viewport,
 * set against a blueprint grid with a horizontal rule that draws itself.
 */
export function Stats() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-25% 0px" });
  const reduced = useReducedMotion();

  return (
    <section ref={sectionRef} aria-label="Studio statistics" className="relative py-24 sm:py-32">
      {/* blueprint backdrop */}
      <div className="absolute inset-0 bg-grid opacity-60" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_50%,transparent,#0a0a0b_85%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8">
        <motion.div
          initial={reduced ? false : { scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="h-px origin-left bg-gradient-to-r from-transparent via-accent/50 to-transparent"
          aria-hidden="true"
        />

        <dl className="grid grid-cols-2 divide-white/8 max-lg:gap-y-12 lg:grid-cols-4 lg:divide-x">
          {STATS.map((stat, i) => (
            <Counter key={stat.label} stat={stat} inView={inView} index={i} />
          ))}
        </dl>

        <motion.div
          initial={reduced ? false : { scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="h-px origin-right bg-gradient-to-r from-transparent via-accent/50 to-transparent"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}

function Counter({
  stat,
  inView,
  index,
}: {
  stat: Stat;
  inView: boolean;
  index: number;
}) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      const raf = requestAnimationFrame(() => setDisplay(stat.value));
      return () => cancelAnimationFrame(raf);
    }
    const controls = animate(0, stat.value, {
      duration: 2,
      delay: index * 0.12,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, stat.value, index, reduced]);

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
      className="flex flex-col items-center px-6 py-4 text-center lg:py-10"
    >
      <dd className="font-display text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
        <span className="text-gradient tabular-nums">{display}</span>
        <span className="text-3xl text-accent sm:text-4xl lg:text-5xl">{stat.suffix}</span>
      </dd>
      <dt className="mt-4 font-mono text-[11px] uppercase tracking-[0.22em] text-foreground">
        {stat.label}
      </dt>
      <p className="mt-2 max-w-[200px] text-xs leading-relaxed text-muted-foreground">
        {stat.detail}
      </p>
    </motion.div>
  );
}
