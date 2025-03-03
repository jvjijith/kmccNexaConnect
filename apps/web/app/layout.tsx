"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@repo/ui/NavBar";
import { fetchApi } from "../src/utils/api"; // Corrected import
import { themes, withOpacity } from "../src/utils/colors";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [menuData, setMenuData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchApi("/apps/menu"); // Use the dynamic function
        setMenuData(data);
      } catch (error) {
        console.error("Error fetching menu data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <html lang="en">
      <body>
      <Navbar 
        menuData={menuData} 
        fetchApi={fetchApi} 
        theme={themes.ramadan} 
        withOpacity={withOpacity} 
      />

        {children}
      </body>
    </html>
  );
}
