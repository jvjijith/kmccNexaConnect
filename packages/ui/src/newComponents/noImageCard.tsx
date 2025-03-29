"use client";

import React, { Suspense } from "react";
import { Box, Typography, Card, CardContent, IconButton, styled, ThemeProvider, useTheme, Skeleton } from "@mui/material";
import { ArrowOutwardOutlined as ArrowOutwardOutlinedIcon } from "@mui/icons-material";
import { createDynamicTheme } from "../theme/theme";

// Custom styled components using theme with responsive adjustments
const StyledCard = styled(Card)(({ theme }) => ({
  borderBottomRightRadius: "60px",
  boxShadow: theme.shadows[3],
  backgroundColor: theme.palette.background.default,
  maxWidth: 650,
  minHeight: 440,
  padding: theme.spacing(3),
  position: "relative",
  overflow: "visible",
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  marginBottom: theme.spacing(3),
  marginTop: theme.spacing(5),
  [theme.breakpoints.down("sm")]: {
    minHeight: 380,
    padding: theme.spacing(2),
    borderBottomRightRadius: "40px",
  },
}));

const IconContainer = styled(Box)(({ theme }) => ({
  width: theme.spacing(11),
  height: theme.spacing(11),
  borderRadius: "50%",
  backgroundColor: theme.palette.iconColor.main,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: theme.spacing(3),
  alignSelf: "flex-start",
  marginRight: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    width: theme.spacing(9),
    height: theme.spacing(9),
    marginBottom: theme.spacing(2),
  },
}));

const CircleButton = styled(IconButton)(({ theme }) => ({
  width: theme.spacing(7.5),
  height: theme.spacing(7.5),
  borderRadius: "50%",
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  position: "absolute",
  bottom: theme.spacing(3),
  right: theme.spacing(3),
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
  [theme.breakpoints.down("sm")]: {
    width: theme.spacing(6),
    height: theme.spacing(6),
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

const CardWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  minHeight: "300px",
  padding: theme.spacing(0, 2),
  [theme.breakpoints.down("sm")]: {
    minHeight: "250px",
  },
}));

// Skeleton Loader for SupportCard
const SupportCardSkeleton = () => (
  <CardWrapper>
    <StyledCard>
      <CardContent>
        <Skeleton variant="circular" width={88} height={88} sx={{ mb: 3 }} />
        <Skeleton variant="text" width="80%" height={30} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="60%" height={20} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" width="100%" height={150} />
      </CardContent>
    </StyledCard>
  </CardWrapper>
);

// Interface for component props
interface SupportCardProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

const SupportCard: React.FC<{ elementData: any; containerTitle?: string; themes: any }> = ({
  elementData,
  containerTitle,
  themes,
}) => {
  const titles = elementData?.title?.map((t: { name: string }) => t.name) || [];
  const theme = createDynamicTheme({ themes });
  const muiTheme = useTheme();

  return (
    <Suspense fallback={<SupportCardSkeleton />}>
      <ThemeProvider theme={theme}>
        <CardWrapper>
          <StyledCard>
            <CardContent
              sx={{
                p: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flex: 1,
              }}
            >
              <IconContainer>
                <Box
                  component="img"
                  src={elementData?.imageUrl}
                  alt="Icon"
                  sx={{
                    height: { xs: 30, sm: 35, md: 40 },
                    mr: 1,
                  }}
                />
              </IconContainer>

              {elementData?.description?.map((desc: { paragraph: string }, index: number) => (
                <Typography
                  key={index}
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mb: { xs: 1.5, sm: 2 },
                    mt: { xs: 1.5, sm: 2 },
                    fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
                    lineHeight: 1.6,
                    textAlign: "center",
                    maxWidth: { xs: "95%", sm: "90%" },
                    px: { xs: 1, sm: 0 },
                  }}
                >
                  {desc.paragraph}
                </Typography>
              ))}

              <Box sx={{ flexGrow: 1 }} /> {/* Spacer that grows to push content apart */}

              {titles.map((title: string, index: string) => (
                <Typography
                  key={index}
                  variant="subtitle1"
                  component="div"
                  color="text.primary"
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: "1.5rem", sm: "1.7rem", md: "1.9rem" },
                    position: "absolute",
                    bottom: { xs: 18, sm: 20, md: 24 },
                    left: { xs: 18, sm: 20, md: 24 },
                    lineHeight: 1.2,
                    maxWidth: { xs: "60%", sm: "auto" },
                  }}
                >
                  {title}
                </Typography>
              ))}

              {elementData?.cardOptions?.actionButtonPosition !== "hidden" && (
                <CircleButton aria-label="navigate">
                  <ArrowOutwardOutlinedIcon sx={{ fontSize: { xs: "1.25rem", md: "1.5rem" } }} />
                </CircleButton>
              )}
            </CardContent>
          </StyledCard>
        </CardWrapper>
      </ThemeProvider>
    </Suspense>
  );
};

export default SupportCard;