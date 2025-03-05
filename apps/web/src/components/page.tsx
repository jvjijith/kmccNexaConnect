"use client";
import React from "react";
import Containers from "./Container";

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
    </>
  );
};

export default Page;
