"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CATEGORIES } from "@/lib/categories";
import ListingGrid from "@/components/listings/listing-grid";

type Listing = {
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

export default function BrowsePageWrapper() {
  return (
    <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" /></div>}>
      <BrowsePage />
    </Suspense>
  );
}

function BrowsePage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [listings, setListings] = useState<Listing[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const search = searchParams.get("search") ?? "";
  const category = searchParams.get("category") ?? "";
  const sort = searchParams.get("sort") ?? "newest";
  const page = parseInt(searchParams.get("page") ?? "1");

  const fetchListings = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category) params.set("category", category);
    params.set("sort", sort);
    params.set("page", page.toString());

    const res = await fetch(`/api/listings?${params}`);
    const data = await res.json();
    setListings(data.listings ?? []);
    setTotal(data.total ?? 0);
    setLoading(false);
  }, [search, category, sort, page]);

  useEffect(() => { fetchListings(); }, [fetchListings]);

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.push(`/browse?${params}`);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Browse Products</h1>
        <p className="mt-1 text-zinc-400">
          {total > 0 ? `${total} products found` : "Explore our marketplace"}
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Filters Sidebar */}
        <div className="w-full shrink-0 lg:w-64">
          <div className="space-y-6 rounded-xl border border-white/10 bg-zinc-900/50 p-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">Search</label>
              <input
                type="text"
                defaultValue={search}
                onKeyDown={(e) => {
                  if (e.key === "Enter") updateParam("search", e.currentTarget.value);
                }}
                placeholder="Search products..."
                className="w-full rounded-lg border border-white/10 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-violet-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">Category</label>
              <select
                value={category}
                onChange={(e) => updateParam("category", e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-zinc-800 px-3 py-2 text-sm text-white focus:border-violet-500 focus:outline-none"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">Sort By</label>
              <select
                value={sort}
                onChange={(e) => updateParam("sort", e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-zinc-800 px-3 py-2 text-sm text-white focus:border-violet-500 focus:outline-none"
              >
                <option value="newest">Newest</option>
                <option value="best-selling">Best Selling</option>
                <option value="top-rated">Top Rated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-xl border border-white/10 bg-zinc-900/50">
                  <div className="skeleton aspect-[16/10]" />
                  <div className="space-y-3 p-4">
                    <div className="skeleton h-3 w-20 rounded" />
                    <div className="skeleton h-4 w-3/4 rounded" />
                    <div className="skeleton h-3 w-full rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ListingGrid listings={listings} />
          )}

          {total > 20 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              {page > 1 && (
                <button
                  onClick={() => updateParam("page", (page - 1).toString())}
                  className="rounded-lg border border-white/10 px-4 py-2 text-sm text-zinc-400 hover:text-white"
                >
                  Previous
                </button>
              )}
              <span className="text-sm text-zinc-500">
                Page {page} of {Math.ceil(total / 20)}
              </span>
              {page < Math.ceil(total / 20) && (
                <button
                  onClick={() => updateParam("page", (page + 1).toString())}
                  className="rounded-lg border border-white/10 px-4 py-2 text-sm text-zinc-400 hover:text-white"
                >
                  Next
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
