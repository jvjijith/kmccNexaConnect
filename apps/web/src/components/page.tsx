"use client";
import React from "react";
import Containers from "./Container";
import About from "@repo/ui/newAbout";
import Image from "@repo/ui/newImage";
import ImageLeft from "@repo/ui/imageLeftCard";
import NoImageCard from "@repo/ui/noimagecard";
import ImageOnlyCard from "@repo/ui/imageonlycard";

interface PageProps {
  pageData: any;
  containers: any[]; // Accept containers as prop
}

const Page: React.FC<PageProps> = ({ pageData, containers }) => {
  // if (!pageData) return <span>Loading...</span>;

  return (
    <>
        {containers.map((container, index) => (
          <Containers key={index} containerData={container} />
        ))}
        
        {/* <About/> */}
        {/* <Image/> */}
        {/* <ImageLeft/> */}
        {/* <NoImageCard/> */}
        {/* <ImageOnlyCard/> */}
    </>
  );
};

export default Page;
