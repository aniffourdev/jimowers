import { getAllTags } from "@/lib/wordpress";
import { Section, Container, Prose } from "@/components/craft";
import { Metadata } from "next";
import BackButton from "@/components/back";
import Link from "next/link";
import { generateMetadata } from "@/lib/metadata";
import { siteConfig } from "@/site.config";

export const metadata = generateMetadata({
  title: "Tags | " + siteConfig.site_name,
  description: "Browse our blog posts by tags.",
  path: "/posts/tags",
  noindex: true,
});

export default async function Page() {
  const tags = await getAllTags();

  return (
    <Section>
      <Container className="space-y-6">
        <Prose className="mb-8">
          <h2>All Tags</h2>
          <ul className="grid">
            {tags.map((tag: any) => (
              <li key={tag.id}>
                <Link href={`/posts/?tag=${tag.id}`}>{tag.name}</Link>
              </li>
            ))}
          </ul>
        </Prose>
        <BackButton />
      </Container>
    </Section>
  );
}
