import { BlogPost } from "@/lib/blog";
import PostCard from "./PostCard";

interface RelatedPostsProps {
  posts: BlogPost[];
}

export const RelatedPosts = ({ posts }: RelatedPostsProps) => {
  if (!posts || posts.length === 0) return null;
  return (
    <section className="border-t border-border pt-12 mt-12">
      <p className="text-xs font-semibold tracking-[0.3em] uppercase text-accent-deep mb-3">
        Keep Reading
      </p>
      <h2 className="text-2xl md:text-4xl font-serif font-bold leading-tight mb-8">
        More posts in this thread.
      </h2>
      <div className="grid md:grid-cols-3 gap-5">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
};

export default RelatedPosts;
