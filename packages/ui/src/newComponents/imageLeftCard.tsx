import React from "react";
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
} from "@mui/material";
import { ArrowForward as ArrowForwardIcon } from "@mui/icons-material";
import { theme } from '../theme';

interface ChildrensWorshipProps {
  elementData: any;
  containerTitle: string;
  onClick?: () => void;
}

const ChildrensWorship: React.FC<ChildrensWorshipProps> = ({
  elementData,
  containerTitle,
  onClick = () => console.log("Children's worship clicked"),
}) => {
//   const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { cardOptions, description, imageUrl } = elementData;
  const isVisible = (position: string) => position !== "none" && position !== "hidden";
  const titles = elementData?.title?.map((t: { name: string }) => t.name) || [];


  return (
    <ThemeProvider theme={theme}>
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
            backgroundColor: theme.palette.background.default, // Theme-based background
          }}
        >
          <Typography 
              variant="h1" 
              component="h1" 
              fontWeight="bold" 
              mb={1} 
              color="text.primary"
              sx={{ fontSize: { xs: "2rem", sm: "3rem", md: "4rem" } }} // Responsive font sizes
            >
              {titles[0]}
            </Typography>

            {titles.slice(1).map((title: string, index: string) => (
            <Typography 
            key={index}
              variant="body1" 
              component="p" // Corrected: "p" is a valid HTML tag
              color="text.secondary" 
              mb={3}
              sx={{ fontSize: { xs: "0.875rem", sm: "1rem", md: "2.125rem" } }} // Responsive font sizes
            >
              {title}
            </Typography>
              ))}


          <Box>
            
          {/* <Button 
              variant="contained" 
              color="primary" 
              size="large"
              endIcon={<ArrowForwardIcon />}
              href={cardOptions.actionButtonUrl}
              sx={{ 
                borderRadius: 50, 
                px: 4, 
                py: 1.5,
                height: 70,
                textTransform: 'none',
                fontWeight: 'bold',
                fontSize: "1rem",
                mt: 10
              }}
            >
          {cardOptions.actionButtonText}
          
        </Button> */}
            {cardOptions.actionButtonPosition === "bottom" &&
            <Button
              variant="contained"
              sx={{
                borderRadius: "50%",
                minWidth: "48px",
                height: "48px",
                padding: 0,
                backgroundColor: theme.palette.primary.main, // Primary color from theme
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark, // Darker on hover
                },
              }}
              onClick={onClick}
            >
              <ArrowForwardIcon />
            </Button>}
          </Box>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
};

export default ChildrensWorship;
