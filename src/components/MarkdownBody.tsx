import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeSlug from 'rehype-slug';

const schema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames || []), 'aside'],
  attributes: {
    ...defaultSchema.attributes,
    '*': [...(defaultSchema.attributes?.['*'] || []), 'className', 'id', 'ariaLabel'],
    a: [...(defaultSchema.attributes?.a || []), 'id', 'className'],
    aside: ['className', 'ariaLabel'],
  },
};

export function MarkdownBody({ source }: { source: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, [rehypeSanitize, schema], rehypeSlug]}
      components={{
        table: ({ children }) => <div className="table-wrap"><table>{children}</table></div>,
        a: ({ href, children, ...props }) => {
          const external = href?.startsWith('http');
          return <a href={href} {...props} {...(external ? { rel: 'noopener noreferrer' } : {})}>{children}</a>;
        },
        img: ({ src, alt }) => <img src={typeof src === 'string' ? src : ''} alt={alt || ''} loading="lazy" />,
      }}
    >
      {source}
    </ReactMarkdown>
  );
}
