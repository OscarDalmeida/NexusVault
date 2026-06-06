import Link from "next/link";
import { db } from "@/lib/db";
import { CATEGORIES } from "@/lib/categories";
import ListingGrid from "@/components/listings/listing-grid";

async function getFeaturedListings() {
  try {
    return await db.listing.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { totalSales: "desc" },
      take: 8,
      include: { seller: { select: { name: true, username: true, image: true } } },
    });
  } catch {
    return [];
  }
}

async function getRecentListings() {
  try {
    return await db.listing.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { seller: { select: { name: true, username: true, image: true } } },
    });
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [featured, recent] = await Promise.all([getFeaturedListings(), getRecentListings()]);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-500/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                Premium Digital
              </span>
              <br />
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                Products
              </span>
            </h1>
            <p className="mt-6 text-lg text-zinc-400 sm:text-xl">
              Discover thousands of digital products from creators worldwide. Templates, tools, courses, and more — delivered instantly.
            </p>
            <div className="mt-8">
              <form action="/browse" method="get" className="mx-auto flex max-w-xl overflow-hidden rounded-xl border border-white/10 bg-zinc-900 focus-within:border-violet-500/50 focus-within:ring-1 focus-within:ring-violet-500/50">
                <input
                  type="text"
                  name="search"
                  placeholder="Search for templates, tools, courses..."
                  className="flex-1 bg-transparent px-5 py-4 text-sm text-white placeholder:text-zinc-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="m-1.5 rounded-lg bg-violet-600 px-6 text-sm font-medium text-white transition hover:bg-violet-500"
                >
                  Search
                </button>
              </form>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs text-zinc-600">Popular:</span>
              {["AI Prompts", "Notion Templates", "UI Kits", "Courses"].map((tag) => (
                <Link
                  key={tag}
                  href={`/browse?search=${encodeURIComponent(tag)}`}
                  className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400 transition hover:border-violet-500/50 hover:text-violet-400"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-8 text-2xl font-bold text-white">Browse Categories</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/browse/${cat.slug}`}
              className="group flex items-center gap-3 rounded-xl border border-white/10 bg-zinc-900/50 p-4 transition-all hover:border-violet-500/50 hover:bg-zinc-900"
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className="text-sm font-medium text-zinc-300 group-hover:text-white line-clamp-2">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Best Sellers</h2>
            <Link href="/browse?sort=best-selling" className="text-sm text-violet-400 hover:text-violet-300">
              View all →
            </Link>
          </div>
          <ListingGrid listings={featured} />
        </section>
      )}

      {/* Recent */}
      {recent.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Recently Added</h2>
            <Link href="/browse?sort=newest" className="text-sm text-violet-400 hover:text-violet-300">
              View all →
            </Link>
          </div>
          <ListingGrid listings={recent} />
        </section>
      )}

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-violet-900/30 to-fuchsia-900/30 p-8 sm:p-12">
          <div className="relative">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Start Selling Today</h2>
            <p className="mt-3 max-w-xl text-zinc-400">
              Turn your digital creations into income. Set up your store in minutes and reach thousands of buyers.
            </p>
            <Link
              href="/auth/signup"
              className="mt-6 inline-flex rounded-lg bg-violet-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-violet-500"
            >
              Create Your Store →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
