import React from "react";
import Containers from "./Container";

interface PageProps {
  pageData: any;
  containers: any[];
}

const Page: React.FC<PageProps> = ({ pageData, containers }) => {
  // Check if there's no pageData or empty/invalid containers
  if (!pageData || !containers || containers.length === 0) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          backgroundColor: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "4rem"
        }}
      >
        🚧
      </div>
    );
  }

  return (
    <>
      {containers.map((container, index) => (
        <Containers key={index} containerData={container} />
      ))}
    </>
  );
};

export default Page;
