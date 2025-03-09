"use client";
import React from "react";
import Navbar from "@repo/ui/NavBar";

interface NavbarWrapperProps {
  menuData: any;
}

export default function NavbarWrapper({ menuData }: NavbarWrapperProps) {
  if (!menuData) return null;
  return <Navbar menuData={menuData} />;
}