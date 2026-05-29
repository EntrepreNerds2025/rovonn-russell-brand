import type { BookingCallType } from "@/lib/booking";

export type IntakePayload = {
  full_name: string;
  email: string;
  business_name: string;
  business_website?: string | null;
  business_size?: string | null;
  challenge_type: string;
  referral_source?: string | null;
  project_context?: string | null;
};

export type BookingLeadRecord = {
  id: string;
  full_name: string;
  email: string;
  business_name: string;
  business_website?: string | null;
  business_size?: string | null;
  challenge_type: string;
  referral_source?: string | null;
  pre_call_answers?: Record<string, unknown> | null;
  call_type: BookingCallType;
  call_duration_min: number;
  status: string;
  cancel_token: string;
  scheduled_at?: string | null;
  meeting_link?: string | null;
};

export type AvailabilitySlot = {
  start: string;
  end: string;
  start_utc: string;
  end_utc: string;
};

export type AvailabilityDay = {
  date: string;
  slots: AvailabilitySlot[];
};
