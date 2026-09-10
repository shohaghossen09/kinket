"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Magnetic } from "./magnetic";
import { Reveal } from "./reveal";
import { useIsMobile } from "@/lib/hooks";
import { scrollToSection } from "@/lib/scroll";

interface Project {
  id: string;
  index: string;
  name: string;
  category: string;
  description: string;
  detail: string;
  tech: string[];
  image: string;
  alt: string;
  outcome: { label: string; value: string }[];
  year: string;
}

const PROJECTS: Project[] = [
  {
    id: "aether",
    index: "01",
    name: "AETHER",
    category: "Immersive 3D Commerce",
    description:
      "A real-time 3D shopping world where products float in a navigable space — commerce reimagined as exploration.",
    detail:
      "AETHER rebuilt a premium audio brand's storefront as a WebGL environment: visitors travel through a spatial catalogue, inspect products in true scale and check out without ever leaving the scene. Custom asset pipeline keeps load under 2.5s on mid-tier hardware.",
    tech: ["WebGL", "Three.js", "Next.js", "WebGPU"],
    image: "/images/work-aether.jpg",
    alt: "Abstract iridescent liquid metal 3D sculpture from the AETHER immersive commerce experience",
    outcome: [
      { label: "Session duration", value: "+164%" },
      { label: "Conversion", value: "+38%" },
      { label: "Load time", value: "2.4s" },
    ],
    year: "2025",
  },
  {
    id: "pulse",
    index: "02",
    name: "PULSE",
    category: "SaaS Analytics Platform",
    description:
      "A real-time analytics platform rendering millions of events into a canvas the eye can actually read.",
    detail:
      "PULSE turns financial telemetry into an operating instrument — custom D3 canvas rendering, sub-100ms interactivity and a modular dashboard language that scales from a single chart to a trading floor of screens.",
    tech: ["React", "TypeScript", "D3.js", "WebSockets"],
    image: "/images/work-pulse.jpg",
    alt: "Dark financial analytics dashboard interface with glowing data visualisation",
    outcome: [
      { label: "Data refresh", value: "Realtime" },
      { label: "Query latency", value: "-72%" },
      { label: "Daily actives", value: "48k" },
    ],
    year: "2025",
  },
  {
    id: "velour",
    index: "03",
    name: "VELOUR",
    category: "Luxury E-Commerce",
    description:
      "Fashion e-commerce with editorial pace — cinematic lookbooks that convert as beautifully as they present.",
    detail:
      "VELOUR paired a headless commerce core with motion-choreographed lookbooks, 3D product views and a one-thumb checkout. Every screen is art-directed; every transition earns its milliseconds.",
    tech: ["Next.js", "Headless", "Motion", "CRO"],
    image: "/images/work-velour.jpg",
    alt: "Luxury fashion e-commerce app interface on smartphone with elegant dark presentation",
    outcome: [
      { label: "Checkout completion", value: "+27%" },
      { label: "AOV", value: "+19%" },
      { label: "Return visits", value: "+46%" },
    ],
    year: "2024",
  },
  {
    id: "cortex",
    index: "04",
    name: "CORTEX",
    category: "AI Design Engine",
    description:
      "An AI engine that generates on-brand design systems — strategy to styleguide in hours, not months.",
    detail:
      "CORTEX ingests a brand's strategy, references and constraints, then proposes complete design systems with tokens, components and motion rules. Designers direct; the engine iterates. Built on a multi-model LLM pipeline with human-in-the-loop evaluation.",
    tech: ["Python", "LLMs", "RAG", "Design Tokens"],
    image: "/images/work-cortex.jpg",
    alt: "Glowing neural network visualisation representing the CORTEX AI design engine",
    outcome: [
      { label: "Design cycle", value: "12x faster" },
      { label: "Token coverage", value: "94%" },
      { label: "Brands onboarded", value: "60+" },
    ],
    year: "2024",
  },
];

export function Work() {
  const isMobile = useIsMobile(1024);
  const reduced = useReducedMotion();
  const horizontal = !isMobile && !reduced;

  const [openProject, setOpenProject] = useState<Project | null>(null);

  return (
    <section id="work" aria-labelledby="work-heading" className="relative">
      {horizontal ? (
        <HorizontalWork onSelect={setOpenProject} />
      ) : (
        <VerticalWork onSelect={setOpenProject} />
      )}

      <CaseDialog project={openProject} onClose={() => setOpenProject(null)} />
    </section>
  );
}

/* ------------------------------ horizontal (pinned) ------------------------------ */

