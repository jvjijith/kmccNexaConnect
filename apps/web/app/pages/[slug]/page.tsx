"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Box } from "@mui/material";
import { getContainer, getPage } from "../../../src/data/loader";
import Page from "../../../src/components/page";

export default function DynamicPage() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug; // Ensure slug is a string

  const [pageData, setPageData] = useState<any>(null);
  const [containers, setContainers] = useState<any[]>([]);

  useEffect(() => {
    const fetchPageData = async () => {
      if (!slug) return;

      try {
        const [data] = await getPage(slug); // Ensure this function can handle a single slug
        setPageData(data);

        if (data?.items?.length) {
          const containersData = await Promise.all(
            data.items.map((itemId: string) => getContainer(itemId))
          );
          setContainers(containersData);
        }
      } catch (error) {
        console.error("Error fetching page:", error);
      }
    };

    fetchPageData();
  }, [slug]);

  console.log("pageData from page:",pageData);

  // if (!pageData) return <span>Loading...</span>;

  return (
    <Box  
    sx={{  
      display: "flex", 
      flexDirection: "column",
      overflow: "hidden" 
    }}>
      <Page pageData={pageData} containers={containers} />
    </Box>
  );
}
