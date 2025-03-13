"use client"; // This ensures the component runs only on the client side

import React from 'react';
import { Card, CardMedia, Typography, Box, IconButton, styled, ThemeProvider } from '@mui/material';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { theme } from '../theme';


// Custom styled components
const StyledCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  borderBottomRightRadius: '200px',
  overflow: 'hidden',
  boxShadow: theme.shadows[3],
  width: '50%', // Full width
  height: '90vh', // Full height of viewport
  display: 'flex',
  flexDirection: 'column',
  marginBottom: 20,
}));

const CardMediaFull = styled(CardMedia)(({ theme }) => ({
  flexGrow: 1, // Take up all available space
  width: '100%',
  height: '100%', // Fill the card
  objectFit: 'cover',
}));

const ContentOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: '3%',
  width: '90%',
  height: '20%',
  justifyContent: 'center',
  left: '50%', // Centering horizontally
  transform: 'translateX(-50%)', // Adjusting position
  background: theme.palette.background.paper, // Theme-based background
  borderBottomRightRadius: '200px',
  padding: theme.spacing(2, 3),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  opacity: 0.9,
}));

const CircleButton = styled(IconButton)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main, // Primary color from theme
    color: theme.palette.common.white,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark, // Darker shade on hover
    },
    boxShadow: theme.shadows[2],
    width: "100px",   // Increased width
    height: "100px",  // Increased height (same as width to keep it circular)
    borderRadius: "50%", // Ensures it's a perfect circle
    justifyContent: "center",
    right: "5%",
    top: '10%'
  }));
  

interface YouthWorshipCardProps {
  elementData: any;
  containerTitle?: string;
}

const YouthWorshipCard: React.FC<YouthWorshipCardProps> = ({
  elementData,
  containerTitle
}) => {
  
  const { cardOptions, description, imageUrl } = elementData;
  const isVisible = (position: string) => position !== "none" && position !== "hidden";
  const titles = elementData?.title?.map((t: { name: string }) => t.name) || [];

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <StyledCard>
          <CardMediaFull
            sx={{ height: 1 }}
            image={imageUrl}
            title="Church interior with stained glass and altar"
          />
          <ContentOverlay>
            <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography
              variant="h2"
              component="h2"
              fontWeight="bold"
              sx={{
                fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3rem", lg: "3.5rem" }, // Responsive font sizes
                textAlign: "center", // Center align for better responsiveness
                wordBreak: "break-word", // Prevents overflow on small screens
              }}
            >
            {titles[0]}
            </Typography>

              {cardOptions.actionButtonPosition === "inline" &&
                <CircleButton aria-label="learn more">
                <ArrowForwardIcon />
              </CircleButton>}
            </Box>
            {titles.slice(1).map((title: string, index: string) => (
            <Typography variant="body1" color="text.secondary" key={index}
              sx={{
                fontSize: { xs: "0.25rem", sm: "0.5rem", md: "1rem", lg: "1.5rem" }, // Responsive font sizes
                wordBreak: "break-word", // Prevents overflow on small screens
              }}>
              {title}
            </Typography>
              ))}
          </ContentOverlay>
        </StyledCard>
      </Box>
    </ThemeProvider>
  );
};

export default YouthWorshipCard;
