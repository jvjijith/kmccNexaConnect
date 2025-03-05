"use client";

import React, { useEffect, useState } from "react";
import { fetchApi } from "../src/utils/api";
import { themes, withOpacity } from "../src/utils/colors";
import TopLoader from "./components/TopLoader";
import NextTopLoader from "nextjs-toploader";
import Navbar from "@repo/ui/NavBar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [menuData, setMenuData] = useState<any>(null);
  const [isTopOfPage, setIsTopOfPage] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchApi("/apps/menu");
        setMenuData(data);
      } catch (error) {
        console.error("Error fetching menu data:", error);
      }
    };

    const handleScroll = () => {
      if (window.scrollY === 0) {
        setIsTopOfPage(true);
      }
      if (window.scrollY !== 0) setIsTopOfPage(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);

    fetchData();
  }, []);

  return (
    <html lang="en">
      <body>
        <div className="app">
        {/* Ensure TopLoader is inside body */}
        <NextTopLoader/>

        <Navbar
        isTopOfPage={isTopOfPage}
          menuData={menuData} 
          fetchApi={fetchApi} 
          theme={themes.ramadan} 
          withOpacity={withOpacity} 
        />

        {children}
        </div>
      </body>
    </html>
  );
}
