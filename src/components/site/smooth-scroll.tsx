"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setLenis } from "@/lib/scroll";

/**
 * Lenis smooth scrolling — cinematic inertia on wheel input.
 * Drives GSAP ScrollTrigger so both systems share one clock.
 * Disabled for reduced-motion users and left off for native touch scrolling
 * (mobile keeps platform momentum scrolling for performance and feel).
 */
export function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
      smoothWheel: true,
    });

    setLenis(lenis);

    /* --- Lenis ⟷ GSAP: single source of truth for scroll --- */
    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => {
      lenis.raf(time * 1000); // gsap ticker is seconds, lenis wants ms
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const onVisibility = () => {
      if (document.hidden) {
        gsap.ticker.remove(raf);
      } else {
        gsap.ticker.add(raf);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      gsap.ticker.remove(raf);
      lenis.off("scroll", ScrollTrigger.update);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
