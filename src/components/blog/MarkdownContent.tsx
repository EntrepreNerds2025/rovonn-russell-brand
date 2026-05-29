import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

interface MarkdownContentProps {
  content: string;
}

export const MarkdownContent = ({ content }: MarkdownContentProps) => {
  return (
    <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:font-bold prose-h2:text-3xl md:prose-h2:text-4xl prose-h2:mt-12 prose-h2:mb-5 prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4 prose-p:leading-relaxed prose-p:text-foreground prose-li:text-foreground prose-strong:text-foreground prose-a:text-accent-deep prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-4 prose-blockquote:border-accent prose-blockquote:bg-secondary prose-blockquote:py-1 prose-blockquote:px-6 prose-blockquote:not-italic prose-blockquote:font-serif prose-blockquote:text-foreground prose-img:rounded-md prose-hr:my-12 prose-hr:border-border">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behavior: "wrap",
              properties: { className: ["heading-anchor"] },
            },
          ],
        ]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownContent;
