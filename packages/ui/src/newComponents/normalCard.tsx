import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardActions, 
  Typography, 
  Button, 
  Chip, 
  Box, 
  ThemeProvider
} from '@mui/material';
import { CalendarToday, LocationOn } from '@mui/icons-material';
import { createDynamicTheme } from '../theme/theme';
import ChildrensMinistryDetail from './model';

// Define the event interface
interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  category: string;
  image?: string;
}

// Props for the component
interface EventCardProps {
  elementData: any;
  themes: any;
}

// Helper function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};



const EventCard: React.FC<EventCardProps> = ({ elementData, themes }) => {

  const [openModal, setOpenModal] = useState(false);

const handleButtonClick = () => {
  if (elementData?.withDescription) {
    setOpenModal(true);
  } else {
    window.location.href = `/${elementData?.cardOptions?.actionButtonUrl}`;
  }
};


  const titles = elementData?.title?.map((t: { name: string }) => t.name) || [];

  const theme = createDynamicTheme({ themes });

  console.log("elementData from normal card",elementData)

  return (
      <ThemeProvider theme={theme}>
    <Card sx={{ maxWidth: 650,minHeight: 650, overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.12)', mb: "10%", borderRadius: "30px", margin:2 }}>
      {/* Image section with category badge */}
      <Box sx={{ position: 'relative', height: 360 }}>
        <img
          src={elementData?.imageUrl}
          alt={elementData?.referenceName}
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover' 
          }}
        />
        {/* <Chip
          label={event.category}
          color="primary"
          size="medium"
          sx={{ 
            position: 'absolute', 
            top: 20, 
            right: 20, 
            textTransform: 'capitalize',
            fontSize: '1rem',
            padding: '6px 4px',
            height: 'auto'
          }}
        /> */}
      </Box>

      {/* Card header with title */}
      <CardContent sx={{ pt: 4, px: 4, pb: 2, minHeight: 135 }}>
      {titles.map((title: string, index: string) => (
        <Typography key={index} variant="h4" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
          {title}
        </Typography>
      ))}

        {/* Date and location info */}
       {elementData?.info?.length > 0 &&
        <>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <CalendarToday sx={{ fontSize: 24, color: 'primary.main' }} />
          <Typography variant="h6" color="text.secondary">
            {formatDate('2025-04-15')}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <LocationOn sx={{ fontSize: 24, color: 'primary.main' }} />
          <Typography variant="h6" color="text.secondary">
            {'San Francisco, CA'}
          </Typography>
        </Box>
        </>
        }

        {/* Description with line clamp */}
        
        {/* {elementData?.description?.map((desc: { paragraph: string }, index: number) => ( */}
        {elementData?.description?.length > 0 &&
        <Typography 
        // key={index}
          variant="body1" 
          color="text.secondary"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            mb: 3,
            lineHeight: 1.8,
            fontSize: '1.1rem'
          }}
        >
          {elementData?.description[0]?.paragraph}
        </Typography>
      }
              {/* ))} */}
      </CardContent>

      {/* Card footer with button */}

      {elementData?.cardOptions?.actionButtonPosition == "bottom" && 
      <CardActions sx={{ p: 4, pt: 0 }}>
        <Button 
          variant="outlined" 
          fullWidth 
          onClick={handleButtonClick}
          size="large"
          sx={{ 
            py: 2,
            fontSize: '1.2rem',
            textTransform: 'none',
            borderRadius: 2,
            borderWidth: 2
          }}
        >
          {elementData?.cardOptions?.actionButtonText}
        </Button>

      </CardActions>}
    </Card>
    <ChildrensMinistryDetail
        elementData={elementData}
        open={openModal}
        themes={themes}
        onClose={() => setOpenModal(false)}
      />
    </ThemeProvider>
  );
};

export default EventCard;