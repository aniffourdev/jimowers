import Image from "next/image";
import Link from "next/link";

import { Post } from "@/lib/wordpress.d";
import { cn } from "@/lib/utils";

import {
  getFeaturedMediaById,
  getAuthorById,
  getCategoryById,
} from "@/lib/wordpress";

import { formatDate } from "@/lib/utils";

export async function PostCard({ post }: { post: Post }) {
  const media = post.featured_media
    ? await getFeaturedMediaById(post.featured_media)
    : null;
  const author = post.author ? await getAuthorById(post.author) : null;
  const date = formatDate(post.date);
  const category = post.categories?.[0]
    ? await getCategoryById(post.categories[0])
    : null;

  return (
    <article className="flex flex-col gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
      {post._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
        <Link href={`/${post.slug}`}>
          <img
            src={post._embedded['wp:featuredmedia'][0].source_url}
            alt={post.title.rendered}
            className="w-full h-48 object-cover rounded-lg"
          />
        </Link>
      )}
      <div className="flex flex-col gap-2">
        {category && (
          <Link
            href={`/${category.slug}`}
            className="text-sm text-muted-foreground hover:underline"
          >
            {category.name}
          </Link>
        )}
        <Link href={`/${post.slug}`} className="hover:underline">
          <h2 className="text-xl font-semibold">{post.title.rendered}</h2>
        </Link>
        <div
          className="text-muted-foreground line-clamp-2"
          dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
        />
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>{date}</span>
        </div>
      </div>
    </article>
  );
}
