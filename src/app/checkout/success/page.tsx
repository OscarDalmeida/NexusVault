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
          <Link href="/" className="mt-4 inline-block text-violet-400 hover:text-violet-300 transition-colors">Go home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 animate-page-in">
      <div className="max-w-md text-center">
        {loading ? (
          <div className="space-y-4 animate-page-up">
            <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
            <h1 className="text-2xl font-bold text-white">Processing your order...</h1>
            <p className="text-zinc-400">Please wait while we confirm your payment.</p>
          </div>
        ) : (
          <div className="space-y-6 animate-scale-in">
            {/* Success icon with glow */}
            <div className="relative mx-auto w-fit">
              <div className="absolute inset-0 rounded-full bg-green-500/20 blur-xl" />
              <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20 border border-green-500/30">
                <svg className="h-10 w-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-bold text-white">Purchase Successful!</h1>
              <p className="mt-2 text-zinc-400">
                Your digital product is ready for instant access.
              </p>
            </div>

            {/* What's next */}
            <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-5 text-left">
              <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">What happens next</div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-xs font-bold text-violet-400 mt-0.5">1</div>
                  <p className="text-sm text-zinc-300">Your content is available immediately in <strong className="text-white">My Orders</strong></p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-xs font-bold text-violet-400 mt-0.5">2</div>
                  <p className="text-sm text-zinc-300">Copy the prompt and paste it into ChatGPT or Claude</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-xs font-bold text-violet-400 mt-0.5">3</div>
                  <p className="text-sm text-zinc-300">Follow the guided questions to build your custom budget</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Link
                href="/dashboard/buyer/orders"
                className="rounded-lg bg-violet-600 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-violet-500 hover:shadow-lg hover:shadow-violet-500/25"
              >
                View My Orders & Get Content →
              </Link>
              <Link
                href="/browse"
                className="rounded-lg border border-white/10 px-6 py-3 text-sm font-medium text-zinc-400 transition hover:text-white hover:border-white/20"
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
