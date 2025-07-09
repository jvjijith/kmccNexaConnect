import React from "react";
import { Grid, Box, Typography, Button } from "@repo/ui/mui";
import Element from "./Element";
import { ArrowRight } from "@repo/ui/mui";
import { createDynamicTheme } from "@repo/ui/theme";
import { getColor, getElement } from "../../src/data/loader";

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

const GridPage: React.FC<{ layoutOptions: any; items: any; elementDataMap: any; containerTitle: string; description: string; }> = async ({ layoutOptions, items, elementDataMap, containerTitle, description }) => {


  // Fetch theme colors
  let colors: any = {};
  try {
    colors = await getColor("light");
  } catch (error) {
    console.error("Error fetching theme colors:", error);
  }

  const theme = createDynamicTheme({ colors });

  return (
    // <Box>
    //   {containerData.map((container, index) => (
    //       )}

    //       <Grid container 
    //       spacing={container.layoutOptions?.gridOptions?.spacing || 2} 
    //       justifyContent={container.layoutOptions?.gridOptions?.justifyContent ||'center'}
    //       alignItems={container.layoutOptions?.gridOptions?.alignItems ||'center'}
    //       direction={container.layoutOptions?.gridOptions?.alignItems ||'row'}
    //       >
    //         {container.items?.map((item, itemIndex) => {
    //           const size = container.layoutOptions?.gridOptions?.sizeData?.[itemIndex]?.size || {};
    //           return (
    //             <Grid size = {{xs:size.xs || 12, sm:size.sm || 6, md:size.md || 4, lg:size.lg || 3, xl:size.xl || 3}} key={item.element}>
    //               {elementDataMap[item.element]?.map((elementData: any, i: number) => (
    //                 <Element key={i} elementData={elementData} containerTitle={container.title} />
    //               ))}
    //             </Grid>
    //           );
    //         })}
    //       </Grid>
    //     </Box>
    //   ))}
    // </Box>


    <Box sx={{ flexGrow: 1 }}>
      
      
          {containerTitle && (
            <Box textAlign="center" py={2} sx={{ mb: "1%", mt: "5%" }}>
              <Typography variant="h1" fontWeight="bold" sx={{ fontSize: "3rem" }}>
                {containerTitle}
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {description}
              </Typography>
              </Box>)}

      <Grid container 
      spacing={layoutOptions?.gridOptions?.spacing || 2}
      columns={layoutOptions?.gridOptions?.columns || 12}
      direction={layoutOptions?.gridOptions?.direction ||'row'}
      sx={{
        justifyContent: layoutOptions?.gridOptions?.justifyContent ||'center',
        alignItems: layoutOptions?.gridOptions?.alignItems ||'center',
      }}
      wrap={layoutOptions?.gridOptions?.wrap ||"wrap"}
      >
       {items.map((item: any, index: string) => {
          const size = layoutOptions?.gridOptions?.sizeData?.[index]?.size || {};
          console.log("size",size);
          return (
            <Grid key={index} size={{ xs:size.xs || 12, sm:size.sm || 6, md:size.md || 4, lg:size.lg || 3, xl:size.xl || 3 }}>
              {elementDataMap[item.element]?.map((elementData: any, index: number) => (
                <Element key={index} elementData={elementData} containerTitle={containerTitle} />
              ))}
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default GridPage;
