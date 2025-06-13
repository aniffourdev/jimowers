import Link from "next/link";
import { cn } from "@/lib/utils";

interface MenuItem {
  id: string;
  label: string;
  path: string;
  parentId: string | null;
  children?: MenuItem[];
}

interface MainNavProps {
  items: MenuItem[];
}

export function MainNav({ items }: MainNavProps) {
  return (
    <div className="hidden md:flex">
      <Link
        href="/"
        className="mr-6 flex items-center space-x-2"
      >
        <span className="hidden font-bold sm:inline-block">
          {items[0]?.label || "Home"}
        </span>
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        {items.slice(1).map((item) => (
          <Link
            key={item.id}
            href={item.path}
            className={cn(
              "transition-colors hover:text-foreground/80",
              "text-foreground/60"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
} 