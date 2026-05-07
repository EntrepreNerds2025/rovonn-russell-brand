/**
 * Blog data layer.
 * Loads markdown files from /content/blog at build time via Vite's import.meta.glob,
 * parses frontmatter with js-yaml, and exposes a tiny query API for routes and components.
 *
 * Posts are markdown (.md) with YAML frontmatter. The schema is defined in
 * docs/VOICE_REFERENCE.md and enforced by docs/PRE_PUBLISH_CHECKLIST.md.
 */
import yaml from "js-yaml";

// Lightweight reading-time calculator (browser-safe).
// The npm `reading-time` package depends on Node's stream/util `inherits`,
// which breaks in browser bundles ("OF.inherits is not a function").
function readingTime(text: string): { minutes: number; words: number; text: string } {
  const words = (text.trim().match(/\S+/g) || []).length;
  const minutes = words / 200; // ~200 wpm
  const mins = Math.max(1, Math.ceil(minutes));
  return { minutes, words, text: `${mins} min read` };
}

export type BlogCategory =
  | "Building in Public"
  | "Storytelling"
  | "Systems & Agents"
  | "Community/Culture"
  | "ADAPT in Practice";

export interface BlogFAQ {
  question: string;
  answer: string;
}

export interface BlogFrontmatter {
  title: string;
  slug: string;
  date: string;
  author: string;
  category: BlogCategory;
  tags: string[];
  excerpt: string;
  seoTitle?: string;
  metaDescription?: string;
  heroImage?: string;
  heroImageAlt?: string;
  faq?: BlogFAQ[];
  published: boolean;
}

export interface BlogPost extends BlogFrontmatter {
  body: string;
  readingMinutes: number;
  readingText: string;
  wordCount: number;
}

export const ALL_CATEGORIES: BlogCategory[] = [
  "Building in Public",
  "Storytelling",
  "Systems & Agents",
  "Community/Culture",
  "ADAPT in Practice",
];

const FRONTMATTER_REGEX = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;

function parseFrontmatter(raw: string): { data: Record<string, unknown>; body: string } {
  const match = raw.match(FRONTMATTER_REGEX);
  if (!match) {
    return { data: {}, body: raw };
  }
  const [, fmText, body] = match;
  let data: Record<string, unknown> = {};
  try {
    const parsed = yaml.load(fmText);
    if (parsed && typeof parsed === "object") {
      data = parsed as Record<string, unknown>;
    }
  } catch (err) {
    console.error("Frontmatter parse error:", err);
  }
  return { data, body: body.trimStart() };
}

function buildPost(slug: string, raw: string): BlogPost | null {
  const { data, body } = parseFrontmatter(raw);
  if (!data.title || !data.slug || !data.date || !data.category) {
    console.warn(`Blog post '${slug}' is missing required frontmatter fields`);
    return null;
  }
  const stats = readingTime(body);
  return {
    title: data.title as string,
    slug: data.slug as string,
    date: data.date as string,
    author: (data.author as string) || "rovonn-russell",
    category: data.category as BlogCategory,
    tags: (data.tags as string[]) || [],
    excerpt: (data.excerpt as string) || "",
    seoTitle: data.seoTitle as string | undefined,
    metaDescription: data.metaDescription as string | undefined,
    heroImage: data.heroImage as string | undefined,
    heroImageAlt: data.heroImageAlt as string | undefined,
    faq: (data.faq as BlogFAQ[] | undefined) || [],
    published: data.published === true,
    body,
    readingMinutes: Math.ceil(stats.minutes),
    readingText: stats.text,
    wordCount: stats.words,
  };
}

// Eagerly load all markdown posts at build time. The path is relative to this file.
const modules = import.meta.glob("/content/blog/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

const allPosts: BlogPost[] = Object.entries(modules)
  .map(([path, raw]) => {
    const fileSlug = path.split("/").pop()?.replace(/\.md$/, "") ?? "";
    return buildPost(fileSlug, raw);
  })
  .filter((p): p is BlogPost => p !== null)
  .sort((a, b) => (a.date < b.date ? 1 : -1));

const publishedPosts = allPosts.filter((p) => p.published);

export function getAllPosts(): BlogPost[] {
  return publishedPosts;
}

export function getAllPostsIncludingDrafts(): BlogPost[] {
  return allPosts;
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return publishedPosts.find((p) => p.slug === slug);
}

export function getPostsByCategory(category: BlogCategory): BlogPost[] {
  return publishedPosts.filter((p) => p.category === category);
}

export function getRelatedPosts(slug: string, limit = 3): BlogPost[] {
  const current = publishedPosts.find((p) => p.slug === slug);
  if (!current) return [];
  const sameCategory = publishedPosts.filter((p) => p.slug !== slug && p.category === current.category);
  if (sameCategory.length >= limit) return sameCategory.slice(0, limit);
  const others = publishedPosts.filter((p) => p.slug !== slug && p.category !== current.category);
  return [...sameCategory, ...others].slice(0, limit);
}

export function getCategoryCounts(): Record<BlogCategory, number> {
  const counts = Object.fromEntries(ALL_CATEGORIES.map((c) => [c, 0])) as Record<BlogCategory, number>;
  for (const post of publishedPosts) {
    counts[post.category] = (counts[post.category] || 0) + 1;
  }
  return counts;
}

export function categorySlug(category: BlogCategory): string {
  return category
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\//g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function categoryFromSlug(slug: string): BlogCategory | undefined {
  return ALL_CATEGORIES.find((c) => categorySlug(c) === slug);
}

export function formatPostDate(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}
