// import Link from "next/link";
// import { MenuItem } from "@/lib/wordpress.d";
// import {
//   NavigationMenu,
//   NavigationMenuContent,
//   NavigationMenuItem,
//   NavigationMenuLink,
//   NavigationMenuList,
//   NavigationMenuTrigger,
//   navigationMenuTriggerStyle,
// } from "@/components/ui/navigation-menu";
// import { cn } from "@/lib/utils";
// import { ChevronDown } from "lucide-react";

// interface MainNavProps {
//   items: MenuItem[];
// }

// export function MainNav({ items }: MainNavProps) {
//   return (
//     <NavigationMenu>
//       <NavigationMenuList>
//         {items.map((item) => (
//           <NavigationMenuItem key={item.id}>
//             {item.children && item.children.length > 0 ? (
//               <>
//                 <NavigationMenuTrigger className="h-9">
//                   {item.label}
//                 </NavigationMenuTrigger>
//                 <NavigationMenuContent>
//                   <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
//                     {item.children.map((child) => (
//                       <li key={child.id}>
//                         <NavigationMenuLink asChild>
//                           <Link
//                             href={child.path}
//                             className={cn(
//                               "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
//                               child.cssClasses.join(" ")
//                             )}
//                           >
//                             <div className="text-sm font-medium leading-none">
//                               {child.label}
//                             </div>
//                             {child.children && child.children.length > 0 && (
//                               <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
//                                 {child.children.length} sub-items
//                               </p>
//                             )}
//                           </Link>
//                         </NavigationMenuLink>
//                       </li>
//                     ))}
//                   </ul>
//                 </NavigationMenuContent>
//               </>
//             ) : (
//               <Link href={item.path} legacyBehavior passHref>
//                 <NavigationMenuLink
//                   className={cn(
//                     navigationMenuTriggerStyle(),
//                     item.cssClasses.join(" ")
//                   )}
//                 >
//                   {item.label}
//                 </NavigationMenuLink>
//               </Link>
//             )}
//           </NavigationMenuItem>
//         ))}
//       </NavigationMenuList>
//     </NavigationMenu>
//   );
// } 