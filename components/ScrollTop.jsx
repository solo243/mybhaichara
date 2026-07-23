"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function ScrollToTopContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Forces the window to the absolute top left whenever the route or query params change
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [pathname, searchParams]);

  return null;
}

export default function ScrollToTop() {
  return (
    <Suspense fallback={null}>
      <ScrollToTopContent />
    </Suspense>
  );
}
