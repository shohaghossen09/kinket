"use client";

import { useState } from "react";
import { SmoothScroll } from "@/components/site/smooth-scroll";
import { Cursor } from "@/components/site/cursor";
import { ScrollProgress } from "@/components/site/scroll-progress";
import { Preloader } from "@/components/site/preloader";
import { Nav } from "@/components/site/nav";
import { Hero } from "@/components/site/hero";
import { Intro } from "@/components/site/intro";
import { Services } from "@/components/site/services";
import { Work } from "@/components/site/work";
import { Showcase } from "@/components/site/showcase";
import { Process } from "@/components/site/process";
import { About } from "@/components/site/about";
import { Stats } from "@/components/site/stats";
import { Testimonials } from "@/components/site/testimonials";
import { Cta } from "@/components/site/cta";
import { Footer } from "@/components/site/footer";

export default function Home() {
  const [ready, setReady] = useState(false);

  return (
    <>
      <SmoothScroll />
      <Cursor />
      <ScrollProgress />
      <Preloader onComplete={() => setReady(true)} />
      <Nav />

      <main id="main" className="relative">
        <Hero ready={ready} />

        <Intro
          text="We are a creative technology studio blending design, engineering and artificial intelligence into products people remember — web platforms, mobile apps, SaaS systems and intelligent experiences, built to move markets."
          highlight={["design,", "engineering", "intelligence", "remember", "move"]}
        />

        <Services />

        <Work />

        <Showcase />

        <Process />

        <About />

        <Stats />

        <Testimonials />

        <Cta />
      </main>

      <Footer />

      {/* film grain */}
      <div className="noise-overlay" aria-hidden="true" />
    </>
  );
}
