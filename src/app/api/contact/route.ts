import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Please tell us your name.").max(120),
  email: z.string().trim().email("That email doesn't look right.").max(200),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  budget: z.string().trim().max(40).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, "Give us a little more detail — 10 characters minimum.")
    .max(4000),
  website: z.string().max(0).optional().or(z.literal("")), // honeypot — must stay empty
});

/* --- naive in-memory rate limit: 3 submissions / 10 min / IP --- */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 3;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) return true;
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // safety valve
  return false;
}

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";

    if (rateLimited(ip)) {
      return NextResponse.json(
        { ok: false, error: "Too many messages — please try again a little later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      const first = parsed.error.issues[0]?.message ?? "Invalid submission.";
      return NextResponse.json({ ok: false, error: first }, { status: 400 });
    }

    const { name, email, company, budget, message, website } = parsed.data;

    /* honeypot filled → silently accept (bots get a warm smile, no data) */
    if (website) {
      return NextResponse.json({ ok: true });
    }

    await db.lead.create({
      data: {
        name,
        email,
        company: company || null,
        budget: budget || null,
        message,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[/api/contact] failed:", error);
    return NextResponse.json(
      { ok: false, error: "Something broke on our side — please email hello@kineticstudio.dev." },
      { status: 500 }
    );
  }
}
