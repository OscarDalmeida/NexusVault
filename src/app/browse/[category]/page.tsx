import { redirect } from "next/navigation";
import { getCategoryBySlug } from "@/lib/categories";

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const cat = getCategoryBySlug(category);

  if (!cat) redirect("/browse");

  redirect(`/browse?category=${category}`);
}
