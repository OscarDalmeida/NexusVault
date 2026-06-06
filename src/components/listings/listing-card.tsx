"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { getCategoryName } from "@/lib/categories";

interface ListingCardProps {
  listing: {
    id: string;
    title: string;
    slug: string;
    shortDesc: string;
    price: number;
    thumbnailUrl: string | null;
    category: string;
    avgRating: number;
    reviewCount: number;
    totalSales: number;
    seller: { name: string | null; username: string | null };
  };
}

export default function ListingCard({ listing }: ListingCardProps) {
  return (
    <Link href={`/product/${listing.slug}`} className="group">
      <div className="overflow-hidden rounded-xl border border-white/10 bg-zinc-900/50 transition-all duration-300 hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/10 hover:scale-[1.02] hover:-translate-y-1">
        <div className="relative aspect-[16/10] overflow-hidden bg-zinc-800">
          {listing.thumbnailUrl ? (
            <img
              src={listing.thumbnailUrl}
              alt={listing.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-4xl opacity-30">
                {getCategoryName(listing.category)?.[0] ?? "N"}
              </span>
            </div>
          )}
          {/* Price badge */}
          <div className="absolute right-3 top-3">
            <span className="rounded-full bg-zinc-950/80 px-3 py-1 text-sm font-semibold text-white backdrop-blur-sm">
              {formatPrice(listing.price)}
            </span>
          </div>
          {/* Bestseller badge for high-sales products */}
          {listing.totalSales > 50 && (
            <div className="absolute left-3 top-3">
              <span className="flex items-center gap-1 rounded-full bg-amber-500/90 px-2.5 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Bestseller
              </span>
            </div>
          )}
          {/* Instant delivery label on hover */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-zinc-950/80 to-transparent px-3 py-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="flex items-center gap-1 text-xs text-emerald-400">
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Instant delivery
            </span>
          </div>
        </div>
        <div className="p-4">
          <div className="mb-1 text-xs font-medium text-violet-400">
            {getCategoryName(listing.category)}
          </div>
          <h3 className="mb-1 text-sm font-semibold text-white line-clamp-1 group-hover:text-violet-300 transition-colors">
            {listing.title}
          </h3>
          <p className="mb-3 text-xs text-zinc-500 line-clamp-2">
            {listing.shortDesc}
          </p>
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span>{listing.seller.name ?? "Seller"}</span>
            <div className="flex items-center gap-2">
              {listing.avgRating > 0 && (
                <span className="flex items-center gap-1">
                  <svg className="h-3 w-3 fill-yellow-400" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {listing.avgRating.toFixed(1)}
                  {listing.reviewCount > 0 && (
                    <span className="text-zinc-600">({listing.reviewCount})</span>
                  )}
                </span>
              )}
              {listing.totalSales > 0 && <span>{listing.totalSales} sold</span>}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
