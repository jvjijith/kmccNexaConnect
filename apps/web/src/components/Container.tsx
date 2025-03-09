import React from "react";
import Element from "./Element";
import { getElement } from "../data/loader";
import { Box, Typography } from "@repo/ui/mui";

interface LayoutOptions {
  layout?: "grid" | "stack" | "tab" | "fluid";
  gridOptions?: {
    spacing?: number;
    direction?: string;
    justifyContent?: string;
    alignItems?: string;
    wrap?: string;
    columns?: number;
    sizeData?: {
        column: number | string; // Column identifier
        size: {
            xs?: number;
            sm?: number;
            md?: number;
            lg?: number;
            xl?: number;
        };
    }[];
    defaultSize?: {
        xs?: number;
        sm?: number;
        md?: number;
        lg?: number;
        xl?: number;
    };
  };
  stackOptions?: {
    spacing?: number;
    direction?: string;
    justifyContent?: string;
    alignItems?: string;
  };
  tabOptions?: {
    orientation?: string;
    variant?: string;
    centered?: boolean;
    indicatorColor?: string;
    textColor?: string;
  };
  fluidOptions?: {
    gutter?: number;
    justify?: string;
  };
}

interface StyleOptions {
  backgroundColor?: string;
  textColor?: string;
  textMutedColor?: string;
  headerFontFamily?: string;
  textFontFamily?: string;
  headerFontSize?: string;
  textFontSize?: string;
  borderRadius?: string;
  padding?: string;
  customCSS?: string;
}

interface ContainerItem {
  element: string;
  _id: string;
}

interface ContainerData {
  referenceName: string;
  description: string;
  title: string;
  layoutOptions?: LayoutOptions;
  items?: ContainerItem[];
  style?: StyleOptions;
}

interface ContainerProps {
  containerData: ContainerData[]; // Expecting an array of containers
}

// Function to fetch elements for all containers
async function getElementsData(containerData: ContainerData[]) {
  const elementDataMap: { [key: string]: any } = {};

  // Gather all unique element IDs across all containers
  const elementIds = new Set<string>();
  containerData?.forEach(container => {
    container.items?.forEach(item => {
      elementIds.add(item.element);
    });
  });

  // Fetch data for each unique element ID
  const elementPromises = Array.from(elementIds).map(async (elementId) => {
    const elementData = await getElement(elementId);
    return { [elementId]: elementData };
  });

  const resolvedElements = await Promise.all(elementPromises);
  return Object.assign({}, ...resolvedElements);
}

const Containers = async ({ containerData }: ContainerProps) => {
  // Fetch all element data at the server
  const elementDataMap = await getElementsData(containerData);

  console.log("containerData", containerData);
  
  return (
    <div>
      {containerData.map((container, index) => {
        const { referenceName, title, description, layoutOptions, items = [], style = {} } = container;

        const containerStyle: React.CSSProperties = {
          backgroundColor: style.backgroundColor || "transparent",
          color: style.textColor || "inherit",
          borderRadius: `${style.borderRadius || "0"}px`,
          padding: `${style.padding || "0"}px`,
          fontFamily: style.textFontFamily || "inherit",
          fontSize: `${style.textFontSize || "16"}px`,
          ...(style.customCSS ? { cssText: style.customCSS } : {}),
        };

        const renderLayout = () => {
          switch (layoutOptions?.layout) {
            case "grid":
              return (
                <>
                {title && (
                    <Box textAlign="center" py={2} sx={{ mb: "5%" }}>
                      <Typography
                        variant="h1"
                        fontWeight="bold"
                        color="text.primary"
                        sx={{
                          display: "inline-block",
                          whiteSpace: "pre-line",
                          wordWrap: "break-word",
                          maxWidth: "80%", // Adjust as needed
                          fontSize: "3.5rem",
                        }}
                      >
                        {title.length > 30
                          ? title.replace(/(.{30})/, "$1\n") // Insert a break after 30 characters
                          : title}
                      </Typography>
                    </Box>
                  )}

                <div
                  style={{
                    display: layoutOptions.gridOptions?.direction?.includes("row") ? "flex" : "grid",
                    gap: `${(layoutOptions.gridOptions?.spacing || 0) * 4}px`, // Adjusted spacing
                    gridTemplateColumns: layoutOptions.gridOptions?.direction?.includes("row")
                      ? undefined
                      : `repeat(${layoutOptions.gridOptions?.columns || 1}, 1fr)`,
                    justifyContent: layoutOptions.gridOptions?.justifyContent || "flex-start",
                    alignItems: layoutOptions.gridOptions?.alignItems || "stretch",
                    flexWrap: layoutOptions.gridOptions?.wrap as React.CSSProperties["flexWrap"] || "wrap",
                    flexDirection: layoutOptions.gridOptions?.direction as React.CSSProperties["flexDirection"] || "row",
                  }}
                >
                  {items.map((item, itemIndex) => {
                    const columnSize = layoutOptions.gridOptions?.sizeData?.[itemIndex]?.size || {};
                    const mdSize = columnSize.md ?? 1; // Default fallback to 1 if undefined
              
                    const elements = elementDataMap[item.element] || []; // Ensure it's an array
                    return elements.map((elementData: any, index: number) => (
                      <div
                        key={`${item.element}-${index}`}
                        style={{
                          gridColumn: `span ${mdSize}`, // Use the safely assigned `mdSize`
                        }}
                      >
                        <Element elementData={elementData} containerTitle={title} />
                      </div>
                    ));
                  })}
                </div>
                </>
              );
              
            case "stack":
              return (
                <div
                  style={{
                    display: "flex",
                    flexDirection: layoutOptions.stackOptions?.direction as React.CSSProperties["flexDirection"]  || "column",
                    gap: `${layoutOptions.stackOptions?.spacing || 2}px`,
                    justifyContent: layoutOptions.stackOptions?.justifyContent || "flex-start",
                    alignItems: layoutOptions.stackOptions?.alignItems || "stretch",
                  }}
                >
                  
                  {items.map((item) => (
                    <div key={item.element}>
                      {elementDataMap[item.element]?.map((elementData: any, index: number) => (
                        <Element key={index} elementData={elementData} containerTitle={title} />
                      ))}
                    </div>
                  ))}

                </div>
              );
            case "tab":
              return <div>{/* Implement tab layout if needed */}</div>;
            case "fluid":
              return (
                <div
                  style={{
                    display: "flex",
                    gap: `${layoutOptions.fluidOptions?.gutter || 16}px`,
                    justifyContent: layoutOptions.fluidOptions?.justify || "start",
                  }}
                >
                  
                  {items.map((item) => (
                    <div key={item.element}>
                      {elementDataMap[item.element]?.map((elementData: any, index: number) => (
                        <Element key={index} elementData={elementData} containerTitle={title} />
                      ))}
                    </div>
                  ))}

                </div>
              );
            default:
              return (
                <div>
                 
                 {items.map((item) => (
                    <div key={item.element}>
                      {elementDataMap[item.element]?.map((elementData: any, index: number) => (
                        <Element key={index} elementData={elementData} containerTitle={title} />
                      ))}
                    </div>
                  ))}

                </div>
              );
          }
        };

        return (
          <div key={index} style={containerStyle}>
            {renderLayout()}
          </div>
        );
      })}
    </div>
  );
};

export default Containers;