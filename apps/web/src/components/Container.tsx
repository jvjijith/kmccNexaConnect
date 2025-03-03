"use client";
import React, { useEffect, useState } from "react";
import Element from "./Element";
import { getElement } from "../data/loader";

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
  layoutOptions?: LayoutOptions;
  items?: ContainerItem[];
  style?: StyleOptions;
}

interface ContainerProps {
  containerData: ContainerData[]; // Expecting an array of containers
}

const Containers: React.FC<ContainerProps> = ({ containerData }) => {
  const [elementDataMap, setElementDataMap] = useState<{ [key: string]: any }>({});

  // Fetch elements based on container items
  useEffect(() => {
    const fetchElements = async () => {
      if (!containerData) return;

      const elementPromises = containerData.flatMap((container) =>
        container.items?.map(async (item) => {
          const elementData = await getElement(item.element);
          return { [item.element]: elementData };
        }) || []
      );

      const resolvedElements = await Promise.all(elementPromises);
      const elementsMap = Object.assign({}, ...resolvedElements);
      setElementDataMap(elementsMap);
    };

    fetchElements();
  }, [containerData]);

  // console.log("elementDataMap",elementDataMap['670ec2f5dba590f25ae80e1b']);
  return (
    <div>
      {containerData.map((container, index) => {
        const { referenceName, description, layoutOptions, items = [], style = {} } = container;

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
                <div
                  style={{
                    display: "grid",
                    gap: `${layoutOptions.gridOptions?.spacing || 2}px`,
                    gridTemplateColumns: `repeat(${layoutOptions.gridOptions?.columns || 1}, 1fr)`,
                    justifyContent: layoutOptions.gridOptions?.justifyContent || "flex-start",
                    alignItems: layoutOptions.gridOptions?.alignItems || "stretch",
                    flexWrap: layoutOptions.gridOptions?.wrap as React.CSSProperties["flexWrap"]  || "wrap",
                    flexDirection: layoutOptions.gridOptions?.direction as React.CSSProperties["flexDirection"]  || "row",
                  }}
                >
                  {items.map((item) => {
                    const columnSize =
                      layoutOptions.gridOptions?.sizeData?.find((col) => col.column === item.element)?.size;
                      console.log("columnSize",columnSize);
                      console.log("containerData",containerData);
                    return elementDataMap[item.element]?.map((elementData: any, index: number) => (
                      <div
                        key={`${item.element}-${index}`}
                        style={{
                          gridColumn: `span ${columnSize?.md}`,
                        }}
                      >
                        {/* <div> */}
                        <Element elementData={elementData} />
                        {/* </div> */}
                      </div>
                    ));
                  })}


                </div>

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
                        <Element key={index} elementData={elementData} />
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
                        <Element key={index} elementData={elementData} />
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
                        <Element key={index} elementData={elementData} />
                      ))}
                    </div>
                  ))}

                </div>
              );
          }
        };

        return (
          <div key={index} style={containerStyle}>
            {/* <h2>{referenceName}</h2>
            <p>{description}</p> */}
            {renderLayout()}
          </div>
        );
      })}
    </div>
  );
};

export default Containers;
