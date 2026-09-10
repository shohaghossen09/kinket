"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  ChevronDown,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";
import { Magnetic } from "./magnetic";

const EASE = [0.16, 1, 0.3, 1] as const;

const BUDGETS = ["Under $10k", "$10k — $25k", "$25k — $50k", "$50k — $100k", "$100k+", "To be discussed"];

type Status = "idle" | "sending" | "success" | "error";

/**
 * Contact — full-screen closing act with a working lead form.
 * Fields animate a gradient underline on focus; submission runs through
 * /api/contact (zod-validated, honeypotted, rate-limited) and persists
 * to SQLite via Prisma. Success swaps the form for an animated receipt.
 */
export function Contact() {
  const reduced = useReducedMotion();
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    budget: "",
    message: "",
    website: "", // honeypot
  });

  const set = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (res.ok && data.ok) {
        setStatus("success");
      } else {
        setErrorMsg(data.error ?? "Something went wrong — please try again.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network hiccup — please check your connection and retry.");
      setStatus("error");
    }
  }

  const fieldAnim = (d: number) => ({
    initial: reduced ? false : { opacity: 0, y: 22 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-8% 0px" },
    transition: { duration: 0.7, ease: EASE, delay: d },
  });

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative overflow-hidden py-28 sm:py-36"
    >
      {/* atmosphere */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_20%_0%,#121216_0%,#0a0a0b_55%)]" />
        <div className="absolute -left-[12%] top-[15%] h-[36vw] w-[36vw] rounded-full bg-[radial-gradient(circle,rgba(255,194,75,0.08),transparent_65%)] blur-2xl" />
        <div className="absolute -right-[10%] bottom-[5%] h-[30vw] w-[30vw] rounded-full bg-[radial-gradient(circle,rgba(232,93,117,0.07),transparent_65%)] blur-2xl" />
        <div className="absolute inset-0 bg-grid opacity-25 mask-fade-b" />
      </div>

      <div className="relative mx-auto grid max-w-7xl gap-16 px-6 sm:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        {/* -------- left: pitch + details -------- */}
        <div>
          <motion.p
            {...fieldAnim(0)}
            className="mb-5 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.32em] text-accent"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Currently booking — Q4 2026
          </motion.p>

          <motion.h2
            {...fieldAnim(0.08)}
            id="contact-heading"
            className="font-display text-[clamp(2.6rem,6.4vw,5.4rem)] font-semibold leading-[1.02] tracking-[-0.02em]"
          >
            LET&apos;S
            <br />
            <span className="font-serif-accent italic font-normal text-gradient">talk.</span>
          </motion.h2>

          <motion.p {...fieldAnim(0.16)} className="mt-7 max-w-md text-base leading-relaxed text-muted-foreground">
            One conversation is usually enough to know if we fit. Tell us what
            you&apos;re building — we&apos;ll reply within one business day with
            honest thoughts, a rough timeline and zero sales theatre.
          </motion.p>

          <motion.ul {...fieldAnim(0.24)} className="mt-12 space-y-5">
            {[
              { icon: Mail, label: "hello@kineticstudio.dev", href: "mailto:hello@kineticstudio.dev" },
              { icon: Phone, label: "+1 (415) 555-0134", href: "tel:+14155550134" },
              { icon: MapPin, label: "Lisbon · Tokyo · New York", href: undefined },
            ].map((row) => (
              <li key={row.label}>
                <a
                  href={row.href ?? "#contact"}
                  onClick={row.href ? undefined : (e) => e.preventDefault()}
                  className="group inline-flex items-center gap-4 text-muted-foreground transition-colors duration-300 hover:text-foreground"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 transition-all duration-400 group-hover:border-accent/50 group-hover:text-accent">
                    <row.icon className="h-4 w-4" />
                  </span>
                  <span className="font-mono text-sm tracking-wide">{row.label}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
                </a>
              </li>
            ))}
          </motion.ul>
        </div>

        {/* -------- right: form / success -------- */}
        <motion.div {...fieldAnim(0.2)} className="relative">
          <div className="glass-panel relative overflow-hidden rounded-3xl p-7 sm:p-10">
            {/* top gradient hairline */}
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent"
            />

            <AnimatePresence mode="wait">
              {status === "success" ? (
                /* ---------- success receipt ---------- */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 26 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="flex min-h-[430px] flex-col items-center justify-center text-center"
                  role="status"
                >
                  <motion.svg
                    viewBox="0 0 64 64"
                    className="h-20 w-20"
                    initial={false}
                    aria-hidden="true"
                  >
                    <motion.circle
                      cx="32" cy="32" r="29" fill="none"
                      stroke="url(#contact-ok)" strokeWidth="2.5"
                      initial={reduced ? false : { pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.9, ease: EASE }}
                    />
                    <motion.path
                      d="M20 33.5 28.5 42 45 24" fill="none"
                      stroke="url(#contact-ok)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                      initial={reduced ? false : { pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.55, ease: EASE, delay: 0.55 }}
                    />
                    <defs>
                      <linearGradient id="contact-ok" x1="0" y1="0" x2="64" y2="64">
                        <stop offset="0%" stopColor="#ffc24b" />
                        <stop offset="55%" stopColor="#ff6a3d" />
                        <stop offset="100%" stopColor="#e85d75" />
                      </linearGradient>
                    </defs>
                  </motion.svg>

                  <h3 className="mt-8 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                    Message <span className="font-serif-accent italic font-normal text-gradient">received.</span>
                  </h3>
                  <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
                    Thank you, {form.name.split(" ")[0] || "friend"} — your brief
                    is already on its way to the studio. Expect a reply within
                    one business day.
                  </p>
                  <button
                    onClick={() => {
                      setForm({ name: "", email: "", company: "", budget: "", message: "", website: "" });
                      setStatus("idle");
                    }}
                    className="mt-9 rounded-full border border-white/15 px-7 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground transition-colors duration-300 hover:border-accent/50 hover:text-accent"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                /* ---------- the form ---------- */
                <motion.form
                  key="form"
                  onSubmit={onSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  noValidate={false}
                  className="space-y-8"
                >
                  <div className="grid gap-8 sm:grid-cols-2">
                    <label className="kinetic-field group block">
                      <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground transition-colors duration-300 group-focus-within:text-accent">
                        Name *
                      </span>
                      <input
                        required
                        minLength={2}
                        value={form.name}
                        onChange={set("name")}
                        type="text"
                        name="name"
                        autoComplete="name"
                        placeholder="Ada Lovelace"
                        className="kinetic-input"
                      />
                    </label>

                    <label className="kinetic-field group block">
                      <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground transition-colors duration-300 group-focus-within:text-accent">
                        Email *
                      </span>
                      <input
                        required
                        type="email"
                        name="email"
                        autoComplete="email"
                        value={form.email}
                        onChange={set("email")}
                        placeholder="ada@analytical.engine"
                        className="kinetic-input"
                      />
                    </label>
                  </div>

                  <div className="grid gap-8 sm:grid-cols-2">
                    <label className="kinetic-field group block">
                      <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground transition-colors duration-300 group-focus-within:text-accent">
                        Company
                      </span>
                      <input
                        type="text"
                        name="company"
                        autoComplete="organization"
                        value={form.company}
                        onChange={set("company")}
                        placeholder="Optional"
                        className="kinetic-input"
                      />
                    </label>

                    <label className="kinetic-field group block">
                      <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground transition-colors duration-300 group-focus-within:text-accent">
                        Budget
                      </span>
                      <span className="relative block">
                        <select
                          name="budget"
                          value={form.budget}
                          onChange={set("budget")}
                          className="kinetic-input appearance-none pr-8 [&>option]:bg-[#101013] [&>option]:text-foreground"
                        >
                          <option value="">Select a range</option>
                          {BUDGETS.map((b) => (
                            <option key={b} value={b}>
                              {b}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-1 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      </span>
                    </label>
                  </div>

                  <label className="kinetic-field group block">
                    <span className="mb-1 block font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground transition-colors duration-300 group-focus-within:text-accent">
                      Tell us about the project *
                    </span>
                    <textarea
                      required
                      minLength={10}
                      name="message"
                      rows={5}
                      value={form.message}
                      onChange={set("message")}
                      placeholder="What are we building, and what does success look like?"
                      className="kinetic-input resize-none"
                    />
                  </label>

                  {/* honeypot — invisible to humans, catnip to bots */}
                  <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                    <label>
                      Website
                      <input
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        value={form.website}
                        onChange={set("website")}
                      />
                    </label>
                  </div>

                  <AnimatePresence>
                    {status === "error" && (
                      <motion.p
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-[#ff8f8f]"
                        role="alert"
                      >
                        {errorMsg}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <div className="flex flex-wrap items-center justify-between gap-5 pt-2">
                    <p className="max-w-[240px] font-mono text-[10px] uppercase leading-relaxed tracking-[0.18em] text-muted-foreground/70">
                      NDA-friendly · Reply within 1 business day
                    </p>

                    <Magnetic strength={0.28}>
                      <button
                        type="submit"
                        disabled={status === "sending"}
                        className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-foreground px-8 py-4 text-sm font-semibold text-primary-foreground transition-colors duration-500 hover:text-accent-foreground disabled:cursor-wait disabled:opacity-70"
                      >
                        <span className="absolute inset-0 translate-y-full bg-gradient-to-r from-accent-warm via-accent to-[#e85d75] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0" />
                        {status === "sending" ? (
                          <>
                            <Loader2 className="relative z-10 h-4 w-4 animate-spin" />
                            <span className="relative z-10">Sending…</span>
                          </>
                        ) : (
                          <>
                            <span className="relative z-10">Send Message</span>
                            <Send className="relative z-10 h-4 w-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                          </>
                        )}
                      </button>
                    </Magnetic>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
