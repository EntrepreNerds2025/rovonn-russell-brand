import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { BlogPost, formatPostDate, categorySlug } from "@/lib/blog";

interface PostCardProps {
  post: BlogPost;
  variant?: "default" | "feature";
}

export const PostCard = ({ post, variant = "default" }: PostCardProps) => {
  const isFeature = variant === "feature";

  return (
    <article
      className={
        isFeature
          ? "group border border-border rounded-md bg-card p-6 md:p-8 hover:border-accent transition-colors"
          : "group border border-border rounded-md bg-card p-5 md:p-6 hover:border-accent transition-colors"
      }
    >
      <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-muted-foreground mb-4">
        <Link
          to={`/blog/category/${categorySlug(post.category)}`}
          className="font-semibold text-accent-deep hover:underline"
        >
          {post.category}
        </Link>
        <span className="opacity-50">•</span>
        <span>{formatPostDate(post.date)}</span>
        <span className="opacity-50">•</span>
        <span>{post.readingMinutes} min read</span>
      </div>

      <Link to={`/blog/${post.slug}`} className="block">
        <h2
          className={
            isFeature
              ? "text-2xl md:text-4xl font-serif font-bold leading-tight mb-3 group-hover:text-accent-deep transition-colors"
              : "text-xl md:text-2xl font-serif font-bold leading-tight mb-3 group-hover:text-accent-deep transition-colors"
          }
        >
          {post.title}
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">{post.excerpt}</p>
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent-deep">
          Read the post
          <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </Link>
    </article>
  );
};

export default PostCard;
