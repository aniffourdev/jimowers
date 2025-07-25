import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getPost, getCategory, getAuthor } from '@/lib/api'
import { getAuthorById, getFeaturedMediaById } from '@/lib/wordpress'
import { getPostBySlug, getPageBySlug, getCategoryBySlug, getAuthorBySlug } from "@/lib/wordpress";
import { generateArticleSchema, generatePageSchema, generateCategorySchema, generateAuthorSchema } from "@/lib/schema";
import PostContent from '@/components/PostContent'
import PageContent from '@/components/PageContent'
import CategoryContent from '@/components/CategoryContent'
import AuthorContent from '@/components/AuthorContent'
import { decodeHtmlEntities, stripHtmlTags } from "@/lib/utils";

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Await params before accessing its properties
  const { slug } = await params;
  
  const post = await getPostBySlug(slug);
  const page = await getPageBySlug(slug);
  const category = await getCategoryBySlug(slug);
  const author = await getAuthorBySlug(slug);

  if (post) {
    const author = await getAuthorById(post.author)
    const schema = generateArticleSchema(post)
    const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/${post.slug}`
    
    return {
      title: post.title.rendered,
      description: stripHtmlTags(decodeHtmlEntities(post.excerpt.rendered)),
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: post.title.rendered,
        description: stripHtmlTags(decodeHtmlEntities(post.excerpt.rendered)),
        type: 'article',
        publishedTime: post.date,
        modifiedTime: post.modified,
        authors: [author.name],
        url: canonicalUrl,
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title.rendered,
        description: stripHtmlTags(decodeHtmlEntities(post.excerpt.rendered)),
      },
      other: {
        'schema-org': JSON.stringify(schema),
      },
      robots: {
        index: true,
        follow: true,
      },
    }
  }

  if (page) {
    return {
      title: page.title.rendered,
      description: stripHtmlTags(decodeHtmlEntities(page.excerpt.rendered)),
      openGraph: {
        title: page.title.rendered,
        description: stripHtmlTags(decodeHtmlEntities(page.excerpt.rendered)),
        type: 'website',
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/${page.slug}`,
      },
      twitter: {
        card: 'summary',
        title: page.title.rendered,
        description: stripHtmlTags(decodeHtmlEntities(page.excerpt.rendered)),
      },
      robots: {
        index: true,
        follow: true,
      },
      other: {
        'application/ld+json': generatePageSchema(page),
      },
    }
  }

  if (category) {
    const schema = generateCategorySchema(category)
    const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/${category.slug}`
    
    return {
      title: decodeHtmlEntities(category.name),
      description: `Posts in category ${decodeHtmlEntities(category.name)}`,
      openGraph: {
        title: decodeHtmlEntities(category.name),
        description: `Posts in category ${decodeHtmlEntities(category.name)}`,
        type: 'website',
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/${category.slug}`,
      },
      twitter: {
        card: 'summary',
        title: decodeHtmlEntities(category.name),
        description: `Posts in category ${decodeHtmlEntities(category.name)}`,
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/${category.slug}`,
      },
      robots: {
        index: true,
        follow: true,
      },
      other: {
        'schema-org': JSON.stringify(schema),
      },
    }
  }

  if (author) {
    const schema = generateAuthorSchema(author)
    const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/${author.slug}`
    return {
      title: decodeHtmlEntities(author.name),
      description: `Posts by ${decodeHtmlEntities(author.name)}`,
      openGraph: {
        title: decodeHtmlEntities(author.name),
        description: `Posts by ${decodeHtmlEntities(author.name)}`,
        type: 'profile',
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/${author.slug}`,
      },
      twitter: {
        card: 'summary',
        title: decodeHtmlEntities(author.name),
        description: `Posts by ${decodeHtmlEntities(author.name)}`,
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/${author.slug}`,
      },
      robots: {
        index: true,
        follow: true,
      },
      other: {
        'schema-org': JSON.stringify(schema),
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
  // Await params before accessing its properties
  const { slug } = await params;

  // Try to get post first
  const post = await getPost(slug)
  if (post) {
    return <PostContent post={post} />
  }

  // Try to get page
  const page = await getPageBySlug(slug)
  if (page) {
    return <PageContent page={page} />
  }

  // Try to get category
  const category = await getCategory(slug)
  if (category) {
    return <CategoryContent category={category} />
  }

  // Try to get author
  const author = await getAuthor(slug)
  if (author) {
    return <AuthorContent author={author} />
  }

  // If nothing is found, return 404
  notFound()
}