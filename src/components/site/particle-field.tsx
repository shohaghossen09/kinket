"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  accent: boolean;
}

const ACCENT = [255, 138, 61];
const WARM = [255, 194, 75];
const WHITE = [244, 243, 239];

/**
 * Canvas-based 3D particle constellation.
 * - Perspective projection with depth-based scale/opacity
 * - Slow autonomous drift + scroll-linked camera roll (fly-through feel)
 * - Subtle mouse parallax; connections drawn between near neighbours
 * - Performance: DPR capped, paused off-screen & on hidden tabs,
 *   particle count scales with viewport, single static frame when
 *   prefers-reduced-motion.
 */
export function ParticleField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles: Particle[] = [];
    let rafId = 0;
    let running = true;
    let inView = true;
    let scrollNorm = 0;
    const mouse = { x: 0.5, y: 0.5, active: false };
    const FOV = 900;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seed = () => {
      const area = Math.max(width * height, 1);
      // ~1 particle per 9000px², clamped 60–170
      const count = Math.min(170, Math.max(60, Math.round(area / 9000)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 1200,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        vz: (Math.random() - 0.5) * 0.18,
        size: Math.random() * 1.6 + 0.4,
        accent: Math.random() < 0.16,
      }));
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const time = t / 1000;

      // camera drift + scroll-linked roll — the "fly-through"
      const scrollRoll = scrollNorm * 0.35;
      const camX = cx + Math.sin(time * 0.08) * 30 + (mouse.active ? (mouse.x - 0.5) * -34 : 0);
      const camY = cy + Math.cos(time * 0.06) * 20 + (mouse.active ? (mouse.y - 0.5) * -24 : 0);

      const projected = particles.map((p) => {
        if (!reduced) {
          p.x += p.vx;
          p.y += p.vy;
          p.z += p.vz;

          // wrap the depth box so the field is endless
          if (p.z > 1200) p.z -= 1200;
          if (p.z < 0) p.z += 1200;
          if (p.x < -50) p.x = width + 50;
          if (p.x > width + 50) p.x = -50;
          if (p.y < -50) p.y = height + 50;
          if (p.y > height + 50) p.y = -50;
        }

        const scale = FOV / (FOV + p.z);
        const depth = 1 - p.z / 1200; // 1 near, 0 far

        // gentle global roll tied to scroll progress
        const angle = scrollRoll;
        const dx = p.x - cx;
        const dy = p.y - cy;
        const rx = cx + dx * Math.cos(angle) - dy * Math.sin(angle);
        const ry = cy + dx * Math.sin(angle) + dy * Math.cos(angle);

        return {
          sx: rx + (camX - cx) * depth,
          sy: ry + (camY - cy) * depth,
          scale,
          depth,
          p,
        };
      });

      // connections (near neighbours only)
      const maxDist = Math.min(width, height) * 0.14;
      ctx.lineWidth = 0.6;
      for (let i = 0; i < projected.length; i++) {
        const a = projected[i];
        if (a.depth < 0.18) continue;
        for (let j = i + 1; j < projected.length; j++) {
          const b = projected[j];
          if (b.depth < 0.18) continue;
          const dx = a.sx - b.sx;
          const dy = a.sy - b.sy;
          const d2 = dx * dx + dy * dy;
          if (d2 < maxDist * maxDist) {
            const alpha = (1 - Math.sqrt(d2) / maxDist) * 0.34 * Math.min(a.depth, b.depth);
            ctx.strokeStyle = `rgba(244,243,239,${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.sx, a.sy);
            ctx.lineTo(b.sx, b.sy);
            ctx.stroke();
          }
        }
      }

      // particles
      for (const { sx, sy, scale, depth, p } of projected) {
        const r = p.size * scale;
        if (r <= 0.15) continue;
        const alpha = 0.14 + depth * 0.62;
        const [cr, cg, cb] = p.accent ? (Math.random() < 2 ? ACCENT : WARM) : WHITE;
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${alpha})`;
        ctx.beginPath();
        ctx.arc(sx, sy, r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = (t: number) => {
      if (running && inView) draw(t);
      rafId = requestAnimationFrame(loop);
    };

    const onScroll = () => {
      const doc = document.documentElement;
      const max = Math.max(doc.scrollHeight - window.innerHeight, 1);
      scrollNorm = window.scrollY / max;
    };

    const onMouse = (e: MouseEvent) => {
      mouse.x = e.clientX / window.innerWidth;
      mouse.y = e.clientY / window.innerHeight;
      mouse.active = true;
    };

    resize();
    seed();
    onScroll();

    if (reduced) {
      draw(0); // single static frame
    } else {
      rafId = requestAnimationFrame(loop);
      window.addEventListener("mousemove", onMouse, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    const onResize = () => {
      resize();
      seed();
      if (reduced) draw(0);
    };
    window.addEventListener("resize", onResize);

    const io = new IntersectionObserver(
      (entries) => {
        inView = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    const onVisibility = () => {
      running = !document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      io.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
