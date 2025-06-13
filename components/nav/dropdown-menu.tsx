import * as React from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

interface MenuItem {
  id: string;
  label: string;
  path: string;
  parentId: string | null;
  children?: MenuItem[];
}

export function DropdownMenu({ items }: { items: MenuItem[] }) {
  return (
    <NavigationMenu>
      <NavigationMenuList className="hidden md:flex">
        {items.map((item) => (
          <NavigationMenuItem key={item.id}>
            {item.children && item.children.length > 0 ? (
              <>
                <NavigationMenuTrigger>{item.label}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-2 p-4">
                    {item.children.map((child) => (
                      <li key={child.id}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={child.path}
                            className={cn(
                              "block select-none rounded-md p-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            )}
                          >
                            {child.label}
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </>
            ) : (
              <NavigationMenuLink asChild>
                <Link
                  href={item.path}
                  className={navigationMenuTriggerStyle()}
                >
                  {item.label}
                </Link>
              </NavigationMenuLink>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>

      {/* Mobile Menu */}
      <div className="md:hidden">
        <NavigationMenuList className="flex flex-col space-y-2">
          {items.map((item) => (
            <NavigationMenuItem key={item.id} className="w-full">
              {item.children && item.children.length > 0 ? (
                <div className="w-full">
                  <NavigationMenuTrigger className="w-full justify-between">
                    {item.label}
                  </NavigationMenuTrigger>
                  <div className="mt-2 pl-4 border-l">
                    {item.children.map((child) => (
                      <NavigationMenuLink key={child.id} asChild>
                        <Link
                          href={child.path}
                          className={cn(
                            "block w-full py-2 text-sm leading-none no-underline outline-none transition-colors hover:text-accent-foreground focus:text-accent-foreground"
                          )}
                        >
                          {child.label}
                        </Link>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </div>
              ) : (
                <NavigationMenuLink asChild>
                  <Link
                    href={item.path}
                    className={cn(
                      "block w-full py-2 text-sm leading-none no-underline outline-none transition-colors hover:text-accent-foreground focus:text-accent-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                </NavigationMenuLink>
              )}
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </div>
    </NavigationMenu>
  );
} 