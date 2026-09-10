"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUp, Dribbble, Github, Instagram, Linkedin, Twitter } from "lucide-react";
import { Magnetic } from "./magnetic";
import { scrollToSection, scrollToTop } from "@/lib/scroll";

const SITEMAP = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Awards", href: "#awards" },
  { label: "Stack", href: "#stack" },
  { label: "About", href: "#about" },
  { label: "Process", href: "#process" },
  { label: "FAQ", href: "#faq" },
];

const SERVICE_LINKS = [
  "Web Development",
  "Mobile Apps",
  "AI Solutions",
  "SaaS Platforms",
  "UI/UX Design",
  "E-commerce",
];

const SOCIALS = [
  { label: "X / Twitter", icon: Twitter, href: "https://x.com/kineticstudio" },
  { label: "Dribbble", icon: Dribbble, href: "https://dribbble.com/kineticstudio" },
  { label: "Instagram", icon: Instagram, href: "https://instagram.com/kineticstudio" },
  { label: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/company/kineticstudio" },
  { label: "GitHub", icon: Github, href: "https://github.com/kineticstudio" },
];

/**
 * Footer — sophisticated closing act. A giant watermark wordmark rises as you
 * reach the bottom of the page, columns of links, contact block, and a
 * magnetic back-to-top control.
 */
export function Footer() {
  const reduced = useReducedMotion();

  return (
    <footer
      aria-labelledby="footer-heading"
      className="relative overflow-hidden border-t border-white/8"
    >
      <h2 id="footer-heading" className="sr-only">
        Contact and site footer
      </h2>

      {/* final scroll animation — giant watermark rising from the fold */}
      <div className="pointer-events-none relative flex justify-center pt-16 sm:pt-20" aria-hidden="true">
        <motion.p
          initial={reduced ? { opacity: 0.05 } : { y: "55%", opacity: 0 }}
          whileInView={{ y: "12%", opacity: 0.055 }}
          viewport={{ once: true, margin: "0px 0px -8% 0px" }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          className="select-none font-display text-[19vw] font-bold leading-none tracking-[-0.03em] text-foreground"
        >
          KINETIC
        </motion.p>
      </div>

      <div className="relative mx-auto -mt-[6vw] max-w-7xl px-6 pb-10 sm:px-8">
        <div className="grid grid-cols-1 gap-12 border-t border-white/8 pt-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_1fr_1fr_1.1fr]">
          {/* brand */}
          <div>
            <p className="font-display text-xl font-semibold tracking-[0.22em] text-foreground">
              KINETIC<span className="text-accent">®</span>
            </p>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
              A creative technology studio crafting digital experiences that
              move — for brands that refuse to be ordinary.
            </p>
            <div className="mt-7 flex gap-3">
              {SOCIALS.map((social) => {
                const Icon = social.icon;
                return (
                  <Magnetic key={social.label} strength={0.35}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${social.label} (opens in new tab)`}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 text-muted-foreground transition-colors duration-300 hover:border-accent/50 hover:text-accent"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  </Magnetic>
                );
              })}
            </div>
          </div>

          {/* sitemap */}
          <nav aria-label="Footer navigation">
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">Studio</p>
            <ul className="mt-5 space-y-3">
              {SITEMAP.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.href);
                    }}
                    className="text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* services */}
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">Services</p>
            <ul className="mt-5 space-y-3">
              {SERVICE_LINKS.map((s) => (
                <li key={s}>
                  <a
                    href="#services"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection("#services");
                    }}
                    className="text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground"
                  >
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* contact */}
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">Contact</p>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              <li>
                <a
                  href="mailto:hello@kineticstudio.dev"
                  className="transition-colors duration-300 hover:text-foreground"
                >
                  hello@kineticstudio.dev
                </a>
              </li>
              <li>
                <a
                  href="tel:+351210000000"
                  className="transition-colors duration-300 hover:text-foreground"
                >
                  +351 21 000 0000
                </a>
              </li>
              <li className="leading-relaxed">
                Rua do Alecrim 12
                <br />
                1200-018 Lisbon, Portugal
              </li>
              <li className="font-mono text-xs leading-relaxed text-muted-foreground/70">
                LIS — TYO — NYC
              </li>
            </ul>
          </div>

          {/* back to top */}
          <div className="flex flex-col items-start justify-between gap-8 lg:items-end">
            <Magnetic strength={0.3}>
              <button
                type="button"
                onClick={scrollToTop}
                aria-label="Back to top"
                className="group flex h-14 w-14 items-center justify-center rounded-full border border-white/12 text-foreground transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-accent-foreground"
              >
                <ArrowUp className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
              </button>
            </Magnetic>
            <p className="font-mono text-[10px] uppercase leading-relaxed tracking-[0.2em] text-muted-foreground/60 lg:text-right">
              Crafted with
              <br />
              motion & intent
            </p>
          </div>
        </div>

        {/* bottom bar */}
        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/8 pt-7 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground/70">
            © {new Date().getFullYear()} KINETIC Studio. All rights reserved.
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/50">
            Designed & engineered in-house — no templates, ever
          </p>
        </div>
      </div>
    </footer>
  );
}
