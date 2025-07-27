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
  getPostsByCategory,
  getCommentsByPostId,
} from "@/lib/wordpress";
import parse, { Element, DOMNode } from "html-react-parser";
import TableOfContents, { TocItem } from "@/components/TableOfContents";
import Image from "next/image";
import { FaFire } from "react-icons/fa";
import { FaFacebookF, FaXTwitter, FaPinterestP } from "react-icons/fa6";
import CommentsSection from "@/components/CommentsSection";
import ShareSection from "@/components/ShareSection";

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
  let firstImageFound = false;
 
 // Get the current domain for internal link detection
 const getCurrentDomain = () => {
   if (typeof window !== 'undefined') {
     return window.location.hostname;
   }
   // Fallback for SSR - you can replace this with your actual domain
   return process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL).hostname : 'localhost';
 };
 
 const currentDomain = getCurrentDomain();
 
  return parse(content, {
    replace: (domNode: DOMNode) => {
      // Convert internal links to Next.js Link components
      if (domNode instanceof Element && domNode.name === "a" && domNode.attribs?.href) {
        const href = domNode.attribs.href;
        
        // Check if it's an internal link (relative URL or same domain)
        const isInternalLink = href.startsWith('/') || 
          href.startsWith('./') || 
          href.startsWith('../') ||
          (href.startsWith('http') && (href.includes(currentDomain) || href.includes('localhost')));
        
        if (isInternalLink) {
          // Extract the slug from the URL
          let slug = href;
          
          // Remove domain if present
          if (href.startsWith('http')) {
            const url = new URL(href);
            slug = url.pathname;
          }
          
          // Remove leading slash and any query parameters
          slug = slug.replace(/^\//, '').split('?')[0].split('#')[0];
          
          // If it's not empty and doesn't contain file extensions, treat as internal link
          if (slug && !slug.includes('.') && !slug.includes('wp-admin') && !slug.includes('wp-content')) {
            // Extract text content from children
            const linkText = domNode.children?.map(child => {
              if (child.type === 'text') {
                return child.data;
              }
              return '';
            }).join('') || '';
            
            return (
              <Link
                href={`/${slug}`}
                className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
              >
                {linkText}
              </Link>
            );
          }
        }
        
        // For external links, keep as regular anchor but add target="_blank" and rel="noopener noreferrer"
        if (href.startsWith('http') && !href.includes(currentDomain) && !href.includes('localhost')) {
          // Extract text content from children
          const linkText = domNode.children?.map(child => {
            if (child.type === 'text') {
              return child.data;
            }
            return '';
          }).join('') || '';
          
          return (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
            >
              {linkText}
            </a>
          );
        }
      }
      
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
        // Use Next.js Image for optimization
        const isLCP = !firstImageFound;
        if (isLCP) firstImageFound = true;
        const imageProps = {
          src: attribs.src,
          alt: attribs.alt || "Article image",
          width: attribs.width ? parseInt(attribs.width) : 800,
          height: attribs.height ? parseInt(attribs.height) : 450,
          style: {
            width: "100%",
            height: "auto",
            display: "block",
            margin: "2rem 0",
          },
          sizes: "(max-width: 640px) 100vw, (max-width: 768px) 100vw, 1200px",
          quality: 75,
          ...(isLCP
            ? { loading: "eager" as const, fetchPriority: "high" as const }
            : { loading: "lazy" as const }),
          className: attribs.className || "object-cover",
        };
        // If parent is <p>, just return the <Image> with full width styles
        if (
          domNode.parent &&
          typeof (domNode.parent as any).name === "string" &&
          (domNode.parent as any).name === "p"
        ) {
          return <Image {...imageProps} />;
        }
        // Otherwise, wrap in a div for spacing
        return (
          <div style={{ width: "100%", margin: "2rem 0" }}>
            <Image {...imageProps} />
          </div>
        );
      }
    },
  });
}

