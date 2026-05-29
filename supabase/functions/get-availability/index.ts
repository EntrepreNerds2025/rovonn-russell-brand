// Supabase Edge Function: get-availability
// Returns available time slots for the personal brand booking system.
// Reads availability config + existing booked slots from the database.
//
// Env vars required:
//   SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type WeeklyHours = Record<string, [string, string] | null>;

const DAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

// ---- Seeded random (deterministic per day-string + salt) ----------------
// Mulberry32 PRNG. Same seed = same sequence = same slots hidden across refreshes.
function hashSeed(input: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Mark a deterministic subset of slots as hidden (seems_busy).
// Picks indices to hide based on a date-salted seed so the same indices stay hidden
// across page refreshes for any given day.
function applySeemsBusy<T>(
  slots: T[],
  dateIso: string,
  ratio: number,
  salt: string,
): T[] {
  if (ratio <= 0 || slots.length === 0) return slots;
  const seed = hashSeed(`${salt}|${dateIso}`);
  const rng = mulberry32(seed);
  const indices = slots.map((_, i) => i);
  // Fisher-Yates with the seeded RNG
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const toHide = Math.min(
    indices.length - 1, // never hide ALL slots on a day with availability
    Math.floor(slots.length * ratio),
  );
  const hidden = new Set(indices.slice(0, toHide));
  return slots.filter((_, i) => !hidden.has(i));
}

function parseTime(hhmm: string): { h: number; m: number } {
  const [h, m] = hhmm.split(":").map((s) => parseInt(s, 10));
  return { h, m };
}

function buildSlotsForDay(opts: {
  dateIso: string;
  windowStart: string;
  windowEnd: string;
  duration: number;
  step: number;
  bookedUtcStarts: Set<string>;
  bufferBefore: number;
  bufferAfter: number;
  timezone: string;
  now: Date;
  minNoticeHours: number;
}) {
  const slots: { start: string; end: string; start_utc: string; end_utc: string }[] = [];
  const { h: sh, m: sm } = parseTime(opts.windowStart);
  const { h: eh, m: em } = parseTime(opts.windowEnd);

  // Approximate: build slot start times as UTC by treating local time as UTC, then shifting.
  // For a production-grade fix, swap this for a tz-aware library (date-fns-tz, Temporal).
  const dayStart = new Date(`${opts.dateIso}T${pad(sh)}:${pad(sm)}:00.000Z`);
  const dayEnd = new Date(`${opts.dateIso}T${pad(eh)}:${pad(em)}:00.000Z`);

  for (let cursor = dayStart.getTime(); cursor + opts.duration * 60_000 <= dayEnd.getTime(); cursor += opts.step * 60_000) {
    const startUtc = new Date(cursor);
    const endUtc = new Date(cursor + opts.duration * 60_000);

    // Skip slots that don't respect min-notice
    const noticeMs = opts.minNoticeHours * 60 * 60_000;
    if (startUtc.getTime() < opts.now.getTime() + noticeMs) continue;

    // Skip if already booked
    if (opts.bookedUtcStarts.has(startUtc.toISOString())) continue;

    slots.push({
      start: startUtc.toISOString(),
      end: endUtc.toISOString(),
      start_utc: startUtc.toISOString(),
      end_utc: endUtc.toISOString(),
    });
  }
  return slots;
}

function pad(n: number) { return n.toString().padStart(2, "0"); }

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const dateFrom = body.date_from as string;
    const dateTo = body.date_to as string;
    const duration = (body.duration_minutes as number) || 30;

    if (!dateFrom || !dateTo) {
      return new Response(JSON.stringify({ error: "date_from and date_to required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Load config
    const { data: config } = await supabase
      .from("booking_availability_config")
      .select("*")
      .eq("id", 1)
      .single();

    const timezone = config?.timezone || "America/Toronto";
    const weeklyHours: WeeklyHours = config?.weekly_hours || {};
    const step = config?.slot_step_min || 30;
    const bufferBefore = config?.buffer_before_min || 15;
    const bufferAfter = config?.buffer_after_min || 15;
    const minNoticeHours = config?.min_notice_hours || 12;
    const blockedDates: string[] = config?.blocked_dates || [];
    const seemsBusyRatio: number = typeof config?.seems_busy_ratio === "number" ? config.seems_busy_ratio : 0;
    const seemsBusySalt: string = config?.seems_busy_salt || "rovonn";

    // Load already-booked slots in the range
    const { data: booked } = await supabase
      .from("booking_leads")
      .select("scheduled_at")
      .eq("status", "booked")
      .gte("scheduled_at", `${dateFrom}T00:00:00Z`)
      .lte("scheduled_at", `${dateTo}T23:59:59Z`);

    const bookedUtcStarts = new Set<string>((booked || []).map((b: { scheduled_at: string }) => b.scheduled_at));

    // Iterate days from dateFrom to dateTo
    const start = new Date(`${dateFrom}T00:00:00Z`);
    const end = new Date(`${dateTo}T00:00:00Z`);
    const availability: { date: string; slots: { start: string; end: string; start_utc: string; end_utc: string }[] }[] = [];
    const now = new Date();

    for (let d = new Date(start); d.getTime() <= end.getTime(); d.setUTCDate(d.getUTCDate() + 1)) {
      const dateIso = d.toISOString().slice(0, 10);
      const dayName = DAY_KEYS[d.getUTCDay()];

      if (blockedDates.includes(dateIso)) {
        availability.push({ date: dateIso, slots: [] });
        continue;
      }

      const window = weeklyHours[dayName];
      if (!window || !Array.isArray(window) || window.length !== 2) {
        availability.push({ date: dateIso, slots: [] });
        continue;
      }

      const allSlots = buildSlotsForDay({
        dateIso,
        windowStart: window[0],
        windowEnd: window[1],
        duration,
        step,
        bookedUtcStarts,
        bufferBefore,
        bufferAfter,
        timezone,
        now,
        minNoticeHours,
      });

      // Apply seems-busy mode (deterministic per-day filtering)
      const slots = applySeemsBusy(allSlots, dateIso, seemsBusyRatio, seemsBusySalt);

      availability.push({ date: dateIso, slots });
    }

    return new Response(JSON.stringify({ timezone, availability }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("get-availability error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
