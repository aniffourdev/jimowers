// Description: WordPress API functions
// Used to fetch data from a WordPress site using the WordPress REST API
// Types are imported from `wp.d.ts`

import querystring from "query-string";
import type {
  Post,
  Category,
  Page,
  Author,
  FeaturedMedia,
} from "./wordpress.d";
import { decodeHtmlEntities } from "./utils";

// WordPress API Configuration
const REST_API_URL = "https://jimowers.infy.uk/wp-json/wp/v2";
const GRAPHQL_URL = "https://jimowers.infy.uk/graphql";

// Menu Types
export interface MenuItem {
  id: string;
  label: string;
  uri: string;
  parentId: string | null;
  icon?: string;
  icon_image?: string;
  childItems?: {
    nodes: MenuItem[];
  };
}

export interface Menu {
  id: string;
  name: string;
  menuItems: {
    nodes: MenuItem[];
  };
}

class WordPressAPIError extends Error {
  constructor(message: string, public status: number, public endpoint: string) {
    super(message);
    this.name = "WordPressAPIError";
  }
}

// GraphQL Menu Query
const MENU_QUERY = `
  query GetMenus {
    menus(first: 100) {
      nodes {
        id
        name
        menuItems(first: 100) {
          nodes {
            id
            label
            uri
            parentId
            icon
            icon_image
            childItems(first: 100) {
              nodes {
                id
                label
                uri
                parentId
                icon
                icon_image
                childItems(first: 100) {
                  nodes {
                    id
                    label
                    uri
                    parentId
                    icon
                    icon_image
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

// Menu Functions
export async function getMenu(): Promise<any | null> {
  try {
    const response = await fetch(
      "https://jimowers.infy.uk/wp-json/wp/v2/main-menu",
      {
        cache: "no-store",
      }
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const items = await response.json();
    const WP_DOMAIN = "https://jimowers.infy.uk";
    function cleanHref(href: string) {
      if (!href) return href;
      // Remove domain if present
      if (href.startsWith(WP_DOMAIN)) {
        href = href.replace(WP_DOMAIN, "");
      }
      // Remove /category/ prefix
      if (href.startsWith("/category/")) {
        href = href.replace("/category/", "/");
      }
      // Remove trailing slash (optional)
      if (href.length > 1 && href.endsWith("/")) {
        href = href.slice(0, -1);
      }
      return href;
    }
    function cleanMenuTree(nodes: any[]): any[] {
      return nodes.map((item) => ({
        ...item,
        label: decodeHtmlEntities(item.name),
        uri: cleanHref(item.href),
        href: cleanHref(item.href),
        childItems: item.children
          ? { nodes: cleanMenuTree(item.children) }
          : { nodes: [] },
      }));
    }
    return {
      menuItems: {
        nodes: cleanMenuTree(items),
      },
    };
  } catch (error) {
    console.error("Error fetching menu:", error);
    return null;
  }
}

export async function getMenuByLocation(location: string): Promise<any | null> {
  try {
    // Use REST API to fetch menu
    const response = await fetch(
      `https://jimowers.infy.uk/wp-json/wp/v2/${location}`,
      {
        cache: "no-store",
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const items = await response.json();
    const WP_DOMAIN = "https://jimowers.infy.uk";
    
    function cleanHref(href: string) {
      if (!href) return href;
      // Remove domain if present
      if (href.startsWith(WP_DOMAIN)) {
        href = href.replace(WP_DOMAIN, "");
      }
      // Remove /category/ prefix
      if (href.startsWith("/category/")) {
        href = href.replace("/category/", "/");
      }
      // Remove trailing slash (optional)
      if (href.length > 1 && href.endsWith("/")) {
        href = href.slice(0, -1);
      }
      return href;
    }

    function cleanMenuTree(nodes: any[]): any[] {
      return nodes.map((item) => ({
        ...item,
        label: decodeHtmlEntities(item.name),
        uri: cleanHref(item.href),
        parentId: item.menu_item_parent === "0" ? null : item.menu_item_parent,
        icon: item.icon || null,
        icon_image: item.icon_image || null,
        childItems: item.children && item.children.length > 0
          ? { nodes: cleanMenuTree(item.children) }
          : { nodes: [] },
      }));
    }

    return {
      menuItems: {
        nodes: cleanMenuTree(items),
      },
    };
  } catch (error) {
    console.error("Error fetching menu:", error);
    return null;
  }
}

// REST API Functions
export async function getAllPosts(filterParams?: Record<string, any>): Promise<Post[]> {
  const query: Record<string, any> = {
    _embed: true,
    per_page: 100,
    ...filterParams,
  };
  return wordpressFetch<Post[]>(`${REST_API_URL}/posts`, query);
}

