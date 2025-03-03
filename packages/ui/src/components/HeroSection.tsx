"use client";

import { Typography, Button, Container, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { KeyboardArrowRight } from "@mui/icons-material";

// Styled Button
const ActionButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "btnColor" && prop !== "borderColor",
})<{ btnColor: string; borderColor?: string }>(({ btnColor, borderColor }) => ({
  borderRadius: "50px",
  padding: "12px 32px",
  fontSize: "1rem",
  fontWeight: 500,
  textTransform: "none",
  backgroundColor: btnColor || "transparent",
  border: borderColor ? `2px solid ${borderColor}` : "none",
  color: borderColor ? borderColor : "#fff",
  "&:hover": {
    backgroundColor: borderColor ? borderColor : btnColor,
    borderColor: borderColor || btnColor,
    color: borderColor ? btnColor : "#fff",
  },
  "& .MuiSvgIcon-root": {
    marginLeft: "8px",
    fontSize: "1.2rem",
  },
}));


// Styled Hero Section
const HeroSection = styled("div")<{  overlayColor: string }>(({  overlayColor }) => ({
  backgroundImage: 'url("https://s3.us-east-005.backblazeb2.com/nexaStore/67c046400f7598cc5ee8ceae.jpg")', // A mosque at night
  backgroundSize: "cover",
  backgroundPosition: "center",
  height: "100vh",
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  color: "white",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: overlayColor || "rgba(0, 0, 0, 0.5)",
  },
}));

export default function Hero({
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
}) {
  return (
    <HeroSection  overlayColor={withOpacity(theme.background, 0.7)}>
      <Container maxWidth="lg">
        <Box position="relative" zIndex={1}>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "bold", color: theme.foreground }}>
            {elementData?.description?.[0]?.paragraph}
          </Typography>

          <Typography
            variant="h2"
            component="h1"
            sx={{ mb: 3, fontWeight: "bold", textTransform: "uppercase", color: theme.primary }}
          >
            {elementData?.description?.[1]?.paragraph}
          </Typography>

          <Typography variant="body1" sx={{ mb: 4, maxWidth: "600px", mx: "auto", color: theme.foreground }}>
            {elementData?.description?.[2]?.paragraph}
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              mt: 2,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActionButton btnColor={theme.primary}>
              Join In Person
              <KeyboardArrowRight />
            </ActionButton>

            <ActionButton btnColor="transparent" borderColor={theme.accent}>
              Donate Now
              <KeyboardArrowRight />
            </ActionButton>
          </Box>
        </Box>
      </Container>
    </HeroSection>
  );
}
