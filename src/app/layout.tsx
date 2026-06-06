import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/lib/session-provider";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import PageTransition from "@/components/ui/page-transition";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "NexusVault — Digital Product Marketplace | AI Prompts, Templates & More",
    template: "%s | NexusVault",
  },
  description: "Buy and sell premium digital products instantly. AI prompts for ChatGPT & Claude, budget spreadsheets, templates, courses, code, design assets, and more. Instant digital delivery.",
  keywords: ["digital products", "AI prompts", "ChatGPT prompts", "Claude prompts", "budget spreadsheet", "digital marketplace", "templates", "NexusVault"],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://nexus-vault-beta.vercel.app"),
  openGraph: {
    title: "NexusVault — Digital Product Marketplace",
    description: "Buy and sell premium digital products instantly. AI prompts, templates, courses, and more.",
    siteName: "NexusVault",
    type: "website",
    locale: "en_US",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "NexusVault — Digital Product Marketplace",
    description: "Buy and sell premium digital products instantly. AI prompts, templates, courses, and more.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body className="min-h-screen bg-zinc-950 font-sans text-white antialiased">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
