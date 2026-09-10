"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MessageCircleQuestion } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

const FAQS = [
  {
    q: "What does a typical engagement look like?",
    a: "Every project runs through our seven-stage process — Discover, Strategy, Design, Build, Test, Launch and Grow. The first two weeks are pure discovery: stakeholder interviews, technical audits and experience mapping. From there you receive a living roadmap with weekly demos, so you watch the product take shape in real time rather than waiting for a big reveal.",
  },
  {
    q: "How long does a project usually take?",
    a: "A focused marketing site ships in 4–6 weeks. A full product — web platform, mobile app or SaaS system — typically runs 10 to 16 weeks depending on scope and integrations. We plan in two-week sprints with demoable output at the end of each, which keeps momentum high and surprises at zero.",
  },
  {
    q: "How do you price your work?",
    a: "Two models: a fixed price for clearly scoped projects, or a dedicated team on a monthly retainer for evolving products. Both include strategy, design, engineering and QA — there are no hidden line items. After the discovery phase you receive a precise, milestone-based quote that holds unless the scope itself changes.",
  },
  {
    q: "Can you work with our existing team or codebase?",
    a: "Absolutely — roughly a third of our work is embedded collaboration. We slot into your sprint rituals and Slack, follow your code standards, and leave behind documentation your engineers will actually enjoy reading. If the codebase needs love, we refactor incrementally instead of rewriting recklessly.",
  },
  {
    q: "Do you provide support after launch?",
    a: "Launch is the midpoint, not the finish line. Our Grow retainer covers performance monitoring, A/B experiments, SEO evolution, feature iterations and priority response — with a monthly report that ties engineering work back to business metrics like conversion and retention.",
  },
  {
    q: "Who owns the code and intellectual property?",
    a: "You do — one hundred percent. From the first commit to the final deploy, all repositories, design files, credentials and documentation are created in your accounts and transferred upon final payment. We are craftsmen, not collectors of leverage.",
  },
];

/**
 * FAQ — editorial two-column layout with a sticky headline and an
 * accordion that reveals answers with smooth height transitions.
 */
export function Faq() {
  const reduced = useReducedMotion();

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="relative overflow-hidden py-28 sm:py-36"
    >
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/2 top-0 h-px w-[92%] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        <div className="absolute -right-[15%] top-[20%] h-[30vw] w-[30vw] rounded-full bg-[radial-gradient(circle,rgba(232,93,117,0.06),transparent_65%)] blur-2xl" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-14 px-6 sm:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        {/* sticky intro column */}
        <div className="lg:sticky lg:top-32 lg:self-start">
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 0.7, ease: EASE }}
            className="mb-5 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.32em] text-accent"
          >
            <MessageCircleQuestion className="h-4 w-4" />
            Before you ask
          </motion.p>
          <motion.h2
            id="faq-heading"
            initial={reduced ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.08 }}
            className="font-display text-[clamp(2.4rem,5.4vw,4.6rem)] font-semibold leading-[1.04] tracking-[-0.02em]"
          >
            QUESTIONS,
            <br />
            <span className="font-serif-accent italic font-normal text-gradient">answered.</span>
          </motion.h2>
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.16 }}
            className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground"
          >
            Everything partners usually want to know before the first call.
            Something more specific? We answer every message within one
            business day.
          </motion.p>
        </div>

        {/* accordion */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
        >
          <Accordion type="single" collapsible className="border-t border-white/8">
            {FAQS.map((item, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="group border-b border-white/8 transition-colors duration-500 data-[state=open]:border-accent/30"
              >
                <AccordionTrigger className="gap-6 px-1 py-7 text-left hover:no-underline sm:px-3 [&[data-state=open]>span:first-child]:text-accent">
                  <span className="flex items-baseline gap-5 sm:gap-7">
                    <span className="font-mono text-xs text-muted-foreground/60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-lg font-semibold tracking-tight transition-colors duration-400 group-hover:text-accent sm:text-2xl">
                      {item.q}
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-1 pb-8 sm:px-3 sm:pl-[4.4rem]">
                  <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {item.a}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
