"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              NexusVault
            </span>
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            <Link href="/browse" className="text-sm text-zinc-400 transition hover:text-white">
              Browse
            </Link>
            {session?.user && (session.user.role === "SELLER" || session.user.role === "BOTH") && (
              <Link href="/dashboard/seller" className="text-sm text-zinc-400 transition hover:text-white">
                Seller Dashboard
              </Link>
            )}
          </div>
        </div>

        <div className="hidden items-center gap-4 md:flex">
          {session?.user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-sm text-zinc-300 transition hover:border-white/20 hover:text-white"
              >
                {session.user.image ? (
                  <img src={session.user.image} alt="" className="h-6 w-6 rounded-full" />
                ) : (
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500/20 text-xs font-medium text-violet-400">
                    {session.user.name?.[0] ?? "U"}
                  </div>
                )}
                {session.user.name ?? "Account"}
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-white/10 bg-zinc-900 py-1 shadow-xl">
                  <Link
                    href="/dashboard/buyer/orders"
                    className="block px-4 py-2 text-sm text-zinc-400 hover:bg-white/5 hover:text-white"
                    onClick={() => setMenuOpen(false)}
                  >
                    My Orders
                  </Link>
                  {(session.user.role === "SELLER" || session.user.role === "BOTH") && (
                    <Link
                      href="/dashboard/seller"
                      className="block px-4 py-2 text-sm text-zinc-400 hover:bg-white/5 hover:text-white"
                      onClick={() => setMenuOpen(false)}
                    >
                      Seller Dashboard
                    </Link>
                  )}
                  <Link
                    href={`/profile/${session.user.username}`}
                    className="block px-4 py-2 text-sm text-zinc-400 hover:bg-white/5 hover:text-white"
                    onClick={() => setMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <hr className="my-1 border-white/10" />
                  <button
                    onClick={() => signOut()}
                    className="block w-full px-4 py-2 text-left text-sm text-zinc-400 hover:bg-white/5 hover:text-white"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/auth/login" className="text-sm text-zinc-400 transition hover:text-white">
                Log In
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-500"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden text-zinc-400 hover:text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/10 bg-zinc-950 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <Link href="/browse" className="text-sm text-zinc-400 hover:text-white" onClick={() => setMobileOpen(false)}>
              Browse
            </Link>
            {session?.user ? (
              <>
                <Link href="/dashboard/buyer/orders" className="text-sm text-zinc-400 hover:text-white" onClick={() => setMobileOpen(false)}>
                  My Orders
                </Link>
                {(session.user.role === "SELLER" || session.user.role === "BOTH") && (
                  <Link href="/dashboard/seller" className="text-sm text-zinc-400 hover:text-white" onClick={() => setMobileOpen(false)}>
                    Seller Dashboard
                  </Link>
                )}
                <button onClick={() => signOut()} className="text-left text-sm text-zinc-400 hover:text-white">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-sm text-zinc-400 hover:text-white" onClick={() => setMobileOpen(false)}>
                  Log In
                </Link>
                <Link href="/auth/signup" className="text-sm text-violet-400 hover:text-violet-300" onClick={() => setMobileOpen(false)}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
