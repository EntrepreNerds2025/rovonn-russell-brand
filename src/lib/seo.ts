/**
 * Lightweight SEO helper.
 * Mirrors the pattern used in Impact Loop (src/lib/seo.ts) so the two brands
 * stay structurally consistent. Sets title, meta description, OG tags,
 * Twitter Card tags, and canonical URL on the document head.
 */

const SITE_URL = "https://rovonnrussell.com";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

export interface SEOConfig {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  noindex?: boolean;
}

const setMeta = (name: string, content: string, attr: "name" | "property" = "name") => {
  if (typeof document === "undefined") return;
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const setLink = (rel: string, href: string) => {
  if (typeof document === "undefined") return;
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
};

export function setSEO(config: SEOConfig) {
  if (typeof document === "undefined") return;

  const fullTitle = config.title;
  const url = `${SITE_URL}${config.path || ""}`;
  const image = config.ogImage || DEFAULT_OG_IMAGE;
  const ogType = config.ogType || "website";

  document.title = fullTitle;
  setMeta("description", config.description);
  setMeta("robots", config.noindex ? "noindex, nofollow" : "index, follow");

  setMeta("og:title", fullTitle, "property");
  setMeta("og:description", config.description, "property");
  setMeta("og:url", url, "property");
  setMeta("og:type", ogType, "property");
  setMeta("og:image", image, "property");
  setMeta("og:site_name", "Rovonn Russell", "property");

  setMeta("twitter:card", "summary_large_image");
  setMeta("twitter:title", fullTitle);
  setMeta("twitter:description", config.description);
  setMeta("twitter:image", image);

  setLink("canonical", url);
}

export function resetSEO() {
  setSEO({
    title: "Rovonn Russell | Storytelling, Systems and AI",
    description: "Rovonn Russell helps founders, businesses, and impact-driven leaders tailor AI and systems to what their work actually needs. ADAPT framework, content systems, storytelling, and practical AI for real work.",
    path: "/",
  });
}
