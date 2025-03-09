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


const ChurchAboutUs: React.FC<{ elementData: any; containerTitle: string; }> = ({ elementData, containerTitle }) => {
    const { cardOptions, description, imageUrl } = elementData;
    const isVisible = (position: string) => position !== "none" && position !== "hidden";
    const titles = elementData?.title?.map((t: { name: string }) => t.name) || [];
  
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ width: '100%', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: "center", mt: 8, mb: 8 }}>
          <Grid container spacing={10}>
            {/* Content Section - Now First */}
            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
              <Box sx={{ p: 2, height: '100%', width: '80%', minHeight: "100vh", alignContent: "center", ml: 30 }}>
                {containerTitle && (
                  <Typography 
                    variant="subtitle1" 
                    component="div" 
                    sx={{ display: 'flex', alignItems: 'center', color: 'primary.main', fontSize: '1.5rem', mb: 2 }}
                  >
                    <Box component="span" sx={{ mr: 1, fontSize: '1.5rem', fontWeight: 'bold' }}>✦</Box>
                    {containerTitle}
                  </Typography>
                )}
  
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
                    if (wordCount + words.length > 50) {
                      truncated = true;
                      const remainingWords = 50 - wordCount;
                      desc.paragraph = words.slice(0, remainingWords).join(" ") + "...";
                    }
  
                    wordCount += words.length;
                    if (truncated && wordCount >= 50) return null;
  
                    return (
                      <Typography key={index} component="p" variant="h4" sx={{ mb: 3, color: 'text.secondary' }}>
                        {desc.paragraph}
                      </Typography>
                    );
                  });
                })()}
  
                {cardOptions.actionButtonPosition === "bottom" && (
                  <Button 
                    variant="contained" 
                    color="primary" 
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    href={cardOptions.actionButtonUrl}
                    sx={{ borderRadius: 50, px: 4, py: 1.5, height: 70, textTransform: 'none', fontWeight: 'bold', fontSize: "1rem", mt: 5 }}
                  >
                    {cardOptions.actionButtonText}
                  </Button>
                )}
              </Box>
            </Grid>
  
            {/* Image Section - Now on Right */}
            <Grid size={{ xs: 12, sm: 12, md: 6 }}>
              <Box sx={{ position: 'relative', height: '100%', minHeight: "100vh", borderRadius: '0 0 50px 0', overflow: 'hidden', mr:20 }}>
                <Box
                  component="img"
                  src={imageUrl}
                  alt="Church interior main hall"
                  sx={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '95%',
                    height: '75%',
                    objectFit: 'cover',
                    borderRadius: '0 0 200px 0',
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </ThemeProvider>
    );
  };
  
  export default ChurchAboutUs;
  