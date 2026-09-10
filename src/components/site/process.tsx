"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import {
  Compass,
  Target,
  PenTool,
  Code2,
  ShieldCheck,
  Rocket,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "./reveal";

interface Step {
  icon: LucideIcon;
  title: string;
  description: string;
  duration: string;
}

const STEPS: Step[] = [
  {
    icon: Compass,
    title: "Discover",
    description:
      "We immerse in your world — auditing product, market and audience to find the tension worth resolving.",
    duration: "1–2 weeks",
  },
  {
    icon: Target,
    title: "Strategy",
    description:
      "Positioning, architecture and a measurable definition of done. Every screen earns its place on a roadmap.",
    duration: "1–2 weeks",
  },
  {
    icon: PenTool,
    title: "Design",
    description:
      "Art direction, design systems and motion language. We prototype the feeling before we build the function.",
    duration: "2–4 weeks",
  },
  {
    icon: Code2,
    title: "Build",
    description:
      "Senior engineers ship in weekly increments behind feature flags — you watch the product assemble live.",
    duration: "4–10 weeks",
  },
  {
    icon: ShieldCheck,
    title: "Test",
    description:
      "Automated suites, device labs and accessibility audits. We break it in QA so users never do.",
    duration: "1–2 weeks",
  },
  {
    icon: Rocket,
    title: "Launch",
    description:
      "Zero-drama releases with observability wired in from the first deploy. Rollback plans ready, champagne optional.",
    duration: "Launch week",
  },
  {
    icon: TrendingUp,
    title: "Grow",
    description:
      "Post-launch experiments, performance budgets and roadmap iterations that compound quarter after quarter.",
    duration: "Ongoing",
  },
];

/** Pinned scroll-sequence length — ~55vh of scroll per step + intro. */
const SEQ_VH = 460;

/**
 * How We Work — a pinned, scroll-scrubbed cinematic stepper.
 * One step owns the stage at a time: a giant outlined numeral drifts
 * behind the card while a horizontal rail with a comet head tracks
 * progress through all seven moves.
 */
