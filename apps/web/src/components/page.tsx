import React from "react";
import Containers from "./Container";

interface PageProps {
  pageData: any;
  containers: any[];
}

const Page: React.FC<PageProps> = ({ pageData, containers }) => {
  if (!pageData) return null; // Prevent rendering if no data

  return (
    <>
      {containers.map((container, index) => (
        <Containers key={index} containerData={container} />
      ))}
    </>
  );
};

export default Page;
