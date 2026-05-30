import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { setSEO, resetSEO } from "@/lib/seo";
import { CheckCircle2, AlertCircle } from "lucide-react";

const SUPABASE_FUNCTIONS_URL = (import.meta as ImportMeta).env?.VITE_SUPABASE_FUNCTIONS_URL || "";

const CancelBooking = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [submitting, setSubmitting] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  useEffect(() => {
    setSEO({
      title: "Cancel Booking | Rovonn Russell",
      description: "Cancel your booked call. If you want to reschedule, you can do that here too.",
      path: "/cancel-booking",
    });
    return resetSEO;
  }, []);

  const handleCancel = async () => {
    if (!token) {
      setError("This link is missing a token. Email rovonn@rovonnrussell.com directly to cancel.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`${SUPABASE_FUNCTIONS_URL}/cancel-booking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cancel_token: token, reason }),
      });
      if (!res.ok) throw new Error("Failed to cancel.");
      setCancelled(true);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to cancel.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) {
    return (
      <main className="section-padding pt-32 md:pt-40 min-h-[60vh]">
        <div className="max-w-2xl mx-auto bg-card border border-border rounded-md p-10 text-center">
          <AlertCircle size={48} className="text-destructive mx-auto mb-5" />
          <h1 className="text-2xl md:text-3xl font-serif font-bold mb-4">Missing cancel link.</h1>
          <p className="text-muted-foreground mb-6">
            Use the link in your confirmation email, or email rovonn@rovonnrussell.com directly and I'll handle it.
          </p>
          <Button variant="hero-outline" asChild>
            <Link to="/">Back to home</Link>
          </Button>
        </div>
      </main>
    );
  }

  if (cancelled) {
    return (
      <main className="section-padding pt-32 md:pt-40 min-h-[60vh]">
        <div className="max-w-2xl mx-auto bg-card border border-border rounded-md p-10 text-center">
          <CheckCircle2 size={48} className="text-accent-deep mx-auto mb-5" />
          <h1 className="text-2xl md:text-3xl font-serif font-bold mb-4">Cancelled.</h1>
          <p className="text-muted-foreground mb-8">
            The call's off the calendar. You'll get a confirmation email shortly.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="hero" asChild><Link to="/book">Rebook a different time</Link></Button>
            <Button variant="hero-outline" asChild><Link to="/">Back to home</Link></Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="section-padding pt-32 md:pt-40 pb-20">
      <div className="max-w-2xl mx-auto bg-card border border-border rounded-md p-8 md:p-10">
        <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-5">Manage your booking</p>
        <h1 className="text-2xl md:text-4xl font-serif font-bold leading-tight mb-5">Cancel your call?</h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          If you need to reschedule instead, the easier path is to cancel here, then rebook a new time. If you can tell me why (optional), it helps me improve the booking experience.
        </p>

        <div className="mb-6">
          <label className="text-xs font-semibold uppercase tracking-wider text-accent-deep block mb-2">Reason (optional)</label>
          <textarea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Something came up, schedule conflict, wrong call type for me, etc."
            className="w-full bg-background border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:border-accent-deep transition-colors resize-none"
          />
        </div>

        {error && <p className="text-sm text-destructive mb-4">{error}</p>}

        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="hero" onClick={handleCancel} disabled={submitting}>
            {submitting ? "Cancelling..." : "Cancel my booking"}
          </Button>
          <Button variant="hero-outline" asChild>
            <Link to={`/book`}>Or just rebook a new time</Link>
          </Button>
        </div>
      </div>
    </main>
  );
};

export default CancelBooking;
