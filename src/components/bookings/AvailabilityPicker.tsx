import { useEffect, useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AvailabilityDay, AvailabilitySlot } from "./types";

type AvailabilityPickerProps = {
  durationMinutes: number;
  onConfirm: (slot: AvailabilitySlot) => Promise<void> | void;
  confirmLabel?: string;
};

type AvailabilityResponse = {
  timezone: string;
  availability: AvailabilityDay[];
};

const SUPABASE_FUNCTIONS_URL = (import.meta as ImportMeta).env?.VITE_SUPABASE_FUNCTIONS_URL || "";

const toIsoDate = (date: Date) => date.toISOString().slice(0, 10);

const formatDayLabel = (dateString: string) => {
  const date = new Date(`${dateString}T00:00:00Z`);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
};

const formatSlotLocalTime = (iso: string, timeZone: string) =>
  new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone,
  }).format(new Date(iso));

const AvailabilityPicker = ({
  durationMinutes,
  onConfirm,
  confirmLabel = "Confirm Booking",
}: AvailabilityPickerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availability, setAvailability] = useState<AvailabilityDay[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
  const [businessTimezone, setBusinessTimezone] = useState("America/Toronto");
  const [error, setError] = useState<string | null>(null);

  const viewerTimezone = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,
    [],
  );

  const loadAvailability = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const now = new Date();
      const dateFrom = toIsoDate(now);
      const dateTo = toIsoDate(new Date(now.getTime() + 13 * 24 * 60 * 60 * 1000));

      const res = await fetch(`${SUPABASE_FUNCTIONS_URL}/get-availability`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date_from: dateFrom,
          date_to: dateTo,
          duration_minutes: durationMinutes,
        }),
      });
      if (!res.ok) throw new Error("Unable to load availability.");
      const payload = (await res.json()) as AvailabilityResponse;

      setAvailability(payload?.availability || []);
      setBusinessTimezone(payload?.timezone || "America/Toronto");
      setSelectedDate((current) => {
        if (current && (payload?.availability || []).some((d) => d.date === current)) {
          return current;
        }
        const firstWithSlots = (payload?.availability || []).find((d) => d.slots.length > 0);
        return firstWithSlots?.date || payload?.availability?.[0]?.date || null;
      });
      setSelectedSlot(null);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to load availability.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAvailability();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [durationMinutes]);

  const selectedDay = availability.find((day) => day.date === selectedDate) || null;

  const handleConfirm = async () => {
    if (!selectedSlot) return;
    setIsSubmitting(true);
    try {
      await onConfirm(selectedSlot);
      setSelectedSlot(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-md p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="font-serif text-2xl text-foreground font-semibold">Pick a Time</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Times in your timezone ({viewerTimezone}). My hours are aligned to {businessTimezone}.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-md text-xs hover:border-accent-deep/40 transition-colors"
          onClick={loadAvailability}
          disabled={isLoading || isSubmitting}
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {error && <p className="text-sm text-destructive mb-4">{error}</p>}

      {isLoading ? (
        <div className="space-y-3">
          <div className="h-10 rounded-md bg-muted animate-pulse" />
          <div className="h-10 rounded-md bg-muted animate-pulse" />
          <div className="h-10 rounded-md bg-muted animate-pulse" />
        </div>
      ) : (
        <>
          <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
            {availability.map((day) => {
              const isActive = day.date === selectedDate;
              const hasSlots = day.slots.length > 0;

              return (
                <button
                  key={day.date}
                  type="button"
                  onClick={() => {
                    setSelectedDate(day.date);
                    setSelectedSlot(null);
                  }}
                  className={`min-w-[110px] rounded-md border px-3 py-2 text-left transition ${
                    isActive
                      ? "border-accent-deep bg-accent/10 text-accent-deep"
                      : hasSlots
                        ? "border-border hover:border-accent-deep/40"
                        : "border-border/70 text-muted-foreground/70"
                  }`}
                >
                  <p className="text-xs font-semibold uppercase tracking-wide">
                    {formatDayLabel(day.date)}
                  </p>
                  <p className="text-[11px] mt-1">
                    {hasSlots ? `${day.slots.length} slots` : "No slots"}
                  </p>
                </button>
              );
            })}
          </div>

          {!selectedDay || selectedDay.slots.length === 0 ? (
            <div className="rounded-md border border-dashed border-border p-5 text-sm text-muted-foreground">
              No available times on this date. Try another day.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {selectedDay.slots.map((slot) => {
                const isSelected = selectedSlot?.start_utc === slot.start_utc;
                return (
                  <button
                    key={slot.start_utc}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`rounded-md border px-4 py-3 text-sm text-left transition ${
                      isSelected
                        ? "border-accent-deep bg-accent/10 text-accent-deep"
                        : "border-border hover:border-accent-deep/50"
                    }`}
                  >
                    <p className="font-semibold">
                      {formatSlotLocalTime(slot.start_utc, viewerTimezone)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {durationMinutes} min
                    </p>
                  </button>
                );
              })}
            </div>
          )}

          {selectedSlot && (
            <div className="mt-6 rounded-md border border-accent-deep/30 bg-accent/5 p-4">
              <p className="text-sm text-foreground mb-3">
                Selected:{" "}
                <strong>
                  {formatSlotLocalTime(selectedSlot.start_utc, viewerTimezone)}
                </strong>{" "}
                on <strong>{formatDayLabel(selectedDay?.date || "")}</strong> ({viewerTimezone})
              </p>
              <Button
                type="button"
                variant="hero"
                onClick={handleConfirm}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Booking..." : confirmLabel}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AvailabilityPicker;
