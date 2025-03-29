import React from "react";
import Footer from "@repo/ui/footer";
import { getColor, getMenu } from "../src/data/loader";
import NextTopLoader from "nextjs-toploader";
import Navbar from "./components/navbar/NavBar";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let menuData = null;
  let colors =null;

  try {
    menuData = await getMenu();
    
    const colorData = await getColor("light");
    if (colorData?.theme?.palette?.primary?.main) {
      colors = colorData;
    }
  } catch (error) {
    console.error("Error fetching menu data:", error);
  }

  return (
    <html lang="en">
      <body>
      <NextTopLoader 
          color="#16a249"
          showSpinner={false}
          height={3}
        />
        <Navbar menuData={menuData} themes={colors} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}