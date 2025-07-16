"use client";

import React, { useEffect, useState } from "react";
import Element from "./Element";
import { getColor, getElement } from "../data/loader";
import { ArrowRight, Box, Button, Typography } from "@repo/ui/mui";
import { createDynamicTheme } from "@repo/ui/theme";
import { ThemeProvider } from '@mui/material/styles';
import ClientGridPage from "./ClientGridPage";

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
        column: number | string;
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
  containerData: ContainerData;
}

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

const ClientContainer: React.FC<ContainerProps> = ({ containerData }) => {
  const [elementDataMap, setElementDataMap] = useState<{ [key: string]: any }>({});
  const [theme, setTheme] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("Loading container data:", containerData);
        
        // Gather all unique element IDs
        const elementIds = new Set<string>();
        containerData.items?.forEach(item => {
          elementIds.add(item.element);
        });

        console.log("Element IDs to load:", Array.from(elementIds));

        // Fetch data for each unique element ID
        const elementDataMap: { [key: string]: any } = {};
        const elementPromises = Array.from(elementIds).map(async (elementId) => {
          try {
            console.log("Loading element:", elementId);
            const elementData = await getElement(elementId);
            console.log("Element loaded:", elementId, elementData);
            return { [elementId]: elementData };
          } catch (error) {
            console.error("Error loading element:", elementId, error);
            return { [elementId]: null };
          }
        });

        const resolvedElements = await Promise.all(elementPromises);
        const finalElementDataMap = Object.assign({}, ...resolvedElements);
        console.log("All elements loaded:", finalElementDataMap);
        setElementDataMap(finalElementDataMap);

        // Fetch colors
        try {
          console.log("Loading colors...");
          const colorData = await getColor("light");
          console.log("Colors loaded:", colorData);
          
          if (colorData) {
            const dynamicTheme = createDynamicTheme(colorData);
            console.log("Theme created:", dynamicTheme);
            setTheme(dynamicTheme);
          }
        } catch (error) {
          console.error("Error fetching theme colors:", error);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error loading container data:", error);
        setIsLoading(false);
      }
    };

    loadData();
  }, [containerData]);

  if (isLoading) {
    return <div>Loading container...</div>;
  }

  const { referenceName, title, description, layoutOptions, items = [], style = {} } = containerData;

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
          <ClientGridPage 
            layoutOptions={layoutOptions} 
            items={items} 
            elementDataMap={elementDataMap} 
            containerTitle={title} 
            description={description} 
          />
        );
        
      case "stack":
        return (
          <div
            style={{
              display: "flex",
              flexDirection: layoutOptions.stackOptions?.direction as React.CSSProperties["flexDirection"] || "column",
              gap: `${layoutOptions.stackOptions?.spacing || 2}px`,
              justifyContent: layoutOptions.stackOptions?.justifyContent || "flex-start",
              alignItems: layoutOptions.stackOptions?.alignItems || "stretch",
            }}
          >
            {items.map((item) => {
              const elementData = elementDataMap[item.element];
              if (!elementData) return null;
              
              return (
                <div key={item.element}>
                  {Array.isArray(elementData) ? 
                    elementData.map((data: any, index: number) => (
                      <Element key={index} elementData={data} containerTitle={title} description={description} />
                    )) :
                    <Element elementData={elementData} containerTitle={title} description={description} />
                  }
                </div>
              );
            })}
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
            {items.map((item) => {
              const elementData = elementDataMap[item.element];
              if (!elementData) return null;
              
              return (
                <div key={item.element}>
                  {Array.isArray(elementData) ? 
                    elementData.map((data: any, index: number) => (
                      <Element key={index} elementData={data} containerTitle={title} description={description} />
                    )) :
                    <Element elementData={elementData} containerTitle={title} description={description} />
                  }
                </div>
              );
            })}
          </div>
        );
        
      default:
        return (
          <div>
            {items.map((item) => {
              const elementData = elementDataMap[item.element];
              if (!elementData) return null;
              
              return (
                <div key={item.element}>
                  {Array.isArray(elementData) ? 
                    elementData.map((data: any, index: number) => (
                      <Element key={index} elementData={data} containerTitle={title} description={description} />
                    )) :
                    <Element elementData={elementData} containerTitle={title} description={description} />
                  }
                </div>
              );
            })}
          </div>
        );
    }
  };

  const content = (
    <div style={containerStyle}>
      {renderLayout()}
    </div>
  );

  // Wrap with theme if available
  if (theme) {
    return (
      <ThemeProvider theme={theme}>
        {content}
      </ThemeProvider>
    );
  }

  return content;
};

export default ClientContainer;