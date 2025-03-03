import React from "react";
import { 
  Box, 
  Typography, 
  Grid, 
  Button, 
  IconButton 
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ArrowForward, Diamond, Favorite, Logout, People, School, ShoppingCart, VolunteerActivism } from '@mui/icons-material';

const IconCircle = styled(Box)(({ theme }) => ({
  width: 50,  // Increased from 40
  height: 50,  // Increased from 40
  borderRadius: '50%',
  backgroundColor: '#FFF4E6',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: theme.spacing(2),
  '& svg': {
    color: '#F97316',
    fontSize: '1.5rem'  // Increased icon size
  }
}));

export default function About({
  elementData,
  theme,
  withOpacity,
}: {
  elementData: any;
  theme: {
    primary: string;
    secondary: string;
    accent: string;
    foreground: string;
    background: string;
  };
  withOpacity: (color: string, opacity: number) => string;
}) {

  console.log("About",elementData);
  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh', 
      bgcolor: 'white', 
      position: 'relative',
      justifyContent: 'flex-start',  // Left align the content
      alignItems: 'center',  // Center vertically
    }}>
      {/* Main content - now wider */}
      <Box sx={{ 
        width: '60%',  // Increased from 50%
        px: 6,  // Increased padding
        py: 10,  // Increased padding
        ml: 4,   // Added margin-left for better left-center positioning
      }}>
        {/* About Us label */}
        
        {/* Main heading - larger */}
        {elementData.title?.map((desc: { name: string }, index: number) => (
        <Typography key={index}  variant="h2" component="h1" sx={{ fontWeight: 'bold', mb: 0.5 }}>  {/* h3 to h2 */}
            {desc.name}
        </Typography>
        ))}
        
        {/* Description paragraphs - slightly larger */}
        {elementData.description?.map((desc: { paragraph: string }, index: number) => (
          <Typography 
            key={index} 
            variant="body1" 
            sx={{ mb: 3, color: '#4B5563', fontSize: '1.1rem' }}
          >
            {desc.paragraph}
          </Typography>
        ))}
        
        {/* Core values - larger */}
        <Grid container spacing={4} sx={{ mb: 5 }}>  {/* Increased spacing and margin */}
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconCircle>
                <Favorite />
              </IconCircle>
              <Typography variant="subtitle1" sx={{ fontWeight: 500, fontSize: '1.1rem' }}>  {/* Increased font size */}
                Share God's Love
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconCircle>
                <School />
              </IconCircle>
              <Typography variant="subtitle1" sx={{ fontWeight: 500, fontSize: '1.1rem' }}>  {/* Increased font size */}
                Foster Spiritual Growth
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconCircle>
                <People />
              </IconCircle>
              <Typography variant="subtitle1" sx={{ fontWeight: 500, fontSize: '1.1rem' }}>  {/* Increased font size */}
                Serve Our Community
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconCircle>
                <VolunteerActivism />
              </IconCircle>
              <Typography variant="subtitle1" sx={{ fontWeight: 500, fontSize: '1.1rem' }}>  {/* Increased font size */}
                Build Strong Relationships
              </Typography>
            </Box>
          </Grid>
        </Grid>
        
        {/* Read More button - larger */}
        <Button 
          variant="contained" 
          endIcon={<ArrowForward />}
          sx={{ 
            backgroundColor: '#F97316', 
            borderRadius: 28,
            px: 4,  // Increased padding
            py: 1.75,  // Increased padding
            textTransform: 'none',
            fontSize: '1.1rem',  // Increased font size
            '&:hover': {
              backgroundColor: '#EA580C'
            }
          }}
        >
          Read More About Us
        </Button>
      </Box>
      
      {/* Right side icons */}
      <Box sx={{ position: 'absolute', top: 64, right: 32, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <IconButton size="small" sx={{ bgcolor: '#1F2937', color: 'white', p: 1, borderRadius: 1 }}>
          <Logout fontSize="small" />
        </IconButton>
        <IconButton size="small" sx={{ bgcolor: '#1F2937', color: 'white', p: 1, borderRadius: 1 }}>
          <ShoppingCart fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};
