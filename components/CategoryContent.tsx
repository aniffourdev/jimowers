import { Category } from "@/lib/wordpress.d";
import { Section, Container, Prose } from "@/components/craft";
import { PostCard } from "@/components/posts/post-card";
import { getPostsByCategory } from "@/lib/wordpress";

export default async function CategoryContent({ category }: { category: Category }) {
  const posts = await getPostsByCategory(category.id);

  return (
    <Section>
      <Container>
        <Prose>
          <h1 className="!uppercase !font-[600] !text-xs !tracking-widest">Posts In:</h1>
          <p className="!text-3xl !font-bold !uppercase !mt-1">{category.name}</p>
          {/* <p className="text-muted-foreground">
            {posts.length} {posts.length === 1 ? "post" : "posts"} in this category
          </p> */}
        </Prose>

        <div className="grid md:grid-cols-3 gap-4 mt-8">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </Container>
    </Section>
  );
} 