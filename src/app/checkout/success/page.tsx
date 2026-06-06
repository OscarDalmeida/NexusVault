"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function CheckoutSuccessWrapper() {
  return (
    <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" /></div>}>
      <CheckoutSuccessPage />
    </Suspense>
  );
}

function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!sessionId) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Invalid session</h1>
          <Link href="/" className="mt-4 inline-block text-violet-400 hover:text-violet-300">Go home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        {loading ? (
          <div className="space-y-4">
            <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
            <h1 className="text-2xl font-bold text-white">Processing your order...</h1>
            <p className="text-zinc-400">Please wait while we confirm your payment.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
              <svg className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">Purchase Successful!</h1>
            <p className="text-zinc-400">
              Your digital product is ready. Check your email for delivery details.
            </p>
            <div className="flex flex-col gap-3 pt-4">
              <Link
                href="/dashboard/buyer/orders"
                className="rounded-lg bg-violet-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-violet-500"
              >
                View My Orders
              </Link>
              <Link
                href="/browse"
                className="rounded-lg border border-white/10 px-6 py-3 text-sm font-medium text-zinc-400 transition hover:text-white"
              >
                Continue Browsing
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
