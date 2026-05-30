import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, Sparkles, Users, Mic, Layers } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { setSEO, resetSEO } from "@/lib/seo";
import StepIndicator from "@/components/bookings/StepIndicator";
import IntakeForm from "@/components/bookings/IntakeForm";
import AvailabilityPicker from "@/components/bookings/AvailabilityPicker";
import type { AvailabilitySlot, BookingLeadRecord } from "@/components/bookings/types";
import {
  BOOKING_CALL_TYPES,
  BOOKING_STEPS,
  getCallTypeConfig,
  normalizeCallType,
  trackBookingEvent,
  type BookingCallType,
} from "@/lib/booking";

const callTypeIcons: Record<BookingCallType, typeof Sparkles> = {
  "edge-followup": Sparkles,
  "advisory-discovery": Users,
  "speaking-inquiry": Mic,
  "adapt-sprint-intro": Layers,
};

const SUPABASE_FUNCTIONS_URL = (import.meta as ImportMeta).env?.VITE_SUPABASE_FUNCTIONS_URL || "";

const Bookings = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const preselectedCallType = useMemo(
    () => normalizeCallType(searchParams.get("type")),
    [searchParams],
  );

  const [selectedCallType, setSelectedCallType] = useState<BookingCallType | null>(preselectedCallType);
  const [currentStep, setCurrentStep] = useState(preselectedCallType ? 2 : 1);
  const [bookingLead, setBookingLead] = useState<BookingLeadRecord | null>(null);
  const [isCreatingBooking, setIsCreatingBooking] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  useEffect(() => {
    setSEO({
      title: "Book a Call | Rovonn Russell",
      description:
        "Book a call with Rovonn. The Edge follow-up, Advisory discovery, Speaking inquiry, or ADAPT Sprint intro. Real availability, no Calendly back-and-forth.",
      path: "/book",
    });
    return resetSEO;
  }, []);

  useEffect(() => {
    if (!preselectedCallType) return;
    setSelectedCallType(preselectedCallType);
    setCurrentStep((prev) => (prev < 2 ? 2 : prev));
  }, [preselectedCallType]);

  const selectedCallConfig = selectedCallType ? getCallTypeConfig(selectedCallType) : null;

  const handleSelectCallType = (callType: BookingCallType) => {
    trackBookingEvent("booking_call_type_selected", { call_type: callType });
    setSelectedCallType(callType);
    setCurrentStep(2);
    setBookingLead(null);
  };

  const handleIntakeComplete = (lead: BookingLeadRecord) => {
    setBookingLead(lead);
    setCurrentStep(3);
  };

  const handleConfirmSlot = async (slot: AvailabilitySlot) => {
    if (!bookingLead?.id) {
      setBookingError("Please complete the intake form first.");
      return;
    }

    setIsCreatingBooking(true);
    setBookingError(null);

    try {
      const res = await fetch(`${SUPABASE_FUNCTIONS_URL}/create-booking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          booking_lead_id: bookingLead.id,
          selected_slot: slot.start_utc,
        }),
      });

      if (!res.ok) throw new Error("Failed to book this slot.");

      const data = await res.json();
      const booking = data?.booking;
      if (!booking?.cancel_token || !booking?.scheduled_at) {
        throw new Error("Booking response missing required details.");
      }

      const params = new URLSearchParams({
        token: booking.cancel_token,
        scheduled: booking.scheduled_at,
        callType: booking.call_type || selectedCallType || "edge-followup",
        callTypeLabel: booking.call_type_label || selectedCallConfig?.title || "Call",
        name: booking.full_name || bookingLead.full_name,
        meeting: booking.meeting_link || "",
      });

      trackBookingEvent("booking_confirmed", { call_type: selectedCallType });
      navigate(`/booking-confirmed?${params.toString()}`);
    } catch (err) {
      console.error(err);
      setBookingError(err instanceof Error ? err.message : "Could not complete booking.");
    } finally {
      setIsCreatingBooking(false);
    }
  };

  const renderStepContent = () => {
    if (currentStep === 1 || !selectedCallType) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {BOOKING_CALL_TYPES.map((type) => {
            const Icon = callTypeIcons[type.id];
            return (
              <article key={type.id} className="bg-card border border-border rounded-md p-7 hover:border-accent/40 transition-colors flex flex-col">
                <div className="w-12 h-12 rounded-md bg-accent/10 flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6 text-accent-deep" />
                </div>
                <h3 className="font-serif text-2xl font-semibold text-foreground mb-2 leading-tight">{type.title}</h3>
                <p className="text-accent-deep text-sm font-medium mb-4">{type.durationLabel}</p>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{type.description}</p>
                <p className="text-muted-foreground/80 text-xs mb-6 flex-grow">
                  <span className="font-semibold">Ideal for:</span> {type.ideal}
                </p>
                <Button variant="hero" onClick={() => handleSelectCallType(type.id)}>
                  Choose this call
                </Button>
              </article>
            );
          })}
        </div>
      );
    }

    if (currentStep === 2) {
      return (
        <div className="space-y-5">
          <div className="rounded-md border border-border bg-card p-5">
            <p className="text-xs uppercase tracking-widest text-accent-deep mb-2 font-semibold">Selected call type</p>
            <p className="font-serif text-2xl text-foreground">{selectedCallConfig?.title}</p>
            <p className="text-sm text-muted-foreground mt-1">{selectedCallConfig?.durationLabel}</p>
          </div>
          <IntakeForm
            callType={selectedCallType}
            callDurationMin={selectedCallConfig?.durationMinutes || 30}
            onComplete={handleIntakeComplete}
          />
          {!preselectedCallType && (
            <button
              className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-2"
              onClick={() => setCurrentStep(1)}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to call types
            </button>
          )}
        </div>
      );
    }

    if (currentStep === 3) {
      return (
        <div className="space-y-5">
          <div className="rounded-md border border-accent-deep/40 bg-accent/10 p-4 text-sm">
            <p className="font-semibold inline-flex items-center gap-2 text-foreground">
              <CheckCircle2 className="w-4 h-4 text-accent-deep" />
              Intake complete
            </p>
            <p className="mt-1 text-muted-foreground">
              Booking for <strong className="text-foreground">{bookingLead?.full_name}</strong> at{" "}
              <strong className="text-foreground">{bookingLead?.business_name}</strong>.
            </p>
          </div>

          <AvailabilityPicker
            durationMinutes={selectedCallConfig?.durationMinutes || bookingLead?.call_duration_min || 30}
            onConfirm={handleConfirmSlot}
            confirmLabel={isCreatingBooking ? "Booking..." : "Confirm Booking"}
          />

          {bookingError && <p className="text-sm text-destructive">{bookingError}</p>}

          <button
            className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-2"
            onClick={() => setCurrentStep(2)}
            disabled={isCreatingBooking}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to intake
          </button>
        </div>
      );
    }

    return null;
  };

  return (
    <main>
      <section className="section-padding pt-32 md:pt-40 pb-12">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-6">Book a call</p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold leading-[1.05] mb-7">
            Pick the call, share context, <span className="italic text-accent-highlight">reserve a time.</span>
          </h1>
          <p className="text-lg md:text-2xl text-muted-foreground max-w-3xl leading-relaxed">
            Real availability on my actual calendar. No back-and-forth, no Calendly link sent to your email, no "let me check and get back to you."
          </p>
        </div>
      </section>

      <section className="section-padding bg-secondary py-12 md:py-16">
        <div className="max-w-5xl mx-auto space-y-8">
          <StepIndicator steps={BOOKING_STEPS} currentStep={currentStep} />
          {renderStepContent()}
        </div>
      </section>

      <section className="section-padding py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-serif font-bold leading-tight mb-8">What to expect.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div>
              <div className="w-8 h-8 rounded-full bg-accent-deep text-background flex items-center justify-center font-bold mb-4">1</div>
              <h4 className="font-semibold text-foreground mb-2">I read up first</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">Before we get on, I review the intake and your business. You don't have to brief me from scratch.</p>
            </div>
            <div>
              <div className="w-8 h-8 rounded-full bg-accent-deep text-background flex items-center justify-center font-bold mb-4">2</div>
              <h4 className="font-semibold text-foreground mb-2">We talk straight</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">No sales script. We work the question. If something else fits better than what you booked, I'll say so.</p>
            </div>
            <div>
              <div className="w-8 h-8 rounded-full bg-accent-deep text-background flex items-center justify-center font-bold mb-4">3</div>
              <h4 className="font-semibold text-foreground mb-2">You leave with a move</h4>
              <p className="text-muted-foreground text-sm leading-relaxed">A clear next step, even if it's not us working together. You're not walking out empty-handed.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Bookings;
