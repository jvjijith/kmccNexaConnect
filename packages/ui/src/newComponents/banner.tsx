import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  ThemeProvider, 
  CssBaseline,
  AppBar,
  Toolbar,
  IconButton
} from '@mui/material';
import {Grid2 as Grid} from '@mui/material';
import {ShoppingCart as ShoppingCartIcon} from '@mui/icons-material';
import {PictureAsPdf as PictureAsPdfIcon} from '@mui/icons-material';
import {ArrowForward as ArrowForwardIcon} from '@mui/icons-material';
import {Star as StarIcon} from '@mui/icons-material';
import { theme } from '../theme';

const LandingPage: React.FC<{ elementData: any; containerTitle: string; }> = ({ elementData, containerTitle }) => {
    const { cardOptions, description, imageUrl } = elementData;
    const titles = elementData?.title?.map((t: { name: string }) => t.name) || [];
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      <Box sx={{ 
        minHeight: { xs: '65vh', md: '65vh' }, // Reduced to 65vh
        position: 'relative',
        backgroundImage: {
          xs: 'none',
          md: `url(${imageUrl})`
        },
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right center',
        backgroundSize: '50% 100%',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: {
            xs: 'transparent',
            md: 'linear-gradient(to right, #fff 40%, rgba(255,255,255,0.8) 60%, rgba(255,255,255,0) 100%)'
          },
          zIndex: 1
        }
      }}>
        {/* Header with icons */}
        <AppBar position="absolute" color="transparent" elevation={0} sx={{ zIndex: 3 }}>
          <Toolbar sx={{ justifyContent: 'flex-end' }}>
            {/* <IconButton color="inherit" aria-label="pdf">
              <PictureAsPdfIcon />
            </IconButton>
            <IconButton color="inherit" aria-label="cart">
              <ShoppingCartIcon />
            </IconButton> */}
          </Toolbar>
        </AppBar>
        
        {/* Mobile-only background image */}
        <Box sx={{
          display: { xs: 'block', md: 'none' },
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '28vh', // Reduced for 65vh total height
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to bottom, rgba(255,255,255,0) 60%, rgba(255,255,255,1) 100%)'
          }
        }} />
        
        {/* Main content */}
        <Container maxWidth={false} sx={{ position: 'relative', zIndex: 2, height: '100%' }}>
          <Grid container sx={{ minHeight: { xs: '65vh', md: '65vh' } }}> {/* Reduced to 65vh */}
            {/* Left side content */}
            <Grid size={{xs:12, md:6}} sx={{ 
              padding: { xs: 2.5, md: 5 }, // Further reduced padding
              paddingTop: { xs: '30vh', md: 5 }, // Adjusted for smaller total height
              display: 'flex',
              flexDirection: 'column',
              justifyContent: { xs: 'flex-start', md: 'center' }
            }}>
              <Box sx={{ mb: 3, ml: 40 }}> {/* Kept the ml: 40 from your pasted code */}
                {containerTitle &&
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}> {/* Further reduced margin */}
                  <StarIcon color="primary" fontSize="small" />
                  <Typography 
                    variant="subtitle1" 
                    color="primary" 
                    sx={{ 
                      ml: 1,
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                      fontWeight: 600
                    }}
                  >
                    {containerTitle}
                  </Typography>
                </Box>}
                
              {titles.length > 0 && (
                <Typography variant="h1" component="h1" sx={{ 
                  fontWeight: 'bold',
                  fontSize: '3.745rem', // Using your size from pasted code
                  mb: 1, // Further reduced margin
                  lineHeight: 1 // More compact line height
                }}>
                  {titles[0]}
                </Typography>
              )}
                
              {titles.slice(1).map((title: string, index: string) => (
                <Typography
                key={index} variant="h2" component="div" color="primary" sx={{ 
                  fontWeight: 'bold',
                  fontSize: '3.745rem', // Using your size from pasted code
                  mb: 4, // Further reduced margin
                  lineHeight: 1 // More compact line height
                }}>
                  {title}
                </Typography>
              ))}
                
                <Typography variant='body2'
                sx={{ 
                    fontWeight: 'bold',
                  mb: 4, // Further reduced margin
                  fontSize: '1.25rem', // Using your size from pasted code
                }}>
                  Life is a church dedicated to loving God and serving people. We foster a welcoming community
                  where faith and compassion drive everything we do, striving to make a positive impact both
                  spiritually and socially. Join us in this journey.
                </Typography>
                
                {/* <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  size="large"
                  endIcon={<ArrowForwardIcon sx={{ fontSize: 32 }} />} // Bigger arrow icon
                  sx={{ 
                    borderRadius: 40, // More rounded
                    px: 4, // Increased horizontal padding
                    py: 2, // Increased vertical padding
                    minWidth: 200, // Ensures a larger button
                    minHeight: 64, // Increased button height
                    fontSize: '1.25rem', // Bigger text
                    textTransform: 'none',
                    fontWeight: 'bold'
                  }}
                >
                  Donate Now
                </Button> */}

                  
                  {/* Commented out as in your pasted code */}
                  {/* <Box component="img" 
                    src="/curved-arrow.svg" 
                    alt="Arrow" 
                    sx={{ 
                      width: 70,
                      ml: 2,
                      display: { xs: 'none', sm: 'block' }
                    }} 
                  />
                </Box> */}
              </Box>
            </Grid>
            
            {/* Right side - empty to let background image show */}
            <Grid size={{xs:12, md:6}}></Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default LandingPage;