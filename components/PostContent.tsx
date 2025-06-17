import Link from "next/link";
import { Post } from "@/lib/wordpress.d";
import { Section, Container, Prose, Article } from "@/components/craft";
import { Balancer } from "@/components/ui/balancer";
import { badgeVariants } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getFeaturedMediaById, getAuthorById, getCategoryById } from "@/lib/wordpress";

export default async function PostContent({ post }: { post: Post }) {
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
    <Section>
      <Container>
        <Prose>
          <h1>
            <Balancer>
              <span dangerouslySetInnerHTML={{ __html: post.title.rendered }}></span>
            </Balancer>
          </h1>
          <div className="flex justify-between items-center gap-4 text-sm mb-4">
            <h5>
              Published {date} by{" "}
              {author.name && (
                <span>
                  <Link href={`/${author.slug}`}>{author.name}</Link>{" "}
                </span>
              )}
            </h5>

            <Link
              href={`/${category.slug}`}
              className={cn(badgeVariants({ variant: "outline" }), "!no-underline")}
            >
              {category.name}
            </Link>
          </div>
          {featuredMedia?.source_url && (
            <div className="h-96 my-12 md:h-[500px] overflow-hidden flex items-center justify-center border rounded-lg bg-accent/25">
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
  );
} 