"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getMenuByLocation, type Menu } from "@/lib/wordpress";

export default function FooterNav() {
  const [menu, setMenu] = useState<Menu | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMenuByLocation("menu/second").then((data) => {
      setMenu(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!menu) return null;

  return (
    <ul>
      {menu.menuItems.nodes.map((item) => (
        <li key={item.id}>
          <Link href={item.uri}>{item.label}</Link>
        </li>
      ))}
    </ul>
  );
} 