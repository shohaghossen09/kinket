"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowUpRight, Trophy } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

const AWARDS = [
  {
    name: "Awwwards",
    result: "Site of the Day × 7",
    category: "Digital Design Excellence",
    year: "2020 — 25",
  },
  {
    name: "FWA",
    result: "FWA of the Day × 4",
    category: "Cutting-Edge Web Experiences",
    year: "2021 — 25",
  },
  {
    name: "CSS Design Awards",
    result: "Website of the Year — Nominee",
    category: "Best UI Design & Innovation",
    year: "2024",
  },
  {
    name: "The Webby Awards",
    result: "Honoree — Best Visual Design",
    category: "Apps & Web Craft",
    year: "2023",
  },
  {
    name: "Red Dot Award",
    result: "Brands & Communication Design",
    category: "Interface Design",
    year: "2023",
  },
  {
    name: "ADC Annual Awards",
    result: "Interaction Design — Merit × 3",
    category: "Craft in Digital Media",
    year: "2022 — 24",
  },
];

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 42 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: EASE, delay: i * 0.07 },
  }),
};

/**
 * Awards & recognition — an editorial index of honours.
 * Rows reveal on scroll and erupt on hover: gradient sweep, sliding
 * title, rotating arrow. The custom cursor flips to a VIEW state.
 */
export function Awards() {
  const reduced = useReducedMotion();

  return (
    <section
      id="awards"
      aria-labelledby="awards-heading"
      className="relative overflow-hidden py-28 sm:py-36"
    >
      {/* backdrop flourish */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/2 top-0 h-px w-[92%] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        <div className="absolute -right-[20%] top-[10%] h-[36vw] w-[36vw] rounded-full bg-[radial-gradient(circle,rgba(255,106,61,0.07),transparent_65%)] blur-2xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8">
        {/* header */}
        <div className="mb-16 flex flex-wrap items-end justify-between gap-8 sm:mb-20">
          <div>
            <motion.p
              initial={reduced ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ duration: 0.7, ease: EASE }}
              className="mb-5 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.32em] text-accent"
            >
              <Trophy className="h-4 w-4" />
              Recognition
            </motion.p>
            <h2
              id="awards-heading"
              className="font-display text-[clamp(2.4rem,6.4vw,5.6rem)] font-semibold leading-[1.02] tracking-[-0.02em]"
            >
              AWARDED FOR
              <br />
              <span className="font-serif-accent italic font-normal text-gradient">the craft.</span>
            </h2>
          </div>
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
            className="max-w-sm text-sm leading-relaxed text-muted-foreground"
          >
            Twenty-two international honours across design, technology and
            interaction — earned with partners who dared to build differently.
          </motion.p>
        </div>

        {/* award rows */}
        <ul className="border-t border-white/8">
          {AWARDS.map((award, i) => (
            <motion.li
              key={award.name}
              custom={i}
              variants={rowVariants}
              initial={reduced ? false : "hidden"}
              whileInView="show"
              viewport={{ once: true, margin: "-8% 0px" }}
              className="group relative border-b border-white/8"
            >
              <a
                href="#contact"
                onClick={(e) => e.preventDefault()}
                data-cursor="view"
                className="relative block px-2 py-7 sm:px-4 sm:py-9"
                aria-label={`${award.name} — ${award.result}, ${award.year}`}
              >
                {/* gradient sweep */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-accent/14 via-accent/6 to-transparent transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
                />
                {/* left accent bar */}
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-1/2 h-0 w-[3px] -translate-y-1/2 rounded-full bg-gradient-to-b from-accent-warm to-accent transition-all duration-500 group-hover:h-16"
                />

                <div className="relative flex flex-wrap items-baseline gap-x-6 gap-y-1 sm:items-center sm:gap-x-10">
                  <span className="font-mono text-xs text-muted-foreground/70 transition-colors duration-500 group-hover:text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <h3 className="font-display text-[clamp(1.5rem,3.6vw,3rem)] font-semibold tracking-tight transition-all duration-500 group-hover:translate-x-3 group-hover:text-accent">
                    {award.name}
                  </h3>

                  <p className="order-last w-full text-xs text-muted-foreground sm:order-none sm:w-auto sm:text-sm">
                    {award.result} · {award.category}
                  </p>

                  <span className="ml-auto font-mono text-xs tracking-[0.2em] text-muted-foreground/80 transition-colors duration-500 group-hover:text-foreground">
                    {award.year}
                  </span>

                  <ArrowUpRight
                    className="hidden h-6 w-6 -translate-x-2 translate-y-2 text-accent opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 sm:block"
                    strokeWidth={2}
                  />
                </div>
              </a>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
