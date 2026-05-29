import { Link, useLocation } from "react-router-dom";
import { ALL_CATEGORIES, categorySlug, getCategoryCounts } from "@/lib/blog";

interface CategoryNavProps {
  activeCategory?: string;
}

export const CategoryNav = ({ activeCategory }: CategoryNavProps) => {
  const counts = getCategoryCounts();
  const location = useLocation();
  const isAllActive = !activeCategory && location.pathname === "/blog";

  return (
    <nav aria-label="Blog categories" className="flex flex-wrap gap-2 mb-8">
      <Link
        to="/blog"
        className={
          isAllActive
            ? "px-4 py-2 rounded-md text-xs font-semibold uppercase tracking-wider bg-foreground text-background"
            : "px-4 py-2 rounded-md text-xs font-semibold uppercase tracking-wider bg-secondary text-foreground hover:bg-foreground hover:text-background transition-colors"
        }
      >
        All Posts
      </Link>
      {ALL_CATEGORIES.map((cat) => {
        const slug = categorySlug(cat);
        const isActive = activeCategory === slug;
        return (
          <Link
            key={cat}
            to={`/blog/category/${slug}`}
            className={
              isActive
                ? "px-4 py-2 rounded-md text-xs font-semibold uppercase tracking-wider bg-foreground text-background"
                : "px-4 py-2 rounded-md text-xs font-semibold uppercase tracking-wider bg-secondary text-foreground hover:bg-foreground hover:text-background transition-colors"
            }
          >
            {cat} <span className="opacity-50 ml-1">({counts[cat] || 0})</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default CategoryNav;
