/**
 * Lightweight analytics helper.
 * Mirrors Impact Loop's pattern (trackImpactVisibilityEvent / trackAdaptEvent):
 * fires events to gtag, plausible, and dataLayer if any of them are present.
 * Silent no-op if none are configured.
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    plausible?: (event: string, options?: { props?: Record<string, unknown> }) => void;
    dataLayer?: unknown[];
  }
}

export type AnalyticsEvent = string;

export function trackEvent(
  eventName: AnalyticsEvent,
  payload?: Record<string, unknown>
): void {
  if (typeof window === "undefined") return;

  try {
    window.gtag?.("event", eventName, payload || {});
  } catch {
    // gtag failure is non-fatal
  }

  try {
    window.plausible?.(eventName, payload ? { props: payload } : undefined);
  } catch {
    // plausible failure is non-fatal
  }

  try {
    window.dataLayer?.push({ event: eventName, ...(payload || {}) });
  } catch {
    // dataLayer failure is non-fatal
  }
}
