import { NextRequest, NextResponse } from "next/server";
import { getAllPosts } from "@/lib/wordpress";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const term = searchParams.get("term") || "";

  if (!term) {
    return NextResponse.json({ posts: [] });
  }

  // Fetch posts from WordPress with the search term
  const posts = await getAllPosts({ search: term });

  return NextResponse.json({ posts });
} 