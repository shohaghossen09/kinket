"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Magnetic } from "./magnetic";
import { scrollToSection, getLenis } from "@/lib/scroll";

const LINKS = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Awards", href: "#awards" },
  { label: "About", href: "#about" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Floating navigation — starts transparent and airy, condenses into a refined
 * glass pill on scroll. Full-screen staggered menu on mobile.
 */
export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 48);
  });

  // lock scroll when the mobile overlay is open
  useEffect(() => {
    const lenis = getLenis();
    if (open) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const go = (href: string) => {
    setOpen(false);
    // wait for the overlay to start closing before scrolling
    setTimeout(() => scrollToSection(href), open ? 350 : 0);
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: EASE, delay: 0.2 }}
        className="fixed inset-x-0 top-0 z-[70] flex justify-center px-4 pt-5 sm:px-6"
      >
        <motion.nav
          aria-label="Primary"
          animate={{
            paddingLeft: scrolled ? 16 : 24,
            paddingRight: scrolled ? 16 : 24,
            paddingTop: scrolled ? 10 : 16,
            paddingBottom: scrolled ? 10 : 16,
            backgroundColor: scrolled ? "rgba(16,16,19,0.72)" : "rgba(16,16,19,0)",
            borderColor: scrolled ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0)",
            backdropFilter: scrolled ? "blur(18px)" : "blur(0px)",
            maxWidth: scrolled ? 920 : 1040,
            marginTop: scrolled ? 6 : 0,
          }}
          transition={{ duration: 0.55, ease: EASE }}
          className="flex w-full items-center justify-between rounded-full border"
          style={{ willChange: "padding, background-color, max-width", maxWidth: 1040 }}
        >
          {/* Logo */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              go("#top");
            }}
            className="font-display text-lg font-semibold tracking-[0.22em] text-foreground"
            aria-label="KINETIC — back to top"
          >
            KINETIC<span className="text-accent">®</span>
          </a>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 lg:flex">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    go(link.href);
                  }}
                  className="group relative rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground"
                >
                  {link.label}
                  <span className="absolute inset-x-4 -bottom-0.5 h-px origin-left scale-x-0 bg-gradient-to-r from-accent-warm to-accent transition-transform duration-300 group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <Magnetic strength={0.3} className="hidden sm:inline-block">
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  go("#contact");
                }}
                className="group inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors duration-300 hover:bg-accent hover:text-accent-foreground"
              >
                Start a Project
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
              </a>
            </Magnetic>

            {/* Mobile trigger */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-foreground lg:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </motion.nav>
      </motion.header>

      {/* Full-screen mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[65] flex flex-col justify-center bg-[#0c0c0e]/97 px-8 backdrop-blur-xl lg:hidden"
          >
            <nav aria-label="Mobile">
              <ul className="space-y-2">
                {LINKS.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, y: 32 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.06, duration: 0.7, ease: EASE }}
                  >
                    <a
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        go(link.href);
                      }}
                      className="group flex items-baseline gap-4 py-3"
                    >
                      <span className="font-mono text-xs text-accent">0{i + 1}</span>
                      <span className="font-display text-4xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-accent sm:text-5xl">
                        {link.label}
                      </span>
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55, duration: 0.6 }}
              className="mt-12"
            >
              <a
                href="mailto:hello@kineticstudio.dev"
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-primary-foreground"
              >
                Start a Project <ArrowUpRight className="h-4 w-4" />
              </a>
              <p className="mt-6 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                hello@kineticstudio.dev
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
