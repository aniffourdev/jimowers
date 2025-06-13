import {
  getPostBySlug,
  getFeaturedMediaById,
  getAuthorById,
  getCategoryById,
  getAllPosts,
} from "@/lib/wordpress";

import { Section, Container, Article, Prose } from "@/components/craft";
import { badgeVariants } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/site.config";

import Link from "next/link";
import Balancer from "react-wrap-balancer";

import type { Metadata } from "next";
import { generateMetadata as generatePageMetadata } from "@/lib/metadata";
import { SchemaMarkup } from "@/components/schema/schema-markup";

export async function generateStaticParams() {
  const posts = await getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  
  return generatePageMetadata({
    title: `${post.title.rendered} | ${siteConfig.site_name}`,
    description: post.excerpt.rendered.replace(/<[^>]*>/g, ""),
    path: `/posts/${params.slug}`,
  });
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  const featuredMedia = post.featured_media
    ? await getFeaturedMediaById(post.featured_media)
    : null;
  const author = await getAuthorById(post.author);
  const date = new Date(post.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const category = await getCategoryById(post.categories[0]);

  return (
    <>
      <SchemaMarkup type="post" data={post} />
      <Section>
        <Container>
          <Prose>
            <h1>
              <Balancer>
                <span
                  dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                ></span>
              </Balancer>
            </h1>
            <div className="flex justify-between items-center gap-4 text-sm mb-4">
              <h5>
                Published {date} by{" "}
                {author.name && (
                  <span>
                    <a href={`/posts/?author=${author.id}`}>{author.name}</a>{" "}
                  </span>
                )}
              </h5>

              <Link
                href={`/posts/?category=${category.id}`}
                className={cn(
                  badgeVariants({ variant: "outline" }),
                  "!no-underline"
                )}
              >
                {category.name}
              </Link>
            </div>
            {featuredMedia?.source_url && (
              <div className="h-96 my-12 md:h-[500px] overflow-hidden flex items-center justify-center border rounded-lg bg-accent/25">
                {/* eslint-disable-next-line */}
                <img
                  className="w-full h-full object-cover"
                  src={featuredMedia.source_url}
                  alt={post.title.rendered}
                />
              </div>
            )}
          </Prose>

          <Article dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
        </Container>
      </Section>
    </>
  );
}
