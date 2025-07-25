"use client";
import { useState, useTransition } from "react";
import { Post } from "@/lib/wordpress.d";
import { PostCard } from "@/components/posts/post-card";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from "@/components/ui/pagination";

export default function AuthorPostsGrid({ posts }: { posts: Post[] }) {
  const perPage = 1;
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  const totalPages = Math.ceil(posts.length / perPage);
  const paginatedPosts = posts.slice((page - 1) * perPage, (page - 1) * perPage + perPage);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    startTransition(() => setPage(newPage));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div className="grid md:grid-cols-3 gap-4 min-h-[300px]">
        {isPending ? (
          <div className="col-span-3 flex justify-center items-center min-h-[200px]">
            <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-600" />
          </div>
        ) : (
          paginatedPosts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            {page > 1 && (
              <PaginationItem>
                <button
                  className="px-3 py-1 rounded hover:bg-teal-100 dark:hover:bg-teal-900 transition-colors"
                  onClick={() => handlePageChange(page - 1)}
                  aria-label="Previous page"
                >
                  Previous
                </button>
              </PaginationItem>
            )}
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <button
                  className={`px-3 py-1 rounded ${page === i + 1 ? 'bg-teal-600 text-white' : 'hover:bg-teal-100 dark:hover:bg-teal-900'} transition-colors`}
                  onClick={() => handlePageChange(i + 1)}
                  aria-current={page === i + 1 ? 'page' : undefined}
                >
                  {i + 1}
                </button>
              </PaginationItem>
            ))}
            {page < totalPages && (
              <PaginationItem>
                <button
                  className="px-3 py-1 rounded hover:bg-teal-100 dark:hover:bg-teal-900 transition-colors"
                  onClick={() => handlePageChange(page + 1)}
                  aria-label="Next page"
                >
                  Next
                </button>
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      )}
    </>
  );
} 