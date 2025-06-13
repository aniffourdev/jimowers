'use client';

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/site.config";
import { DropdownMenu } from "@/components/nav/dropdown-menu";
import { MobileNav } from "@/components/nav/mobile-nav";
import Logo from "@/public/logo.svg";

interface MenuItem {
  id: string;
  label: string;
  path: string;
  parentId: string | null;
  children?: MenuItem[];
}

interface NavProps {
  menuItems: MenuItem[];
  className?: string;
  children?: React.ReactNode;
  id?: string;
}

export function Nav({ menuItems, className, children, id }: NavProps) {
  return (
    <nav
      className={cn("sticky z-50 top-0 bg-background", "border-b", className)}
      id={id}
    >
      <div
        id="nav-container"
        className="max-w-5xl mx-auto py-4 px-6 sm:px-8 flex justify-between items-center"
      >
        <Link
          className="hover:opacity-75 transition-all flex gap-4 items-center"
          href="/"
        >
          <Image
            src={Logo}
            alt="Logo"
            loading="eager"
            className="dark:invert"
            width={42}
            height={26.44}
          />
          <h2 className="text-sm">{siteConfig.site_name}</h2>
        </Link>
        {children}
        <div className="flex items-center gap-2">
          <div className="mx-2 hidden md:flex">
            <DropdownMenu items={menuItems} />
          </div>
          <MobileNav items={menuItems} />
        </div>
      </div>
    </nav>
  );
} 