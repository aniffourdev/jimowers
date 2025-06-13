import { Post, Category, Page } from "@/lib/wordpress.d";
import { siteConfig } from "@/site.config";

interface SchemaMarkupProps {
  type: "post" | "category" | "page" | "index";
  data?: Post | Category | Page;
  posts?: Post[];
}

export function SchemaMarkup({ type, data, posts }: SchemaMarkupProps) {
  const getSchema = () => {
    switch (type) {
      case "post":
        if (!data || !("title" in data)) return null;
        const post = data as Post;
        return {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title.rendered,
          image: post._embedded?.["wp:featuredmedia"]?.[0]?.source_url,
          datePublished: post.date,
          dateModified: post.modified,
          author: {
            "@type": "Person",
            name: post._embedded?.author?.[0]?.name || "Unknown Author",
          },
          publisher: {
            "@type": "Organization",
            name: siteConfig.site_name,
            logo: {
              "@type": "ImageObject",
              url: `${siteConfig.site_domain}/logo.svg`,
            },
          },
          description: post.excerpt.rendered.replace(/<[^>]*>/g, ""),
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `${siteConfig.site_domain}/posts/${post.slug}`,
          },
        };

      case "category":
        if (!data || !("name" in data)) return null;
        return {
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: data.name,
          description: data.description,
          url: `${siteConfig.site_domain}/posts/categories/${data.slug}`,
          mainEntity: {
            "@type": "ItemList",
            itemListElement: posts?.map((post, index) => ({
              "@type": "ListItem",
              position: index + 1,
              item: {
                "@type": "BlogPosting",
                headline: post.title.rendered,
                url: `${siteConfig.site_domain}/posts/${post.slug}`,
              },
            })),
          },
        };

      case "page":
        if (!data || !("title" in data)) return null;
        return {
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: data.title.rendered,
          description: data.excerpt.rendered.replace(/<[^>]*>/g, ""),
          url: `${siteConfig.site_domain}/pages/${data.slug}`,
        };

      case "index":
        return {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: siteConfig.site_name,
          description: siteConfig.site_description,
          url: siteConfig.site_domain,
          potentialAction: {
            "@type": "SearchAction",
            target: `${siteConfig.site_domain}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        };

      default:
        return null;
    }
  };

  const schema = getSchema();
  if (!schema) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
} 