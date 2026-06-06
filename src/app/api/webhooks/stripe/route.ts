import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { getDownloadUrl } from "@/lib/s3";
import { sendPurchaseConfirmation, sendSellerNotification } from "@/lib/email";

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { listingId, buyerId, platformFee } = session.metadata!;

    const listing = await db.listing.findUnique({
      where: { id: listingId },
      include: { deliveryItems: true, seller: true },
    });

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    const deliveries = await Promise.all(
      listing.deliveryItems.map(async (item) => {
        let resolvedValue = item.value;
        if (item.type === "FILE") {
          resolvedValue = await getDownloadUrl(item.value);
        }
        return { deliveryItemId: item.id, resolvedValue };
      })
    );

    const order = await db.order.create({
      data: {
        buyerId,
        listingId,
        amountPaid: session.amount_total! / 100,
        platformFee: parseFloat(platformFee),
        stripePaymentIntentId: session.payment_intent as string,
        stripeSessionId: session.id,
        status: "COMPLETED",
        deliveries: { create: deliveries },
      },
    });

    await db.listing.update({
      where: { id: listingId },
      data: { totalSales: { increment: 1 } },
    });

    const buyer = await db.user.findUnique({ where: { id: buyerId } });
    if (buyer?.email) {
      const orderUrl = `${process.env.NEXT_PUBLIC_APP_URL}/orders/${order.id}`;
      await sendPurchaseConfirmation(buyer.email, listing.title, orderUrl).catch(() => {});
    }

    if (listing.seller.email) {
      await sendSellerNotification(listing.seller.email, listing.title, session.amount_total! / 100).catch(() => {});
    }
  }

  if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object;
    await db.order.updateMany({
      where: { stripePaymentIntentId: paymentIntent.id },
      data: { status: "FAILED" },
    });
  }

  return NextResponse.json({ received: true });
}
