import React from "react";
import Element from "./Element";
import { getColor, getElement } from "../data/loader";
import { ArrowRight, Box, Button, Typography } from "@repo/ui/mui";
import { createDynamicTheme } from "@repo/ui/theme";
import GridPage from "./GridPage";

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

// Define an interface for the color data
interface ColorData {
  theme?: {
    palette: {
      primary: {
        main: string;
        [key: string]: any;
      };
      [key: string]: any;
    };
    transitions: {
      create: (prop: string, options?: any) => string;
      duration: {
        shorter: number;
        [key: string]: any;
      };
      [key: string]: any;
    };
    [key: string]: any;
  };
  [key: string]: any;
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

  // Fetch colors server-side
  let colors: ColorData = {};
  try {
    const colorData = await getColor("light");
    if (colorData?.theme?.palette?.primary?.main) {
      colors = colorData as ColorData;
    }
  } catch (error) {
    console.error("Error fetching theme colors:", error);
  }

  console.log("containerData", containerData);
  
  const theme = createDynamicTheme({colors});
  
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
                <GridPage containerData={containerData}/>
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