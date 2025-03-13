import React from "react";
import { Grid, Box, Typography, Button } from "@repo/ui/mui";
import Element from "./Element";
import { ArrowRight } from "@repo/ui/mui";
import { createDynamicTheme } from "@repo/ui/theme";
import { getColor, getElement } from "../data/loader";

interface ContainerItem {
  element: string;
  _id: string;
}

interface LayoutOptions {
  gridOptions?: {
    spacing?: number;
    columns?: number;
    justifyContent?: number;
    alignItems?: number;
    direction?: string;
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
  };
}

interface StyleOptions {
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: string;
  padding?: string;
}

interface ContainerData {
  referenceName: string;
  description: string;
  title: string;
  layoutOptions?: any;
  items?: ContainerItem[];
  style?: StyleOptions;
}

const GridPage: React.FC<{ containerData: ContainerData[] }> = async ({ containerData }) => {
  // Fetch all element data
  const elementDataMap: { [key: string]: any } = {};
  for (const container of containerData) {
    for (const item of container.items || []) {
      elementDataMap[item.element] = await getElement(item.element);
    }
  }

  // Fetch theme colors
  let colors: any = {};
  try {
    colors = await getColor("light");
  } catch (error) {
    console.error("Error fetching theme colors:", error);
  }

  const theme = createDynamicTheme({ colors });

  return (
    <Box>
      {containerData.map((container, index) => (
        <Box key={index} sx={{ backgroundColor: container.style?.backgroundColor || "transparent", padding: container.style?.padding || "0px", borderRadius: container.style?.borderRadius || "0px" }}>
          {container.title && (
            <Box textAlign="center" py={2} sx={{ mb: "1%", mt: "5%" }}>
              <Typography variant="h1" fontWeight="bold" sx={{ fontSize: "3rem" }}>
                {container.title}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {container.description}
              </Typography>
            </Box>
          )}

          <Grid container 
          spacing={container.layoutOptions?.gridOptions?.spacing || 2} 
          justifyContent={container.layoutOptions?.gridOptions?.justifyContent ||'center'}
          alignItems={container.layoutOptions?.gridOptions?.alignItems ||'center'}
          direction={container.layoutOptions?.gridOptions?.alignItems ||'row'}
          >
            {container.items?.map((item, itemIndex) => {
              const size = container.layoutOptions?.gridOptions?.sizeData?.[itemIndex]?.size || {};
              return (
                <Grid size = {{xs:size.xs || 12, sm:size.sm || 6, md:size.md || 4, lg:size.lg || 3, xl:size.xl || 3}} key={item.element}>
                  {elementDataMap[item.element]?.map((elementData: any, i: number) => (
                    <Element key={i} elementData={elementData} containerTitle={container.title} />
                  ))}
                </Grid>
              );
            })}
          </Grid>
        </Box>
      ))}
    </Box>
  );
};

export default GridPage;
