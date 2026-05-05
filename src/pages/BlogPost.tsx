import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { setSEO, resetSEO } from "@/lib/seo";
import { trackEvent } from "@/lib/analytics";
import { getPostBySlug, getRelatedPosts, formatPostDate, categorySlug } from "@/lib/blog";
import MarkdownContent from "@/components/blog/MarkdownContent";
import FAQSection from "@/components/blog/FAQSection";
import RelatedPosts from "@/components/blog/RelatedPosts";
import NotFound from "./NotFound";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;

  useEffect(() => {
    if (!post) return;
    setSEO({
      title: post.seoTitle || `${post.title} | Rovonn Russell`,
      description: post.metaDescription || post.excerpt,
      path: `/blog/${post.slug}`,
      ogType: "article",
      ogImage: post.heroImage ? `https://rovonnrussell.com${post.heroImage}` : undefined,
    });
    trackEvent("blog_post_viewed", { slug: post.slug, category: post.category });
    return resetSEO;
  }, [post]);

  useEffect(() => {
    if (!post) return;
    const handlers: Record<string, () => void> = {};
    const thresholds = [50, 90];
    let fired: Record<number, boolean> = {};
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      if (max <= 0) return;
      const pct = (window.scrollY / max) * 100;
      thresholds.forEach((t) => {
        if (!fired[t] && pct >= t) {
          fired[t] = true;
          trackEvent(`blog_scroll_${t}`, { slug: post.slug });
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [post]);

  if (!post) return <NotFound />;

  const related = getRelatedPosts(post.slug, 3);

  return (
    <main>
      <article className="section-padding pt-32 md:pt-40 pb-16">
        <div className="max-w-3xl mx-auto">
          <Link
            to={`/blog/category/${categorySlug(post.category)}`}
            className="inline-flex items-center gap-1 text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep hover:underline mb-6"
          >
            {post.category}
          </Link>

          <h1 className="text-4xl md:text-6xl font-serif font-bold leading-[1.05] mb-6">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-8">
            <span>{formatPostDate(post.date)}</span>
            <span className="opacity-50">•</span>
            <span>{post.readingMinutes} min read</span>
            <span className="opacity-50">•</span>
            <span>{post.wordCount.toLocaleString()} words</span>
          </div>

          {post.heroImage && (
            <img
              src={post.heroImage}
              alt={post.heroImageAlt || post.title}
              className="w-full rounded-md mb-12 aspect-[16/9] object-cover"
              loading="eager"
            />
          )}

          <MarkdownContent content={post.body} />

          <FAQSection faqs={post.faq || []} />

          <section className="border-t border-border pt-12 mt-12 bg-secondary -mx-6 px-6 md:mx-0 md:px-10 md:rounded-md py-10">
            <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-3">
              Next Step
            </p>
            <h2 className="text-2xl md:text-3xl font-serif font-bold leading-tight mb-4">
              If this resonated, two ways forward.
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Pick the door that fits where you are right now.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link
                  to="/resources/visibility-starter-kit"
                  onClick={() => trackEvent("blog_cta_click", { kind: "kit", slug: post.slug })}
                >
                  Get the Visibility Starter Kit <ArrowRight className="ml-2" size={16} />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link
                  to="/work-with-me"
                  onClick={() => trackEvent("blog_cta_click", { kind: "work_with_me", slug: post.slug })}
                >
                  Work with me
                </Link>
              </Button>
            </div>
          </section>

          <RelatedPosts posts={related} />

          <div className="border-t border-border pt-8 mt-12">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-accent-deep hover:underline"
            >
              <ArrowLeft size={14} /> Back to all posts
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
};

export default BlogPost;
