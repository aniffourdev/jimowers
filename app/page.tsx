// Craft Imports
import { Section, Container, Prose } from "@/components/craft";
import { PostCard } from "@/components/posts/post-card";
import PillarPostsCarousel from "@/components/PillarPostsCarousel";
import {
  getAllCategories,
  getAllAuthors,
  getAllPosts,
  getPostsByCategory,
  getAuthorById,
} from "@/lib/wordpress";
import { decodeHtmlEntities } from "@/lib/utils";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import AuthorSpotlightCarousel from "@/components/AuthorSpotlightCarousel";
import { PiResizeDuotone } from "react-icons/pi";

// Helper to fetch only pillar posts
async function getPillarPosts() {
  // Use the integer term ID for pillar (13)
  return await getAllPosts({ content_type: 13 });
}

// SVG for ruler/mower illustration
const RulerSVG = () => (
  <svg
    width="80"
    height="40"
    viewBox="0 0 80 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="5" y="15" width="70" height="10" rx="3" fill="#14b8a6" />
    <rect x="10" y="18" width="2" height="4" rx="1" fill="#fff" />
    <rect x="18" y="18" width="2" height="4" rx="1" fill="#fff" />
    <rect x="26" y="18" width="2" height="4" rx="1" fill="#fff" />
    <rect x="34" y="18" width="2" height="4" rx="1" fill="#fff" />
    <rect x="42" y="18" width="2" height="4" rx="1" fill="#fff" />
    <rect x="50" y="18" width="2" height="4" rx="1" fill="#fff" />
    <rect x="58" y="18" width="2" height="4" rx="1" fill="#fff" />
    <rect x="66" y="18" width="2" height="4" rx="1" fill="#fff" />
    <circle cx="75" cy="20" r="5" fill="#0f766e" />
    <rect x="72" y="17" width="6" height="6" rx="3" fill="#fff" />
  </svg>
);

