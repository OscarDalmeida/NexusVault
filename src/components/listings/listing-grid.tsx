import ListingCard from "./listing-card";

interface ListingGridProps {
  listings: Array<{
    id: string;
    title: string;
    slug: string;
    shortDesc: string;
    price: number;
    thumbnailUrl: string | null;
    category: string;
    avgRating: number;
    reviewCount: number;
    totalSales: number;
    seller: { name: string | null; username: string | null };
  }>;
}

export default function ListingGrid({ listings }: ListingGridProps) {
  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-4xl opacity-30 mb-4">🔍</div>
        <h3 className="text-lg font-medium text-zinc-300">No products found</h3>
        <p className="text-sm text-zinc-500 mt-1">Try adjusting your filters or search query.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
