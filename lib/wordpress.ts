// Description: WordPress API functions
// Used to fetch data from a WordPress site using the WordPress REST API
// Types are imported from `wp.d.ts`

import querystring from "query-string";
import type {
  Post,
  Category,
  Tag,
  Page,
  Author,
  FeaturedMedia,
} from "./wordpress.d";

// WordPress API Configuration
const REST_API_URL = 'https://gvr.ltm.temporary.site/mower/wp-json/wp/v2';
const GRAPHQL_URL = 'https://gvr.ltm.temporary.site/mower/graphql';

// Menu Types
export interface MenuItem {
  id: string;
  label: string;
  uri: string;
  parentId: string | null;
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
            childItems(first: 100) {
              nodes {
                id
                label
                uri
                parentId
                childItems(first: 100) {
                  nodes {
                    id
                    label
                    uri
                    parentId
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
export async function getMenu(): Promise<Menu | null> {
  try {
    console.log('Fetching menu from:', GRAPHQL_URL);

    const response = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: MENU_QUERY,
      }),
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();
    // console.log('Menu Response:', json);

    if (json.errors) {
      console.error('GraphQL Errors:', json.errors);
      return null;
    }

    // Find the primary menu from the list of menus
    let primaryMenu = json.data?.menus?.nodes?.find((menu: any) => 
      menu.name.toLowerCase().includes('primary') || 
      menu.name.toLowerCase().includes('main') ||
      menu.name.toLowerCase().includes('header')
    );

    if (!primaryMenu) {
      console.log('Available menus:', json.data?.menus?.nodes?.map((m: any) => m.name));
      // If no primary menu found, use the first menu
      primaryMenu = json.data?.menus?.nodes?.[0] || null;
    }

    if (primaryMenu && primaryMenu.menuItems && primaryMenu.menuItems.nodes) {
      const cleanUri = (uri: string) => {
        if (!uri) return "/";
        if (uri.startsWith("/category/")) {
          return uri.substring("/category".length);
        }
        if (uri.startsWith("/tag/")) {
          return uri.substring("/tag".length);
        }
        return uri;
      };

      const processMenuItems = (items: MenuItem[]): MenuItem[] => {
        return items.map((item) => ({
          ...item,
          uri: cleanUri(item.uri),
          childItems:
            item.childItems && item.childItems.nodes
              ? { nodes: processMenuItems(item.childItems.nodes) }
              : undefined,
        }));
      };

      primaryMenu.menuItems.nodes = processMenuItems(
        primaryMenu.menuItems.nodes
      );
    }

    return primaryMenu;
  } catch (error) {
    console.error('Error fetching menu:', error);
    return null;
  }
}

// REST API Functions
export async function getAllPosts(filterParams?: {
  author?: string;
  tag?: string;
  category?: string;
  search?: string;
}): Promise<Post[]> {
  const query: Record<string, any> = {
    _embed: true,
    per_page: 100,
  };

  if (filterParams?.search) {
    query.search = filterParams.search;
  }
  if (filterParams?.author) {
    query.author = filterParams.author;
  }
  if (filterParams?.tag) {
    query.tags = filterParams.tag;
  }
  if (filterParams?.category) {
    query.categories = filterParams.category;
  }

  return wordpressFetch<Post[]>(`${REST_API_URL}/posts`, query);
}

export async function getPostById(id: number): Promise<Post> {
  return wordpressFetch<Post>(`${REST_API_URL}/posts/${id}`);
}

export async function getPostBySlug(slug: string): Promise<Post> {
  const response = await wordpressFetch<Post[]>(`${REST_API_URL}/posts`, { slug });
  return response[0];
}

export async function getAllCategories(): Promise<Category[]> {
  return wordpressFetch<Category[]>(`${REST_API_URL}/categories`);
}

export async function getCategoryById(id: number): Promise<Category> {
  return wordpressFetch<Category>(`${REST_API_URL}/categories/${id}`);
}

export async function getCategoryBySlug(slug: string): Promise<Category> {
  const response = await wordpressFetch<Category[]>(`${REST_API_URL}/categories`, { slug });
  return response[0];
}

export async function getPostsByCategory(categoryId: number): Promise<Post[]> {
  return wordpressFetch<Post[]>(`${REST_API_URL}/posts`, { categories: categoryId });
}

export async function getPostsByTag(tagId: number): Promise<Post[]> {
  return wordpressFetch<Post[]>(`${REST_API_URL}/posts`, { tags: tagId });
}

export async function getAllTags(): Promise<Tag[]> {
  return wordpressFetch<Tag[]>(`${REST_API_URL}/tags`);
}

export async function getTagById(id: number): Promise<Tag> {
  return wordpressFetch<Tag>(`${REST_API_URL}/tags/${id}`);
}

export async function getTagBySlug(slug: string): Promise<Tag> {
  const response = await wordpressFetch<Tag[]>(`${REST_API_URL}/tags`, { slug });
  return response[0];
}

export async function getAllPages(): Promise<Page[]> {
  return wordpressFetch<Page[]>(`${REST_API_URL}/pages`);
}

export async function getPageById(id: number): Promise<Page> {
  return wordpressFetch<Page>(`${REST_API_URL}/pages/${id}`);
}

export async function getPageBySlug(slug: string): Promise<Page> {
  const response = await wordpressFetch<Page[]>(`${REST_API_URL}/pages`, { slug });
  return response[0];
}

export async function getAllAuthors(): Promise<Author[]> {
  return wordpressFetch<Author[]>(`${REST_API_URL}/users`);
}

export async function getAuthorById(id: number): Promise<Author> {
  return wordpressFetch<Author>(`${REST_API_URL}/users/${id}`);
}

export async function getAuthorBySlug(slug: string): Promise<Author> {
  const response = await wordpressFetch<Author[]>(`${REST_API_URL}/users`, { slug });
  return response[0];
}

export async function getPostsByAuthor(authorId: number): Promise<Post[]> {
  return wordpressFetch<Post[]>(`${REST_API_URL}/posts`, { author: authorId });
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

export async function searchTags(query: string): Promise<Tag[]> {
  return wordpressFetch<Tag[]>(`${REST_API_URL}/tags`, {
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
}

export { WordPressAPIError };
