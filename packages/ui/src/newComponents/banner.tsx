import React from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  ThemeProvider, 
  CssBaseline,
  AppBar,
  Toolbar
} from '@mui/material';
import {Grid2 as Grid} from '@mui/material';
import {Star as StarIcon} from '@mui/icons-material';
import { createDynamicTheme } from '../theme/theme';

const LandingPage: React.FC<{ elementData: any; containerTitle?: string; themes: any; }> = ({ elementData, containerTitle, themes }) => {
    const { description, imageUrl } = elementData;
    const titles = elementData?.title?.map((t: { name: string }) => t.name) || [];
    const theme = createDynamicTheme({themes});
  
    return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      <Box sx={{ 
        minHeight: { xs: '100vh', sm: '70vh', md: '65vh', lg: '25vh' },
        position: 'relative',
        backgroundImage: {
          xs: 'none',
          md: `url(${imageUrl})`
        },
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right center',
        backgroundSize: { md: '60% 100%', lg: '50% 100%' },
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
          </Toolbar>
        </AppBar>
        
        {/* Mobile-only background image */}
        <Box sx={{
          display: { xs: 'block', md: 'none' },
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: { xs: '40vh', sm: '35vh' },
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
          <Grid container sx={{ minHeight: { xs: '65vh', md: '65vh' } }}>
            <Grid size={{xs: 12, sm: 12, md: 8, lg: 6}} sx={{ 
              padding: { xs: 2.5, sm: 3, md: 5 },
              paddingTop: { xs: '45vh', sm: '40vh', md: 5 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: { xs: 'flex-start', md: 'center' }
            }}>
              <Box sx={{ 
                mb: 3, 
                ml: { xs: 0, sm: 2, md: 3, lg: 4 },
                maxWidth: { xs: '100%', sm: '90%', md: '85%' }
              }}>
                {containerTitle &&
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
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
                
              {titles.map((title: string, index: number) => (
                <Typography
                key={index} 
                variant="h2" 
                component="div" 
                color="primary" 
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: { xs: '2.5rem', sm: '3rem', md: '3.745rem' },
                  mb: 4,
                  lineHeight: 1.1
                }}>
                  {title}
                </Typography>
              ))}
                {elementData?.description?.map((desc: { paragraph: string }, index: number) => (
                <Typography 
                key={index}
                  variant='body2'
                  sx={{ 
                    fontWeight: 'bold',
                    mb: 4,
                    fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
                    lineHeight: 1.5
                  }}
                >
          {desc.paragraph}
                </Typography>
              ))}
              </Box>
            </Grid>
            <Grid size={{xs: 12, md: 4, lg: 6}}></Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default LandingPage;