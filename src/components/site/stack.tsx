"use client";

import { useState, useMemo } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { Cpu } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

type Category = "frontend" | "backend" | "ai" | "motion" | "infra";

const CATEGORIES: { id: Category | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "frontend", label: "Frontend" },
  { id: "backend", label: "Backend" },
  { id: "ai", label: "AI & Data" },
  { id: "motion", label: "Motion & 3D" },
  { id: "infra", label: "Infrastructure" },
];

const DOT: Record<Category, string> = {
  frontend: "bg-accent-warm",
  backend: "bg-accent",
  ai: "bg-[#e85d75]",
  motion: "bg-[#c084fc]",
  infra: "bg-[#4ade80]",
};

interface Tech {
  name: string;
  cat: Category;
  level: "Core" | "Expert" | "Production";
}

const TECHS: Tech[] = [
  { name: "React 19", cat: "frontend", level: "Core" },
  { name: "Next.js 16", cat: "frontend", level: "Core" },
  { name: "TypeScript", cat: "frontend", level: "Core" },
  { name: "Tailwind CSS 4", cat: "frontend", level: "Core" },
  { name: "Vue / Nuxt", cat: "frontend", level: "Expert" },
  { name: "Svelte", cat: "frontend", level: "Production" },
  { name: "Astro", cat: "frontend", level: "Production" },

  { name: "Node.js", cat: "backend", level: "Core" },
  { name: "Bun", cat: "backend", level: "Expert" },
  { name: "PostgreSQL", cat: "backend", level: "Core" },
  { name: "Prisma", cat: "backend", level: "Core" },
  { name: "GraphQL", cat: "backend", level: "Expert" },
  { name: "Redis", cat: "backend", level: "Production" },
  { name: "Go", cat: "backend", level: "Production" },

  { name: "PyTorch", cat: "ai", level: "Expert" },
  { name: "LangChain", cat: "ai", level: "Expert" },
  { name: "LLM Pipelines", cat: "ai", level: "Core" },
  { name: "Vector Databases", cat: "ai", level: "Expert" },
  { name: "RAG Systems", cat: "ai", level: "Core" },
  { name: "Computer Vision", cat: "ai", level: "Production" },

  { name: "GSAP", cat: "motion", level: "Core" },
  { name: "Three.js", cat: "motion", level: "Core" },
  { name: "WebGL / GLSL", cat: "motion", level: "Core" },
  { name: "Framer Motion", cat: "motion", level: "Core" },
  { name: "WebGPU", cat: "motion", level: "Expert" },
  { name: "Lenis", cat: "motion", level: "Expert" },
  { name: "Lottie / Rive", cat: "motion", level: "Production" },

  { name: "AWS", cat: "infra", level: "Core" },
  { name: "Vercel", cat: "infra", level: "Core" },
  { name: "Docker", cat: "infra", level: "Expert" },
  { name: "Kubernetes", cat: "infra", level: "Production" },
  { name: "Cloudflare", cat: "infra", level: "Expert" },
  { name: "CI/CD Pipelines", cat: "infra", level: "Expert" },
];

/**
 * Tech stack constellation — a filterable, layout-animated field of
 * technologies. Category pills re-flow the grid with spring physics;
 * chips lift and glow on hover.
 */
export function Stack() {
  const [active, setActive] = useState<Category | "all">("all");
  const reduced = useReducedMotion();

  const visible = useMemo(
    () => (active === "all" ? TECHS : TECHS.filter((t) => t.cat === active)),
    [active]
  );

  const headerVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    show: (d: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: EASE, delay: d },
    }),
  };

  return (
    <section
      id="stack"
      aria-labelledby="stack-heading"
      className="relative overflow-hidden py-28 sm:py-36"
    >
      {/* backdrop */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-grid opacity-30 mask-fade-b" />
        <div className="absolute left-1/2 top-0 h-px w-[92%] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        <div className="absolute -left-[15%] bottom-[5%] h-[34vw] w-[34vw] rounded-full bg-[radial-gradient(circle,rgba(255,194,75,0.06),transparent_65%)] blur-2xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8">
        {/* header */}
        <div className="mb-14 flex flex-wrap items-end justify-between gap-8">
          <div>
            <motion.p
              custom={0}
              variants={headerVariants}
              initial={reduced ? false : "hidden"}
              whileInView="show"
              viewport={{ once: true, margin: "-15% 0px" }}
              className="mb-5 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.32em] text-accent"
            >
              <Cpu className="h-4 w-4" />
              The Arsenal
            </motion.p>
            <motion.h2
              id="stack-heading"
              custom={0.08}
              variants={headerVariants}
              initial={reduced ? false : "hidden"}
              whileInView="show"
              viewport={{ once: true, margin: "-15% 0px" }}
              className="font-display text-[clamp(2.4rem,6.4vw,5.6rem)] font-semibold leading-[1.02] tracking-[-0.02em]"
            >
              WEAPONS OF
              <br />
              <span className="font-serif-accent italic font-normal text-gradient">choice.</span>
            </motion.h2>
          </div>
          <motion.p
            custom={0.16}
            variants={headerVariants}
            initial={reduced ? false : "hidden"}
            whileInView="show"
            viewport={{ once: true, margin: "-15% 0px" }}
            className="max-w-sm text-sm leading-relaxed text-muted-foreground"
          >
            Thirty-two production-grade technologies orchestrated into one
            coherent system — chosen for speed, stability and sheer expressive
            power.
          </motion.p>
        </div>

        {/* filter pills */}
        <motion.div
          custom={0.2}
          variants={headerVariants}
          initial={reduced ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, margin: "-10% 0px" }}
          className="mb-10 flex flex-wrap gap-2"
          role="tablist"
          aria-label="Filter technologies by category"
        >
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              role="tab"
              aria-selected={active === c.id}
              onClick={() => setActive(c.id)}
              className={`relative rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] transition-colors duration-300 ${
                active === c.id
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {active === c.id && (
                <motion.span
                  layoutId="stack-pill"
                  transition={
                    reduced
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 380, damping: 32 }
                  }
                  className="absolute inset-0 rounded-full bg-foreground"
                />
              )}
              <span className="relative z-10">{c.label}</span>
              {active !== c.id && (
                <span className="absolute inset-0 rounded-full border border-white/12 transition-colors duration-300 hover:border-white/25" />
              )}
            </button>
          ))}
        </motion.div>

        {/* chips field */}
        <motion.ul layout className="flex flex-wrap gap-3 sm:gap-4" aria-live="polite">
          <AnimatePresence mode="popLayout">
            {visible.map((tech) => (
              <motion.li
                key={tech.name}
                layout
                initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.6, y: 18 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.6, y: -14 }}
                transition={
                  reduced
                    ? { duration: 0.15 }
                    : { type: "spring", stiffness: 320, damping: 26 }
                }
                className="group relative"
              >
                <div className="flex cursor-default items-center gap-3 rounded-2xl glass-panel px-5 py-4 transition-all duration-400 group-hover:-translate-y-1.5 group-hover:border-accent/45 group-hover:shadow-[0_18px_50px_-16px_rgba(255,106,61,0.35)]">
                  <span
                    className={`h-2 w-2 rounded-full ${DOT[tech.cat]} transition-transform duration-300 group-hover:scale-150`}
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-display text-sm font-semibold tracking-tight sm:text-base">
                      {tech.name}
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/80">
                      {tech.level}
                    </p>
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>
    </section>
  );
}
