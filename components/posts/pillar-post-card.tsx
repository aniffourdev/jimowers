import Image from "next/image";
import Link from "next/link";
import { Post } from "@/lib/wordpress.d";
import { decodeHtmlEntities, formatDate } from "@/lib/utils";
import { IoCheckmarkCircle } from "react-icons/io5";

export default function PillarPostCard({ post }: { post: Post }) {
  const _embedded = post._embedded as any;
  const featuredImage = _embedded?.["wp:featuredmedia"]?.[0]?.source_url;
  const category = _embedded?.["wp:term"]?.[0]?.[0] || null;
  const author = _embedded?.author?.[0] || null;
  const date = formatDate(post.date);
  const contentText = post.content?.rendered
    ? decodeHtmlEntities(post.content.rendered.replace(/<[^>]+>/g, "")).slice(
        0,
        100
      )
    : "";

  return (
    <article className="relative rounded-2xl overflow-hidden shadow-xl border dark:border-zinc-800 bg-gradient-to-br from-teal-50 to-white dark:from-zinc-900 dark:to-zinc-800 group transition-transform hover:scale-[1.025]">
      {featuredImage && (
        <div className="relative h-56 w-full overflow-hidden">
          <Image
            src={featuredImage}
            alt={post.title.rendered}
            fill
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
            priority={true}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          {category && (
            <span className="absolute top-4 left-4 bg-teal-600 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg z-10">
              {decodeHtmlEntities(category.name)}
            </span>
          )}
        </div>
      )}
      <div className="p-6 flex flex-col gap-2 z-10 relative">
        <Link href={`/${post.slug}`} className="hover:underline">
          <h2 className="text-2xl font-extrabold leading-tight mb-2 text-zinc-900 dark:text-white drop-shadow-lg">
            {decodeHtmlEntities(post.title.rendered)}
          </h2>
        </Link>
        <p className="text-base text-zinc-700 dark:text-zinc-200 mb-2 line-clamp-2">
          {contentText}
        </p>
        <div className="flex items-center justify-center gap-1.5 mt-2">
          {author && author.avatar_urls?.[48] && (
            <Image
              src={author.avatar_urls[48]}
              alt={author.name}
              width={32}
              height={32}
              className="rounded-full border"
            />
          )}
          {author && (
            <span className="flex justify-start items-center gap-1 text-sm font-medium text-zinc-800 dark:text-zinc-200">
              {author.name}
              <IoCheckmarkCircle
                className="size-4 relative top-[1.5px] text-teal-700"
                title="Verified"
              />
            </span>
          )}
          <span className="text-xs text-zinc-500 dark:text-zinc-400 ml-auto">
            {date}
          </span>
        </div>
      </div>
    </article>
  );
}
