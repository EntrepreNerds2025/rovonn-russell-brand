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

export type AnalyticsEvent =
  | "personal_brand_home_viewed"
  | "starter_kit_form_started"
  | "starter_kit_form_submitted"
  | "starter_kit_downloaded"
  | "youtube_video_clicked"
  | "youtube_subscribe_clicked"
  | "impact_loop_cta_clicked"
  | "advisory_cta_clicked"
  | "speaking_form_submitted"
  | "resource_clicked"
  | "navbar_cta_clicked"
  | "blog_index_viewed"
  | "blog_category_viewed"
  | "blog_post_viewed"
  | "blog_cta_click"
  | "portfolio_index_viewed"
  | "portfolio_card_click"
  | "portfolio_case_study_viewed"
  | `blog_scroll_${number}`;

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
