import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuth } from "@/lib/auth";
import { listingSchema } from "@/lib/validations";
import { generateProductIconUrl } from "@/lib/icon-generator";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const listing = await db.listing.findFirst({
    where: { OR: [{ id }, { slug: id }] },
    include: {
      seller: { select: { id: true, name: true, username: true, image: true, bio: true } },
      deliveryItems: { select: { id: true, type: true, fileName: true, fileSize: true } },
      reviews: {
        include: { buyer: { select: { name: true, image: true } } },
        orderBy: { createdAt: "desc" },
        take: 20,
      },
    },
  });

  if (!listing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ listing });
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAuth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const listing = await db.listing.findUnique({ where: { id } });
  if (!listing || listing.sellerId !== session.user.id) {
    return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });
  }

  try {
    const body = await req.json();
    const parsed = listingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { deliveryItems, ...listingData } = parsed.data;

    await db.deliveryItem.deleteMany({ where: { listingId: id } });

    // Regenerate unique product icon based on updated content
    const thumbnailUrl = generateProductIconUrl(
      listingData.title,
      listingData.shortDesc || listingData.description || "",
      listingData.category
    );

    const updated = await db.listing.update({
      where: { id },
      data: {
        ...listingData,
        thumbnailUrl,
        deliveryItems: {
          create: deliveryItems.map((item) => ({
            type: item.type,
            value: item.value,
            fileName: item.fileName,
            fileSize: item.fileSize,
          })),
        },
      },
      include: { deliveryItems: true },
    });

    return NextResponse.json({ listing: updated });
  } catch {
    return NextResponse.json({ error: "Failed to update listing" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAuth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const listing = await db.listing.findUnique({ where: { id } });
  if (!listing || listing.sellerId !== session.user.id) {
    return NextResponse.json({ error: "Not found or unauthorized" }, { status: 404 });
  }

  await db.listing.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
