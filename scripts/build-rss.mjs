/**
 * Build-time RSS feed generator.
 *
 * Reads /content/blog/*.md, parses frontmatter, and writes /public/rss.xml.
 * Run as part of `npm run build` (wired in package.json) or standalone:
 *   node scripts/build-rss.mjs
 */
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, "..");
const SITE_URL = "https://rovonnrussell.com";
const BLOG_DIR = join(ROOT, "content", "blog");
const PUBLIC_DIR = join(ROOT, "public");
const OUT_PATH = join(PUBLIC_DIR, "rss.xml");

const FRONTMATTER_REGEX = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;

const parseFrontmatter = (raw) => {
  const m = raw.match(FRONTMATTER_REGEX);
  if (!m) return { data: {}, body: raw };
  try {
    const data = yaml.load(m[1]) || {};
    return { data, body: m[2] };
  } catch {
    return { data: {}, body: m[2] || raw };
  }
};

const escapeXml = (s = "") =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const main = () => {
  if (!existsSync(BLOG_DIR)) {
    console.warn(`[rss] No blog directory at ${BLOG_DIR}, skipping.`);
    return;
  }
  const files = readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));
  const posts = files
    .map((file) => {
      const raw = readFileSync(join(BLOG_DIR, file), "utf8");
      const { data } = parseFrontmatter(raw);
      return data;
    })
    .filter((p) => p && p.published === true && p.title && p.slug && p.date)
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  const lastBuildDate = new Date().toUTCString();

  const items = posts
    .map((p) => {
      const url = `${SITE_URL}/blog/${p.slug}`;
      const pubDate = new Date(p.date).toUTCString();
      const desc = p.excerpt || p.metaDescription || "";
      return `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(desc)}</description>
      <category>${escapeXml(p.category || "Uncategorized")}</category>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Rovonn Russell - Blog</title>
    <link>${SITE_URL}/blog</link>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <description>Writing for founders, businesses, and impact-led leaders on storytelling, practical AI, and the ADAPT framework.</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
${items}
  </channel>
</rss>`;

  if (!existsSync(PUBLIC_DIR)) mkdirSync(PUBLIC_DIR, { recursive: true });
  writeFileSync(OUT_PATH, xml, "utf8");
  console.log(`[rss] Wrote ${posts.length} posts to ${OUT_PATH}`);
};

main();
