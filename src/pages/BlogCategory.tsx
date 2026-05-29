import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { setSEO, resetSEO } from "@/lib/seo";
import { trackEvent } from "@/lib/analytics";
import { categoryFromSlug, categorySlug, getPostsByCategory } from "@/lib/blog";
import PostCard from "@/components/blog/PostCard";
import CategoryNav from "@/components/blog/CategoryNav";
import NotFound from "./NotFound";

const CATEGORY_BLURBS: Record<string, string> = {
  "Building in Public":
    "The view from inside Impact Loop, Nerds Creative, and the personal brand. What's actually shipping, what's broken, what changed.",
  Storytelling:
    "The craft. Narrative architecture, story capture, writing for visibility, how messages land for founders and impact-led leaders.",
  "Systems & Agents":
    "Practical AI and workflow systems for founders and SMB operators. What works, what doesn't, the math behind the choice.",
  "Community/Culture":
    "Toronto, Black community organizing, youth programs, and the conditions that make community-led work actually work.",
  "ADAPT in Practice":
    "The framework applied to real cycles. Each post shows a phase in motion. The deliverable varies — sometimes a content engine, sometimes an agent, sometimes brand work, often a hybrid. The point is the tailoring, not the output.",
};

const BlogCategory = () => {
  const { categorySlug: slug } = useParams<{ categorySlug: string }>();
  const category = slug ? categoryFromSlug(slug) : undefined;

  useEffect(() => {
    if (!category) return;
    setSEO({
      title: `${category} | The Blog | Rovonn Russell`,
      description: CATEGORY_BLURBS[category] || `Posts in the ${category} category.`,
      path: `/blog/category/${categorySlug(category)}`,
    });
    trackEvent("blog_category_viewed", { category });
    return resetSEO;
  }, [category]);

  if (!category) return <NotFound />;

  const posts = getPostsByCategory(category);

  return (
    <main>
      <section className="section-padding pt-32 md:pt-40 pb-12">
        <div className="max-w-5xl mx-auto">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep hover:underline mb-6"
          >
            <ArrowLeft size={12} /> All Posts
          </Link>
          <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-4">
            Category
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold leading-[1.0] mb-6">
            {category}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed font-serif italic">
            {CATEGORY_BLURBS[category]}
          </p>
        </div>
      </section>

      <section className="section-padding pb-20">
        <div className="max-w-5xl mx-auto">
          <CategoryNav activeCategory={categorySlug(category)} />
          {posts.length === 0 ? (
            <div className="border border-border rounded-md p-12 text-center bg-card">
              <p className="text-muted-foreground">
                No posts published in this category yet. Check back soon.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {posts.map((p) => (
                <PostCard key={p.slug} post={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default BlogCategory;
