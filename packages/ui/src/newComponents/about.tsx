"use client";

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  ThemeProvider
} from '@mui/material';
import {Grid2 as Grid} from '@mui/material';
import {ArrowForward as ArrowForwardIcon} from '@mui/icons-material';
import { createDynamicTheme } from '../theme/theme';

const ChurchAboutUs: React.FC<{ elementData: any; containerTitle: string; themes: any; }> = ({ elementData, containerTitle, themes }) => {
  // Use state to control client-side rendering
  const [isClient, setIsClient] = useState(false);
  
  // Safely access data with fallbacks to prevent undefined errors
  const cardOptions = elementData?.cardOptions || {};
  const description = elementData?.description || [];
  const imageUrl = elementData?.imageUrl || '';
  const titles = elementData?.title?.map((t: { name: string }) => t.name) || [];
  
  // Helper function for visibility checks
  const isVisible = (position: string) => position !== "none" && position !== "hidden";
  
  // Set client-side state after hydration completes
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Create theme
  const theme = createDynamicTheme({ themes });
  
  // Process description text (limit to 50 words total)
  const processedDescriptions = React.useMemo(() => {
    if (!description || !Array.isArray(description)) return [];
    
    const result = [];
    let totalWords = 0;
    const MAX_WORDS = 50;
    
    for (const desc of description) {
      if (!desc.paragraph) continue;
      
      const words = desc.paragraph.split(/\s+/);
      const wordsToTake = Math.min(words.length, MAX_WORDS - totalWords);
      
      if (wordsToTake <= 0) break;
      
      const truncatedParagraph = words.slice(0, wordsToTake).join(" ") + 
                               (wordsToTake < words.length ? "..." : "");
      
      result.push(truncatedParagraph);
      totalWords += wordsToTake;
      
      if (totalWords >= MAX_WORDS) break;
    }
    
    return result;
  }, [description]);
  
  // Server-side safe rendering approach
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: '100%', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: "center", mt: 8, mb: 8 }}>
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
                alt="Church interior"
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
          
          {/* Content Section */}
          <Grid size={{ xs: 12, sm: 12, md: 6 }}>
            <Box sx={{ 
              p: 2,
              height: '100%',
              width: '80%',
              minHeight: "100vh",
              alignContent: "center" 
            }}>
              {/* Title Section */}
              {containerTitle && (
                <div>
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
                </div>
              )}
              
              {/* Main Title */}
              {titles.length > 0 && (
                <div>
                  <Typography variant="h2" component="h1" color='text.secondary' sx={{ mb: 2 }}>
                    {titles[0]}
                  </Typography>
                </div>
              )}

              {/* Subtitle(s) */}
              {titles.slice(1).map((title: string, index: number) => (
                <div key={`title-${index}`}>
                  <Typography variant="h3" component="h2" sx={{ mb: 2 }}>
                    {title}
                  </Typography>
                </div>
              ))}
              
              {/* Description Paragraphs - Only render if visible */}
              {isVisible(cardOptions.descriptionPosition) && processedDescriptions.map((paragraph, index) => (
                <div key={`paragraph-${index}`}>
                  <Typography component="div" variant="h4" sx={{ mb: 3, color: 'text.secondary' }}>
                    <p>{paragraph}</p>
                  </Typography>
                </div>
              ))}
              
              {/* Action Button - Only render on client side */}
              {isClient && cardOptions.actionButtonPosition === "bottom" && (
                <div>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    size="large"
                    endIcon={<ArrowForwardIcon />}
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
                    {cardOptions.actionButtonText || "Learn More"}
                  </Button>
                </div>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default ChurchAboutUs;