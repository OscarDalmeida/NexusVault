"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, ReactNode } from "react";

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.classList.remove("animate-page-in");
    // Force reflow
    void el.offsetHeight;
    el.classList.add("animate-page-in");
  }, [pathname]);

  return (
    <div ref={containerRef} className="animate-page-in">
      {children}
    </div>
  );
}
