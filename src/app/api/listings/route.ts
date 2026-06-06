import { NextResponse } from "next/server";
import slugify from "slugify";
import { db } from "@/lib/db";
import { getAuth } from "@/lib/auth";
import { listingSchema } from "@/lib/validations";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const category = url.searchParams.get("category");
  const search = url.searchParams.get("search");
  const sort = url.searchParams.get("sort") ?? "newest";
  const minPrice = url.searchParams.get("minPrice");
  const maxPrice = url.searchParams.get("maxPrice");
  const page = parseInt(url.searchParams.get("page") ?? "1");
  const limit = parseInt(url.searchParams.get("limit") ?? "20");

  const where: Record<string, unknown> = { status: "PUBLISHED" };

  if (category) where.category = category;
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) (where.price as Record<string, number>).gte = parseFloat(minPrice);
    if (maxPrice) (where.price as Record<string, number>).lte = parseFloat(maxPrice);
  }
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { shortDesc: { contains: search, mode: "insensitive" } },
      { tags: { hasSome: [search.toLowerCase()] } },
    ];
  }

  const orderBy: Record<string, string> =
    sort === "price-asc" ? { price: "asc" } :
    sort === "price-desc" ? { price: "desc" } :
    sort === "best-selling" ? { totalSales: "desc" } :
    sort === "top-rated" ? { avgRating: "desc" } :
    { createdAt: "desc" };

  const [listings, total] = await Promise.all([
    db.listing.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: { seller: { select: { name: true, username: true, image: true } } },
    }),
    db.listing.count({ where }),
  ]);

  return NextResponse.json({ listings, total, pages: Math.ceil(total / limit) });
}

export async function POST(req: Request) {
  const session = await getAuth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await db.user.findUnique({ where: { id: session.user.id } });
  if (!user || (user.role !== "SELLER" && user.role !== "BOTH")) {
    return NextResponse.json({ error: "Only sellers can create listings" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const parsed = listingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { deliveryItems, ...listingData } = parsed.data;

    let slug = slugify(listingData.title, { lower: true, strict: true });
    const existing = await db.listing.findUnique({ where: { slug } });
    if (existing) slug += "-" + Math.random().toString(36).slice(2, 6);

    const listing = await db.listing.create({
      data: {
        ...listingData,
        slug,
        sellerId: session.user.id,
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

    return NextResponse.json({ listing });
  } catch {
    return NextResponse.json({ error: "Failed to create listing" }, { status: 500 });
  }
}