export async function getPostById(id: number): Promise<Post> {
  return wordpressFetch<Post>(`${REST_API_URL}/posts/${id}`);
}

export async function getPostBySlug(slug: string): Promise<Post> {
  const response = await wordpressFetch<Post[]>(`${REST_API_URL}/posts`, {
    slug,
    _embed: true,
  });
  return response[0];
}

export async function getAllCategories(): Promise<Category[]> {
  return wordpressFetch<Category[]>(`${REST_API_URL}/categories`);
}

export async function getCategoryById(id: number): Promise<Category> {
  return wordpressFetch<Category>(`${REST_API_URL}/categories/${id}`);
}

export async function getCategoryBySlug(slug: string): Promise<Category> {
  const response = await wordpressFetch<Category[]>(
    `${REST_API_URL}/categories`,
    { slug }
  );
  return response[0];
}

export async function getPostsByCategory(categoryId: number): Promise<Post[]> {
  return wordpressFetch<Post[]>(`${REST_API_URL}/posts`, {
    categories: categoryId,
    _embed: true,
  });
}

export async function getAllPages(): Promise<Page[]> {
  return wordpressFetch<Page[]>(`${REST_API_URL}/pages`);
}

export async function getPageById(id: number): Promise<Page> {
  return wordpressFetch<Page>(`${REST_API_URL}/pages/${id}`);
}

export async function getPageBySlug(slug: string): Promise<Page> {
  const response = await wordpressFetch<Page[]>(`${REST_API_URL}/pages`, {
    slug,
  });
  return response[0];
}

export async function getAllAuthors(): Promise<Author[]> {
  return wordpressFetch<Author[]>(`${REST_API_URL}/users`);
}

export async function getAuthorById(id: number): Promise<Author> {
  return wordpressFetch<Author>(`${REST_API_URL}/users/${id}`);
}

export async function getAuthorBySlug(slug: string): Promise<Author> {
  const response = await wordpressFetch<Author[]>(`${REST_API_URL}/users`, {
    slug,
  });
  return response[0];
}

export async function getPostsByAuthor(authorId: number): Promise<Post[]> {
  return wordpressFetch<Post[]>(`${REST_API_URL}/posts`, { author: authorId, _embed: true });
}

export async function getFeaturedMediaById(id: number): Promise<FeaturedMedia> {
  return wordpressFetch<FeaturedMedia>(`${REST_API_URL}/media/${id}`);
}

export async function searchCategories(query: string): Promise<Category[]> {
  return wordpressFetch<Category[]>(`${REST_API_URL}/categories`, {
    search: query,
    per_page: 100,
  });
}

export async function searchAuthors(query: string): Promise<Author[]> {
  return wordpressFetch<Author[]>(`${REST_API_URL}/users`, {
    search: query,
    per_page: 100,
  });
}

export async function getCommentsByPostId(postId: number) {
  try {
    // Fetch top-level comments (parent = 0)
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/wp/v2/comments?post=${postId}&parent=0&orderby=date&order=desc`
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch comments");
    }
    
    const comments = await response.json();
    
    // Fetch replies for each comment recursively
    const fetchReplies = async (comment: any): Promise<any> => {
      const replyResponse = await fetch(
        `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/wp/v2/comments?post=${postId}&parent=${comment.id}&orderby=date&order=asc`
      );
      
      if (replyResponse.ok) {
        const replies = await replyResponse.json();
        for (const reply of replies) {
          await fetchReplies(reply);
        }
        comment.replies = replies;
      }
      return comment;
    };

    // Fetch replies for each top-level comment
    for (const comment of comments) {
      await fetchReplies(comment);
    }

    return comments;
  } catch (error) {
    console.error("Error fetching comments:", error);
    return [];
  }
}

async function wordpressFetch<T>(
  endpoint: string,
  params?: Record<string, any>
): Promise<T> {
  const url = new URL(endpoint);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }
  try {
    const response = await fetch(url.toString(), {
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    if (!response.ok) {
      throw new WordPressAPIError(
        `WordPress API request failed: ${response.statusText}`,
        response.status,
        url.toString()
      );
    }
    return response.json();
  } catch (error) {
    console.error('Failed to fetch from WordPress API:', url.toString(), error);
    // Return empty array or null depending on expected type
    if (endpoint.includes('/categories') || endpoint.includes('/posts') || endpoint.includes('/users')) {
      return [] as T;
    }
    return null as T;
  }
}

export { WordPressAPIError };
