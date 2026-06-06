import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuth } from "@/lib/auth";
import { reviewSchema } from "@/lib/validations";

export async function POST(req: Request) {
  const session = await getAuth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { orderId, ...reviewData } = body;
  const parsed = reviewSchema.safeParse(reviewData);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { review: true },
  });

  if (!order || order.buyerId !== session.user.id) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.status !== "COMPLETED") {
    return NextResponse.json({ error: "Order not completed" }, { status: 400 });
  }

  if (order.review) {
    return NextResponse.json({ error: "Already reviewed" }, { status: 400 });
  }

  const review = await db.review.create({
    data: {
      orderId,
      buyerId: session.user.id,
      listingId: order.listingId,
      rating: parsed.data.rating,
      body: parsed.data.body,
    },
  });

  const reviews = await db.review.findMany({ where: { listingId: order.listingId } });
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  await db.listing.update({
    where: { id: order.listingId },
    data: { avgRating: Math.round(avgRating * 10) / 10, reviewCount: reviews.length },
  });

  return NextResponse.json({ review });
}
