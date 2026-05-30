import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  BUSINESS_SIZE_OPTIONS,
  getChallengeTypeOptions,
  getCallTypeConfig,
  REFERRAL_SOURCE_OPTIONS,
  trackBookingEvent,
  type BookingCallType,
} from "@/lib/booking";
import type { BookingLeadRecord, IntakePayload } from "./types";
import { ArrowRight } from "lucide-react";

type IntakeFormProps = {
  callType: BookingCallType;
  callDurationMin: number;
  onComplete: (lead: BookingLeadRecord) => void;
};

const SUPABASE_FUNCTIONS_URL = (import.meta as ImportMeta).env?.VITE_SUPABASE_FUNCTIONS_URL || "";

const IntakeForm = ({ callType, callDurationMin, onComplete }: IntakeFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<IntakePayload>({
    full_name: "",
    email: "",
    business_name: "",
    business_website: "",
    business_size: "",
    challenge_type: "",
    referral_source: "",
    project_context: "",
  });

  const callConfig = getCallTypeConfig(callType);
  const challengeOptions = getChallengeTypeOptions(callType);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!form.full_name.trim()) return "Please enter your full name.";
    if (!form.email.trim()) return "Please enter your email.";
    if (!form.business_name.trim()) return "Please enter your business name.";
    if (!form.challenge_type) return "Please select what brought you here.";
    return null;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        business_name: form.business_name.trim(),
        business_website: form.business_website?.trim() || null,
        business_size: form.business_size || null,
        challenge_type: form.challenge_type,
        referral_source: form.referral_source || null,
        pre_call_answers: form.project_context?.trim()
          ? { project_context: form.project_context.trim() }
          : null,
        call_type: callType,
        call_duration_min: callDurationMin,
      };

      const res = await fetch(`${SUPABASE_FUNCTIONS_URL}/create-booking-lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Could not save your intake.");

      const data = await res.json();
      if (!data?.lead) throw new Error("Intake response missing lead.");

      trackBookingEvent("booking_intake_completed", { call_type: callType });
      onComplete(data.lead as BookingLeadRecord);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-card border border-border rounded-md p-6 md:p-8">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-accent-deep block mb-2">Full name *</label>
          <input
            name="full_name"
            type="text"
            value={form.full_name}
            onChange={handleChange}
            required
            className="w-full bg-background border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:border-accent-deep transition-colors"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-accent-deep block mb-2">Email *</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full bg-background border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:border-accent-deep transition-colors"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-accent-deep block mb-2">Business name *</label>
          <input
            name="business_name"
            type="text"
            value={form.business_name}
            onChange={handleChange}
            required
            className="w-full bg-background border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:border-accent-deep transition-colors"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-accent-deep block mb-2">Business website</label>
          <input
            name="business_website"
            type="url"
            placeholder="https://"
            value={form.business_website || ""}
            onChange={handleChange}
            className="w-full bg-background border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:border-accent-deep transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-accent-deep block mb-2">Business size</label>
        <select
          name="business_size"
          value={form.business_size || ""}
          onChange={handleChange}
          className="w-full bg-background border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:border-accent-deep transition-colors appearance-none cursor-pointer"
        >
          <option value="">Pick one</option>
          {BUSINESS_SIZE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-accent-deep block mb-2">What brought you to {callConfig.title}? *</label>
        <select
          name="challenge_type"
          value={form.challenge_type}
          onChange={handleChange}
          required
          className="w-full bg-background border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:border-accent-deep transition-colors appearance-none cursor-pointer"
        >
          <option value="">Pick the closest match</option>
          {challengeOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-accent-deep block mb-2">Anything else you want me to know?</label>
        <textarea
          name="project_context"
          rows={3}
          value={form.project_context || ""}
          onChange={handleChange}
          placeholder="Optional. Specific context, timing, or constraints worth flagging before we talk."
          className="w-full bg-background border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:border-accent-deep transition-colors resize-none"
        />
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-accent-deep block mb-2">How did you find me?</label>
        <select
          name="referral_source"
          value={form.referral_source || ""}
          onChange={handleChange}
          className="w-full bg-background border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:border-accent-deep transition-colors appearance-none cursor-pointer"
        >
          <option value="">Pick one (optional)</option>
          {REFERRAL_SOURCE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" variant="hero" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? "Saving..." : "Continue to time picker"} <ArrowRight className="ml-2" size={16} />
      </Button>
    </form>
  );
};

export default IntakeForm;
