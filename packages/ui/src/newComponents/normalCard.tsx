import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip,
  styled
} from '@mui/material';
import { Person, Category, Schedule } from '@mui/icons-material';

// Styled components
const DateBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 16,
  left: 16,
  backgroundColor: '#FF5733', // Orange color from the image
  color: 'white',
  padding: '8px 12px',
  borderRadius: 4,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 'bold',
}));

const SermonCard = () => {
  return (
    <Card sx={{ 
      maxWidth: 400, 
      position: 'relative',
      borderRadius: 4,
      overflow: 'visible',
      boxShadow: 3,
    }}>
      {/* Image section */}
      <Box sx={{ 
        height: 300, 
        overflow: 'hidden',
        position: 'relative',
      }}>
        <img 
          src="/path/to/church-image.jpg" 
          alt="Person in church"
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
          }}
        />
        <DateBadge>
          <Typography variant="h6" fontWeight="bold">03</Typography>
          <Typography variant="caption" fontWeight="bold">Aug</Typography>
        </DateBadge>
      </Box>

      {/* Content section */}
      <CardContent sx={{ 
        bgcolor: '#FFF8F5', // Light peach background
        borderRadius: '0 0 16px 16px',
        padding: 3,
      }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Start A New Way Of Living
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
          <Person sx={{ color: '#FF5733' }} />
          <Typography variant="body2">
            Sermon From : <strong>James Mitchell</strong>
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
          <Category sx={{ color: '#FF5733' }} />
          <Typography variant="body2">
            Categories : <strong>Faith & Trust</strong>
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Schedule sx={{ color: '#FF5733' }} />
          <Typography variant="body2">
            Date & Time : <strong>7:00 Am To 10:00 Am</strong>
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SermonCard;