import Link from "next/link";
import { MainNav } from "@/components/nav/main-nav";
import { MobileNav } from "@/components/nav/mobile-nav";
import { ModeToggle } from "@/components/mode-toggle";
import { siteConfig } from "@/site.config";

interface MenuItem {
  id: string;
  label: string;
  path: string;
  parentId: string | null;
  children?: MenuItem[];
}

interface SiteHeaderProps {
  menuItems: MenuItem[];
}

export function SiteHeader({ menuItems }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <MainNav items={menuItems} />
        <MobileNav items={menuItems} />
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center space-x-2">
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
} 