"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getPage } from "../src/data/loader";

export default function HomeRoute() {
  const [pages, setPages] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pageData = await getPage();
        if (pageData.length > 0) {
          router.replace(`/pages/${pageData[0].slug}`); // Redirect to first page
        }
        setPages(pageData || []);
      } catch (error) {
        console.error("Error fetching pages:", error);
      }
    };

    fetchData();
  }, [router]);

  return <span>Loading...</span>;
}
