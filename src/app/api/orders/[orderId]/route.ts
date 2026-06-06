import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuth } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: Promise<{ orderId: string }> }) {
  const session = await getAuth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId } = await params;

  const order = await db.order.findUnique({
    where: { id: orderId },
    include: {
      listing: {
        include: { seller: { select: { name: true, username: true } } },
      },
      deliveries: {
        include: { deliveryItem: true },
      },
      review: true,
    },
  });

  if (!order || order.buyerId !== session.user.id) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const deliveries = await Promise.all(
    order.deliveries.map(async (d) => {
      let resolvedValue = d.resolvedValue;

      // For FILE type, try to generate a fresh signed download URL
      if (d.deliveryItem.type === "FILE") {
        try {
          const { getDownloadUrl } = await import("@/lib/s3");
          resolvedValue = await getDownloadUrl(d.deliveryItem.value);
        } catch {
          // S3 not configured — use the stored value as-is
        }
      }

      return {
        id: d.id,
        type: d.deliveryItem.type,
        value: resolvedValue,
        fileName: d.deliveryItem.fileName,
        fileSize: d.deliveryItem.fileSize,
      };
    })
  );

  return NextResponse.json({
    order: {
      id: order.id,
      status: order.status,
      amountPaid: order.amountPaid,
      createdAt: order.createdAt,
      listing: order.listing,
      deliveries,
      review: order.review,
    },
  });
}
