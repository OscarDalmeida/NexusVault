"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice, formatDate } from "@/lib/utils";

interface SellerStats {
  totalRevenue: number;
  totalSales: number;
  listings: Array<{
    id: string;
    title: string;
    slug: string;
    status: string;
    totalSales: number;
    price: number;
    avgRating: number;
    createdAt: string;
  }>;
  recentReviews: Array<{
    id: string;
    rating: number;
    body: string | null;
    createdAt: string;
    buyer: { name: string | null; image: string | null };
    listing: { title: string; slug: string };
  }>;
}

export default function SellerDashboardPage() {
  const [stats, setStats] = useState<SellerStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/seller/stats")
      .then((r) => r.json())
      .then((d) => { setStats(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="skeleton h-8 w-48 rounded mb-8" />
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map((i) => <div key={i} className="skeleton h-24 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Seller Dashboard</h1>
        <Link
          href="/dashboard/seller/listings/new"
          className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500"
        >
          + New Listing
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
        <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-5">
          <div className="text-sm text-zinc-400">Total Revenue</div>
          <div className="mt-1 text-2xl font-bold text-white">${stats?.totalRevenue.toFixed(2) ?? "0.00"}</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-5">
          <div className="text-sm text-zinc-400">Total Sales</div>
          <div className="mt-1 text-2xl font-bold text-white">{stats?.totalSales ?? 0}</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-5">
          <div className="text-sm text-zinc-400">Active Listings</div>
          <div className="mt-1 text-2xl font-bold text-white">
            {stats?.listings.filter((l) => l.status === "PUBLISHED").length ?? 0}
          </div>
        </div>
      </div>

      {/* Listings */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Your Listings</h2>
          <Link href="/dashboard/seller/listings" className="text-sm text-violet-400 hover:text-violet-300">
            Manage all →
          </Link>
        </div>
        {stats?.listings.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-8 text-center">
            <p className="text-zinc-400">No listings yet.</p>
            <Link href="/dashboard/seller/listings/new" className="mt-2 inline-block text-sm text-violet-400">
              Create your first listing →
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-zinc-900/80 text-xs text-zinc-400">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Product</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Price</th>
                  <th className="px-4 py-3 text-left font-medium">Sales</th>
                  <th className="px-4 py-3 text-left font-medium">Rating</th>
                  <th className="px-4 py-3 text-left font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {stats?.listings.map((listing) => (
                  <tr key={listing.id} className="hover:bg-white/5">
                    <td className="px-4 py-3 text-white font-medium">{listing.title}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs ${
                        listing.status === "PUBLISHED" ? "bg-green-500/10 text-green-400" : "bg-zinc-500/10 text-zinc-400"
                      }`}>
                        {listing.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-300">{formatPrice(listing.price)}</td>
                    <td className="px-4 py-3 text-zinc-300">{listing.totalSales}</td>
                    <td className="px-4 py-3 text-zinc-300">
                      {listing.avgRating > 0 ? `${listing.avgRating.toFixed(1)} ★` : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/dashboard/seller/listings/${listing.id}/edit`} className="text-violet-400 hover:text-violet-300">
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Reviews */}
      {stats?.recentReviews && stats.recentReviews.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Recent Reviews</h2>
          <div className="space-y-3">
            {stats.recentReviews.map((review) => (
              <div key={review.id} className="rounded-xl border border-white/10 bg-zinc-900/50 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">{review.buyer.name}</span>
                    <span className="text-xs text-zinc-500">on {review.listing.title}</span>
                  </div>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg key={i} className={`h-3.5 w-3.5 ${i < review.rating ? "fill-yellow-400" : "fill-zinc-700"}`} viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                {review.body && <p className="mt-2 text-sm text-zinc-400">{review.body}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
