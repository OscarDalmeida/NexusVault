import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuth } from "@/lib/auth";

export async function GET() {
  const session = await getAuth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const wishlists = await db.wishlist.findMany({
    where: { userId: session.user.id },
    include: {
      listing: {
        select: { id: true, title: true, slug: true, price: true, thumbnailUrl: true, category: true, avgRating: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ wishlists });
}

export async function POST(req: Request) {
  const session = await getAuth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { listingId } = await req.json();

  const existing = await db.wishlist.findUnique({
    where: { userId_listingId: { userId: session.user.id, listingId } },
  });

  if (existing) {
    await db.wishlist.delete({ where: { id: existing.id } });
    return NextResponse.json({ wishlisted: false });
  }

  await db.wishlist.create({
    data: { userId: session.user.id, listingId },
  });

  return NextResponse.json({ wishlisted: true });
}
