import { Post, Category, Author, Page } from "./wordpress.d";
import { getFeaturedMediaById, getCategoryById } from "./wordpress";
import { siteConfig } from '@/site.config'

export async function generatePostSchema(post: Post, author: Author) {
  const featuredMedia = post.featured_media ? await getFeaturedMediaById(post.featured_media) : null;
  const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/${post.slug}`;
  // Fetch categories only
  const categories = await Promise.all(post.categories?.map(id => getCategoryById(id)) || []);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title.rendered,
    "description": post.excerpt.rendered,
    "image": featuredMedia?.source_url ? {
      "@type": "ImageObject",
      "url": featuredMedia.source_url,
      "width": featuredMedia.width || 1200,
      "height": featuredMedia.height || 630
    } : null,
    "datePublished": post.date,
    "dateModified": post.modified,
    "author": {
      "@type": "Person",
      "name": author.name,
      "url": `${process.env.NEXT_PUBLIC_SITE_URL}/${author.slug}`,
      "image": author.avatar_urls?.["96"] || null
    },
    "publisher": {
      "@type": "Organization",
      "name": process.env.NEXT_PUBLIC_SITE_NAME,
      "logo": {
        "@type": "ImageObject",
        "url": `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
        "width": 180,
        "height": 60
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    },
    "url": canonicalUrl,
    "wordCount": post.content.rendered.split(/\s+/).length,
    "articleSection": categories.map(cat => cat.name).join(", ") || "",
    "inLanguage": "en-US",
    "isAccessibleForFree": true,
    "isFamilyFriendly": true
  };
}

export function generateCategorySchema(category: Category) {
  const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/${category.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": category.yoast_head_json?.title || category.name,
    "description": category.yoast_head_json?.description || category.description,
    "url": canonicalUrl,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": [],
      "numberOfItems": category.count
    },
    "publisher": {
      "@type": "Organization",
      "name": process.env.NEXT_PUBLIC_SITE_NAME,
      "logo": {
        "@type": "ImageObject",
        "url": `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`
      }
    },
    "inLanguage": "en-US"
  };
}

export function generateAuthorSchema(author: Author) {
  const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/${author.slug}`;
  
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": author.name,
    "description": author.description,
    "url": canonicalUrl,
    "image": author.avatar_urls?.["96"] || null,
    "sameAs": author.social_links || [],
    "worksFor": {
      "@type": "Organization",
      "name": process.env.NEXT_PUBLIC_SITE_NAME
    }
  };
}

function ensureValidUrl(url: string | undefined): string {
  if (!url) return 'https://example.com';
  
  try {
    // Remove any trailing slashes
    const cleanUrl = url.replace(/\/+$/, '');
    // Ensure it starts with http or https
    const urlWithProtocol = cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`;
    // Validate the URL
    new URL(urlWithProtocol);
    return urlWithProtocol;
  } catch {
    return 'https://example.com';
  }
}

export function generateWebSiteSchema() {
  const siteUrl = ensureValidUrl(siteConfig.site_domain);
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.site_name || 'Bkmower',
    description: siteConfig.site_description || '',
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  })
}

export function generateArticleSchema(post: Post) {
  const siteUrl = ensureValidUrl(siteConfig.site_domain);
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.yoast_head_json?.title || post.title.rendered || '',
    description: post.yoast_head_json?.description || post.excerpt.rendered || '',
    image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
    datePublished: post.date || new Date().toISOString(),
    dateModified: post.modified || new Date().toISOString(),
    author: {
      '@type': 'Person',
      name: post._embedded?.author?.[0]?.name || 'Unknown Author',
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.site_name || 'Bkmower',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.svg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/${post.slug || ''}`,
    },
    ...(post.meta?._article_rating ? {
      review: {
        '@type': 'AggregateRating',
        ratingValue: post.meta._article_rating,
        bestRating: "5",
        ratingCount: post.meta._article_rating_count || 0
      }
    } : {})
  })
}

export function generatePageSchema(page: Page) {
  const siteUrl = ensureValidUrl(siteConfig.site_domain);
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: page.yoast_head_json?.title || page.title.rendered || '',
    description: page.yoast_head_json?.description || page.excerpt.rendered || '',
    url: `${siteUrl}/${page.slug || ''}`,
    publisher: {
      '@type': 'Organization',
      name: siteConfig.site_name || 'Bkmower',
    }
  })
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  const siteUrl = ensureValidUrl(siteConfig.site_domain);
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name || '',
      item: item.url.startsWith('http') ? ensureValidUrl(item.url) : `${siteUrl}${item.url || ''}`,
    })),
  })
} 
