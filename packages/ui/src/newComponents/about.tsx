import React from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Card, 
  CardContent, 
  Button, 
  useTheme, 
  ThemeProvider, 
  createTheme 
} from '@mui/material';
import {Grid2 as Grid} from '@mui/material';
import {Favorite as FavoriteIcon} from '@mui/icons-material';
import {School as SchoolIcon} from '@mui/icons-material';
import {People as PeopleIcon} from '@mui/icons-material';
import {Handshake as HandshakeIcon} from '@mui/icons-material';
import {ArrowForward as ArrowForwardIcon} from '@mui/icons-material';
import { theme } from '../theme';


// Custom theme
// const theme = createTheme({
//   palette: {
//     primary: {
//       main: '#ff5733',
//     },
//     secondary: {
//       main: '#212121',
//     },
//   },
//   typography: {
//     h2: {
//       fontWeight: 700,
//       color: '#212121',
//     },
//     h3: {
//       fontWeight: 700,
//       fontSize: '2.5rem',
//       color: '#ff5733',
//     },
//   },
// });

const ChurchAboutUs: React.FC<{ elementData: any; containerTitle: string; }> = ({ elementData, containerTitle }) => {
  
  const { cardOptions, description, imageUrl } = elementData;
  const isVisible = (position: string) => position !== "none" && position !== "hidden";
  const titles = elementData?.title?.map((t: { name: string }) => t.name) || [];

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: '100%',  display: 'flex', flexDirection: { xs: 'column', md: 'row' },justifyContent: "center", mt: 8, mb: 8 }}>
        <Grid container spacing={10}>
          {/* Images Section */}
          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <Box
              sx={{
                position: 'relative',
                height: '100%',
                minHeight: "100vh",
                borderRadius: '0 0 50px 0',
                overflow: 'hidden',
              }}
            >
              {/* Main image */}
              <Box
  component="img"
  src={imageUrl}
  alt="Church interior main hall"
  sx={{
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)', // Centers it both horizontally & vertically
    width: '95%',
    height: '75%',
    objectFit: 'cover',
    borderRadius: '0 0 200px 0',
  }}
/>

              
              {/* Secondary image */}
              {/* <Box
                component="img"
                src="https://demo.awaikenthemes.com/avenix/wp-content/uploads/2024/08/about-us-img-1.jpg"
                alt="Church interior side view"
                sx={{
                  position: 'absolute',
                  left: 0,
                  right: 200,
                  bottom: 0,
                  width: '70%',
                  height: '85%',
                  objectFit: 'cover',
                  borderRadius: '0 0 100px 0',
                  zIndex: -1,
                }}
              /> */}
            </Box>
          </Grid>
          
          {/* Content Section */}
          <Grid  size={{ xs: 12, sm: 12, md: 6 }}>
            <Box sx={{ p: 2,
                height: '100%',
                width: '80%',
                minHeight: "100vh",
                alignContent: "center" }}>

              {containerTitle &&
              <Typography 
                variant="subtitle1" 
                component="div" 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  color: 'primary.main',
                  fontSize: '1.5rem',
                  mb: 2,
                }}
              >
                <Box 
                  component="span" 
                  sx={{ 
                    mr: 1, 
                    fontSize: '1.5rem', 
                    fontWeight: 'bold' 
                  }}
                >
                  ✦
                </Box>
                {containerTitle}
              </Typography>
              }
              
              {titles.length > 0 && (
                <Typography variant="h2" component="h1" sx={{ mb: 2 }}>
                  {titles[0]}
                </Typography>
              )}

              {titles.slice(1).map((title: string, index: string) => (
                <Typography key={index} variant="h3" component="h2" sx={{ mb: 2 }}>
                  {title}
                </Typography>
              ))}
              
        {isVisible(cardOptions.descriptionPosition) && (() => {
          let wordCount = 0;
          let truncated = false;
        
          return description?.map((desc: { paragraph: string }, index: number) => {
            const words = desc.paragraph.split(" ");
            
            // Check if adding this paragraph exceeds the 200-word limit
            if (wordCount + words.length > 50) {
              truncated = true;
              const remainingWords = 50 - wordCount;
              desc.paragraph = words.slice(0, remainingWords).join(" ") + "...";
            }
        
            wordCount += words.length;
        
            // Stop rendering more paragraphs if the limit is reached
            if (truncated && wordCount >= 50) return null;
        
            return (
              <Typography key={index} component="p" variant="h4" sx={{ mb: 3, color: 'text.secondary' }}>
                {desc.paragraph}
              </Typography>
            );
          });
        })()}
              
              {/* Values Cards */}
              {/* <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid  size={{ xs: 6 }}>
                  <Card variant="outlined" sx={{ border: 'none', boxShadow: 'none' }}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
                      <Box 
                        sx={{ 
                          mr: 2, 
                          p: 1, 
                          borderRadius: '50%', 
                          bgcolor: 'rgba(255, 87, 51, 0.1)' 
                        }}
                      >
                        <FavoriteIcon color="primary" />
                      </Box>
                      <Typography variant="body1" fontWeight="medium">
                        Share God's Love
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid   size={{ xs: 6 }}>
                  <Card variant="outlined" sx={{ border: 'none', boxShadow: 'none' }}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
                      <Box 
                        sx={{ 
                          mr: 2, 
                          p: 1, 
                          borderRadius: '50%', 
                          bgcolor: 'rgba(255, 87, 51, 0.1)' 
                        }}
                      >
                        <SchoolIcon color="primary" />
                      </Box>
                      <Typography variant="body1" fontWeight="medium">
                        Foster Spiritual Growth
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid  size={{ xs: 6 }}>
                  <Card variant="outlined" sx={{ border: 'none', boxShadow: 'none' }}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
                      <Box 
                        sx={{ 
                          mr: 2, 
                          p: 1, 
                          borderRadius: '50%', 
                          bgcolor: 'rgba(255, 87, 51, 0.1)' 
                        }}
                      >
                        <PeopleIcon color="primary" />
                      </Box>
                      <Typography variant="body1" fontWeight="medium">
                        Serve Our Community
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid  size={{ xs: 6 }}>
                  <Card variant="outlined" sx={{ border: 'none', boxShadow: 'none' }}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
                      <Box 
                        sx={{ 
                          mr: 2, 
                          p: 1, 
                          borderRadius: '50%', 
                          bgcolor: 'rgba(255, 87, 51, 0.1)' 
                        }}
                      >
                        <HandshakeIcon color="primary" />
                      </Box>
                      <Typography variant="body1" fontWeight="medium">
                        Build Strong Relationships
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid> */}
              
              {/* CTA Button */}
              {cardOptions.actionButtonPosition == "bottom" &&
                <Button 
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
              </Button>}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default ChurchAboutUs;