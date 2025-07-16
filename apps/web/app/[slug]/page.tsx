import { Box } from "@mui/material";
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
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

// This is now a server component that fetches data during server rendering
export default async function DynamicPage({ params, searchParams }: PageProps) {
  // Await both params and searchParams objects before accessing their properties
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  // We're also awaiting searchParams even though we're not using it in this component
  await searchParams;
  
  // Use try/catch for error handling during data fetching
  try {
    // Fetch the page data
    const pageData: PageData = await getPage(slug);

    // Check if there's no data or if items array is empty
    if (!pageData || !pageData.items || pageData.items.length === 0) {
      return (
        <Box
          sx={{
            width: "100vw",
            height: "100vh",
            backgroundColor: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "4rem"
          }}
        >
        </Box>
      );
    }

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
    
    // Return a blank white page with construction emoji in case of error
    return (
      <Box
        sx={{
          width: "100vw",
          height: "100vh",
          backgroundColor: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "4rem"
        }}
      >
      </Box>
    );
  }
}