import { getAllAuthors } from "@/lib/wordpress";
import { Section, Container, Prose } from "@/components/craft";
import { Metadata } from "next";
import BackButton from "@/components/back";
import Link from "next/link";
import { generateMetadata } from "@/lib/metadata";
import { siteConfig } from "@/site.config";

export const metadata = generateMetadata({
  title: "Authors | " + siteConfig.site_name,
  description: "Our blog authors and contributors.",
  path: "/posts/authors",
  noindex: true,
});

export default async function AuthorsPage() {
  const authors = await getAllAuthors();

  return (
    <Section>
      <Container className="space-y-6">
        <Prose className="mb-8">
          <h2>All Authors</h2>
          <ul className="grid">
            {authors.map((author: any) => (
              <li key={author.id}>
                <Link href={`/posts/?author=${author.id}`}>{author.name}</Link>
              </li>
            ))}
          </ul>
        </Prose>
        <BackButton />
      </Container>
    </Section>
  );
}
