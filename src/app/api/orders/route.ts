import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuth } from "@/lib/auth";

export async function GET() {
  const session = await getAuth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await db.order.findMany({
    where: { buyerId: session.user.id },
    include: {
      listing: {
        select: {
          title: true,
          slug: true,
          thumbnailUrl: true,
          category: true,
          seller: { select: { name: true, username: true } },
        },
      },
      review: { select: { id: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ orders });
}
