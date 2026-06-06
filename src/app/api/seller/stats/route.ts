import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuth } from "@/lib/auth";

export async function GET() {
  const session = await getAuth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [listings, orders, reviews] = await Promise.all([
    db.listing.findMany({
      where: { sellerId: session.user.id },
      select: { id: true, title: true, slug: true, status: true, totalSales: true, price: true, avgRating: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    }),
    db.order.findMany({
      where: { listing: { sellerId: session.user.id }, status: "COMPLETED" },
      select: { amountPaid: true, platformFee: true, createdAt: true },
    }),
    db.review.findMany({
      where: { listing: { sellerId: session.user.id } },
      include: {
        buyer: { select: { name: true, image: true } },
        listing: { select: { title: true, slug: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.amountPaid - o.platformFee), 0);
  const totalSales = orders.length;

  return NextResponse.json({
    listings,
    totalRevenue,
    totalSales,
    recentReviews: reviews,
  });
}
