"use client";

import React, { Suspense } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  useTheme,
  useMediaQuery,
  ThemeProvider,
  Skeleton,
} from "@mui/material";
import { ArrowForward as ArrowForwardIcon } from "@mui/icons-material";
import { theme } from '../theme';

interface ChildrensWorshipProps {
  elementData: any;
  containerTitle?: string;
  onClick?: () => void;
}

// Skeleton Component
function ChildrensWorshipSkeleton() {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        overflow: "hidden",
        maxWidth: "100%",
        borderRadius: "0 0 100px 0",
        boxShadow: "none",
      }}
    >
      <Skeleton
        variant="rectangular"
        sx={{
          width: isMobile ? "100%" : "50%",
          height: isMobile ? "300px" : "600px",
          borderRadius: "0 0 100px 0",
        }}
        animation="wave"
      />

      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: theme.spacing(4),
          width: isMobile ? "100%" : "50%",
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Skeleton 
          variant="text" 
          width="80%" 
          height={80} 
          animation="wave"
          sx={{ mb: 1 }}
        />
        <Skeleton 
          variant="text" 
          width="60%" 
          height={60} 
          animation="wave"
          sx={{ mb: 3 }}
        />
        <Skeleton 
          variant="text" 
          width="90%" 
          height={30} 
          animation="wave"
          sx={{ mb: 2 }}
        />
        <Skeleton 
          variant="text" 
          width="85%" 
          height={30} 
          animation="wave"
          sx={{ mb: 2 }}
        />

        <Box sx={{ mt: 10 }}>
          <Skeleton 
            variant="circular" 
            width={48} 
            height={48} 
            animation="wave"
          />
        </Box>
      </CardContent>
    </Card>
  );
}

// Main Content Component
function ChildrensWorshipContent({ elementData, containerTitle, onClick = () => console.log("Children's worship clicked") }: ChildrensWorshipProps) {
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { cardOptions, description, imageUrl } = elementData;
  const isVisible = (position: string) => position !== "none" && position !== "hidden";
  const titles = elementData?.title?.map((t: { name: string }) => t.name) || [];

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        overflow: "hidden",
        maxWidth: "100%",
        borderRadius: "0 0 100px 0",
        boxShadow: "none",
      }}
    >
      <CardMedia
        component="img"
        sx={{
          width: isMobile ? "100%" : "50%",
          borderRadius: "0 0 100px 0",
          objectFit: "cover",
        }}
        image={imageUrl}
        alt="Children gathered in church for worship"
      />

      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: theme.spacing(4),
          width: isMobile ? "100%" : "50%",
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Typography 
          variant="h1" 
          component="h1" 
          fontWeight="bold" 
          mb={1} 
          color="text.primary"
          sx={{ fontSize: { xs: "2rem", sm: "3rem", md: "4rem" } }}
        >
          {titles[0]}
        </Typography>

        {titles.slice(1).map((title: string, index: number) => (
          <Typography 
            key={index}
            variant="body1" 
            component="p"
            color="text.secondary" 
            mb={3}
            sx={{ fontSize: { xs: "0.875rem", sm: "1rem", md: "2.125rem" } }}
          >
            {title}
          </Typography>
        ))}

        <Box>
          {cardOptions.actionButtonPosition === "bottom" &&
            <Button
              variant="contained"
              sx={{
                borderRadius: "50%",
                minWidth: "48px",
                height: "48px",
                padding: 0,
                backgroundColor: theme.palette.primary.main,
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark,
                },
              }}
              onClick={onClick}
            >
              <ArrowForwardIcon />
            </Button>
          }
        </Box>
      </CardContent>
    </Card>
  );
}

// Main Component with Suspense
const ChildrensWorship: React.FC<ChildrensWorshipProps> = (props) => {
  return (
    <ThemeProvider theme={theme}>
      <Suspense fallback={<ChildrensWorshipSkeleton />}>
        <ChildrensWorshipContent {...props} />
      </Suspense>
    </ThemeProvider>
  );
};

export default ChildrensWorship;