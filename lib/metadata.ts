import { Metadata } from "next";
import { siteConfig } from "@/site.config";

export function generateMetadata({
  title,
  description,
  path,
  noindex = false,
}: {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
}): Metadata {
  return {
    title,
    description,
    metadataBase: new URL(siteConfig.site_domain),
    alternates: {
      canonical: path,
    },
    robots: {
      index: !noindex,
      follow: !noindex,
    },
    openGraph: {
      title,
      description,
      url: `${siteConfig.site_domain}${path}`,
      siteName: siteConfig.site_name,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
} 