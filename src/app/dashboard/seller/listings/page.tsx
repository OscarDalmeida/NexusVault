"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

interface Listing {
  id: string;
  title: string;
  slug: string;
  status: string;
  totalSales: number;
  price: number;
  avgRating: number;
}

export default function SellerListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/seller/stats")
      .then((r) => r.json())
      .then((d) => { setListings(d.listings ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    await fetch(`/api/listings/${id}`, { method: "DELETE" });
    setListings(listings.filter((l) => l.id !== id));
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Manage Listings</h1>
        <Link href="/dashboard/seller/listings/new" className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500">
          + New Listing
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="skeleton h-16 rounded-xl" />)}</div>
      ) : listings.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-12 text-center">
          <p className="text-zinc-400">No listings yet.</p>
          <Link href="/dashboard/seller/listings/new" className="mt-2 inline-block text-sm text-violet-400">
            Create your first listing →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {listings.map((listing) => (
            <div key={listing.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-zinc-900/50 p-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <h3 className="text-sm font-semibold text-white truncate">{listing.title}</h3>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${
                    listing.status === "PUBLISHED" ? "bg-green-500/10 text-green-400" : "bg-zinc-500/10 text-zinc-400"
                  }`}>
                    {listing.status}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-4 text-xs text-zinc-500">
                  <span>{formatPrice(listing.price)}</span>
                  <span>{listing.totalSales} sales</span>
                  {listing.avgRating > 0 && <span>{listing.avgRating.toFixed(1)} ★</span>}
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Link href={`/product/${listing.slug}`} className="text-xs text-zinc-400 hover:text-white">View</Link>
                <Link href={`/dashboard/seller/listings/${listing.id}/edit`} className="text-xs text-violet-400 hover:text-violet-300">Edit</Link>
                <button onClick={() => handleDelete(listing.id)} className="text-xs text-red-400 hover:text-red-300">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
