import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { setSEO, resetSEO } from "@/lib/seo";
import { CheckCircle2, Calendar, Video, ArrowRight } from "lucide-react";
import { formatBookingDateTime } from "@/lib/booking";

const BookingConfirmed = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const scheduled = searchParams.get("scheduled");
  const callTypeLabel = searchParams.get("callTypeLabel") || "Your call";
  const name = searchParams.get("name") || "there";
  const meeting = searchParams.get("meeting");

  useEffect(() => {
    setSEO({
      title: "Booking Confirmed | Rovonn Russell",
      description: "Your call with Rovonn is booked. Check your inbox for the confirmation and calendar invite.",
      path: "/booking-confirmed",
    });
    return resetSEO;
  }, []);

  const formattedTime = scheduled ? formatBookingDateTime(scheduled) : null;

  return (
    <main>
      <section className="section-padding pt-32 md:pt-40 pb-20">
        <div className="max-w-3xl mx-auto bg-card border border-border rounded-md p-10 md:p-14 text-center">
          <CheckCircle2 size={56} className="text-accent-deep mx-auto mb-6" />
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-5">Booking confirmed</p>
          <h1 className="text-3xl md:text-5xl font-serif font-bold leading-tight mb-5">
            See you {name === "there" ? "soon" : `soon, ${name}`}.
          </h1>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl mx-auto">
            Your {callTypeLabel} is on the calendar. I just sent you a confirmation email with the meeting link and an .ics file you can add to your calendar.
          </p>

          {formattedTime && (
            <div className="inline-flex items-center gap-3 bg-secondary border border-border rounded-md px-5 py-3 mb-8">
              <Calendar size={18} className="text-accent-deep" />
              <span className="font-semibold text-foreground">{formattedTime}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {meeting ? (
              <Button variant="hero" size="lg" asChild>
                <a href={meeting} target="_blank" rel="noopener noreferrer">
                  <Video className="mr-2" size={16} /> Open meeting link
                </a>
              </Button>
            ) : null}
            <Button variant="hero-outline" size="lg" asChild>
              <Link to="/">Back to home</Link>
            </Button>
          </div>

          {token && (
            <p className="text-xs text-muted-foreground mt-10">
              Need to reschedule or cancel?{" "}
              <Link to={`/cancel-booking?token=${token}`} className="underline hover:text-foreground transition-colors">
                Manage your booking
              </Link>
            </p>
          )}
        </div>
      </section>

      <section className="section-padding bg-secondary py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-serif font-bold leading-tight mb-6">Before we get on the call.</h2>
          <ul className="space-y-3 text-base text-muted-foreground leading-relaxed">
            <li className="flex items-start gap-3">
              <ArrowRight size={16} className="text-accent-deep mt-1 shrink-0" />
              <span>I'll read up on the business you submitted in the intake. You don't have to re-brief me.</span>
            </li>
            <li className="flex items-start gap-3">
              <ArrowRight size={16} className="text-accent-deep mt-1 shrink-0" />
              <span>If you remember something else worth flagging, reply to the confirmation email and I'll see it before we talk.</span>
            </li>
            <li className="flex items-start gap-3">
              <ArrowRight size={16} className="text-accent-deep mt-1 shrink-0" />
              <span>If anything comes up and you need to reschedule, the link above lets you do it without emailing me.</span>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
};

export default BookingConfirmed;
