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
    default: "NexusVault — Digital Product Marketplace",
    template: "%s | NexusVault",
  },
  description: "Buy and sell premium digital products instantly. AI prompts, templates, courses, code, design assets, and more.",
  openGraph: {
    title: "NexusVault — Digital Product Marketplace",
    description: "Buy and sell premium digital products instantly.",
    siteName: "NexusVault",
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
