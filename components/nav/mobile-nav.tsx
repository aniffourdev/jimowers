"use client";

// React and Next Imports
import * as React from "react";
import Link, { LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Utility Imports
import { Menu, ChevronDown } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";

import { siteConfig } from "@/site.config";

interface MenuItem {
  id: string;
  label: string;
  path: string;
  parentId: string | null;
  children?: MenuItem[];
}

interface MobileNavProps {
  items: MenuItem[];
}

export function MobileNav({ items }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <SheetHeader className="mb-6">
          <SheetTitle>
            <Link
              href="/"
              className="flex items-center"
              onClick={() => setOpen(false)}
            >
              <span className="font-bold text-xl">{siteConfig.site_name}</span>
            </Link>
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex flex-col">
              {item.children && item.children.length > 0 ? (
                <div className="flex flex-col">
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="flex items-center justify-between py-2 text-base font-medium hover:text-primary transition-colors"
                  >
                    {item.label}
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        expandedItems[item.id] ? "rotate-180" : ""
                      )}
                    />
                  </button>
                  {expandedItems[item.id] && (
                    <div className="pl-4 mt-2 space-y-2 border-l-2 border-muted">
                      {item.children.map((child) => (
                        <Link
                          key={child.id}
                          href={child.path}
                          onClick={() => setOpen(false)}
                          className="block py-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.path}
                  onClick={() => setOpen(false)}
                  className="py-2 text-base font-medium hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
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
