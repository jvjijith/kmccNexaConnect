"use client";

import { Typography, Button, Container, Box, ThemeProvider } from "@mui/material";
import { styled } from "@mui/material/styles";
import { KeyboardArrowRight } from "@mui/icons-material";
import { theme } from "../theme";

// Styled Button
const ActionButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "btnColor" && prop !== "borderColor",
})<{ btnColor: string; borderColor?: string }>(({ theme, btnColor, borderColor }) => ({
  borderRadius: "50px",
  padding: "12px 32px",
  fontSize: "1rem",
  fontWeight: 500,
  textTransform: "none",
  backgroundColor: btnColor || "transparent",
  border: borderColor ? `2px solid ${borderColor}` : "none",
  color: borderColor ? borderColor : theme.palette.primary.contrastText,
  "&:hover": {
    backgroundColor: borderColor ? borderColor : btnColor,
    borderColor: borderColor || btnColor,
    color: borderColor ? btnColor : theme.palette.primary.contrastText,
  },
  "& .MuiSvgIcon-root": {
    marginLeft: "8px",
    fontSize: "1.2rem",
  },
}));

// Styled Hero Section
const HeroSection = styled("div")<{ overlayColor: string; url: string; }>(({ theme, overlayColor, url }) => ({
  backgroundImage: `url(${url})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundAttachment: "fixed",
  height: "100vh",
  width: "100%",
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  color: theme.palette.primary.contrastText,
  zIndex: 0,
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: overlayColor || theme.palette.secondary.main,
  },
}));

export default function Hero({
  elementData,
  withOpacity,
}: {
  elementData: any;
  withOpacity: (color: string, opacity: number) => string;
}) {
  return (
    <ThemeProvider theme={theme}>
      <HeroSection overlayColor={withOpacity(theme.palette.secondary.main, 0.7)} url={elementData?.imageUrl}>
        <Container maxWidth="lg">
          <Box position="relative" zIndex={1}>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "bold", color: theme.palette.primary.main, fontSize: '1.5rem' }}>
            ✦ {elementData?.description?.[0]?.paragraph}
            </Typography>

            <Typography
              variant="h1"
              component="h1"
              sx={{ mb: 3, fontWeight: "bold", textTransform: "uppercase", color: "white", fontSize: '5.5rem' }}
            >
              {elementData?.description?.[1]?.paragraph}
            </Typography>

            <Typography variant="body1" sx={{ mb: 4, maxWidth: "600px", mx: "auto", color: theme.palette.secondary.main, fontSize: '1rem', fontWeight: "bold" }}>
            {elementData?.description?.[2]?.paragraph}
            </Typography>

            {/* <Box sx={{ display: "flex", gap: 2, mt: 2, justifyContent: "center", alignItems: "center" }}>
              <ActionButton btnColor={theme.palette.primary.main}>
                Join In Person
                <KeyboardArrowRight />
              </ActionButton>

              <ActionButton btnColor="transparent" borderColor={theme.palette.primary.main}>
                Donate Now
                <KeyboardArrowRight />
              </ActionButton>
            </Box> */}
          </Box>
        </Container>
      </HeroSection>
    </ThemeProvider>
  );
}
