"use client";

import { useSession } from "next-auth/react";

export default function PayoutsPage() {
  const { data: session } = useSession();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-white">Payouts</h1>

      <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Stripe Connect</h2>
        <p className="text-sm text-zinc-400 mb-4">
          Payouts are processed through Stripe Connect. Set up your Stripe account to receive payments from your sales.
        </p>
        <p className="text-sm text-zinc-500 mb-6">
          Platform commission: 10% per sale. You receive 90% directly to your connected Stripe account.
        </p>
        <a
          href={`https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_STRIPE_CONNECT_CLIENT_ID}&scope=read_write`}
          className="inline-flex rounded-lg bg-violet-600 px-6 py-3 text-sm font-medium text-white hover:bg-violet-500"
        >
          Connect Stripe Account
        </a>
      </div>
    </div>
  );
}
