"use client";

import Lenis from "lenis";

/**
 * Module-level Lenis singleton so any component can trigger smooth
 * programmatic scrolling without prop drilling.
 */
let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

export function getLenis() {
  return lenis;
}

/** Smooth-scroll to a section id (e.g. "#work") with nav offset. */
export function scrollToSection(hash: string) {
  const target = document.querySelector(hash);
  if (!target) return;

  if (lenis) {
    lenis.scrollTo(target as HTMLElement, { offset: -72, duration: 1.6 });
  } else {
    (target as HTMLElement).scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

/** Scroll back to the very top of the page. */
export function scrollToTop() {
  if (lenis) {
    lenis.scrollTo(0, { duration: 1.6 });
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}