function HorizontalWork({ onSelect }: { onSelect: (p: Project) => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [range, setRange] = useState(0);
  const [viewportH, setViewportH] = useState(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      setRange(Math.max(trackRef.current.scrollWidth - window.innerWidth, 0));
      setViewportH(window.innerHeight);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], [0, -range]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.round(v * (PROJECTS.length - 1)));
  });

  return (
    <div ref={sectionRef} className="relative" style={{ height: range > 0 ? `${range + viewportH}px` : "500vh" }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <motion.div
          ref={trackRef}
          style={{ x }}
          data-cursor="drag"
          className="flex w-max items-center gap-10 px-[9vw] will-change-transform"
        >
          {/* intro panel */}
          <div className="flex w-[34vw] min-w-[340px] max-w-[480px] shrink-0 flex-col justify-center">
            <div className="mb-6 flex items-center gap-4">
              <span className="h-px w-10 bg-gradient-to-r from-accent-warm to-accent" aria-hidden="true" />
              <span id="work-heading" className="font-mono text-xs uppercase tracking-[0.28em] text-accent">
                Featured Work
              </span>
            </div>
            <h2 className="font-display text-5xl font-semibold leading-[1.02] tracking-tight text-foreground lg:text-6xl">
              Work that
              <br />
              <span className="font-serif-accent italic font-normal text-gradient">moves</span> the
              needle
            </h2>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
              A selection of platforms, products and experiences — each engineered
              to perform and choreographed to be remembered.
            </p>

            {/* progress */}
            <div className="mt-10 flex items-center gap-5">
              <span className="font-mono text-xs tabular-nums text-foreground">
                {String(active + 1).padStart(2, "0")}
              </span>
              <div className="h-px w-28 overflow-hidden bg-white/10">
                <motion.div
                  className="h-full origin-left bg-gradient-to-r from-accent-warm to-accent"
                  style={{ scaleX: scrollYProgress, width: "100%" }}
                />
              </div>
              <span className="font-mono text-xs tabular-nums text-muted-foreground">
                {String(PROJECTS.length).padStart(2, "0")}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground/60">
                Keep scrolling
              </span>
            </div>
          </div>

          {/* project panels */}
          {PROJECTS.map((project, i) => (
            <ProjectPanel
              key={project.id}
              project={project}
              progress={scrollYProgress}
              index={i}
              count={PROJECTS.length}
              onSelect={onSelect}
            />
          ))}

          {/* end CTA panel */}
          <div className="flex w-[42vw] min-w-[380px] max-w-[560px] shrink-0 items-center justify-center">
            <div className="text-center">
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-accent">Next</p>
              <p className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-foreground">
                Your project
                <br />
                could be <span className="font-serif-accent italic font-normal text-gradient">here.</span>
              </p>
              <Magnetic strength={0.3} className="mt-9">
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection("#contact");
                  }}
                  className="group inline-flex items-center gap-3 rounded-full bg-foreground px-7 py-3.5 text-sm font-semibold text-primary-foreground"
                >
                  Start a Project
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </Magnetic>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function ProjectPanel({
  project,
  progress,
  index,
  count,
  onSelect,
}: {
  project: Project;
  progress: MotionValue<number>;
  index: number;
  count: number;
  onSelect: (p: Project) => void;
}) {
  const n = count + 1.2;
  const center = (index + 0.9) / n;
  const scale = useTransform(progress, [center - 0.34, center, center + 0.34], [0.86, 1, 0.86]);
  const imgX = useTransform(progress, [center - 0.4, center + 0.4], ["-7%", "7%"]);

  return (
    <motion.article
      style={{ scale }}
      className="group relative w-[64vw] max-w-[860px] min-w-[540px] shrink-0"
    >
      <button
        type="button"
        onClick={() => onSelect(project)}
        data-cursor="view"
        aria-label={`Open case study: ${project.name} — ${project.category}`}
        className="block w-full text-left"
      >
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10">
          <motion.div style={{ x: imgX }} className="absolute inset-0 scale-[1.16] will-change-transform">
            <Image
              src={project.image}
              alt={project.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 64vw"
              quality={80}
              className="object-cover"
            />
          </motion.div>

          {/* cinematic gradient wash */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b]/85 via-transparent to-transparent"
            aria-hidden="true"
          />

          {/* top meta */}
          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-6">
            <span className="rounded-full border border-white/15 bg-black/30 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-white backdrop-blur-md">
              {project.category}
            </span>
            <span className="font-mono text-xs text-white/70">{project.year}</span>
          </div>

          {/* bottom title */}
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 sm:p-8">
            <div>
              <span className="font-mono text-[11px] text-accent">{project.index}</span>
              <h3 className="mt-1 font-display text-4xl font-semibold tracking-tight text-white lg:text-5xl">
                {project.name}
              </h3>
            </div>
            <span className="hidden items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium text-white backdrop-blur-md transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-accent-foreground sm:inline-flex">
              View Project <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </button>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 px-1">
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
          {project.description}
        </p>
        <ul className="flex flex-wrap gap-2" aria-label={`${project.name} technologies`}>
          {project.tech.map((t) => (
            <li
              key={t}
              className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[11px] text-muted-foreground"
            >
              {t}
            </li>
          ))}
        </ul>
      </div>
    </motion.article>
  );
}

/* ------------------------------ vertical (mobile / reduced) ------------------------------ */

function VerticalWork({ onSelect }: { onSelect: (p: Project) => void }) {
  return (
    <div className="py-28 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="mb-6 flex items-center gap-4">
          <span className="h-px w-10 bg-gradient-to-r from-accent-warm to-accent" aria-hidden="true" />
          <span id="work-heading" className="font-mono text-xs uppercase tracking-[0.28em] text-accent">
            Featured Work
          </span>
        </div>
        <Reveal>
          <h2 className="max-w-3xl font-display text-4xl font-semibold leading-[1.04] tracking-tight text-foreground sm:text-5xl">
            Work that <span className="font-serif-accent italic font-normal text-gradient">moves</span> the needle
          </h2>
        </Reveal>

        <div className="mt-14 space-y-16">
          {PROJECTS.map((project, i) => (
            <Reveal key={project.id} delay={0.05}>
              <article>
                <button
                  type="button"
                  onClick={() => onSelect(project)}
                  aria-label={`Open case study: ${project.name} — ${project.category}`}
                  className="group block w-full text-left"
                >
                  <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10">
                    <Image
                      src={project.image}
                      alt={project.alt}
                      fill
                      sizes="100vw"
                      quality={78}
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b]/80 via-transparent to-transparent"
                      aria-hidden="true"
                    />
                    <span className="absolute left-5 top-5 rounded-full border border-white/15 bg-black/30 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-white backdrop-blur-md">
                      {project.category}
                    </span>
                    <span className="absolute bottom-5 right-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-medium text-white backdrop-blur-md">
                      View <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                  <div className="mt-5 flex items-baseline justify-between gap-4">
                    <h3 className="font-display text-3xl font-semibold tracking-tight text-foreground">
                      <span className="mr-3 font-mono text-xs text-accent">{project.index}</span>
                      {project.name}
                    </h3>
                    <span className="font-mono text-xs text-muted-foreground">{project.year}</span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {project.description}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {project.tech.map((t) => (
                      <li
                        key={t}
                        className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[11px] text-muted-foreground"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </button>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-20 text-center" delay={0.05}>
          <p className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Your project could be <span className="font-serif-accent italic font-normal text-gradient">here.</span>
          </p>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("#contact");
            }}
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-foreground px-7 py-3.5 text-sm font-semibold text-primary-foreground"
          >
            Start a Project <ArrowRight className="h-4 w-4" />
          </a>
        </Reveal>
      </div>
    </div>
  );
}

/* ------------------------------ case study dialog ------------------------------ */

function CaseDialog({ project, onClose }: { project: Project | null; onClose: () => void }) {
  return (
    <Dialog open={!!project} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-h-[86vh] w-full max-w-3xl gap-0 overflow-y-auto rounded-2xl border-white/12 bg-[#0e0e11] p-0 duration-300 sm:max-w-3xl"
        showCloseButton
        aria-describedby={undefined}
      >
        {project && (
          <>
            <div className="relative aspect-[16/8]">
              <Image
                src={project.image}
                alt={project.alt}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                quality={80}
                className="object-cover"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#0e0e11] via-transparent to-transparent"
                aria-hidden="true"
              />
              <div className="absolute bottom-4 left-6 flex items-baseline gap-4">
                <span className="font-mono text-xs text-accent">{project.index}</span>
                <DialogTitle className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  {project.name}
                </DialogTitle>
              </div>
            </div>

            <DialogDescription asChild>
              <div className="p-6 sm:p-8">
                <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
                  {project.category} — {project.year}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {project.detail}
                </p>

                <div className="mt-8 grid grid-cols-3 gap-4">
                  {project.outcome.map((o) => (
                    <div key={o.label} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                      <p className="font-display text-xl font-semibold text-gradient sm:text-2xl">{o.value}</p>
                      <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{o.label}</p>
                    </div>
                  ))}
                </div>

                <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technologies">
                  {project.tech.map((t) => (
                    <li
                      key={t}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[11px] text-muted-foreground"
                    >
                      {t}
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Magnetic strength={0.25}>
                    <a
                      href="#contact"
                      onClick={(e) => {
                        e.preventDefault();
                        onClose();
                        setTimeout(() => scrollToSection("#contact"), 250);
                      }}
                      className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      Start something similar <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </Magnetic>
                </div>
              </div>
            </DialogDescription>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
