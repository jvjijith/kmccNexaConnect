import React from "react";
import { Card, CardContent, CardMedia, Typography, Button, Box } from "@mui/material";

const FundraiserCard = ({
  elementData,
  theme,
  withOpacity,
}: {
  elementData: any;
  theme: {
    primary: string;
    secondary: string;
    accent: string;
    foreground: string;
    background: string;
  };
  withOpacity: (color: string, opacity: number) => string;
}) => {
  const { cardOptions, title, description, imageUrl } = elementData;

  // Helper function to determine visibility
  const isVisible = (position: string) => position !== "none" && position !== "hidden";

  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: 3,
        overflow: "hidden",
        width: "75%",
        minHeight: "85vh",
        mx: "auto",
        my: 4,
        // backgroundColor: theme.background,
        color: theme.foreground,
        display: "flex",
        flexDirection:
          cardOptions.imagePosition === "left"
            ? "row"
            : cardOptions.imagePosition === "right"
            ? "row-reverse"
            : "column",
      }}
    >
      {/* Image */}
      {isVisible(cardOptions.imagePosition) && (
        <CardMedia
          component="img"
          height={cardOptions.imagePosition === "top" || cardOptions.imagePosition === "bottom" ? "280" : "auto"}
          image={imageUrl || "/placeholder.jpg"}
          alt={title?.[0]?.name || "Fundraiser Image"}
          sx={{
            width: cardOptions.imagePosition === "left" || cardOptions.imagePosition === "right" ? "40%" : "100%",
            order:
              cardOptions.imagePosition === "top"
                ? -1
                : cardOptions.imagePosition === "bottom"
                ? 1
                : 0,
          }}
        />
      )}

      <CardContent
        sx={{
          textAlign: "center",
          px: 4,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {/* Title */}
        {isVisible(cardOptions.titlePosition) && (
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{
              order:
                cardOptions.titlePosition === "top"
                  ? -1
                  : cardOptions.titlePosition === "bottom"
                  ? 1
                  : 0,
              mb: 2,
              color: theme.primary,
            }}
          >
            {title?.[0]?.name || "Fundraiser Title"}
          </Typography>
        )}

        {/* Description */}
        {isVisible(cardOptions.descriptionPosition) && (() => {
          let wordCount = 0;
          let truncated = false;
        
          return description?.map((desc: { paragraph: string }, index: number) => {
            const words = desc.paragraph.split(" ");
            
            // Check if adding this paragraph exceeds the 200-word limit
            if (wordCount + words.length > 120) {
              truncated = true;
              const remainingWords = 120 - wordCount;
              desc.paragraph = words.slice(0, remainingWords).join(" ") + "...";
            }
        
            wordCount += words.length;
        
            // Stop rendering more paragraphs if the limit is reached
            if (truncated && wordCount >= 120) return null;
        
            return (
              <Typography
                key={index}
                variant="body1"
                sx={{
                  mb: 3, // Ensures spacing between paragraphs
                  color: withOpacity(theme.primary, 0.8),
                  fontSize: "1.1rem",
                  display: "block", // Forces line breaks
                }}
              >
                {desc.paragraph}
              </Typography>
            );
          });
        })()}


        {/* Action Button */}
        {isVisible(cardOptions.actionButtonPosition) && (
          <Box
            sx={{
              display: "flex",
              justifyContent:
                cardOptions.actionButtonPosition === "inline" || cardOptions.actionButtonPosition === "bottom" ? "center" : "flex-start",
              mt: cardOptions.actionButtonPosition === "bottom" ? 2 : 0,
            }}
          >
            <Button
              variant="contained"
              sx={{
                borderRadius: 50,
                px: 5,
                bgcolor: theme.accent,
                color: "#fff",
                "&:hover": { bgcolor: withOpacity(theme.accent, 0.8) },
              }}
              href={cardOptions.actionButtonUrl || "#"}
            >
              {cardOptions.actionButtonText || "Read More"}
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default FundraiserCard;