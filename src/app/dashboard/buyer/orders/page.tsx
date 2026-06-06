"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice, formatDate } from "@/lib/utils";
import { getCategoryName } from "@/lib/categories";

interface OrderItem {
  id: string;
  status: string;
  amountPaid: number;
  createdAt: string;
  listing: {
    title: string;
    slug: string;
    thumbnailUrl: string | null;
    category: string;
    seller: { name: string | null; username: string | null };
  };
  review: { id: string } | null;
}

export default function BuyerOrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((d) => { setOrders(d.orders ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-white">My Orders</h1>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-24 rounded-xl" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-4xl opacity-20 mb-4">📦</div>
          <h2 className="text-lg font-medium text-zinc-300">No orders yet</h2>
          <p className="text-sm text-zinc-500 mt-1">Your purchased products will appear here.</p>
          <Link href="/browse" className="mt-4 inline-block text-sm text-violet-400 hover:text-violet-300">
            Browse products →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order.id} href={`/orders/${order.id}`} className="block">
              <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-zinc-900/50 p-4 transition hover:border-violet-500/30">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-zinc-800">
                  {order.listing.thumbnailUrl ? (
                    <img src={order.listing.thumbnailUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-lg opacity-30">
                      {getCategoryName(order.listing.category)?.[0]}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-white truncate">{order.listing.title}</h3>
                  <p className="text-xs text-zinc-500">
                    by {order.listing.seller.name} · {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-medium text-white">{formatPrice(order.amountPaid)}</div>
                  <span className={`text-xs ${order.status === "COMPLETED" ? "text-green-400" : "text-yellow-400"}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