export default async function Home() {
  // Fetch data
  const categories = await getAllCategories();
  const authors = await getAllAuthors();
  const posts = await getAllPosts({});
  const pillarPosts = await getPillarPosts();

  // Fetch author with id 2 for testimonial
  const testimonialAuthor = await getAuthorById(2);

  // 1. Hero Section
  const hero = (
    <Section className="py-12 md:py-20 text-center bg-teal-50 dark:bg-zinc-900">
      <Container>
        <h1 className="text-4xl md:text-5xl font-black mb-4">
          Your Ultimate Guide to Lawn Mowers and Eco-Friendly Lawn Care
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Expert reviews, maintenance tips, and eco-friendly guides from trusted
          authors.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
          <Link
            href="/category/lawn-mowers"
            className="px-6 py-3 rounded border font-semibold bg-white text-teal-600 transition"
          >
            Explore Lawn Mowers
          </Link>
          <Link
            href="/buying-guides"
            className="px-6 py-3 rounded border font-semibold bg-white text-teal-600 transition"
          >
            Read Our Buying Guides
          </Link>
          <Link
            href="/authors"
            className="px-6 py-3 rounded border font-semibold bg-white text-teal-600 transition"
          >
            Meet Our Experts
          </Link>
        </div>
      </Container>
    </Section>
  );

  const pillarGrid = (
    <Section className="py-8">
      <Container>
      <h2 className="text-2xl font-bold mb-5 text-center underline underline-offset-4 decoration-teal-200 ring-offset-black">
          Explore Our Main Topics
        </h2>
        <PillarPostsCarousel posts={pillarPosts} />
      </Container>
    </Section>
  );

  // Lawn Mower Size Finder Tool Section
  const sizeFinderSection = (
    <Section className="max-w-6xl mx-auto py-4 px-6 ">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg flex flex-col md:flex-row items-center gap-8 p-8 border dark:border-zinc-800">
        <div className="flex-1 flex flex-col items-start justify-center">
          <div className="flex items-center gap-2 mb-2">
            <PiResizeDuotone className="text-teal-600 size-8" />
            <h2 className="text-2xl font-bold">Lawn Mower Size Finder Tool</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            Not sure what size lawn mower you need? Use our free Lawn Mower Size
            Finder to get personalized recommendations based on your lawn size,
            terrain, and mowing habits. Whether you have a small yard or acres
            of grass, this tool helps you choose the perfect mower with
            confidence.
          </p>
          <Link href="/lawn-mower-size-finder">
            <button className="bg-gradient-to-r from-teal-500 to-teal-700 hover:from-teal-600 hover:to-teal-800 text-white font-bold px-6 py-3 rounded-full shadow transition mb-2">
              🔍 Find Your Mower Size
            </button>
          </Link>
          <span className="text-xs text-muted-foreground mb-2">
            Takes less than 30 seconds to get your result.
          </span>
          <div className="mt-4 flex items-center gap-0.5">
            <span className="text-yellow-400 text-lg">★</span>
            <span className="text-yellow-400 text-lg">★</span>
            <span className="text-yellow-400 text-lg">★</span>
            <span className="text-yellow-400 text-lg">★</span>
            <span className="text-yellow-400 text-lg">★</span>
            <span className="text-xs text-muted-foreground ml-2">
              “This tool helped me find the right mower for my backyard in
              seconds!”
            </span>
          </div>
          {/* Created by author */}
          {testimonialAuthor && (
            <div className="flex items-center gap-2 mt-3">
              {testimonialAuthor.avatar_urls?.[48] && (
                <Image
                  src={testimonialAuthor.avatar_urls[48]}
                  alt={testimonialAuthor.name}
                  width={32}
                  height={32}
                  className="rounded-full border"
                />
              )}
              <span className="text-xs text-muted-foreground">
                Created by:{" "}
                <Link
                  href={`/${testimonialAuthor.slug}`}
                  className="font-semibold duration-300 transition-all hover:text-teal-500"
                >
                  {testimonialAuthor.name}
                </Link>
              </span>
            </div>
          )}
        </div>
        <div className="flex-shrink-0">
          <RulerSVG />
        </div>
      </div>
    </Section>
  );

  // 3. Latest from Each Category (show 3 latest posts per main category)
  const clusterSections = await Promise.all(
    categories.slice(0, 4).map(async (cat) => {
      const catPosts = await getPostsByCategory(cat.id);
      return (
        <Section key={cat.id} className="py-8">
          <Container>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Link href={`/${cat.slug}`}>{decodeHtmlEntities(cat.name)}</Link>
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {catPosts.slice(0, 3).map((post) => {
                const author = authors.find(a => a.id === post.author);
                return <PostCard key={post.id} post={post} author={author} />;
              })}
            </div>
          </Container>
        </Section>
      );
    })
  );

  // 4. Author Spotlight (3 creative authors)
  const spotlightAuthors = authors.slice(0, 3).map((author, i) => ({
    ...author,
    expertise: [
      "Electric Lawn Mower Expert",
      "Eco-Friendly Lawn Specialist",
      "Maintenance Guru",
    ][i % 3],
    bio:
      author.description || "Trusted contributor to our lawn care community.",
  }));
  const authorSpotlight = (
    <Section className="py-8">
      <Container>
        <h2 className="text-2xl font-bold mb-5 text-center underline underline-offset-4 decoration-teal-200 ring-offset-black">Author Spotlight</h2>
        <AuthorSpotlightCarousel authors={spotlightAuthors} />
      </Container>
    </Section>
  );

  // 5. Top Resources / Evergreen Guides (3 creative posts)
  const evergreenPosts = posts.slice(0, 3);
  const evergreenGuides = (
    <Section className="py-8">
      <Container>
        <h2 className="text-xl font-bold mb-4">
          Top Resources / Evergreen Guides
        </h2>
        <ul className="list-disc pl-6 space-y-2">
          {evergreenPosts.map((post) => (
            <li key={post.id}>
              <Link
                href={`/${post.slug}`}
                className="font-semibold hover:underline"
              >
                {decodeHtmlEntities(post.title.rendered)}
              </Link>
              <span className="block text-muted-foreground text-sm">
                {decodeHtmlEntities(
                  post.excerpt?.rendered?.replace(/<[^>]+>/g, "") || ""
                )}
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );

  // 7. Email opt-in/newsletter
  const newsletterSection = (
    <Section className="py-8">
      <Container>
        <div className="max-w-lg mx-auto bg-teal-50 dark:bg-zinc-800 rounded-lg p-6 text-center">
          <h3 className="text-lg font-bold mb-2">
            Download Our Free Lawn Mower Maintenance Checklist
          </h3>
          <p className="text-muted-foreground mb-4">
            Subscribe to get expert tips, guides, and our exclusive checklist
            delivered to your inbox.
          </p>
          <form className="flex flex-col md:flex-row gap-2 justify-center">
            <Input
              type="email"
              placeholder="Your email address"
              required
              className="flex-1"
            />
            <button
              type="submit"
              className="px-6 py-2 rounded bg-teal-700 text-white font-semibold hover:bg-teal-800 transition"
            >
              Subscribe
            </button>
          </form>
        </div>
      </Container>
    </Section>
  );

  return (
    <main>
      {hero}
      {pillarGrid}
      {sizeFinderSection}
      {clusterSections}
      {authorSpotlight}
      {/* {evergreenGuides} */}
      {newsletterSection}
    </main>
  );
}
