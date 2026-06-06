import { PrismaClient } from "@prisma/client";
import { generateProductIconUrl } from "../src/lib/icon-generator";

const db = new PrismaClient();

async function main() {
  const listings = await db.listing.findMany();
  console.log(`Found ${listings.length} listings to update...`);

  for (const listing of listings) {
    const thumbnailUrl = generateProductIconUrl(
      listing.title,
      listing.shortDesc || listing.description || "",
      listing.category
    );

    await db.listing.update({
      where: { id: listing.id },
      data: { thumbnailUrl },
    });

    console.log(`Updated icon for: ${listing.title}`);
  }

  console.log("All icons updated!");
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
