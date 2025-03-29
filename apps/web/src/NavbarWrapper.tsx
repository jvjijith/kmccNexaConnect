"use client";
import React from "react";
import Navbar from "../app/components/navbar/NavBar";

interface NavbarWrapperProps {
  menuData: any;
  colors: any;
}

export default function NavbarWrapper({ menuData, colors }: NavbarWrapperProps) {
  if (!menuData) return null;
  return <Navbar 
  menuData={menuData}
   themes={colors}  />;
}