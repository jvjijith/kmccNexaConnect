import React, { ReactNode } from "react";
import {Grid2 as Grid} from '@mui/material';
import { Container, Typography, Divider, Box } from "@mui/material";

interface LayoutOptions {
  gridOptions?: {
    spacing?: number;
    direction?: "row" | "column" | "row-reverse" | "column-reverse";
    justifyContent?: "flex-start" | "center" | "flex-end" | "space-between" | "space-around" | "space-evenly";
    alignItems?: "flex-start" | "center" | "flex-end" | "stretch" | "baseline";
    wrap?: "nowrap" | "wrap" | "wrap-reverse";
    columns?: number;
    sizeData?: { size: { xs?: number; sm?: number; md?: number; lg?: number; xl?: number } }[];
    defaultSize?: { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
  };
}

interface LayoutPageProps {
  title: string;
  layoutOptions: any;
  children: ReactNode;
}


const LayoutPage: React.FC<LayoutPageProps> = ({ title, layoutOptions, children }) => {
  const gridOptions = layoutOptions?.gridOptions || {};
  const defaultSize = gridOptions.defaultSize || {};
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Title Section */}
      {title && (
        <Box textAlign="center" my={4}>
          <Divider sx={{ width: "25%", mx: "auto", mb: 2 }} />
          <Typography variant="h4" fontWeight="bold" color="text.primary">
            {title}
          </Typography>
          <Divider sx={{ width: "25%", mx: "auto", mt: 2 }} />
        </Box>
      )}
      
      {/* Content Grid */}
      <Grid
        container
        // spacing={gridOptions.spacing || 2}
        justifyContent={gridOptions.justifyContent || "flex-start"}
        alignItems={gridOptions.alignItems || "stretch"}
        flexWrap={gridOptions.wrap || "wrap"}
        direction={gridOptions.direction || "row"}
        // columns={gridOptions.columns || 12}
        spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}
      >
        {React.Children.map(children, (child, index) => {
          const columnSize = gridOptions.sizeData?.[index]?.size || defaultSize;

          return (
            <Grid 
              size={{
                xs:columnSize.xs ,
              sm:columnSize.sm,
              md:columnSize.md,
              lg:columnSize.lg,
              xl:columnSize.xl,
              }}
            >
              {child}
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default LayoutPage;
