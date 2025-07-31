import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getPost, getCategory, getAuthor } from '@/lib/api'
import { getAuthorById, getFeaturedMediaById } from '@/lib/wordpress'
import { getPostBySlug, getPageBySlug, getCategoryBySlug, getAuthorBySlug } from "@/lib/wordpress";
import { generateArticleSchema, generatePageSchema, generateCategorySchema, generateAuthorSchema, generateWebSiteSchema } from "@/lib/schema";
import PostContent from '@/components/PostContent'
import PageContent from '@/components/PageContent'
import CategoryContent from '@/components/CategoryContent'
import AuthorContent from '@/components/AuthorContent'
import { decodeHtmlEntities, stripHtmlTags } from "@/lib/utils";
import RatingForm from '@/components/RatingForm'

// Helper function to generate schema markup as JSX
function generateSchemaMarkup(schema: any) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: typeof schema === 'string' ? schema : JSON.stringify(schema, null, 2) }}
    />
  );
}

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const post = await getPostBySlug(slug);
  const page = await getPageBySlug(slug);
  const category = await getCategoryBySlug(slug);
  const author = await getAuthorBySlug(slug);

  if (post) {
    const authorData = await getAuthorById(post.author)
    const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/${post.slug}`
    return {
      title: post.yoast_head_json?.title || post.title.rendered,
      description: post.yoast_head_json?.description || stripHtmlTags(decodeHtmlEntities(post.excerpt.rendered)),
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: post.yoast_head_json?.title || post.title.rendered,
        description: post.yoast_head_json?.description || stripHtmlTags(decodeHtmlEntities(post.excerpt.rendered)),
        type: 'article',
        publishedTime: post.date,
        modifiedTime: post.modified,
        authors: [authorData.name],
        url: canonicalUrl,
        images: [post._embedded?.['wp:featuredmedia']?.[0]?.source_url || ""],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.yoast_head_json?.title || post.title.rendered,
        description: post.yoast_head_json?.description || stripHtmlTags(decodeHtmlEntities(post.excerpt.rendered)),
        images: [post._embedded?.['wp:featuredmedia']?.[0]?.source_url || ""],
      },
      robots: {
        index: true,
        follow: true,
      },
    }
  }

  if (page) {
    const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/${page.slug}`
    const pageWithEmbedded = page as any;
    const featuredImageUrl = pageWithEmbedded._embedded?.['wp:featuredmedia']?.[0]?.source_url || "";

    return {
      title: page.yoast_head_json?.title || page.title.rendered,
      description: page.yoast_head_json?.description || stripHtmlTags(decodeHtmlEntities(page.excerpt?.rendered || "")),
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: page.yoast_head_json?.title || page.title.rendered,
        description: page.yoast_head_json?.description || stripHtmlTags(decodeHtmlEntities(page.excerpt?.rendered || "")),
        type: 'website',
        url: canonicalUrl,
        images: featuredImageUrl ? [featuredImageUrl] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: page.yoast_head_json?.title || page.title.rendered,
        description: page.yoast_head_json?.description || stripHtmlTags(decodeHtmlEntities(page.excerpt?.rendered || "")),
        images: featuredImageUrl ? [featuredImageUrl] : [],
      },
      robots: {
        index: true,
        follow: true,
      },
    }
  }

  if (category) {
    const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/${category.slug}`
    return {
      title: category.yoast_head_json?.title || decodeHtmlEntities(category.name),
      description: category.yoast_head_json?.description || `Posts in category ${decodeHtmlEntities(category.name)}`,
      openGraph: {
        title: category.yoast_head_json?.title || decodeHtmlEntities(category.name),
        description: category.yoast_head_json?.description || `Posts in category ${decodeHtmlEntities(category.name)}`,
        type: 'website',
        url: canonicalUrl,
      },
      twitter: {
        card: 'summary',
        title: category.yoast_head_json?.title || decodeHtmlEntities(category.name),
        description: `Posts in category ${decodeHtmlEntities(category.name)}`,
      },
      alternates: {
        canonical: canonicalUrl,
      },
      robots: {
        index: true,
        follow: true,
      },
    }
  }

  if (author) {
    const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/${author.slug}`

    return {
      title: decodeHtmlEntities(author.name),
      description: `Posts by ${decodeHtmlEntities(author.name)}`,
      openGraph: {
        title: decodeHtmlEntities(author.name),
        description: `Posts by ${decodeHtmlEntities(author.name)}`,
        type: 'profile',
        url: canonicalUrl,
        images: [author.avatar_urls?.['96'] || ""],
      },
      twitter: {
        card: 'summary',
        title: decodeHtmlEntities(author.name),
        description: `Posts by ${decodeHtmlEntities(author.name)}`,
        images: [author.avatar_urls?.['96'] || ""],
      },
      alternates: {
        canonical: canonicalUrl,
      },
      robots: {
        index: true,
        follow: true,
      },
    }
  }

  return {
    title: 'Not Found',
    description: 'The page you are looking for does not exist.',
    robots: {
      index: false,
      follow: false,
    },
  }
}

export default async function DynamicPage({ params }: Props) {
  const { slug } = await params;
  const isHomepage = !slug || slug === '' || slug === 'home';

  if (isHomepage) {
    const homepage = await getPageBySlug('home');
    const websiteSchema = generateWebSiteSchema(homepage);

    return (
      <>
        {generateSchemaMarkup(websiteSchema)}
        <div>
          <h1>Welcome to {homepage?.yoast_head_json?.title || process.env.NEXT_PUBLIC_SITE_NAME}</h1>
          <p>{homepage?.yoast_head_json?.description || process.env.NEXT_PUBLIC_SITE_DESCRIPTION}</p>
        </div>
      </>
    );
  }

  const post = await getPostBySlug(slug)
  if (post) {
    const author = await getAuthorById(post.author);
    const articleSchemaResult = generateArticleSchema(post);
    const articleSchema = typeof articleSchemaResult === 'string'
      ? JSON.parse(articleSchemaResult)
      : articleSchemaResult;

    const rating = post.meta?._article_rating ? String(post.meta._article_rating) : 'Not rated yet';
    const ratingCount = String(post.meta?._article_rating_count || 0);

    return (
      <>
        {generateSchemaMarkup(articleSchema)}
        <div>
          <PostContent post={post} />
          <RatingForm postId={post.id} />
          <AuthorContent author={author} />
        </div>
      </>
    )
  }

  const page = await getPageBySlug(slug)
  if (page) {
    const pageSchemaResult = generatePageSchema(page);
    const pageSchema = typeof pageSchemaResult === 'string'
      ? JSON.parse(pageSchemaResult)
      : pageSchemaResult;

    return (
      <>
        {generateSchemaMarkup(pageSchema)}
        <PageContent page={page} />
      </>
    )
  }

  const category = await getCategoryBySlug(slug)
  if (category) {
    const categorySchemaResult = generateCategorySchema(category);
    const categorySchema = typeof categorySchemaResult === 'string'
      ? JSON.parse(categorySchemaResult)
      : categorySchemaResult;

    return (
      <>
        {generateSchemaMarkup(categorySchema)}
        <CategoryContent category={category} />
      </>
    )
  }

  const author = await getAuthorBySlug(slug)
  if (author) {
    const authorSchemaResult = generateAuthorSchema(author);
    const authorSchema = typeof authorSchemaResult === 'string'
      ? JSON.parse(authorSchemaResult)
      : authorSchemaResult;

    return (
      <>
        {generateSchemaMarkup(authorSchema)}
        <AuthorContent author={author} />
      </>
    )
  }

  notFound()
}
