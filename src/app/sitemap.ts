import { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { CATEGORIES } from "@/lib/categories";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://nexus-vault-beta.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/browse`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/auth/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/auth/signup`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${BASE_URL}/browse/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  // Product pages
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const listings = await db.listing.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    });
    productPages = listings.map((listing) => ({
      url: `${BASE_URL}/product/${listing.slug}`,
      lastModified: listing.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    // DB might not be available during build
  }

  return [...staticPages, ...categoryPages, ...productPages];
}