export function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  /* continuous step index 0 → 6.999 across the pin */
  const index = useTransform(scrollYProgress, [0.1, 0.96], [0, 6.999]);
  const railScale = useTransform(scrollYProgress, [0.1, 0.96], [0, 1]);
  const counter = useTransform(index, (v) =>
    String(Math.min(6, Math.max(0, Math.floor(v))) + 1).padStart(2, "0")
  );
  const cometLeft = useTransform(index, (v) => `${(Math.min(v, 6) / 6) * 100}%`);

  /* ------------------------- reduced-motion fallback ------------------------- */
  if (reduced) {
    return (
      <section id="process" aria-labelledby="process-heading" className="relative py-28 sm:py-36">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <SectionHeading
            id="process-heading"
            eyebrow="How We Work"
            title={
              <>
                Seven moves from <span className="font-serif-accent italic font-normal text-gradient">idea</span> to
                impact
              </>
            }
            description="A process refined across 250+ launches — transparent, weekly, and relentlessly focused on outcomes."
          />
          <ol className="mx-auto mt-16 max-w-3xl space-y-10">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <li key={step.title} className="flex items-start gap-6">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/12 bg-[#101013] text-accent">
                    <Icon className="h-6 w-6" strokeWidth={1.6} />
                  </div>
                  <div>
                    <h3 className="flex items-baseline gap-3 font-display text-2xl font-semibold tracking-tight text-foreground">
                      <span className="font-mono text-xs text-accent">0{i + 1}</span>
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                    <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground/70">
                      {step.duration}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>
    );
  }

  /* ------------------------------ pinned stage ------------------------------ */
  return (
    <section
      id="process"
      ref={sectionRef}
      aria-labelledby="process-heading"
      style={{ height: `${SEQ_VH}vh` }}
      className="relative"
    >
      <div className="sticky top-0 flex h-svh flex-col overflow-hidden">
        {/* ambient gradient */}
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_40%_at_80%_20%,rgba(255,106,61,0.06),transparent_60%)]"
          aria-hidden="true"
        />

        {/* heading */}
        <div className="mx-auto w-full max-w-7xl px-6 pt-24 sm:px-8">
          <SectionHeading
            id="process-heading"
            eyebrow="How We Work"
            title={
              <>
                Seven moves from{" "}
                <span className="font-serif-accent italic font-normal text-gradient">idea</span> to
                impact
              </>
            }
            description="A process refined across 250+ launches — transparent, weekly, and relentlessly focused on outcomes."
          />
        </div>

        {/* step stage — one slide owns the center at a time */}
        <div
          className="relative mx-auto w-full max-w-7xl flex-1 px-6 sm:px-8"
          style={{ perspective: "1400px" }}
        >
          {/* screen-reader list (visual slides are aria-hidden) */}
          <ol className="sr-only" aria-labelledby="process-heading">
            {STEPS.map((step, i) => (
              <li key={step.title}>
                <h3>
                  Step {i + 1} of 7: {step.title}
                </h3>
                <p>{step.description}</p>
                <p>{step.duration}</p>
              </li>
            ))}
          </ol>

          {STEPS.map((step, i) => (
            <StepSlide key={step.title} step={step} i={i} index={index} />
          ))}
        </div>

        {/* progress rail */}
        <div className="mx-auto w-full max-w-4xl px-6 pb-14 sm:px-8">
          <div className="mb-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            <span>Step</span>
            <span>
              <motion.span className="text-accent">{counter}</motion.span> / 07
            </span>
          </div>

          <div className="relative">
            {/* rail base */}
            <div className="h-px w-full bg-white/10" aria-hidden="true" />
            {/* rail fill */}
            <motion.div
              style={{ scaleX: railScale }}
              className="absolute inset-y-0 left-0 h-px w-full origin-left bg-gradient-to-r from-accent-warm via-accent to-[#e85d75]"
              aria-hidden="true"
            />
            {/* comet head */}
            <motion.div
              style={{ left: cometLeft }}
              className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_18px_4px_rgba(255,106,61,0.55)]"
              aria-hidden="true"
            />
            {/* nodes */}
            {STEPS.map((step, i) => (
              <RailNode key={step.title} i={i} index={index} label={step.title} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Step slide — scroll-scrubbed filmstrip card                        */
/* ------------------------------------------------------------------ */

function StepSlide({ step, i, index }: { step: Step; i: number; index: MotionValue<number> }) {
  const Icon = step.icon;

  const opacity = useTransform(index, (v) => 1 - Math.min(Math.abs(v - i) / 0.52, 1));
  const y = useTransform(index, (v) => (i - v) * 92);
  const scale = useTransform(index, (v) => 1 - Math.min(Math.abs(v - i) * 0.08, 0.24));
  const rotateX = useTransform(index, (v) => (i - v) * 7);

  /* giant numeral — drifts faster for parallax depth, lingers longer */
  const numOpacity = useTransform(index, (v) => 1 - Math.min(Math.abs(v - i) / 0.75, 1));
  const numY = useTransform(index, (v) => (i - v) * 150);

  return (
    <motion.div
      style={{ opacity, y, scale, rotateX, transformStyle: "preserve-3d" }}
      className="absolute inset-0 flex items-center justify-center will-change-transform"
      aria-hidden="true"
    >
      <div className="relative flex max-w-2xl flex-col items-center text-center">
        {/* giant outlined numeral behind */}
        <motion.span
          style={{ opacity: numOpacity, y: numY }}
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 select-none font-display text-[clamp(11rem,30vw,22rem)] font-bold leading-none text-outline"
        >
          0{i + 1}
        </motion.span>

        {/* icon chip */}
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-accent/30 bg-[#101013] text-accent shadow-[0_0_50px_-10px_rgba(255,106,61,0.5)]">
          <Icon className="h-7 w-7" strokeWidth={1.5} />
        </div>

        <h3 className="mt-7 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          {step.title}
        </h3>

        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
          {step.description}
        </p>

        <span className="mt-6 rounded-full border border-white/12 bg-white/[0.03] px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
          {step.duration}
        </span>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Rail node — lights up as the comet passes                          */
/* ------------------------------------------------------------------ */

function RailNode({ i, index, label }: { i: number; index: MotionValue<number>; label: string }) {
  const lit = useTransform(index, [i - 0.55, i - 0.3], [0, 1]);
  const dotScale = useTransform(lit, [0, 1], [1, 1.5]);
  const labelOpacity = useTransform(lit, [0, 1], [0.4, 1]);

  return (
    <div
      className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${(i / 6) * 100}%` }}
      aria-hidden="true"
    >
      <div className="relative flex h-4 w-4 items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-white/25 bg-[#0a0a0b]" />
        <motion.div
          style={{ opacity: lit, scale: dotScale }}
          className="h-2 w-2 rounded-full bg-accent shadow-[0_0_12px_2px_rgba(255,106,61,0.6)]"
        />
      </div>
      <motion.span
        style={{ opacity: labelOpacity }}
        className="absolute left-1/2 top-6 hidden -translate-x-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground md:block"
      >
        0{i + 1} {label}
      </motion.span>
    </div>
  );
}
