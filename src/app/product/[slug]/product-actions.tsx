"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ProductActions({ listingId, sellerId }: { listingId: string; sellerId: string }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [wishloading, setWishloading] = useState(false);

  async function handleBuy() {
    if (!session) {
      router.push("/auth/login");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/orders/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId }),
    });

    const data = await res.json();
    setLoading(false);

    if (data.free) {
      router.push(`/orders/${data.orderId}`);
    } else if (data.url) {
      window.location.href = data.url;
    } else {
      alert(data.error || "Something went wrong");
    }
  }

  async function handleWishlist() {
    if (!session) {
      router.push("/auth/login");
      return;
    }

    setWishloading(true);
    await fetch("/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId }),
    });
    setWishloading(false);
  }

  const isOwnListing = session?.user?.id === sellerId;

  return (
    <div className="space-y-3">
      <button
        onClick={handleBuy}
        disabled={loading || isOwnListing}
        className="w-full rounded-lg bg-violet-600 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isOwnListing ? "Your Listing" : loading ? "Processing..." : "Buy Now"}
      </button>
      {!isOwnListing && (
        <button
          onClick={handleWishlist}
          disabled={wishloading}
          className="w-full rounded-lg border border-white/10 py-3 text-sm font-medium text-zinc-400 transition hover:border-white/20 hover:text-white disabled:opacity-50"
        >
          {wishloading ? "..." : "Add to Wishlist"}
        </button>
      )}
    </div>
  );
}
