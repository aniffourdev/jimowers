import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// Decodes HTML entities in a string (e.g., &amp; -> &)
export function decodeHtmlEntities(str: string): string {
  if (!str) return '';
  // Decode numeric (decimal and hex) and named entities
  return str
    // Decode decimal entities
    .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec))
    // Decode hex entities
    .replace(/&#x([\da-fA-F]+);/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)))
    // Decode common named entities
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

// Strips HTML tags from a string
export function stripHtmlTags(str: string): string {
  return str.replace(/<[^>]*>/g, '').trim();
}
