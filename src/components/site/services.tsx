"use client";

import { useRef, type MouseEvent } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import {
  Globe2,
  Smartphone,
  Braces,
  BrainCircuit,
  Layers3,
  PenTool,
  ShoppingBag,
  TrendingUp,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "./reveal";
import { useFinePointer } from "@/lib/hooks";

interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
  deliverables: string[];
  index: string;
}

const SERVICES: Service[] = [
  {
    icon: Globe2,
    title: "Web Development",
    description:
      "High-performance websites and web apps engineered for speed, scale and cinematic interaction.",
    deliverables: ["Next.js / React", "WebGL & Motion", "Headless CMS", "Core Web Vitals"],
    index: "01",
  },
  {
    icon: Smartphone,
    title: "Mobile App Development",
    description:
      "Native-feel iOS and Android products with fluid gesture-driven interfaces and offline resilience.",
    deliverables: ["React Native", "Flutter", "App Store Launch", "Push & Deep Links"],
    index: "02",
  },
  {
    icon: Braces,
    title: "Software Development",
    description:
      "Custom platforms, APIs and cloud architecture that power operations long after launch day.",
    deliverables: ["TypeScript", "Node & Go", "Cloud Native", "DevOps & CI/CD"],
    index: "03",
  },
  {
    icon: BrainCircuit,
    title: "AI Solutions",
    description:
      "Intelligent features that feel like magic — LLM products, agents and ML woven into real workflows.",
    deliverables: ["LLM Integration", "RAG Pipelines", "AI Agents", "Model Evaluation"],
    index: "04",
  },
  {
    icon: Layers3,
    title: "SaaS Development",
    description:
      "Multi-tenant platforms with billing, analytics and onboarding designed for compounding growth.",
    deliverables: ["Multi-Tenancy", "Stripe Billing", "Admin Dashboards", "Usage Analytics"],
    index: "05",
  },
  {
    icon: PenTool,
    title: "UI/UX Design",
    description:
      "Research-driven design systems and prototypes that make complex products feel effortless.",
    deliverables: ["Design Systems", "UX Research", "Prototyping", "Motion Language"],
    index: "06",
  },
  {
    icon: ShoppingBag,
    title: "E-Commerce",
    description:
      "Headless storefronts with immersive product storytelling and friction-free checkout flows.",
    deliverables: ["Headless Commerce", "3D Product Views", "CRO Strategy", "Omnichannel"],
    index: "07",
  },
  {
    icon: TrendingUp,
    title: "SEO & Digital Growth",
    description:
      "Technical SEO, performance and analytics that compound visibility into durable acquisition.",
    deliverables: ["Technical SEO", "Schema & Metadata", "Funnel Analytics", "A/B Testing"],
    index: "08",
  },
];

export function Services() {
  return (
    <section id="services" aria-labelledby="services-heading" className="relative py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <SectionHeading
          id="services-heading"
          eyebrow="Capabilities"
          title={
            <>
              What we <span className="font-serif-accent italic font-normal text-gradient">craft</span>
            </>
          }
          description="Eight disciplines, one obsessive standard. Every deliverable is engineered to perform and designed to be remembered."
        />

        <div className="perspective-1200 mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {SERVICES.map((service, i) => (
            <ServiceCard key={service.title} service={service} delay={(i % 4) * 0.08 + Math.floor(i / 4) * 0.12} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service, delay }: { service: Service; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const fine = useFinePointer();
  const tiltEnabled = fine && !reduced;

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 200, damping: 18 });
  const sry = useSpring(ry, { stiffness: 200, damping: 18 });
  const rotateX = useTransform(srx, [-0.5, 0.5], [7, -7]);
  const rotateY = useTransform(sry, [-0.5, 0.5], [-9, 9]);
  const Icon = service.icon;

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!tiltEnabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    rx.set(py - 0.5);
    ry.set(px - 0.5);
    ref.current.style.setProperty("--mx", `${px * 100}%`);
    ref.current.style.setProperty("--my", `${py * 100}%`);
  };

  const onMouseLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.article
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      initial={reduced ? false : { opacity: 0, y: 44 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay }}
      style={tiltEnabled ? { rotateX, rotateY, transformStyle: "preserve-3d" } : undefined}
      className="group relative flex min-h-[19rem] flex-col justify-between overflow-hidden rounded-2xl border border-white/8 bg-[#0e0e11] p-6 transition-colors duration-500 hover:border-accent/35"
    >
      {/* cursor spotlight */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(255,122,61,0.09), transparent 45%)",
        }}
        aria-hidden="true"
      />

      {/* top gradient hairline on hover */}
      <div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden="true"
      />

      <div style={tiltEnabled ? { transform: "translateZ(34px)" } : undefined}>
        <div className="flex items-start justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-foreground transition-colors duration-500 group-hover:border-accent/40 group-hover:text-accent">
            <Icon className="h-5 w-5" strokeWidth={1.6} />
          </div>
          <span className="font-mono text-xs text-muted-foreground/70">{service.index}</span>
        </div>

        <h3 className="mt-8 font-display text-lg font-semibold tracking-tight text-foreground">
          {service.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {service.description}
        </p>
      </div>

      {/* revealed detail */}
      <div
        className="mt-6 lg:translate-y-3 lg:opacity-0 lg:transition-all lg:duration-500 lg:ease-[cubic-bezier(0.16,1,0.3,1)] lg:group-hover:translate-y-0 lg:group-hover:opacity-100"
        style={tiltEnabled ? { transform: "translateZ(20px)" } : undefined}
      >
        <ul className="flex flex-wrap gap-2" aria-label={`${service.title} deliverables`}>
          {service.deliverables.map((d) => (
            <li
              key={d}
              className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-medium text-muted-foreground"
            >
              {d}
            </li>
          ))}
        </ul>
        <a
          href="#contact"
          className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-foreground transition-colors hover:text-accent"
        >
          Discuss this service
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:rotate-45" />
        </a>
      </div>
    </motion.article>
  );
}
