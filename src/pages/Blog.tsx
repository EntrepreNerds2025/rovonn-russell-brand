import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { setSEO, resetSEO } from "@/lib/seo";
import { trackEvent } from "@/lib/analytics";
import { getAllPosts } from "@/lib/blog";
import PostCard from "@/components/blog/PostCard";
import CategoryNav from "@/components/blog/CategoryNav";

const HeroSection = () => (
  <section className="section-padding pt-32 md:pt-40 pb-12 md:pb-16">
    <div className="max-w-5xl mx-auto">
      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-6">
        The Blog
      </p>
      <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold leading-[1.0] mb-8">
        Notes from the work of{" "}
        <span className="italic text-accent-highlight">storytelling and systems.</span>
      </h1>
      <p className="text-lg md:text-2xl text-muted-foreground max-w-3xl leading-relaxed font-serif italic">
        Writing for founders, businesses, and impact-led leaders. Building in public, the craft of storytelling, practical AI, community work, and the ADAPT framework in motion.
      </p>
    </div>
  </section>
);

const EmptyState = () => (
  <div className="border border-border rounded-md p-12 text-center bg-card">
    <p className="text-muted-foreground mb-6">
      No posts published yet. The first ones are queued — check back soon.
    </p>
    <Button asChild variant="default">
      <Link to="/resources/visibility-starter-kit">
        Get the Visibility Starter Kit <ArrowRight className="ml-2" size={16} />
      </Link>
    </Button>
  </div>
);

const Blog = () => {
  useEffect(() => {
    setSEO({
      title: "The Blog | Rovonn Russell",
      description:
        "Writing for founders, businesses, and impact-led leaders on storytelling, practical AI, building in public, community work, and the ADAPT framework.",
      path: "/blog",
    });
    trackEvent("blog_index_viewed");
    return resetSEO;
  }, []);

  const posts = getAllPosts();
  const [featured, ...rest] = posts;

  return (
    <main>
      <HeroSection />
      <section className="section-padding pb-20">
        <div className="max-w-5xl mx-auto">
          <CategoryNav />
          {posts.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-8">
              {featured && <PostCard post={featured} variant="feature" />}
              {rest.length > 0 && (
                <div className="grid md:grid-cols-2 gap-6">
                  {rest.map((p) => (
                    <PostCard key={p.slug} post={p} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Blog;
