"use client";

// React and Next Imports
import * as React from "react";
import Link, { LinkProps } from "next/link";
import { useRouter } from "next/navigation";

// Utility Imports
import { getMenu, type Menu, type MenuItem } from "@/lib/wordpress";
import { Menu as MenuIcon, ArrowRightSquare, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

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

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const [menu, setMenu] = React.useState<Menu | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchMenu() {
      setIsLoading(true);
      const menuData = await getMenu();
      setMenu(menuData);
      setIsLoading(false);
    }
    fetchMenu();
  }, []);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="px-0 border w-10 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <MenuIcon />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-5">
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
  );
}

interface MobileMenuItemProps {
  item: MenuItem;
  onOpenChange: (open: boolean) => void;
}

function MobileMenuItem({ item, onOpenChange }: MobileMenuItemProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const hasChildren = item.childItems && item.childItems.nodes.length > 0;

  if (hasChildren) {
    return (
      <div className="flex flex-col space-y-3">
        <button
          className="flex items-center justify-between text-lg"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{item.label}</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              isOpen ? "rotate-180" : ""
            )}
          />
        </button>
        {isOpen && (
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
      {item.label}
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
