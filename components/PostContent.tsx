import Link from "next/link";
import { Post } from "@/lib/wordpress.d";
import { Section, Container, Prose, Article } from "@/components/craft";
import { Balancer } from "@/components/ui/balancer";
import { badgeVariants } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  getFeaturedMediaById,
  getAuthorById,
  getCategoryById,
} from "@/lib/wordpress";
import parse, { domToReact, Element, DOMNode } from "html-react-parser";
import TableOfContents, { TocItem } from "@/components/TableOfContents";
import Image from "next/image";

function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function generateTableOfContents(content: string) {
  const headingRegex = /<h([2-3])[^>]*>(.*?)<\/h[2-3]>/g;
  const toc: TocItem[] = [];
  const modifiedContent = content.replace(
    headingRegex,
    (match, level, text) => {
      const cleanText = text.replace(/<[^>]+>/g, "").trim();
      const id = createSlug(cleanText);
      toc.push({ text: cleanText, id, level: parseInt(level) });
      return `<h${level} id="${id}">${text}</h${level}>`;
    }
  );
  return { toc, modifiedContent };
}

function youtubeUrlToEmbed(url: string) {
  // Extract the video ID from the URL
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/
  );
  if (!match) return null;
  return `https://www.youtube.com/embed/${match[1]}`;
}

function parseContentWithYouTube(content: string) {
  return parse(content, {
    replace: (domNode: DOMNode) => {
      // Convert plain text YouTube URLs to iframes
      if (domNode.type === "text" && typeof domNode.data === "string") {
        const trimmed = domNode.data.trim();
        if (
          trimmed.startsWith("https://youtube.com/") ||
          trimmed.startsWith("https://www.youtube.com/") ||
          trimmed.startsWith("https://youtu.be/")
        ) {
          const embedUrl = youtubeUrlToEmbed(trimmed);
          if (embedUrl) {
            return (
              <div className="w-full aspect-video my-8">
                <iframe
                  src={embedUrl}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                  style={{ display: "block" }}
                />
              </div>
            );
          }
        }
      }
      // Optionally, handle <a href="youtube..."> links
      if (
        domNode instanceof Element &&
        domNode.name === "a" &&
        domNode.attribs?.href &&
        (domNode.attribs.href.startsWith("https://youtube.com/") ||
          domNode.attribs.href.startsWith("https://www.youtube.com/") ||
          domNode.attribs.href.startsWith("https://youtu.be/"))
      ) {
        const embedUrl = youtubeUrlToEmbed(domNode.attribs.href);
        if (embedUrl) {
          return (
            <div className="w-full aspect-video my-8">
              <iframe
                src={embedUrl}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
                style={{ display: "block" }}
              />
            </div>
          );
        }
      }

      // Make images full width and fix hydration/className issues
      if (domNode instanceof Element && domNode.name === "img") {
        // Convert class to className for React
        const attribs = { ...domNode.attribs };
        if (attribs.class) {
          attribs.className = attribs.class;
          delete attribs.class;
        }
        if (attribs.srcset) {
          attribs.srcSet = attribs.srcset;
          delete attribs.srcset;
        }
        // If parent is <p>, just return the <img> with full width styles
        if (
          domNode.parent &&
          typeof (domNode.parent as any).name === "string" &&
          (domNode.parent as any).name === "p"
        ) {
          return (
            <img
              {...attribs}
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                margin: "2rem 0",
              }}
            />
          );
        }
        // Otherwise, wrap in a div for spacing
        return (
          <div style={{ width: "100%", margin: "2rem 0" }}>
            <img
              {...attribs}
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                margin: 0,
              }}
            />
          </div>
        );
      }
    },
  });
}

// Add a simple Sidebar component at the bottom of the file
function Sidebar() {
  return (
    <aside className="w-full lg:w-80 flex-shrink-0 lg:pl-8 mt-12 lg:mt-0">
      {/* Add your widgets, author info, ads, etc. here */}
      <div className="bg-slate-50 border rounded-lg p-6 mb-6">
        <h3 className="font-bold text-lg mb-2">Sidebar</h3>
        <p className="text-sm text-muted-foreground">
          Add widgets, author info, ads, etc. here.
        </p>
      </div>
    </aside>
  );
}

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

  // Generate TOC and modified content
  const { toc, modifiedContent } = generateTableOfContents(
    post.content.rendered
  );

  return (
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
                  <Link href={`/${author.slug}`}>{author.name}</Link>{" "}
                </span>
              )}
            </h5>
            <Link
              href={`/${category.slug}`}
              className={cn(
                badgeVariants({ variant: "outline" }),
                "!no-underline !text-teal-50 bg-teal-600 font-semibold"
              )}
            >
              {category.name}
            </Link>
          </div>
          {featuredMedia?.source_url && (
            <div className="relative w-full h-72 sm:h-80 md:h-[500px] my-12 overflow-hidden flex items-center justify-center border rounded-lg bg-accent/25">
              <Image
                src={featuredMedia.source_url}
                alt={post.title.rendered}
                fill
                priority // sets fetchpriority="high" and disables lazy loading
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, 1200px"
                className="object-cover"
              />
            </div>
          )}
        </Prose>

        {/* Two-column layout below the featured image */}
        <div className="flex flex-col lg:flex-row gap-0 lg:gap-8">
          {/* Left: TOC and Article */}
          <div className="flex-1 min-w-0">
            {toc.length > 0 && <TableOfContents toc={toc} />}
            <Article>{parseContentWithYouTube(modifiedContent)}</Article>
          </div>
          {/* Right: Sidebar */}
          <Sidebar />
        </div>
      </Container>
    </Section>
  );
}
