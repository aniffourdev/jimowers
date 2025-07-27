import { Author } from "@/lib/wordpress.d";
import { Section, Container } from "@/components/craft";
import { PostCard } from "@/components/posts/post-card";
import { getPostsByAuthor } from "@/lib/wordpress";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { redirect } from "next/navigation";
import Image from "next/image";
import { IoCheckmarkCircle } from "react-icons/io5";
import { FaLinkedin, FaFacebook } from "react-icons/fa";
import { RiTwitterXFill } from "react-icons/ri";
import Link from "next/link";

export default async function AuthorContent({
  author,
  searchParams = {},
}: {
  author: Author;
  searchParams?: Record<string, string>;
}) {
  const posts = await getPostsByAuthor(author.id);

  type Social = { type: string; url: string; icon: JSX.Element; label: string };
  const socials: Social[] = [];
  if (author.linkedin) {
    socials.push({
      type: "linkedin",
      url: author.linkedin,
      icon: <FaLinkedin className="size-5" />,
      label: "LinkedIn",
    });
  }
  if (author.facebook) {
    socials.push({
      type: "facebook",
      url: author.facebook,
      icon: <FaFacebook className="size-5" />,
      label: "Facebook",
    });
  }
  // X (Twitter) support: check author.x, else parse sameAs
  let xUrl = author.x;
  if (!xUrl && Array.isArray(author.sameAs)) {
    xUrl = author.sameAs.find(
      (url: string) => url.includes("x.com") || url.includes("twitter.com")
    );
  }
  if (xUrl) {
    socials.push({
      type: "x",
      url: xUrl,
      icon: <RiTwitterXFill className="size-5" />,
      label: "X (Twitter)",
    });
  }

  return (
    <Section>
      <Container className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center text-center gap-6 mb-8">
          <div className="flex flex-col items-center gap-4">
            {author.avatar_urls && (
              <Image
                src={author.avatar_urls[96] || author.avatar_urls[48]}
                alt={author.name}
                className="rounded-full w-24 h-24 sm:w-32 sm:h-32 object-cover border-4 border-gray-200 dark:border-zinc-700"
                height={128}
                width={128}
              />
            )}
            <div className="flex flex-col items-center">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 flex items-center gap-1">
                {author.name}{" "}
                <IoCheckmarkCircle
                  className="size-5 relative -top-[1.2px] text-teal-700"
                  title="Verified"
                />
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mb-3 text-center">Lead Turf Specialist & Mow-ditor in Chief</p>
              <div className="flex gap-3 mb-4">
                {socials.map((social) => (
                  <Link
                    key={social.type}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-teal-600 transition-colors"
                    aria-label={social.label}
                  >
                    <div className="size-5">
                      {social.icon}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
        {author.description && (
          <p className="text-center text-muted-foreground mb-8 border-t border-gray-200 dark:border-zinc-800 pt-6 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            {author.description}
          </p>
        )}
      </Container>
      <Container>
        <div className="w-full mt-8 sm:mt-12">
          <h2 className="text-xl sm:text-2xl mb-6 font-bold text-center">
            Articles from <span className="text-teal-600">{author.name}</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
