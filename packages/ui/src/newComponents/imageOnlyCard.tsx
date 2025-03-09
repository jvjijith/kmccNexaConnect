"use client";

import React from 'react';
import { 
  Box, 
  Card, 
  CardMedia, 
  Typography, 
  Button,
  styled,
  useTheme
} from '@mui/material';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { ArrowOutwardOutlined as ArrowOutwardOutlinedIcon } from '@mui/icons-material';

// Props interface for the component
interface ChildrensMinistryCardProps {
  title?: string;
  image: string;
  link: string;
}

// Create a styled Card with bottom rounded corners
const RoundedCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: '0 0 150px 0',
  height: '100%',
  boxShadow: 'none',
}));

// Styled Icon Container for better visibility
const IconContainer = styled(Box)(({ theme }) => ({
  width: theme.spacing(9),
  height: theme.spacing(9),
  borderRadius: '50%',
  backgroundColor: theme.palette.iconColor?.main || '#FF6347', // Fallback color
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
  alignSelf: 'flex-start',
  marginRight: theme.spacing(3),
}));

// Children's Ministry Card Component
const ChildrensMinistryCard: React.FC<{ elementData: any; containerTitle: string; }> = ({ elementData, containerTitle }) => {
  
    const titles = elementData?.title?.map((t: { name: string }) => t.name) || [];
  return (
    <Box sx={{ maxWidth: 530, borderRadius: '0 0 24px 24px', marginBottom: 40 }}>
      <RoundedCard>
        {/* Card image with overlay */}
        <CardMedia
          component="img"
          image={elementData?.imageUrl}
          alt={titles[0]}
          sx={{ 
            height: 650,
            objectFit: 'cover',
            filter: 'brightness(0.85)',
          }}
        />
        
        {/* Overlay content */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 3,
          }}
        >
          {/* Title */}
          <Typography 
            variant="h5" 
            component="h3" 
            sx={{
              color: 'white',
              fontWeight: 'bold',
              textShadow: '1px 1px 3px rgba(0,0,0,0.3)',
            }}
          >
            {titles[0]}
          </Typography>
          
          {/* Button with Icon Container */}
          <Box sx={{ alignSelf: 'flex-end', marginTop: 'auto' }}>
            <IconContainer>
              <Button
                variant="contained"
                // href={titles[0]}
                aria-label={`Learn more about ${titles[0]}`}
                sx={{
                  bgcolor: 'transparent', // No background to fit inside IconContainer
                  color: 'white',
                  borderRadius: '50%',
                  minWidth: 0,
                  width: '100%',
                  height: '100%',
                  boxShadow: 'none',
                  '&:hover': {
                    bgcolor: 'transparent',
                  },
                }}
              >
                <ArrowOutwardOutlinedIcon fontSize="large" />
              </Button>
            </IconContainer>
          </Box>
        </Box>
      </RoundedCard>
    </Box>
  );
};



export default ChildrensMinistryCard;
