import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getPost, getCategory, getTag, getAuthor } from '@/lib/api'
import { getAuthorById, getFeaturedMediaById } from '@/lib/wordpress'
import { getPostBySlug, getPageBySlug, getCategoryBySlug, getTagBySlug, getAuthorBySlug } from "@/lib/wordpress";
import { generateArticleSchema, generatePageSchema, generateCategorySchema, generateTagSchema, generateAuthorSchema } from "@/lib/schema";
import PostContent from '@/components/PostContent'
import PageContent from '@/components/PageContent'
import CategoryContent from '@/components/CategoryContent'
import TagContent from '@/components/TagContent'
import AuthorContent from '@/components/AuthorContent'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Await params before accessing its properties
  const { slug } = await params;
  
  const post = await getPostBySlug(slug);
  const page = await getPageBySlug(slug);
  const category = await getCategoryBySlug(slug);
  const tag = await getTagBySlug(slug);
  const author = await getAuthorBySlug(slug);

  if (post) {
    const author = await getAuthorById(post.author)
    const schema = generateArticleSchema(post)
    const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/${post.slug}`
    
    return {
      title: post.title.rendered,
      description: post.excerpt.rendered,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title: post.title.rendered,
        description: post.excerpt.rendered,
        type: 'article',
        publishedTime: post.date,
        modifiedTime: post.modified,
        authors: [author.name],
        url: canonicalUrl,
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title.rendered,
        description: post.excerpt.rendered,
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
      description: page.excerpt.rendered,
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
      title: `Category: ${category.name}`,
      description: `Posts in category ${category.name}`,
      alternates: {
        canonical: canonicalUrl,
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

  if (tag || author) {
    const schema = tag ? generateTagSchema(tag) : generateAuthorSchema(author)
    const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/${tag ? tag.slug : author.slug}`
    
    return {
      title: tag ? `Tag: ${tag.name}` : `Author: ${author.name}`,
      description: tag ? `Posts tagged with ${tag.name}` : `Posts by ${author.name}`,
      alternates: {
        canonical: canonicalUrl,
      },
      robots: {
        index: false,
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

  // Try to get category
  const category = await getCategory(slug)
  if (category) {
    return <CategoryContent category={category} />
  }

  // Try to get tag
  const tag = await getTag(slug)
  if (tag) {
    return <TagContent tag={tag} />
  }

  // Try to get author
  const author = await getAuthor(slug)
  if (author) {
    return <AuthorContent author={author} />
  }

  // If nothing is found, return 404
  notFound()
}