// Add a simple Sidebar component at the bottom of the file
function Sidebar({ author }: { author: any }) {
  // Truncate bio to max 120 characters
  const truncatedBio = author.description
    ? author.description.length > 120
      ? author.description.substring(0, 100) + "..."
      : author.description
    : "";

  return (
    <aside className="w-full lg:w-80 flex-shrink-0 lg:pl-8 mt-12 lg:mt-0">
      {/* Author Widget */}
      <div className="bg-muted/60 dark:bg-muted/80 border-border p-6 mb-8 relative rounded-2xl overflow-hidden shadow-xl border dark:border-zinc-800 bg-gradient-to-br from-teal-50 to-white dark:from-zinc-900 dark:to-zinc-800 group transition-transform hover:scale-[1.025]">
        <div className="flex flex-col items-center text-center">
          {/* Author Profile Image */}
          <Link href={`/${author.slug}`} className="group">
            <div className="relative mb-3">
              {author.avatar_urls && (
                <Image
                  src={author.avatar_urls[96] || author.avatar_urls[48]}
                  alt={author.name}
                  width={80}
                  height={80}
                  className="rounded-full object-cover"
                />
              )}
            </div>
          </Link>

          {/* Author Name */}
          <Link
            href={`/${author.slug}`}
            className="text-lg font-semibold text-foreground hover:text-primary transition-colors mb-2"
          >
            {author.name}
          </Link>

          {/* Author Bio */}
          {truncatedBio && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {truncatedBio}
            </p>
          )}
        </div>
      </div>

      {/* Trending Articles Widget */}
      <TrendingArticlesWidget />
    </aside>
  );
}

// Trending Articles Widget Component
async function TrendingArticlesWidget() {
  // Fetch some trending articles (you can modify this logic as needed)
  const trendingPosts = await getPostsByCategory(1); // Get posts from first category as example

  return (
    <div className="">
      {/* Header with flame icon */}
      <div className="flex items-center justify-start gap-2 mb-2">
        <FaFire className="text-orange-500 text-lg" />
        <h3 className="font-bold text-xl text-foreground underline underline-offset-6 decoration-teal-200">
          Trending Articles
        </h3>
      </div>

      {/* Articles List */}
      <div className="space-y-0">
        {trendingPosts.slice(0, 4).map((post, index) => (
          <div key={post.id}>
            <div className="flex items-center justify-center gap-3 py-3">
              {/* Circular Thumbnail */}
              <div className="flex-shrink-0">
                {post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ? (
                  <Image
                    src={post._embedded["wp:featuredmedia"][0].source_url}
                    alt={post.title.rendered}
                    width={48}
                    height={48}
                    className="rounded-full object-cover w-12 h-12"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-muted-foreground/20 flex items-center justify-center">
                    <span className="text-muted-foreground text-xs">📄</span>
                  </div>
                )}
              </div>

              {/* Article Title */}
              <Link
                href={`/${post.slug}`}
                className="text-sm text-foreground font-semibold hover:text-primary transition-colors leading-tight line-clamp-2"
              >
                {post.title.rendered.replace(/<[^>]*>/g, "")}
              </Link>
            </div>

            {/* Separator line (except for last item) */}
            {index < Math.min(trendingPosts.length, 4) - 1 && (
              <div className="border-t border-border/50 w-full" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Author Details Section Component
function AuthorDetailsSection({ author }: { author: any }) {
  return (
    <div className="bg-slate-100 dark:bg-muted/80 rounded-2xl p-6 mb-8">
      <div className="flex items-start gap-4">
        {/* Author Image */}
        <div className="flex-shrink-0">
          {author.avatar_urls && (
            <Image
              src={author.avatar_urls[96] || author.avatar_urls[48]}
              alt={author.name}
              width={80}
              height={80}
              className="rounded-full object-cover"
            />
          )}
        </div>

        {/* Author Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-xl text-foreground mb-2">
            {author.name}
          </h3>
          {author.description && (
            <p className="text-muted-foreground leading-relaxed mb-4">
              {author.description}
            </p>
          )}
          <Link
            href={`/${author.slug}`}
            className="text-teal-500 text-sm font-bold hover:text-primary/80 transition-colors"
          >
            View All Posts &gt;
          </Link>
        </div>
      </div>
    </div>
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

  // Fetch comments for this post
  const comments = await getCommentsByPostId(post.id);

  const postTitle = post.title.rendered.replace(/<[^>]*>/g, "");

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
                loading="eager"
                fetchPriority="high"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, 426px"
                className="object-cover"
              />
            </div>
          )}
        </Prose>

        {/* Two-column layout below the featured image */}
        <div className="flex flex-col lg:flex-row gap-0 lg:gap-5">
          {/* Left: TOC and Article */}
          <div className="flex-1 min-w-0">
            {toc.length > 0 && <TableOfContents toc={toc} />}
            <Article>{parseContentWithYouTube(modifiedContent)}</Article>

            {/* Share Section */}
            <ShareSection title={postTitle} slug={post.slug} />

            {/* Author Details Section */}
            <AuthorDetailsSection author={author} />

            {/* Comments Section */}
            <div className="mt-16">
              <CommentsSection postId={post.id} initialComments={comments} />
            </div>
          </div>
          {/* Right: Sidebar */}
          <Sidebar author={author} />
        </div>
      </Container>
    </Section>
  );
}
