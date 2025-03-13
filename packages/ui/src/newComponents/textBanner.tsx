import React from 'react';
import { Container, Typography, Box, Theme, ThemeProvider } from '@mui/material';
import { createDynamicTheme } from '../theme/theme';

// Props for the component
interface EventCardProps {
    elementData: any;
    themes: any;
    containerTitle?: string;
  }

const AboutSection: React.FC<EventCardProps> = ({ elementData, themes, containerTitle }) => {

    const titles = elementData?.title?.map((t: { name: string }) => t.name) || [];

  const theme = createDynamicTheme({ themes });
  return (
        <ThemeProvider theme={theme}>
    <Container
      sx={{
        py: 12,
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }}
    >
      <Box
        sx={{
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          marginTop: 10
        }}
      >
      {titles.map((title: string, index: string) => (
        <Typography key={index} variant="h2" component="h1" fontWeight="bold" sx={{ letterSpacing: '-0.025em' }}>
          {title}
        </Typography>
      ))}
        
      {elementData?.description?.map((desc: { paragraph: string }, index: number) => (
        <Typography 
        key={index}
          variant="body1" 
          color="text.secondary"
          sx={{
            maxWidth: '42rem',
            mx: 'auto'
          }}
        >
          {desc.paragraph}
        </Typography>
              ))}
      </Box>
    </Container>
    </ThemeProvider>
  );
};

export default AboutSection;