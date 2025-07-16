"use client";

import React from "react";
import { Grid, Box, Typography } from "@repo/ui/mui";
import Element from "./Element";

interface ContainerItem {
  element: string;
  _id: string;
}

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
}

interface GridPageProps {
  layoutOptions: LayoutOptions;
  items: ContainerItem[];
  elementDataMap: { [key: string]: any };
  containerTitle: string;
  description: string;
}

const ClientGridPage: React.FC<GridPageProps> = ({ 
  layoutOptions, 
  items, 
  elementDataMap, 
  containerTitle, 
  description 
}) => {
  const gridOptions = layoutOptions?.gridOptions;
  const spacing = gridOptions?.spacing || 2;

  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      {containerTitle && (
        <Typography variant="h4" component="h2" gutterBottom>
          {containerTitle}
        </Typography>
      )}
      {description && (
        <Typography variant="body1" sx={{ marginBottom: 2 }}>
          {description}
        </Typography>
      )}
      
      <Grid container spacing={spacing}>
        {items.map((item) => {
          const elementData = elementDataMap[item.element];
          if (!elementData) return null;

          // Find size configuration for this item
          const sizeConfig = gridOptions?.sizeData?.find(
            (sizeData) => sizeData.column === item.element
          );

          const gridProps = sizeConfig?.size || {
            xs: 12,
            sm: 6,
            md: 4,
            lg: 3,
            xl: 3
          };

          return (
            <Grid key={item.element} {...gridProps}>
              {Array.isArray(elementData) ? 
                elementData.map((data: any, index: number) => (
                  <Element 
                    key={index} 
                    elementData={data} 
                    containerTitle={containerTitle} 
                    description={description} 
                  />
                )) :
                <Element 
                  elementData={elementData} 
                  containerTitle={containerTitle} 
                  description={description} 
                />
              }
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default ClientGridPage;