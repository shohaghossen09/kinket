"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Asterisk } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const ROW_A = [
  "Creative Technology",
  "WebGL Experiences",
  "Motion Design",
  "AI Solutions",
  "SaaS Platforms",
  "Digital Products",
];

const ROW_B = [
  "Design Systems",
  "3D Interaction",
  "Mobile Apps",
  "E-Commerce",
  "Brand Worlds",
  "SEO & Growth",
];

/**
 * Velocity-reactive marquee ribbon.
 * Two counter-scrolling typographic bands that speed up and shear
 * with the user's scroll velocity (GSAP ScrollTrigger), then settle back.
 * Purely decorative — hidden from assistive tech.
 */
export function Marquee() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      const tracks = gsap.utils.toArray<HTMLElement>("[data-marquee-track]");
      const tweens: gsap.core.Tween[] = [];

      tracks.forEach((track, i) => {
        const forward = track.dataset.marqueeTrack === "a";
        const tween = gsap.fromTo(
          track,
          { xPercent: forward ? 0 : -50 },
          {
            xPercent: forward ? -50 : 0,
            duration: 26 + i * 6,
            ease: "none",
            repeat: -1,
          }
        );
        tweens.push(tween);
      });

      /* --- scroll-velocity reaction: boost + shear, then decay --- */
      const proxy = { skew: 0, boost: 0 };
      const skewSetter = gsap.quickSetter(tracks, "skewX", "deg");

      ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const v = self.getVelocity();
          const skew = gsap.utils.clamp(-8, 8, v / -320);
          const boost = gsap.utils.clamp(0, 3.2, Math.abs(v) / 900);

          const changed = Math.abs(skew) > Math.abs(proxy.skew) || boost > proxy.boost;
          if (changed) {
            proxy.skew = skew;
            proxy.boost = boost;
            gsap.to(tweens, {
              timeScale: 1 + proxy.boost,
              duration: 0.35,
              overwrite: true,
            });
            gsap.to(proxy, {
              skew: 0,
              boost: 0,
              duration: 0.9,
              ease: "power3.out",
              overwrite: true,
              onUpdate: () => {
                skewSetter(proxy.skew);
                gsap.to(tweens, { timeScale: 1 + proxy.boost, duration: 0.1, overwrite: true });
              },
            });
            skewSetter(proxy.skew);
          }
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const renderRow = (items: string[], dir: "a" | "b", outline: boolean) => (
    <div className="marquee-row overflow-hidden">
      <div
        data-marquee-track={dir}
        className="flex w-max items-center whitespace-nowrap will-change-transform"
      >
        {[...items, ...items].map((item, i) => (
          <span key={i} className="flex items-center">
            <span
              className={`font-display text-[clamp(2rem,5.4vw,4.6rem)] font-semibold uppercase leading-none tracking-tight ${
                outline ? "text-outline" : "text-foreground"
              }`}
            >
              {item}
            </span>
            <Asterisk
              className={`mx-8 h-[0.55em] w-[0.55em] shrink-0 ${outline ? "text-accent/60" : "text-accent"}`}
              strokeWidth={2.5}
            />
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="relative select-none overflow-hidden border-y border-white/8 bg-[#0c0c0e] py-10 sm:py-14"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-background to-transparent" />
      <div className="flex flex-col gap-6 sm:gap-10 [transform:rotate(-1.2deg)]">
        {renderRow(ROW_A, "a", false)}
        {renderRow(ROW_B, "b", true)}
      </div>
    </div>
  );
}
