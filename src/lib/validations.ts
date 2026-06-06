import { z } from "zod";
import { CATEGORIES } from "./categories";

const categorySlugs = CATEGORIES.map((c) => c.slug);

export const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["BUYER", "SELLER", "BOTH"]),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const listingSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  category: z.string().refine((val) => categorySlugs.includes(val as (typeof categorySlugs)[number]), {
    message: "Invalid category",
  }),
  shortDesc: z.string().min(10, "Short description must be at least 10 characters").max(300),
  description: z.string().min(20, "Description must be at least 20 characters"),
  price: z.number().min(0, "Price cannot be negative"),
  tags: z.array(z.string()).max(10, "Maximum 10 tags"),
  licenseType: z.enum(["PERSONAL", "COMMERCIAL", "EXTENDED"]),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  deliveryItems: z
    .array(
      z.object({
        type: z.enum(["FILE", "LINK", "KEY", "INSTRUCTIONS"]),
        value: z.string().min(1, "Delivery value is required"),
        fileName: z.string().optional(),
        fileSize: z.number().optional(),
      })
    )
    .min(1, "At least one delivery item is required"),
});

export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  body: z.string().max(2000).optional(),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ListingInput = z.infer<typeof listingSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
