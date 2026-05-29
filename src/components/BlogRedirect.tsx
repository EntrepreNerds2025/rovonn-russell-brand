import { Navigate, useParams } from "react-router-dom";

/**
 * Client-side redirect from /blogs and /blogs/:slug to /blog and /blog/:slug.
 * Real 301 redirects from blog.rovonnrussell.com (the old subdomain) need to be configured
 * at the hosting layer (Lovable / Vercel / Netlify) - see public/_redirects.
 */
const BlogRedirect = () => {
  const { slug } = useParams();
  if (slug) {
    return <Navigate to={`/blog/${slug}`} replace />;
  }
  return <Navigate to="/blog" replace />;
};

export default BlogRedirect;
