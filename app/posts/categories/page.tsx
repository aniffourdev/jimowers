import { generateMetadata } from "@/lib/metadata";
import { SchemaMarkup } from "@/components/schema/schema-markup";
import { getAllCategories, getPostsByCategory } from "@/lib/wordpress";
import { siteConfig } from "@/site.config";
import { Section, Container, Prose } from "@/components/craft";
import { Metadata } from "next";
import BackButton from "@/components/back";
import Link from "next/link";

export const metadata = generateMetadata({
  title: "Categories | " + siteConfig.site_name,
  description: "Browse our blog posts by categories.",
  path: "/posts/categories",
});

export default async function CategoriesPage() {
  const categories = await getAllCategories();
  const categoryPosts = await Promise.all(
    categories.map(async (category) => {
      const posts = await getPostsByCategory(category.id);
      return { category, posts };
    })
  );

  return (
    <>
      <SchemaMarkup type="index" />
      <Section>
        <Container className="space-y-6">
          <Prose className="mb-8">
            <h2>All Categories</h2>
            <ul className="grid">
              {categories.map((category: any) => (
                <li key={category.id}>
                  <Link href={`/posts/?category=${category.id}`}>
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </Prose>
          <BackButton />
        </Container>
      </Section>
    </>
  );
}
