"use client";

import NextTopLoader from "nextjs-toploader";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function TopLoader() {
  const pathname = usePathname();

  useEffect(() => {
    // Triggers a re-render when the route changes
  }, [pathname]);

  return (
    <NextTopLoader
      color="#2299DD"
      initialPosition={0.08}
      crawlSpeed={200}
      height={3}
      crawl={true}
      showSpinner={true}
      easing="ease"
      speed={200}
      shadow="#000000"
    />
  );
}
