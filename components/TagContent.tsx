import { Tag } from "@/lib/wordpress.d";
import { Section, Container, Prose } from "@/components/craft";
import { PostCard } from "@/components/posts/post-card";
import { getPostsByTag } from "@/lib/wordpress";

export default async function TagContent({ tag }: { tag: Tag }) {
  const posts = await getPostsByTag(tag.id);

  return (
    <Section>
      <Container>
        <Prose>
          <h1>Tag: {tag.name}</h1>
          <p className="text-muted-foreground">
            {posts.length} {posts.length === 1 ? "post" : "posts"} with this tag
          </p>
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