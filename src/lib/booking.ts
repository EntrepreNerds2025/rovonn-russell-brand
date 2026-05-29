// Personal brand booking system.
// Ported from Impact Loop's booking architecture, retuned for founder-facing call types.

export type BookingCallType =
  | "edge-followup"
  | "advisory-discovery"
  | "speaking-inquiry"
  | "adapt-sprint-intro";

export type BookingCallTypeConfig = {
  id: BookingCallType;
  title: string;
  durationMinutes: number;
  durationLabel: string;
  description: string;
  ideal: string;
};

export const BOOKING_CALL_TYPES: BookingCallTypeConfig[] = [
  {
    id: "edge-followup",
    title: "The Edge Follow-up Call",
    durationMinutes: 20,
    durationLabel: "20 minutes · free",
    description:
      "You took The Edge form. I wrote you back. You want to walk through the recommended first move out loud and ask the things easier to ask in conversation than in email.",
    ideal:
      "Founders who already submitted The Edge form and want to skip straight to a working conversation.",
  },
  {
    id: "advisory-discovery",
    title: "Advisory Discovery Call",
    durationMinutes: 30,
    durationLabel: "30 minutes · free",
    description:
      "A no-pressure intro for founders thinking about ongoing AI advisory. We talk through your business, your current bottleneck, and whether ongoing work makes sense.",
    ideal:
      "Founders running 1 to 25-person businesses who want a thinking partner, not a one-off install.",
  },
  {
    id: "speaking-inquiry",
    title: "Speaking Inquiry Call",
    durationMinutes: 30,
    durationLabel: "30 minutes",
    description:
      "Event organizers, conference programmers, and community leaders exploring booking me for a keynote, workshop, fireside, or virtual session.",
    ideal:
      "Anyone planning an event for founders, small business owners, or service-business operators.",
  },
  {
    id: "adapt-sprint-intro",
    title: "ADAPT Strategy Sprint Intro",
    durationMinutes: 45,
    durationLabel: "45 minutes · free",
    description:
      "A focused conversation about a fixed-scope ADAPT Sprint. We run Assess and Discover on your business, hand you a 90-day roadmap, and walk you through the first install.",
    ideal:
      "Founders who want a defined engagement with a clear deliverable, not an open-ended retainer.",
  },
];

export const BOOKING_STEPS = [
  "Choose Call Type",
  "Tell Me About You",
  "Pick a Time",
  "Confirmed",
] as const;

export const CHALLENGE_TYPE_OPTIONS_BY_CALL_TYPE: Record<BookingCallType, readonly string[]> = {
  "edge-followup": [
    "I want to walk through the recommended workflow",
    "I want to talk through alternatives",
    "I want to ask about the bigger picture",
    "Something else",
  ],
  "advisory-discovery": [
    "I'm losing too many hours to admin and delegation gaps",
    "My margin is being squeezed and I need to defend it",
    "I have stalled projects I can't make room for",
    "My team and I are drowning",
    "Something else",
  ],
  "speaking-inquiry": [
    "Conference keynote",
    "Workshop or training session",
    "Virtual webinar or community session",
    "Founder community talk",
    "Fireside or panel",
    "Corporate event or offsite",
    "Something else",
  ],
  "adapt-sprint-intro": [
    "I want my first AI workflow installed properly",
    "I have multiple bottlenecks and want a roadmap",
    "I want a defined engagement, not a retainer",
    "Something else",
  ],
} as const;

export const BUSINESS_SIZE_OPTIONS = [
  "Solo founder",
  "2 to 5 people",
  "6 to 15 people",
  "16 to 50 people",
  "50+ people",
] as const;

export const REFERRAL_SOURCE_OPTIONS = [
  "Google / Search",
  "LinkedIn",
  "Instagram",
  "TikTok",
  "YouTube",
  "Podcast",
  "Word of mouth",
  "Existing client",
  "Took The Edge form",
  "Other",
] as const;

export const getCallTypeConfig = (callType: BookingCallType) =>
  BOOKING_CALL_TYPES.find((item) => item.id === callType) || BOOKING_CALL_TYPES[0];

export const getChallengeTypeOptions = (callType: BookingCallType) =>
  CHALLENGE_TYPE_OPTIONS_BY_CALL_TYPE[callType] || CHALLENGE_TYPE_OPTIONS_BY_CALL_TYPE["edge-followup"];

export const normalizeCallType = (value: string | null): BookingCallType | null => {
  if (!value) return null;
  const cleaned = value.trim().toLowerCase();
  if (cleaned === "edge-followup" || cleaned === "edge") return "edge-followup";
  if (cleaned === "advisory-discovery" || cleaned === "advisory") return "advisory-discovery";
  if (cleaned === "speaking-inquiry" || cleaned === "speaking") return "speaking-inquiry";
  if (cleaned === "adapt-sprint-intro" || cleaned === "sprint") return "adapt-sprint-intro";
  return null;
};

export function trackBookingEvent(eventName: string, payload?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const win = window as Window & {
    gtag?: (...args: unknown[]) => void;
    plausible?: (event: string, options?: { props?: Record<string, unknown> }) => void;
    dataLayer?: unknown[];
  };
  win.gtag?.("event", eventName, payload || {});
  win.plausible?.(eventName, payload ? { props: payload } : undefined);
  win.dataLayer?.push({ event: eventName, ...(payload || {}) });
}

export const formatBookingDateTime = (iso: string, timeZone?: string) =>
  new Intl.DateTimeFormat("en-US", {
    timeZone: timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(new Date(iso));
