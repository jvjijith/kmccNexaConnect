"use client";

import React, { Suspense, useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  ThemeProvider,
  Skeleton,
} from "@mui/material";
import { CalendarToday, LocationOn } from "@mui/icons-material";
import { createDynamicTheme } from "../theme/theme";
import ChildrensMinistryDetail from "./model";

// Define the event interface
interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  image?: string;
}

// Props for the component
interface EventCardProps {
  elementData: any;
  themes: any;
}

// Helper function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Skeleton Loader for EventCard
const EventCardSkeleton = () => (
  <Card
    sx={{
      maxWidth: 650,
      minHeight: 650,
      overflow: "hidden",
      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
      mb: "10%",
      borderRadius: "30px",
      margin: 2,
    }}
  >
    <Box sx={{ position: "relative", height: 360 }}>
      <Skeleton variant="rectangular" width="100%" height="100%" />
    </Box>
    <CardContent sx={{ pt: 4, px: 4, pb: 2, minHeight: 135 }}>
      <Skeleton variant="text" width="80%" height={40} sx={{ mb: 2 }} />
      <Skeleton variant="text" width="60%" height={30} sx={{ mb: 2 }} />
      <Skeleton variant="rectangular" width="100%" height={80} />
    </CardContent>
    <CardActions sx={{ p: 4, pt: 0 }}>
      <Skeleton variant="rectangular" width="100%" height={50} />
    </CardActions>
  </Card>
);

const EventCard: React.FC<EventCardProps> = ({ elementData, themes }) => {
  const [openModal, setOpenModal] = useState(false);

  const handleButtonClick = () => {
    if (!(elementData?.cardOptions?.actionButtonUrl)) {
      setOpenModal(true);
    } else {
      window.location.href = `/${elementData?.cardOptions?.actionButtonUrl}`;
    }
  };

  const titles = elementData?.title?.map((t: { name: string }) => t.name) || [];

  const theme = createDynamicTheme({ themes });

  return (
    <Suspense fallback={<EventCardSkeleton />}>
      <ThemeProvider theme={theme}>
        <Card
          sx={{
            maxWidth: 650,
            minHeight: 650,
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            mb: "10%",
            borderRadius: "30px",
            margin: 2,
          }}
        >
          {/* Image section with category badge */}
          <Box sx={{ position: "relative", height: 360 }}>
            <img
              src={elementData?.imageUrl}
              alt={elementData?.referenceName}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Box>

          {/* Card header with title */}
          <CardContent sx={{ pt: 4, px: 4, pb: 2, minHeight: 135 }}>
            {titles.map((title: string, index: string) => (
              <Typography
                key={index}
                variant="h4"
                gutterBottom
                fontWeight="bold"
                sx={{ mb: 3 }}
              >
                {title}
              </Typography>
            ))}

            {/* Date and location info */}
            {elementData?.info?.length > 0 && (
              <>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    mb: 2,
                  }}
                >
                  <CalendarToday sx={{ fontSize: 24, color: "primary.main" }} />
                  <Typography variant="h6" color="text.secondary">
                    {formatDate("2025-04-15")}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    mb: 4,
                  }}
                >
                  <LocationOn sx={{ fontSize: 24, color: "primary.main" }} />
                  <Typography variant="h6" color="text.secondary">
                    {"San Francisco, CA"}
                  </Typography>
                </Box>
              </>
            )}

            {/* Description with line clamp */}
            {elementData?.description?.length > 0 && (
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  mb: 3,
                  lineHeight: 1.8,
                  fontSize: "1.1rem",
                }}
              >
                {elementData?.description[0]?.paragraph}
              </Typography>
            )}
          </CardContent>

          {/* Card footer with button */}
          {elementData?.cardOptions?.actionButtonPosition === "bottom" && (
            <CardActions sx={{ p: 4, pt: 0 }}>
              <Button
                variant="outlined"
                fullWidth
                onClick={handleButtonClick}
                size="large"
                sx={{
                  py: 2,
                  fontSize: "1.2rem",
                  textTransform: "none",
                  borderRadius: 2,
                  borderWidth: 2,
                }}
              >
                {elementData?.cardOptions?.actionButtonText}
              </Button>
            </CardActions>
          )}
        </Card>
        <ChildrensMinistryDetail
          elementData={elementData}
          open={openModal}
          themes={themes}
          onClose={() => setOpenModal(false)}
        />
      </ThemeProvider>
    </Suspense>
  );
};

export default EventCard;