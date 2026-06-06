import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { getCategoryName } from "@/lib/categories";
import { formatPrice, formatDate } from "@/lib/utils";
import ProductActions from "./product-actions";
import FaqAccordion from "./faq-accordion";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const listing = await db.listing.findUnique({ where: { slug }, select: { title: true, shortDesc: true, thumbnailUrl: true, price: true } });

  if (!listing) return { title: "Not Found" };

  return {
    title: listing.title,
    description: listing.shortDesc,
    openGraph: {
      title: listing.title,
      description: listing.shortDesc,
      images: listing.thumbnailUrl ? [listing.thumbnailUrl] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  const listing = await db.listing.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: {
      seller: { select: { id: true, name: true, username: true, image: true, bio: true } },
      reviews: {
        include: { buyer: { select: { name: true, image: true } } },
        orderBy: { createdAt: "desc" },
        take: 20,
      },
    },
  });

  if (!listing) notFound();

  // Fetch more from this seller
  const moreFromSeller = await db.listing.findMany({
    where: { sellerId: listing.seller.id, status: "PUBLISHED", slug: { not: listing.slug } },
    orderBy: { totalSales: "desc" },
    take: 4,
    select: { id: true, title: true, slug: true, shortDesc: true, price: true, thumbnailUrl: true, category: true, avgRating: true, reviewCount: true, totalSales: true },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left: Images + Description */}
        <div className="lg:col-span-2">
          {/* Thumbnail */}
          <div className="overflow-hidden rounded-xl border border-white/10 bg-zinc-900">
            {listing.thumbnailUrl ? (
              <img src={listing.thumbnailUrl} alt={listing.title} className="w-full object-cover" />
            ) : (
              <div className="flex aspect-video items-center justify-center bg-zinc-800/50">
                <span className="text-6xl opacity-20">{getCategoryName(listing.category)?.[0]}</span>
              </div>
            )}
          </div>

          {/* Preview images */}
          {listing.previewUrls.length > 0 && (
            <div className="mt-4 grid grid-cols-5 gap-2">
              {listing.previewUrls.map((url, i) => (
                <img key={i} src={url} alt={`Preview ${i + 1}`} className="rounded-lg border border-white/10 object-cover aspect-square" />
              ))}
            </div>
          )}

          {/* Description */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-white">Description</h2>
            <div className="mt-4 prose prose-invert prose-sm max-w-none text-zinc-300 whitespace-pre-wrap">
              {listing.description}
            </div>
          </div>

          {/* Reviews */}
          <div className="mt-12">
            <h2 className="text-lg font-semibold text-white">
              Reviews ({listing.reviewCount})
            </h2>
            {listing.reviews.length === 0 ? (
              <p className="mt-4 text-sm text-zinc-500">No reviews yet.</p>
            ) : (
              <div className="mt-4 space-y-4">
                {listing.reviews.map((review) => (
                  <div key={review.id} className="rounded-xl border border-white/10 bg-zinc-900/50 p-4">
                    <div className="flex items-center gap-3">
                      {review.buyer.image ? (
                        <img src={review.buyer.image} alt="" className="h-8 w-8 rounded-full" />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/20 text-xs font-medium text-violet-400">
                          {review.buyer.name?.[0] ?? "U"}
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-white">{review.buyer.name}</div>
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <svg key={i} className={`h-3.5 w-3.5 ${i < review.rating ? "fill-yellow-400" : "fill-zinc-700"}`} viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-xs text-zinc-500">{formatDate(review.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    {review.body && <p className="mt-3 text-sm text-zinc-400">{review.body}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Purchase Card */}
        <div>
          <div className="sticky top-24 rounded-xl border border-white/10 bg-zinc-900/50 p-6">
            <div className="mb-1 text-xs font-medium text-violet-400">
              {getCategoryName(listing.category)}
            </div>
            <h1 className="text-2xl font-bold text-white">{listing.title}</h1>
            <p className="mt-2 text-sm text-zinc-400">{listing.shortDesc}</p>

            {/* Seller */}
            <div className="mt-4 flex items-center gap-3 rounded-lg border border-white/10 bg-zinc-800/50 p-3">
              {listing.seller.image ? (
                <img src={listing.seller.image} alt="" className="h-10 w-10 rounded-full" />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/20 text-sm font-medium text-violet-400">
                  {listing.seller.name?.[0] ?? "S"}
                </div>
              )}
              <div>
                <div className="text-sm font-medium text-white">{listing.seller.name}</div>
                <div className="text-xs text-zinc-500">@{listing.seller.username}</div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-4 flex items-center gap-4 text-sm text-zinc-400">
              {listing.avgRating > 0 && (
                <span className="flex items-center gap-1">
                  <svg className="h-4 w-4 fill-yellow-400" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {listing.avgRating.toFixed(1)} ({listing.reviewCount})
                </span>
              )}
              {listing.totalSales > 0 && <span>{listing.totalSales} sales</span>}
            </div>

            {/* Tags */}
            {listing.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {listing.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs text-zinc-400">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Price & Buy */}
            <div className="mt-6 border-t border-white/10 pt-6">
              <div className="mb-4 text-3xl font-bold text-white">{formatPrice(listing.price)}</div>
              <ProductActions listingId={listing.id} sellerId={listing.seller.id} />
            </div>

            <div className="mt-4 text-center text-xs text-zinc-600">
              Instant digital delivery after purchase
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
