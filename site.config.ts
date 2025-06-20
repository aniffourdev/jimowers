export const siteConfig = {
  site_name: process.env.NEXT_PUBLIC_SITE_NAME || 'Jimowers',
  site_description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'A WordPress site built with Next.js',
  site_domain: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
} as const;
