"use client";

import React, { useEffect, useState } from "react";
import  Navbar  from "@repo/ui/NavBar";
import  Nav  from "@repo/ui/Nav";
import  Footer  from "@repo/ui/footer";
import { fetchApi } from "../src/utils/api"; // Corrected import
import { themes, withOpacity } from "../src/utils/colors";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [menuData, setMenuData] = useState<any>(null);
  const [isTopOfPage, setIsTopOfPage] = useState<boolean>(true);

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

    // const handleScroll = () => {
    //   if (window.scrollY === 0) {
    //     setIsTopOfPage(true);
    //   }
    //   if (window.scrollY !== 0) setIsTopOfPage(false);
    // };
    // window.addEventListener("scroll", handleScroll);
    // return () => window.removeEventListener("scroll", handleScroll);

  }, []);

  console.log("menuData",menuData);

  return (
    <html lang="en">
      <body>
      <Navbar 
        menuData={menuData} 
        // fetchApi={fetchApi} 
        // theme={themes.ramadan} 
        // withOpacity={withOpacity} 
      />

      {/* <Nav
      menuData={menuData} 
      fetchApi={fetchApi} 
      theme={themes.ramadan} 
      withOpacity={withOpacity}
      isTopOfPage={isTopOfPage}
      /> */}

        {children}
        <Footer/>
      </body>
    </html>
  );
}
