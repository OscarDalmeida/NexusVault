"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { formatPrice, formatDate } from "@/lib/utils";
import StarRating from "@/components/listings/star-rating";

interface OrderData {
  id: string;
  status: string;
  amountPaid: number;
  createdAt: string;
  listing: { title: string; slug: string; seller: { name: string; username: string } };
  deliveries: Array<{
    id: string;
    type: string;
    value: string;
    fileName?: string;
    fileSize?: number;
  }>;
  review: { id: string; rating: number; body: string } | null;
}

export default function OrderPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewBody, setReviewBody] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/orders/${orderId}`)
      .then((r) => r.json())
      .then((d) => { setOrder(d.order); setLoading(false); })
      .catch(() => setLoading(false));
  }, [orderId]);

  async function submitReview() {
    if (reviewRating === 0) return;
    setReviewSubmitting(true);
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, rating: reviewRating, body: reviewBody }),
    });
    if (res.ok) {
      const data = await res.json();
      setOrder((prev) => prev ? { ...prev, review: data.review } : null);
    }
    setReviewSubmitting(false);
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Order not found</h1>
          <Link href="/dashboard/buyer/orders" className="mt-4 inline-block text-violet-400">View all orders</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link href="/dashboard/buyer/orders" className="text-sm text-violet-400 hover:text-violet-300">
          ← Back to orders
        </Link>
      </div>

      <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">{order.listing.title}</h1>
            <p className="mt-1 text-sm text-zinc-400">
              by {order.listing.seller.name} · {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-white">{formatPrice(order.amountPaid)}</div>
            <span className={`text-xs font-medium ${order.status === "COMPLETED" ? "text-green-400" : "text-yellow-400"}`}>
              {order.status}
            </span>
          </div>
        </div>

        {/* Delivery Content */}
        <div className="mt-8">
          <h2 className="mb-4 text-lg font-semibold text-white">Your Digital Content</h2>
          <div className="space-y-3">
            {order.deliveries.map((d) => (
              <div key={d.id} className="rounded-lg border border-white/10 bg-zinc-800/50 p-4">
                {d.type === "FILE" && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/20">
                        <svg className="h-5 w-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{d.fileName ?? "Download File"}</div>
                        {d.fileSize && <div className="text-xs text-zinc-500">{(d.fileSize / 1024 / 1024).toFixed(1)} MB</div>}
                      </div>
                    </div>
                    <a
                      href={d.value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500"
                    >
                      Download
                    </a>
                  </div>
                )}
                {d.type === "LINK" && (
                  <div>
                    <div className="mb-1 text-xs font-medium text-zinc-500">External Link</div>
                    <a href={d.value} target="_blank" rel="noopener noreferrer" className="text-sm text-violet-400 hover:text-violet-300 break-all">
                      {d.value}
                    </a>
                  </div>
                )}
                {d.type === "KEY" && (
                  <div>
                    <div className="mb-1 text-xs font-medium text-zinc-500">License Key / Access Code</div>
                    <code className="block rounded bg-zinc-900 p-3 text-sm text-green-400 font-mono break-all">
                      {d.value}
                    </code>
                  </div>
                )}
                {d.type === "INSTRUCTIONS" && (
                  <div>
                    <div className="mb-1 text-xs font-medium text-zinc-500">Instructions</div>
                    <div className="text-sm text-zinc-300 whitespace-pre-wrap">{d.value}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Review */}
        <div className="mt-8 border-t border-white/10 pt-6">
          {order.review ? (
            <div>
              <h3 className="text-sm font-medium text-zinc-300">Your Review</h3>
              <div className="mt-2 flex items-center gap-2">
                <StarRating rating={order.review.rating} size="sm" />
              </div>
              {order.review.body && <p className="mt-2 text-sm text-zinc-400">{order.review.body}</p>}
            </div>
          ) : (
            <div>
              <h3 className="text-sm font-medium text-zinc-300">Leave a Review</h3>
              <div className="mt-3 space-y-3">
                <StarRating rating={reviewRating} onChange={setReviewRating} interactive size="lg" />
                <textarea
                  value={reviewBody}
                  onChange={(e) => setReviewBody(e.target.value)}
                  placeholder="Share your experience (optional)"
                  rows={3}
                  className="w-full rounded-lg border border-white/10 bg-zinc-800 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-violet-500 focus:outline-none"
                />
                <button
                  onClick={submitReview}
                  disabled={reviewRating === 0 || reviewSubmitting}
                  className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 disabled:opacity-50"
                >
                  {reviewSubmitting ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
