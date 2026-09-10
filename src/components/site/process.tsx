"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
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

export function Process() {
  const listRef = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 0.72", "end 0.55"],
  });

  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="process" aria-labelledby="process-heading" className="relative py-28 sm:py-36">
      {/* ambient gradient */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_40%_at_80%_20%,rgba(255,106,61,0.06),transparent_60%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8">
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

        <div className="relative mx-auto mt-20 max-w-3xl">
          {/* progress rail */}
          <div
            className="absolute left-[27px] top-0 h-full w-px bg-white/8 sm:left-1/2"
            aria-hidden="true"
          >
            <motion.div
              style={reduced ? { scaleY: 1 } : { scaleY: lineScale }}
              className="h-full w-full origin-top bg-gradient-to-b from-accent-warm via-accent to-[#e85d75]"
            />
          </div>

          <ol ref={listRef} className="relative space-y-14 sm:space-y-20">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              const leftSide = i % 2 === 0;
              return (
                <li key={step.title} className="relative">
                  <motion.div
                    initial={reduced ? false : { opacity: 0, y: 40, x: 0 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-18% 0px" }}
                    transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                    className={`flex items-start gap-6 sm:w-1/2 ${
                      leftSide
                        ? "sm:pr-14 sm:text-right sm:flex-row-reverse"
                        : "sm:ml-auto sm:pl-14"
                    }`}
                  >
                    {/* node */}
                    <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/12 bg-[#101013] text-accent shadow-[0_0_0_8px_#0a0a0b]">
                      <Icon className="h-6 w-6" strokeWidth={1.6} />
                    </div>

                    <div className={leftSide ? "sm:flex sm:flex-col sm:items-end" : ""}>
                      <div className="flex items-baseline gap-3 sm:gap-0">
                        <span className="font-mono text-xs text-accent sm:hidden">0{i + 1}</span>
                        <h3 className="font-display text-2xl font-semibold tracking-tight text-foreground">
                          {step.title}
                        </h3>
                      </div>
                      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                        {step.description}
                      </p>
                      <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground/70">
                        {step.duration}
                      </p>
                    </div>
                  </motion.div>

                  {/* number watermark (desktop) */}
                  <span
                    className={`pointer-events-none absolute top-1/2 hidden -translate-y-1/2 font-display text-7xl font-bold text-white/[0.045] lg:block ${
                      leftSide ? "right-2 sm:right-[12%]" : "left-2 sm:left-[12%]"
                    }`}
                    aria-hidden="true"
                  >
                    0{i + 1}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
