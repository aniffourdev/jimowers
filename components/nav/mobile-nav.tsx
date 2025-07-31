"use client";

// React and Next Imports
import * as React from "react";
import Link, { LinkProps } from "next/link";
import { useRouter } from "next/navigation";

// Utility Imports
import { getMenu, type Menu, type MenuItem } from "@/lib/wordpress";
import { getMenuByLocation } from "@/lib/wordpress";
import { Menu as MenuIcon, ArrowRightSquare, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { decodeHtmlEntities } from "@/lib/utils";

// Component Imports
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { siteConfig } from "@/site.config";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Search as SearchIcon, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PostCardClient } from "@/components/posts/post-card-client";

interface MobileNavProps {
  className?: string;
}

export function MobileNav({ className }: MobileNavProps) {
  const [open, setOpen] = React.useState(false);
  const [menu, setMenu] = React.useState<Menu | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [showSearch, setShowSearch] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<any[]>([]);
  const [searchLoading, setSearchLoading] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    async function fetchMenu() {
      setIsLoading(true);
      const menuData = await getMenuByLocation("menu/main");
      setMenu(menuData);
      setIsLoading(false);
    }
    fetchMenu();
  }, []);

  // Live search effect
  React.useEffect(() => {
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

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <div className={cn("flex items-center gap-2", className)}>
            {/* Search Icon */}
            <button
              className="p-2 transition-colors"
              aria-label="Search"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowSearch(true);
              }}
            >
              <SearchIcon className="w-5 h-5" />
            </button>
            
            {/* Theme Toggle */}
            <div onClick={(e) => e.stopPropagation()}>
              <ThemeToggle />
            </div>
            
            {/* Menu Button */}
            <Button
              variant="ghost"
              className="px-0 border w-10 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            >
              <MenuIcon />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </div>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="text-left">
              <MobileLink
                href="/"
                className="flex items-center"
                onOpenChange={setOpen}
              >
                <ArrowRightSquare className="mr-2 h-4 w-4" />
                <span>{siteConfig.site_name}</span>
              </MobileLink>
            </SheetTitle>
          </SheetHeader>
          
          <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-5">
            <div className="flex flex-col space-y-4">
              {isLoading ? (
                [...Array(8)].map((_, i) => (
                  <Skeleton key={i} className="h-8 w-4/5 rounded-md" />
                ))
              ) : menu ? (
                menu.menuItems.nodes
                  .filter((item) => !item.parentId)
                  .map((item) => (
                    <MobileMenuItem
                      key={item.id}
                      item={item}
                      onOpenChange={setOpen}
                    />
                  ))
              ) : (
                <p>Menu not found.</p>
              )}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
      
      {/* Search Overlay */}
      {showSearch && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center bg-white/95 dark:bg-black/95 backdrop-blur-sm transition-all">
          <div className="w-full max-w-xl mx-auto mt-16 flex flex-col items-center px-4">
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
          <div className="w-full max-w-6xl grid grid-cols-1 gap-4 px-4 pb-16 overflow-y-auto flex-1">
            {searchTerm && !searchLoading && searchResults.length === 0 && (
              <div className="text-muted-foreground mt-8 text-center">
                No articles found.
              </div>
            )}
            {searchResults.map((post) => (
              <div
                key={post.id}
                onClick={(e) => {
                  e.preventDefault();
                  setShowSearch(false);
                  setSearchTerm("");
                  setSearchResults([]);
                  setOpen(false);
                  router.push(`/${post.slug}`);
                }}
                style={{ cursor: "pointer" }}
              >
                <PostCardClient post={post} />
              </div>
            ))}
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

interface MobileMenuItemProps {
  item: MenuItem;
  onOpenChange: (open: boolean) => void;
}

function MobileMenuItem({ item, onOpenChange }: MobileMenuItemProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const hasChildren = item.childItems && item.childItems.nodes.length > 0;

  const renderMenuItemContent = (menuItem: MenuItem) => {
    // console.log('Mobile MenuItem data:', menuItem); // Debug log
    return (
      <div className="flex items-center gap-3">
        {menuItem.icon_image ? (
          <img 
            src={menuItem.icon_image} 
            alt="" 
            className="w-5 h-5 object-contain"
          />
        ) : menuItem.icon ? (
          <i className={`${menuItem.icon} text-base`}></i>
        ) : null}
        <span>{decodeHtmlEntities(menuItem.label)}</span>
      </div>
    );
  };

  if (hasChildren) {
    return (
      <div className="flex flex-col space-y-3">
        <button
          className="flex items-center justify-between text-lg"
          onClick={() => setIsOpen(!isOpen)}
        >
          {renderMenuItemContent(item)}
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              isOpen ? "rotate-180" : ""
            )}
          />
        </button>
        {isOpen && item.childItems?.nodes && (
          <div className="flex flex-col space-y-3 pl-4 border-l">
            {item.childItems.nodes.map((child) => (
              <MobileMenuItem
                key={child.id}
                item={child}
                onOpenChange={onOpenChange}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <MobileLink href={item.uri} onOpenChange={onOpenChange}>
      {renderMenuItemContent(item)}
    </MobileLink>
  );
}

interface MobileLinkProps extends LinkProps {
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: MobileLinkProps) {
  const router = useRouter();
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString());
        onOpenChange?.(false);
      }}
      className={cn("text-lg", className)}
      {...props}
    >
      {children}
    </Link>
  );
}
