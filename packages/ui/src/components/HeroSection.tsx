"use client";

import { Typography, Button, Container, Box, ThemeProvider, useMediaQuery, useTheme as useMuiTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { KeyboardArrowRight } from "@mui/icons-material";
import { createDynamicTheme } from "../theme/theme";

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
  [theme.breakpoints.down('sm')]: {
    backgroundAttachment: "scroll", // Better mobile performance
  }
}));

export default function Hero({
  elementData,
  withOpacity,
  themes
}: {
  elementData: any;
  withOpacity: (color: string, opacity: number) => string;
  themes: any;
}) {
  const theme = createDynamicTheme({ themes });
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(muiTheme.breakpoints.between('sm', 'md'));

  return (
    <ThemeProvider theme={theme}>
      <HeroSection overlayColor={withOpacity(theme.palette.secondary.main, 0)} url={elementData?.imageUrl}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Box position="relative" zIndex={1}>
            {/* <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: "bold", color: theme.palette.primary.main, fontSize: '1.5rem' }}>
            ✦ {elementData?.description?.[0]?.paragraph}
            </Typography> */}

            <Typography
              variant="h1"
              component="h1"
              sx={{ 
                mb: { xs: 2, sm: 2.5, md: 3 }, 
                fontWeight: "bold", 
                textTransform: "uppercase", 
                color: "white", 
                fontSize: { xs: '2.5rem', sm: '3.5rem', md: '3.5rem', xl: '5.5rem' },
                lineHeight: { xs: 1.2, sm: 1.3, md: 1.2 },
                padding: { xs: '0 10px', sm: 0 }
              }}
            >
              {elementData?.description?.[0]?.paragraph}
            </Typography>

            <Typography 
              variant="body1" 
              sx={{ 
                mb: { xs: 3, sm: 3.5, md: 4 }, 
                maxWidth: "600px", 
                mx: "auto", 
                color: theme.palette.primary.contrastText, 
                fontSize: { xs: '0.875rem', sm: '0.925rem', md: '1rem' }, 
                fontWeight: "bold",
                padding: { xs: '0 15px', sm: '0 20px', md: 0 },
                lineHeight: { xs: 1.5, md: 1.6 }
              }}
            >
              {elementData?.description?.[1]?.paragraph}
            </Typography>

            {/* <Box sx={{ 
              display: "flex", 
              gap: { xs: 1, sm: 1.5, md: 2 }, 
              mt: { xs: 1, sm: 1.5, md: 2 }, 
              justifyContent: "center", 
              alignItems: "center",
              flexDirection: { xs: 'column', sm: 'row' } 
            }}>
              <ActionButton btnColor={theme.palette.primary.main} sx={{
                padding: { xs: '10px 20px', sm: '10px 24px', md: '12px 32px' },
                fontSize: { xs: '0.875rem', sm: '0.925rem', md: '1rem' },
                width: { xs: '100%', sm: 'auto' }
              }}>
                Join In Person
                <KeyboardArrowRight />
              </ActionButton>

              <ActionButton 
                btnColor="transparent" 
                borderColor={theme.palette.primary.main}
                sx={{
                  padding: { xs: '10px 20px', sm: '10px 24px', md: '12px 32px' },
                  fontSize: { xs: '0.875rem', sm: '0.925rem', md: '1rem' },
                  width: { xs: '100%', sm: 'auto' },
                  mt: { xs: 1, sm: 0 }
                }}
              >
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