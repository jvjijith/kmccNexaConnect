"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Box, Skeleton } from "@mui/material";
import { getContainer, getPage } from "../../../src/data/loader";
import Page from "../../../src/components/page";

export default function DynamicPage() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug; // Ensure slug is a string

  const [pageData, setPageData] = useState<any>(null);
  const [containers, setContainers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPageData = async () => {
      if (!slug) return;

      try {
        const data = await getPage(slug);
        if (data) {
          setPageData(data);
          if (data.items?.length) {
            const containersData = await Promise.all(
              data.items.map((itemId: string) => getContainer(itemId))
            );
            setContainers(containersData);
          }
        }
      } catch (error) {
        console.error("Error fetching page:", error);
      }
    };

    fetchPageData();

    // Ensure skeleton stays for at least 3 seconds
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [slug]);

  console.log("pageData from page:", pageData);

  return (
    <Box
      sx={{
        display: "flex",
        top: 0,
        left: 0,
        right:0,
        bottom: 0,
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {!pageData || loading ? (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, marginTop: 8 }}>
          <Skeleton variant="text" width={200} height={40} />
          <Skeleton variant="rectangular" width="90%" height={400} />
          <Skeleton variant="text" width="80%" height={20} />
          <Skeleton variant="text" width="90%" height={20} />
          <Skeleton variant="rectangular" width="90%" height={300} />
          <Skeleton variant="text" width="70%" height={20} />
          <Skeleton variant="text" width="85%" height={20} />
          <Skeleton variant="text" width="75%" height={20} />
          <Skeleton variant="rectangular" width="90%" height={700} />
        </Box>
      ) : (
        <Page pageData={pageData} containers={containers} />
      )}
    </Box>
  );
}
