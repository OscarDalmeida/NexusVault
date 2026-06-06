"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { CATEGORIES } from "@/lib/categories";

interface DeliveryItem {
  type: "FILE" | "LINK" | "KEY" | "INSTRUCTIONS";
  value: string;
  fileName?: string;
  fileSize?: number;
}

export default function EditListingPage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    category: "",
    shortDesc: "",
    description: "",
    price: 0,
    tags: "",
    licenseType: "PERSONAL",
    status: "DRAFT",
  });

  const [deliveryItems, setDeliveryItems] = useState<DeliveryItem[]>([]);

  useEffect(() => {
    fetch(`/api/listings/${id}`)
      .then((r) => r.json())
      .then((data) => {
        const l = data.listing;
        if (l) {
          setForm({
            title: l.title,
            category: l.category,
            shortDesc: l.shortDesc,
            description: l.description,
            price: l.price,
            tags: l.tags?.join(", ") ?? "",
            licenseType: l.licenseType,
            status: l.status,
          });
          setDeliveryItems(
            l.deliveryItems?.map((d: DeliveryItem & { id: string }) => ({
              type: d.type,
              value: d.value ?? "",
              fileName: d.fileName,
              fileSize: d.fileSize,
            })) ?? []
          );
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  function addDeliveryItem() {
    setDeliveryItems([...deliveryItems, { type: "LINK", value: "" }]);
  }

  function removeDeliveryItem(index: number) {
    setDeliveryItems(deliveryItems.filter((_, i) => i !== index));
  }

  function updateDeliveryItem(index: number, field: string, value: string) {
    setDeliveryItems(deliveryItems.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const tags = form.tags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean);

    const res = await fetch(`/api/listings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, tags, deliveryItems }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to update listing");
      setSaving(false);
      return;
    }

    router.push("/dashboard/seller/listings");
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="skeleton h-8 w-48 rounded mb-8" />
        <div className="space-y-4">{[1, 2, 3, 4].map((i) => <div key={i} className="skeleton h-12 rounded-lg" />)}</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-white">Edit Listing</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-sm text-red-400">{error}</div>
        )}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-300">Title</label>
          <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="w-full rounded-lg border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-white focus:border-violet-500 focus:outline-none" />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-300">Category</label>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required className="w-full rounded-lg border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-white focus:border-violet-500 focus:outline-none">
            <option value="">Select a category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.slug} value={cat.slug}>{cat.icon} {cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-300">Short Description</label>
          <input type="text" value={form.shortDesc} onChange={(e) => setForm({ ...form, shortDesc: e.target.value })} required maxLength={300} className="w-full rounded-lg border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-white focus:border-violet-500 focus:outline-none" />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-300">Full Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={8} className="w-full rounded-lg border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-white focus:border-violet-500 focus:outline-none font-mono" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-300">Price (USD)</label>
            <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} min={0} step={0.01} className="w-full rounded-lg border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-white focus:border-violet-500 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-300">License Type</label>
            <select value={form.licenseType} onChange={(e) => setForm({ ...form, licenseType: e.target.value })} className="w-full rounded-lg border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-white focus:border-violet-500 focus:outline-none">
              <option value="PERSONAL">Personal Use</option>
              <option value="COMMERCIAL">Commercial Use</option>
              <option value="EXTENDED">Extended Commercial</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-300">Tags (comma-separated)</label>
          <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="w-full rounded-lg border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-white focus:border-violet-500 focus:outline-none" />
        </div>

        {/* Delivery Items */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-zinc-300">Delivery Items</label>
            <button type="button" onClick={addDeliveryItem} className="text-xs text-violet-400 hover:text-violet-300">+ Add item</button>
          </div>
          <div className="space-y-3">
            {deliveryItems.map((item, index) => (
              <div key={index} className="rounded-lg border border-white/10 bg-zinc-900/80 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <select value={item.type} onChange={(e) => updateDeliveryItem(index, "type", e.target.value)} className="rounded-lg border border-white/10 bg-zinc-800 px-3 py-2 text-sm text-white focus:border-violet-500 focus:outline-none">
                    <option value="FILE">File Upload</option>
                    <option value="LINK">External Link</option>
                    <option value="KEY">License Key</option>
                    <option value="INSTRUCTIONS">Instructions</option>
                  </select>
                  {deliveryItems.length > 1 && (
                    <button type="button" onClick={() => removeDeliveryItem(index)} className="text-xs text-red-400 hover:text-red-300">Remove</button>
                  )}
                </div>
                {item.type === "INSTRUCTIONS" ? (
                  <textarea value={item.value} onChange={(e) => updateDeliveryItem(index, "value", e.target.value)} rows={3} className="w-full rounded-lg border border-white/10 bg-zinc-800 px-4 py-2 text-sm text-white focus:border-violet-500 focus:outline-none" />
                ) : (
                  <input type="text" value={item.value} onChange={(e) => updateDeliveryItem(index, "value", e.target.value)} placeholder={item.type === "LINK" ? "https://..." : item.type === "KEY" ? "License key" : "S3 key"} className="w-full rounded-lg border border-white/10 bg-zinc-800 px-4 py-2 text-sm text-white focus:border-violet-500 focus:outline-none" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-white/10 pt-6">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-zinc-300">
              <input type="radio" checked={form.status === "DRAFT"} onChange={() => setForm({ ...form, status: "DRAFT" })} className="accent-violet-500" /> Draft
            </label>
            <label className="flex items-center gap-2 text-sm text-zinc-300">
              <input type="radio" checked={form.status === "PUBLISHED"} onChange={() => setForm({ ...form, status: "PUBLISHED" })} className="accent-violet-500" /> Published
            </label>
          </div>
          <button type="submit" disabled={saving} className="rounded-lg bg-violet-600 px-6 py-3 text-sm font-medium text-white hover:bg-violet-500 disabled:opacity-50">
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
