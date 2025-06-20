import { Author } from "@/lib/wordpress.d";
import { Section, Container, Prose } from "@/components/craft";
import { PostCard } from "@/components/posts/post-card";
import { getPostsByAuthor } from "@/lib/wordpress";

export default async function AuthorContent({ author }: { author: Author }) {
  const posts = await getPostsByAuthor(author.id);

  return (
    <Section>
      <Container>
      <Prose>
          <h1 className="!uppercase !font-[600] !text-xs !tracking-widest">Posts By:</h1>
          <p className="!text-3xl !font-bold !uppercase !mt-1">{author.name}</p>
          {/* <div className="lg:flex gap-4">
            <div className="lg:w-6/12">Tab 1</div>
            <div className="lg:w-6/12">Tab 1</div>
          </div> */}
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