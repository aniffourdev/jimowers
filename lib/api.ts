import {
  getPostBySlug,
  getCategoryBySlug,
  getTagBySlug,
  getAuthorBySlug,
} from "./wordpress";

export async function getPost(slug: string) {
  try {
    return await getPostBySlug(slug);
  } catch (error) {
    return null;
  }
}

export async function getCategory(slug: string) {
  try {
    return await getCategoryBySlug(slug);
  } catch (error) {
    return null;
  }
}

export async function getTag(slug: string) {
  try {
    return await getTagBySlug(slug);
  } catch (error) {
    return null;
  }
}

export async function getAuthor(slug: string) {
  try {
    return await getAuthorBySlug(slug);
  } catch (error) {
    return null;
  }
} 