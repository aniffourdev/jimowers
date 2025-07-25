"use client";
import Image from "next/image";
import Link from "next/link";
import { Post } from "@/lib/wordpress.d";
import { cn, formatDate, decodeHtmlEntities } from "@/lib/utils";

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

export function PostCardClient({ post }: { post: Post }) {
  // Type _embedded as any to avoid linter error for unknown keys
  const _embedded = post._embedded as any;
  const date = formatDate(post.date);
  const category = _embedded?.['wp:term']?.[0]?.[0] || null;
  const featuredImage = _embedded?.['wp:featuredmedia']?.[0]?.source_url;
  const author = _embedded?.author?.[0] || null;

  const contentText = post.content?.rendered
    ? decodeHtmlEntities(stripHtml(post.content.rendered)).slice(0, 120)
    : "";

  return (
    <article className="bg-white dark:bg-zinc-900 shadow dark:shadow-lg p-0 overflow-hidden border dark:border-zinc-800 flex flex-col transition-colors duration-200">
      <div className="relative">
        {featuredImage && (
          <Image
            src={featuredImage}
            alt={post.title.rendered}
            width={600}
            height={300}
            className="w-full h-52 object-cover"
            priority={true}
          />
        )}
        {author && (
          <span
            className="absolute bottom-0 bg-teal-700 dark:bg-teal-600 text-white px-3 py-1.5 rounded-tr-lg text-sm font-semibold shadow-md z-10"
            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.15)" }}
          >
            By {author.name}
          </span>
        )}
      </div>
      <div className="px-6 pb-6 pt-4 flex flex-col gap-2">
        <Link
          href={`/${post.slug}`}
          className="hover:text-teal-600 dark:hover:text-teal-400 duration-200 transition-colors"
        >
          <h2 className="text-xl font-bold leading-tight mb-2 mt-3 text-zinc-900 dark:text-zinc-100">
            {decodeHtmlEntities(post.title.rendered)}
          </h2>
        </Link>
        <div className="text-muted-foreground dark:text-zinc-300 text-sm mb-4">
          {contentText}
        </div>
        {author && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {date}
            </span>
          </div>
        )}
      </div>
    </article>
  );
} 