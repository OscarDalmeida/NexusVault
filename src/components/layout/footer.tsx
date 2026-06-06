import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-lg font-bold text-transparent">
              NexusVault
            </h3>
            <p className="mt-2 text-sm text-zinc-500">
              The marketplace for premium digital products. Buy and sell instantly.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-300">Marketplace</h4>
            <div className="mt-3 flex flex-col gap-2">
              <Link href="/browse" className="text-sm text-zinc-500 hover:text-zinc-300">Browse All</Link>
              {CATEGORIES.slice(0, 5).map((cat) => (
                <Link key={cat.slug} href={`/browse/${cat.slug}`} className="text-sm text-zinc-500 hover:text-zinc-300">
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-300">Sellers</h4>
            <div className="mt-3 flex flex-col gap-2">
              <Link href="/auth/signup" className="text-sm text-zinc-500 hover:text-zinc-300">Start Selling</Link>
              <Link href="/dashboard/seller" className="text-sm text-zinc-500 hover:text-zinc-300">Seller Dashboard</Link>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-300">Support</h4>
            <div className="mt-3 flex flex-col gap-2">
              <span className="text-sm text-zinc-500">help@nexusvault.com</span>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-white/10 pt-8 text-center text-sm text-zinc-600">
          &copy; {new Date().getFullYear()} NexusVault. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
