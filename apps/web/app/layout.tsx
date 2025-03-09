import React from "react";
import Footer from "@repo/ui/footer";
import { getMenu } from "../src/data/loader";
import NavbarWrapper from "../src/NavbarWrapper";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let menuData = null;

  try {
    menuData = await getMenu();
  } catch (error) {
    console.error("Error fetching menu data:", error);
  }

  return (
    <html lang="en">
      <body>
        <NavbarWrapper menuData={menuData} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}