import { Box, Skeleton } from "@mui/material";
import { getContainer, getPage } from "../../src/data/loader";
import Page from "../../src/components/page";

// Define types
interface PageData {
  items?: string[];
  [key: string]: any;
}

// Updated interface to match Next.js 15 requirements
interface PageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Record<string, string | string[] | undefined>;
}

// This is now a server component that fetches data during server rendering
export default async function DynamicPage({ params, searchParams }: PageProps) {
  // Await the params object before accessing its properties
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  // Use try/catch for error handling during data fetching
  try {
    // Fetch the page data
    const pageData: PageData = await getPage(slug);
    
    // Fetch containers data if the page has items
    let containers: any[] = [];
    if (pageData?.items?.length) {
      containers = await Promise.all(
        pageData.items.map((itemId: string) => getContainer(itemId))
      );
    }

    console.log("pageData from page:", pageData);

    // Render the page with the fetched data
    return (
      <Box
        sx={{
          display: "flex",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Page pageData={pageData} containers={containers} />
      </Box>
    );
    
  } catch (error) {
    console.error("Error fetching page:", error);
    
    // Return a loading skeleton in case of error
    return (
      <Box
        sx={{
          display: "flex",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
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
      </Box>
    );
  }
}