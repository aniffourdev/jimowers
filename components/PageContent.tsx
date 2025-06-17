import { Page } from "@/lib/wordpress.d";
import { formatDate } from "@/lib/utils";

interface PageContentProps {
  page: Page;
}

export default function PageContent({ page }: PageContentProps) {
  return (
    <article className="container relative max-w-3xl py-6 lg:py-10">
      <div>
        <h1 className="mt-2 inline-block text-4xl font-bold leading-tight lg:text-5xl">
          {page.title.rendered}
        </h1>
        {page.date && (
          <div className="mt-4 flex space-x-4 text-sm text-muted-foreground">
            <time dateTime={page.date}>{formatDate(page.date)}</time>
          </div>
        )}
      </div>
      {page.content && (
        <div
          className="prose prose-lg dark:prose-invert mt-8"
          dangerouslySetInnerHTML={{ __html: page.content.rendered }}
        />
      )}
    </article>
  );
} 