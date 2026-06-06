import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import ListingGrid from "@/components/listings/listing-grid";

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  const user = await db.user.findUnique({
    where: { username },
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
      bio: true,
      createdAt: true,
      listings: {
        where: { status: "PUBLISHED" },
        orderBy: { createdAt: "desc" },
        include: { seller: { select: { name: true, username: true, image: true } } },
      },
    },
  });

  if (!user) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center gap-4">
        {user.image ? (
          <img src={user.image} alt="" className="h-16 w-16 rounded-full" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/20 text-xl font-bold text-violet-400">
            {user.name?.[0] ?? "U"}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-white">{user.name}</h1>
          <p className="text-sm text-zinc-400">@{user.username}</p>
          {user.bio && <p className="mt-1 text-sm text-zinc-500">{user.bio}</p>}
        </div>
      </div>

      <h2 className="mb-6 text-xl font-semibold text-white">
        Products ({user.listings.length})
      </h2>

      <ListingGrid listings={user.listings} />
    </div>
  );
}
