"use client";

import NextTopLoader from "nextjs-toploader";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Box } from "@mui/material";

export default function TopLoader() {

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
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
    </Box>
  );
}
