import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuth } from "@/lib/auth";
import { stripe, calculateFees } from "@/lib/stripe";

export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Payments are not configured yet. Please set up Stripe." }, { status: 503 });
  }

  const session = await getAuth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { listingId } = await req.json();
  if (!listingId) {
    return NextResponse.json({ error: "Listing ID required" }, { status: 400 });
  }

  const listing = await db.listing.findUnique({
    where: { id: listingId, status: "PUBLISHED" },
    include: { seller: true },
  });

  if (!listing) {
    return NextResponse.json({ error: "Listing not found" }, { status: 404 });
  }

  if (listing.sellerId === session.user.id) {
    return NextResponse.json({ error: "Cannot purchase your own listing" }, { status: 400 });
  }

  const existingOrder = await db.order.findFirst({
    where: { buyerId: session.user.id, listingId, status: "COMPLETED" },
  });

  if (existingOrder) {
    return NextResponse.json({ error: "Already purchased" }, { status: 400 });
  }

  if (listing.price === 0) {
    const order = await createFreeOrder(session.user.id, listing.id);
    return NextResponse.json({ orderId: order.id, free: true });
  }

  const { platformFee } = calculateFees(listing.price);
  const unitAmount = Math.round(listing.price * 100);

  const checkoutParams: Record<string, unknown> = {
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: listing.title,
            description: listing.shortDesc,
            ...(listing.thumbnailUrl ? { images: [listing.thumbnailUrl] } : {}),
          },
          unit_amount: unitAmount,
        },
        quantity: 1,
      },
    ],
    metadata: {
      listingId: listing.id,
      buyerId: session.user.id,
      platformFee: platformFee.toString(),
    },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/product/${listing.slug}`,
  };

  if (listing.seller.stripeAccountId && listing.seller.stripeOnboarded) {
    checkoutParams.payment_intent_data = {
      application_fee_amount: Math.round(platformFee * 100),
      transfer_data: { destination: listing.seller.stripeAccountId },
    };
  }

  const checkoutSession = await stripe.checkout.sessions.create(
    checkoutParams as Parameters<typeof stripe.checkout.sessions.create>[0]
  );

  return NextResponse.json({ url: checkoutSession.url });
}

async function createFreeOrder(buyerId: string, listingId: string) {
  const listing = await db.listing.findUnique({
    where: { id: listingId },
    include: { deliveryItems: true },
  });

  const order = await db.order.create({
    data: {
      buyerId,
      listingId,
      amountPaid: 0,
      platformFee: 0,
      status: "COMPLETED",
      deliveries: {
        create: listing!.deliveryItems.map((item) => ({
          deliveryItemId: item.id,
          resolvedValue: item.value,
        })),
      },
    },
  });

  await db.listing.update({
    where: { id: listingId },
    data: { totalSales: { increment: 1 } },
  });

  return order;
}
