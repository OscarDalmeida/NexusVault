"use client";

import { useEffect, useState, useRef } from "react";
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

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
        copied
          ? "bg-green-500/20 text-green-400 border border-green-500/30"
          : "bg-violet-600 text-white hover:bg-violet-500 hover:shadow-lg hover:shadow-violet-500/25"
      }`}
    >
      {copied ? (
        <>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Copied to Clipboard!
        </>
      ) : (
        <>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
          Copy Full Prompt
        </>
      )}
    </button>
  );
}

function PromptRenderer({ content }: { content: string }) {
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Extract the actual prompt (between --- markers) for the copy button
  const promptMatch = content.match(/---\n([\s\S]*?)(?:\n---\s*$|$)/m);
  const rawPrompt = promptMatch ? promptMatch[1].trim() : content;

  // Simple markdown-like rendering
  function renderContent(text: string) {
    return text.split("\n").map((line, i) => {
      // Headers
      if (line.startsWith("### ")) {
        return <h4 key={i} className="mt-5 mb-2 text-sm font-bold text-violet-300 uppercase tracking-wide">{line.slice(4)}</h4>;
      }
      if (line.startsWith("## ")) {
        return <h3 key={i} className="mt-6 mb-3 text-base font-bold text-white border-b border-white/10 pb-2">{line.slice(3)}</h3>;
      }
      if (line.startsWith("# ")) {
        return <h2 key={i} className="mt-6 mb-3 text-lg font-bold text-white">{line.slice(2)}</h2>;
      }
      // Horizontal rule
      if (line.trim() === "---") {
        return <hr key={i} className="my-6 border-white/10" />;
      }
      // Bold text inline
      const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
      // List items
      if (line.match(/^\d+\.\s/)) {
        return <div key={i} className="ml-4 mb-1 text-sm text-zinc-300" dangerouslySetInnerHTML={{ __html: formattedLine }} />;
      }
      if (line.startsWith("- ")) {
        return (
          <div key={i} className="ml-4 mb-1 flex gap-2 text-sm text-zinc-300">
            <span className="text-violet-400 shrink-0">&#x2022;</span>
            <span dangerouslySetInnerHTML={{ __html: formattedLine.slice(2) }} />
          </div>
        );
      }
      // Empty lines
      if (line.trim() === "") {
        return <div key={i} className="h-2" />;
      }
      // Regular text
      return <p key={i} className="text-sm text-zinc-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: formattedLine }} />;
    });
  }

  const previewLength = 1500;
  const isLong = content.length > previewLength;
  const displayContent = expanded || !isLong ? content : content.slice(0, previewLength) + "...";

  return (
    <div className="space-y-4">
      {/* Header bar with copy button */}
      <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 border border-violet-500/20 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20">
            <svg className="h-5 w-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-semibold text-white">Your AI Prompt</div>
            <div className="text-xs text-zinc-400">Copy and paste into ChatGPT or Claude</div>
          </div>
        </div>
        <CopyButton text={rawPrompt} />
      </div>

      {/* Rendered content */}
      <div
        ref={contentRef}
        className={`relative rounded-xl border border-white/10 bg-zinc-900/80 px-6 py-5 ${
          !expanded && isLong ? "max-h-[500px] overflow-hidden" : ""
        }`}
      >
        {renderContent(displayContent)}
        {/* Fade overlay when collapsed */}
        {!expanded && isLong && (
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-900 to-transparent" />
        )}
      </div>

      {/* Expand/collapse */}
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-zinc-800/50 py-3 text-sm font-medium text-zinc-400 transition hover:border-white/20 hover:text-white"
        >
          {expanded ? (
            <>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              Show Less
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              Show Full Prompt
            </>
          )}
        </button>
      )}
    </div>
  );
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
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 animate-page-in">
      <div className="mb-6">
        <Link href="/dashboard/buyer/orders" className="text-sm text-violet-400 hover:text-violet-300 transition-colors">
          ← Back to orders
        </Link>
      </div>

      {/* Order Header */}
      <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">{order.listing.title}</h1>
            <p className="mt-1 text-sm text-zinc-400">
              by {order.listing.seller.name} · {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-white">{formatPrice(order.amountPaid)}</div>
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
              order.status === "COMPLETED"
                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                : order.status === "PENDING"
                  ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                  : "bg-red-500/10 text-red-400 border border-red-500/20"
            }`}>
              {order.status === "COMPLETED" && (
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {order.status}
            </span>
          </div>
        </div>
      </div>

      {/* Delivery Content */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/20">
            <svg className="h-4 w-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-white">Your Digital Content</h2>
        </div>

        <div className="space-y-4">
          {order.deliveries.map((d, index) => (
            <div key={d.id}>
              {/* Multi-item label */}
              {order.deliveries.length > 1 && (
                <div className="mb-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Item {index + 1} of {order.deliveries.length}
                </div>
              )}

              {d.type === "FILE" && (
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-zinc-900/50 p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/20">
                      <svg className="h-6 w-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                    className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-violet-500 transition-all hover:shadow-lg hover:shadow-violet-500/25"
                  >
                    Download
                  </a>
                </div>
              )}

              {d.type === "LINK" && (
                <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-5">
                  <div className="mb-1 text-xs font-medium text-zinc-500">External Link</div>
                  <a href={d.value} target="_blank" rel="noopener noreferrer" className="text-sm text-violet-400 hover:text-violet-300 break-all transition-colors">
                    {d.value}
                  </a>
                </div>
              )}

              {d.type === "KEY" && (
                <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-5">
                  <div className="mb-2 text-xs font-medium text-zinc-500">License Key / Access Code</div>
                  <div className="flex items-center gap-3">
                    <code className="flex-1 rounded-lg bg-zinc-950 p-4 text-sm text-green-400 font-mono break-all border border-green-500/10">
                      {d.value}
                    </code>
                    <CopyButton text={d.value} />
                  </div>
                </div>
              )}

              {d.type === "INSTRUCTIONS" && (
                <PromptRenderer content={d.value} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Start Guide */}
      <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-6 mb-6">
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <svg className="h-4 w-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Quick Start
        </h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="flex items-start gap-3 rounded-lg bg-zinc-800/50 p-4">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-xs font-bold text-violet-400">1</span>
            <div>
              <div className="text-sm font-medium text-white">Copy</div>
              <div className="text-xs text-zinc-500">Click the copy button above to grab the full prompt</div>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-lg bg-zinc-800/50 p-4">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-xs font-bold text-violet-400">2</span>
            <div>
              <div className="text-sm font-medium text-white">Paste</div>
              <div className="text-xs text-zinc-500">Open ChatGPT or Claude and paste the prompt</div>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-lg bg-zinc-800/50 p-4">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-xs font-bold text-violet-400">3</span>
            <div>
              <div className="text-sm font-medium text-white">Interact</div>
              <div className="text-xs text-zinc-500">Answer the guided questions to build your budget</div>
            </div>
          </div>
        </div>
      </div>

      {/* Review */}
      <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-6">
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
            <p className="mt-1 text-xs text-zinc-500">Help other buyers by sharing your experience</p>
            <div className="mt-3 space-y-3">
              <StarRating rating={reviewRating} onChange={setReviewRating} interactive size="lg" />
              <textarea
                value={reviewBody}
                onChange={(e) => setReviewBody(e.target.value)}
                placeholder="Share your experience (optional)"
                rows={3}
                className="w-full rounded-lg border border-white/10 bg-zinc-800 px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-violet-500 focus:outline-none transition-colors"
              />
              <button
                onClick={submitReview}
                disabled={reviewRating === 0 || reviewSubmitting}
                className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 disabled:opacity-50 transition-all"
              >
                {reviewSubmitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
