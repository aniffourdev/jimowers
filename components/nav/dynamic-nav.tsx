"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getMenu,
  type Menu,
  type MenuItem,
  getMenuByLocation,
} from "@/lib/wordpress";
import { decodeHtmlEntities } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown, Search as SearchIcon, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PostCardClient } from "@/components/posts/post-card-client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface DynamicNavProps {
  className?: string;
}

export function DynamicNav({ className }: DynamicNavProps) {
  const [menu, setMenu] = useState<Menu | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchMenu() {
      try {
        const menuData = await getMenuByLocation("menu/main");
        setMenu(menuData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch menu");
      } finally {
        setIsLoading(false);
      }
    }
    fetchMenu();
  }, []);

  // Live search effect
  useEffect(() => {
    if (!showSearch) return;
    if (!searchTerm) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }
    setSearchLoading(true);
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search?term=${encodeURIComponent(searchTerm)}`
        );
        const data = await res.json();
        setSearchResults(data.posts || []);
      } catch {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 350);
    return () => clearTimeout(timeout);
  }, [searchTerm, showSearch]);

  if (isLoading) {
    return (
      <div className={cn("mx-2 items-center gap-4", className)}>
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-3.5 w-[90px]" />
        ))}
      </div>
    );
  }

  if (error || !menu) {
    return (
      <div className={cn("mx-2", className)}>
        <Button variant="ghost" size="sm" disabled>
          Menu Error
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className={cn("mx-2 items-center gap-1", className)}>
        {menu.menuItems.nodes
          .filter((item) => !item.parentId)
          .map((item) => (
            <MenuItem key={item.id} item={item} />
          ))}
        {/* Search Icon */}
        <button
          className="ml-2 p-2 rounded-full transition-colors"
          aria-label="Search"
          onClick={() => setShowSearch(true)}
        >
          <SearchIcon className="w-5 h-5" />
        </button>
      </div>
      {/* Search Overlay */}
      {showSearch && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center bg-white/95 dark:bg-black/95 backdrop-blur-sm transition-all">
          <div className="w-full max-w-xl mx-auto mt-16 flex flex-col items-center">
            <Input
              autoFocus
              type="text"
              placeholder="Search articles..."
              className="w-full text-lg px-6 py-4 mb-6 border border-gray-300 rounded-lg shadow"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchLoading && (
              <Loader2 className="animate-spin text-muted-foreground mb-4" />
            )}
          </div>
          {/* Results */}
          <div className="w-full flex-1 flex flex-col items-center overflow-y-auto">
            {searchTerm && !searchLoading && searchResults.length === 0 && (
              <div className="text-muted-foreground mt-8">
                No articles found.
              </div>
            )}
            <div className="w-full max-w-6xl grid md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 pb-16">
              {searchResults.map((post) => (
                <div
                  key={post.id}
                  onClick={(e) => {
                    e.preventDefault();
                    setShowSearch(false);
                    setSearchTerm("");
                    setSearchResults([]);
                    router.push(`/${post.slug}`);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <PostCardClient post={post} />
                </div>
              ))}
            </div>
          </div>
          {/* Close overlay */}
          <button
            className="absolute top-6 right-8 text-2xl text-muted-foreground hover:text-foreground"
            onClick={() => {
              setShowSearch(false);
              setSearchTerm("");
              setSearchResults([]);
            }}
            aria-label="Close search"
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}

function MenuItem({ item }: { item: MenuItem }) {
  const hasChildren =
    item.childItems &&
    item.childItems.nodes &&
    item.childItems.nodes.length > 0;
  const [isOpen, setIsOpen] = useState(false);

  const renderMenuItemContent = (menuItem: MenuItem) => {
    // console.log('MenuItem data:', menuItem); // Debug log
    return (
      <div className="flex items-center gap-2">
        {menuItem.icon_image ? (
          <img 
            src={menuItem.icon_image} 
            alt="" 
            className="w-4 h-4 object-contain"
          />
        ) : menuItem.icon ? (
          <i className={`${menuItem.icon} text-sm`}></i>
        ) : null}
        <span>{decodeHtmlEntities(menuItem.label)}</span>
      </div>
    );
  };

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
          {renderMenuItemContent(item)}
          <ChevronDown className="h-4 w-4" />
        </Button>
        {isOpen && item.childItems?.nodes && (
          <div
            className="absolute top-full left-0 w-[max-content] bg-background shadow-lg z-50"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
          >
            <div className="">
              {item.childItems.nodes.map((child) => (
                <Link
                  key={child.id}
                  href={child.uri}
                  className="flex items-center gap-3 px-4 py-3 text-sm transition-colors"
                >
                  {renderMenuItemContent(child)}
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
      <Link href={item.uri} className="flex items-center gap-2">
        {renderMenuItemContent(item)}
      </Link>
    </Button>
  );
}
