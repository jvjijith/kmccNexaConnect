import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Button, 
  IconButton 
} from '@mui/material';
import { styled } from '@mui/material/styles';


// Custom styled components
const RoundedImage = styled(Box)(({ theme }) => ({
  overflow: 'hidden',
  boxShadow: theme.shadows[5],
  position: 'absolute'
}));

const AboutPage = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'white', position: 'relative' }}>
      {/* Left side with images */}
      <Box sx={{ position: 'relative', width: '50%', height: '100vh' }}>
        {/* Red dot */}
        <Box 
          sx={{ 
            position: 'absolute', 
            top: 64, 
            left: 32, 
            width: 8, 
            height: 8, 
            bgcolor: '#F03E3E', 
            borderRadius: '50%' 
          }} 
        />
        
        {/* Larger church interior image */}
        <RoundedImage
          sx={{
            bottom: 0,
            left: 64,
            width: 380,
            height: 520,
            borderBottomRightRadius: 50
          }}
        >
          <img
            src="https://s3.us-east-005.backblazeb2.com/nexaStore/67c2c59266aea418d92b638f.jpeg"
            alt="Church Interior with Arched Ceiling"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </RoundedImage>
        
        {/* Smaller church interior image */}
        <RoundedImage
          sx={{
            top: 96,
            right: 0,
            width: 320,
            height: 380,
            borderBottomLeftRadius: 50
          }}
        >
          <img
            src="https://s3.us-east-005.backblazeb2.com/nexaStore/67c2c59266aea418d92b638f.jpeg"
            alt="Church Interior with Pews and Altar"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </RoundedImage>
      </Box>
    </Box>
  );
};

export default AboutPage;
