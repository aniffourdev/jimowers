'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { getMenu, type Menu, type MenuItem } from "@/lib/wordpress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown } from "lucide-react";

export function DynamicNav() {
  const [menu, setMenu] = useState<Menu | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMenu() {
      try {
        const menuData = await getMenu();
        console.log('Fetched menu:', menuData);
        setMenu(menuData);
      } catch (err) {
        console.error('Error fetching menu:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch menu');
      } finally {
        setIsLoading(false);
      }
    }

    fetchMenu();
  }, []);

  if (isLoading) {
    return (
      <div className="mx-2 hidden md:flex items-center gap-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-3.5 w-[90px]" />
        ))}
      </div>
    );
  }

  if (error || !menu) {
    return (
      <div className="mx-2 hidden md:flex">
        <Button variant="ghost" size="sm" disabled>
          Menu Error
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-2 hidden md:flex">
      {menu.menuItems.nodes
        .filter((item) => !item.parentId)
        .map((item) => (
          <MenuItem key={item.id} item={item} />
        ))}
    </div>
  );
}

function MenuItem({ item }: { item: MenuItem }) {
  const hasChildren =
    item.childItems &&
    item.childItems.nodes &&
    item.childItems.nodes.length > 0;
  const [isOpen, setIsOpen] = useState(false);

  if (hasChildren) {
    return (
      <div className="relative group">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          {item.label}
          <ChevronDown className="h-4 w-4" />
        </Button>
        {isOpen && item.childItems?.nodes && (
          <div
            className="absolute top-full left-0 mt-1 w-48 bg-background border rounded-md shadow-lg z-50"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
          >
            <div className="py-1">
              {item.childItems.nodes.map((child) => (
                <Link
                  key={child.id}
                  href={child.uri}
                  className="block px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                >
                  {child.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <Button asChild variant="ghost" size="sm">
      <Link href={item.uri}>
        {item.label}
      </Link>
    </Button>
  );
} 