import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

// Disable body parsing — Stripe needs the raw body for signature verification
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature or webhook secret" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { listingId, buyerId, platformFee } = session.metadata!;

    try {
      const listing = await db.listing.findUnique({
        where: { id: listingId },
        include: { deliveryItems: true, seller: true },
      });

      if (!listing) {
        console.error("Webhook: Listing not found:", listingId);
        return NextResponse.json({ error: "Listing not found" }, { status: 404 });
      }

      // Resolve delivery values
      const deliveries = await Promise.all(
        listing.deliveryItems.map(async (item) => {
          let resolvedValue = item.value;

          // For FILE type, try to get a signed download URL (S3)
          if (item.type === "FILE") {
            try {
              const { getDownloadUrl } = await import("@/lib/s3");
              resolvedValue = await getDownloadUrl(item.value);
            } catch {
              // S3 not configured — store the key as-is, can be resolved later
              console.warn("S3 not configured, storing raw key for file delivery");
            }
          }

          return { deliveryItemId: item.id, resolvedValue };
        })
      );

      // Check if order already exists (idempotency)
      const existingOrder = await db.order.findFirst({
        where: { stripeSessionId: session.id },
      });

      if (existingOrder) {
        console.log("Order already exists for session:", session.id);
        return NextResponse.json({ received: true });
      }

      // Create the order
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

      // Increment sales counter
      await db.listing.update({
        where: { id: listingId },
        data: { totalSales: { increment: 1 } },
      });

      // Send email notifications (non-blocking, gracefully fail if not configured)
      try {
        const { sendPurchaseConfirmation, sendSellerNotification } = await import("@/lib/email");

        const buyer = await db.user.findUnique({ where: { id: buyerId } });
        if (buyer?.email) {
          const orderUrl = `${process.env.NEXT_PUBLIC_APP_URL}/orders/${order.id}`;
          await sendPurchaseConfirmation(buyer.email, listing.title, orderUrl).catch((e) => {
            console.warn("Failed to send buyer email:", e);
          });
        }

        if (listing.seller.email) {
          await sendSellerNotification(listing.seller.email, listing.title, session.amount_total! / 100).catch((e) => {
            console.warn("Failed to send seller email:", e);
          });
        }
      } catch {
        console.warn("Email service not configured, skipping notifications");
      }

      console.log("Order created successfully:", order.id);
    } catch (err) {
      console.error("Failed to process checkout.session.completed:", err);
      return NextResponse.json({ error: "Processing failed" }, { status: 500 });
    }
  }

  if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object;
    try {
      await db.order.updateMany({
        where: { stripePaymentIntentId: paymentIntent.id },
        data: { status: "FAILED" },
      });
    } catch (err) {
      console.error("Failed to update failed payment:", err);
    }
  }

  return NextResponse.json({ received: true });
}
