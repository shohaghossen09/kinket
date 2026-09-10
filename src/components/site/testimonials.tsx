"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  project: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "KINETIC didn't just build our platform — they reimagined how our product should feel. Every interaction is considered. Activation doubled within a quarter of launch.",
    name: "Elena Marsh",
    role: "Chief Product Officer",
    company: "Fieldnote",
    project: "PULSE — SaaS Analytics",
  },
  {
    quote:
      "The most technically capable design partner we've ever worked with. They move like an in-house team but think like a product company. Our board asked who built it — twice.",
    name: "David Okafor",
    role: "Founder & CEO",
    company: "Northlight Capital",
    project: "AETHER — Immersive 3D Commerce",
  },
  {
    quote:
      "They shipped an AI feature our users genuinely love. Weekly demos, ruthless prioritisation, zero drama. It felt less like an agency and more like a special-ops team.",
    name: "Yuki Tanaka",
    role: "VP of Engineering",
    company: "Meridian AI",
    project: "CORTEX — AI Design Engine",
  },
  {
    quote:
      "Our conversion rate went up the week we relaunched. But the real win is how the brand feels now — considered, confident, and impossible to forget.",
    name: "Sofia Almeida",
    role: "Head of Digital",
    company: "Velour Atelier",
    project: "VELOUR — Luxury E-Commerce",
  },
];

const AUTOPLAY_MS = 7000;

/**
 * Testimonials — smooth crossfading carousel with autoplay (paused on hover
 * and for reduced-motion users), keyboard-accessible controls and dots.
 */
export function Testimonials() {
  const [[index, direction], setIndex] = useState<[number, number]>([0, 0]);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const paginate = useCallback((dir: number) => {
    setIndex(([prev]) => [(prev + dir + TESTIMONIALS.length) % TESTIMONIALS.length, dir]);
  }, []);

  useEffect(() => {
    if (paused || reduced) return;
    timer.current = setInterval(() => paginate(1), AUTOPLAY_MS);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [paused, reduced, paginate]);

  const current = TESTIMONIALS[index];

  return (
    <section
      aria-label="Client testimonials"
      className="relative py-28 sm:py-36"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_45%_at_50%_45%,rgba(255,106,61,0.05),transparent_65%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-4xl px-6 sm:px-8">
        <div className="mb-12 flex items-center justify-center gap-4">
          <span className="h-px w-10 bg-gradient-to-r from-accent-warm to-accent" aria-hidden="true" />
          <span className="font-mono text-xs uppercase tracking-[0.28em] text-accent">
            Client Voices
          </span>
          <span className="h-px w-10 bg-gradient-to-l from-accent-warm to-accent" aria-hidden="true" />
        </div>

        <div
          className="glass-panel relative overflow-hidden rounded-3xl px-8 py-12 sm:px-14 sm:py-16"
          role="group"
          aria-roledescription="carousel"
          aria-label="Testimonials"
        >
          <Quote
            className="absolute right-8 top-8 h-12 w-12 text-accent/15 sm:h-16 sm:w-16"
            strokeWidth={1}
            aria-hidden="true"
          />

          <div className="relative min-h-[240px] sm:min-h-[210px]" aria-live="polite">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.blockquote
                key={index}
                custom={direction}
                initial={reduced ? { opacity: 1 } : { opacity: 0, x: direction >= 0 ? 60 : -60, filter: "blur(4px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, x: direction >= 0 ? -60 : 60, filter: "blur(4px)" }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <p className="font-serif-accent text-xl italic leading-relaxed text-foreground sm:text-2xl lg:text-[1.7rem]">
                  “{current.quote}”
                </p>

                <footer className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-accent-warm via-accent to-[#e85d75] font-display text-sm font-semibold text-accent-foreground">
                    {current.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{current.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {current.role} — {current.company}
                    </p>
                  </div>
                  <span className="ml-auto hidden rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-accent sm:inline-block">
                    {current.project}
                  </span>
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>

          {/* controls */}
          <div className="mt-12 flex items-center justify-between border-t border-white/8 pt-6">
            <div className="flex gap-2" role="tablist" aria-label="Choose testimonial">
              {TESTIMONIALS.map((t, i) => (
                <button
                  key={t.name}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Testimonial ${i + 1}: ${t.name}, ${t.company}`}
                  onClick={() => setIndex([i, i > index ? 1 : -1])}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i === index ? "w-8 bg-accent" : "w-2.5 bg-white/15 hover:bg-white/30"
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => paginate(-1)}
                aria-label="Previous testimonial"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 text-foreground transition-colors duration-300 hover:border-accent/50 hover:text-accent"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => paginate(1)}
                aria-label="Next testimonial"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 text-foreground transition-colors duration-300 hover:border-accent/50 hover:text-accent"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
