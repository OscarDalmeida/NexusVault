import Link from "next/link";
import { db } from "@/lib/db";
import { CATEGORIES } from "@/lib/categories";
import ListingGrid from "@/components/listings/listing-grid";
import {
  AIPromptsIcon,
  ClaudeSkillsIcon,
  TemplatesIcon,
  CoursesIcon,
  DesignIcon,
  CodeIcon,
  SpreadsheetIcon,
  EbooksIcon,
} from "@/components/ui/category-icons";

const FEATURED_CATEGORIES = [
  {
    slug: "ai-tools-prompts",
    name: "AI Prompts",
    description: "ChatGPT & Claude prompts, agent configs, automation workflows",
    icon: AIPromptsIcon,
    gradient: "from-violet-500/20 to-fuchsia-500/20",
    border: "hover:border-violet-500/50",
    glow: "group-hover:shadow-violet-500/20",
  },
  {
    slug: "ai-tools-prompts",
    name: "Claude Skills",
    description: "Custom Claude system prompts, specialized assistants & tools",
    icon: ClaudeSkillsIcon,
    gradient: "from-amber-500/20 to-orange-500/20",
    border: "hover:border-amber-500/50",
    glow: "group-hover:shadow-amber-500/20",
    search: "claude",
  },
  {
    slug: "spreadsheet-templates",
    name: "Spreadsheets",
    description: "Excel & Sheets financial models, trackers, dashboards",
    icon: SpreadsheetIcon,
    gradient: "from-green-500/20 to-emerald-500/20",
    border: "hover:border-green-500/50",
    glow: "group-hover:shadow-green-500/20",
  },
  {
    slug: "design-assets",
    name: "Design Assets",
    description: "UI kits, Figma components, icon packs, mockups",
    icon: DesignIcon,
    gradient: "from-pink-500/20 to-violet-500/20",
    border: "hover:border-pink-500/50",
    glow: "group-hover:shadow-pink-500/20",
  },
  {
    slug: "courses-tutorials",
    name: "Courses",
    description: "Video lessons, structured modules, workshop recordings",
    icon: CoursesIcon,
    gradient: "from-blue-500/20 to-cyan-500/20",
    border: "hover:border-blue-500/50",
    glow: "group-hover:shadow-blue-500/20",
  },
  {
    slug: "code-dev-tools",
    name: "Code & Dev",
    description: "Scripts, boilerplates, SaaS starter kits, APIs",
    icon: CodeIcon,
    gradient: "from-cyan-500/20 to-teal-500/20",
    border: "hover:border-cyan-500/50",
    glow: "group-hover:shadow-cyan-500/20",
  },
  {
    slug: "presentation-templates",
    name: "Templates",
    description: "Slides, documents, Notion dashboards, printables",
    icon: TemplatesIcon,
    gradient: "from-emerald-500/20 to-green-500/20",
    border: "hover:border-emerald-500/50",
    glow: "group-hover:shadow-emerald-500/20",
  },
  {
    slug: "ebooks-guides",
    name: "eBooks & Guides",
    description: "PDFs, how-to guides, research reports, playbooks",
    icon: EbooksIcon,
    gradient: "from-orange-500/20 to-amber-500/20",
    border: "hover:border-orange-500/50",
    glow: "group-hover:shadow-orange-500/20",
  },
];

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
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-violet-500/5 blur-3xl" />
        <div className="absolute top-40 right-10 h-72 w-72 rounded-full bg-fuchsia-500/5 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="animate-page-up">
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                  Premium Digital
                </span>
                <br />
                <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                  Products
                </span>
              </h1>
            </div>
            <p className="mt-6 text-lg text-zinc-400 sm:text-xl animate-page-up" style={{ animationDelay: "0.1s" }}>
              Discover thousands of digital products from creators worldwide. Templates, tools, courses, and more — delivered instantly.
            </p>
            <div className="mt-8 animate-page-up" style={{ animationDelay: "0.2s" }}>
              <form action="/browse" method="get" className="mx-auto flex max-w-xl overflow-hidden rounded-xl border border-white/10 bg-zinc-900 focus-within:border-violet-500/50 focus-within:ring-1 focus-within:ring-violet-500/50 transition-all duration-300">
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
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 animate-page-up" style={{ animationDelay: "0.3s" }}>
              <span className="text-xs text-zinc-600">Popular:</span>
              {["AI Prompts", "Notion Templates", "UI Kits", "Courses"].map((tag) => (
                <Link
                  key={tag}
                  href={`/browse?search=${encodeURIComponent(tag)}`}
                  className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400 transition-all duration-300 hover:border-violet-500/50 hover:text-violet-400 hover:bg-violet-500/5"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Stats Bar */}
      <section className="border-y border-white/10 bg-zinc-900/40">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { value: "10,000+", label: "Products", icon: "📦" },
              { value: "5,000+", label: "Creators", icon: "🎨" },
              { value: "50,000+", label: "Happy Buyers", icon: "⭐" },
              { value: "4.8/5", label: "Avg Rating", icon: "🏆" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center justify-center gap-3">
                <span className="text-2xl">{stat.icon}</span>
                <div>
                  <div className="text-lg font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-zinc-500">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Category Icons */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-10 animate-page-up" style={{ animationDelay: "0.15s" }}>
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Explore the Marketplace</h2>
          <p className="mt-2 text-zinc-400">Find exactly what you need across every category</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 stagger-children">
          {FEATURED_CATEGORIES.map((cat) => {
            const IconComponent = cat.icon;
            const href = cat.search
              ? `/browse?category=${cat.slug}&search=${cat.search}`
              : `/browse/${cat.slug}`;
            return (
              <Link
                key={cat.name}
                href={href}
                className={`group relative flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-gradient-to-br ${cat.gradient} p-6 transition-all duration-300 ${cat.border} hover:shadow-lg ${cat.glow} hover:scale-[1.02] hover:-translate-y-1`}
              >
                <div className="rounded-xl bg-white/5 p-3 transition-transform duration-300 group-hover:scale-110">
                  <IconComponent className="h-10 w-10" />
                </div>
                <div className="text-center">
                  <span className="block text-sm font-semibold text-white group-hover:text-white transition-colors">
                    {cat.name}
                  </span>
                  <span className="mt-1 block text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors line-clamp-2">
                    {cat.description}
                  </span>
                </div>
                {/* Hover arrow */}
                <div className="absolute right-3 top-3 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-1">
                  <svg className="h-4 w-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* All Categories (compact) */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <h3 className="mb-4 text-sm font-medium text-zinc-500 uppercase tracking-wider">All Categories</h3>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/browse/${cat.slug}`}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-zinc-900/50 px-4 py-2 text-xs text-zinc-400 transition-all duration-300 hover:border-violet-500/40 hover:text-white hover:bg-zinc-800/80"
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-white">Trending This Week</h2>
              <span className="flex items-center gap-1 rounded-full bg-rose-500/20 border border-rose-500/30 px-2.5 py-0.5 text-xs font-semibold text-rose-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
                Hot
              </span>
            </div>
            <Link href="/browse?sort=best-selling" className="text-sm text-violet-400 hover:text-violet-300 transition-colors">
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
            <Link href="/browse?sort=newest" className="text-sm text-violet-400 hover:text-violet-300 transition-colors">
              View all →
            </Link>
          </div>
          <ListingGrid listings={recent} />
        </section>
      )}

      {/* Trust Signals Bar */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              icon: (
                <svg className="h-6 w-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              ),
              title: "Instant Download",
              desc: "Access your files immediately after purchase. No waiting, no shipping.",
            },
            {
              icon: (
                <svg className="h-6 w-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              ),
              title: "Money-Back Guarantee",
              desc: "Not happy? We offer a 30-day refund on all purchases, no questions asked.",
            },
            {
              icon: (
                <svg className="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              ),
              title: "Secure Payments",
              desc: "256-bit SSL encryption. Your payment info is never stored on our servers.",
            },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-4 rounded-xl border border-white/10 bg-zinc-900/50 p-5">
              <div className="shrink-0 rounded-lg bg-zinc-800 p-2">{item.icon}</div>
              <div>
                <div className="text-sm font-semibold text-white">{item.title}</div>
                <div className="mt-1 text-xs text-zinc-500">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-violet-900/30 to-fuchsia-900/30 p-8 sm:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,_var(--tw-gradient-stops))] from-violet-500/10 via-transparent to-transparent" />
          <div className="relative">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Start Selling Today</h2>
            <p className="mt-3 max-w-xl text-zinc-400">
              Turn your digital creations into income. Set up your store in minutes and reach thousands of buyers.
            </p>
            <Link
              href="/auth/signup"
              className="mt-6 inline-flex rounded-lg bg-violet-600 px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-violet-500 hover:shadow-lg hover:shadow-violet-500/25"
            >
              Create Your Store →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
