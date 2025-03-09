import React from 'react';
import { Box, Typography, Card, CardContent, IconButton, styled, ThemeProvider, useTheme } from '@mui/material';
import { ArrowOutwardOutlined as ArrowOutwardOutlinedIcon } from '@mui/icons-material';
import { theme } from '../theme.js';

// Custom styled components using theme
const StyledCard = styled(Card)(({ theme }) => ({
  borderBottomRightRadius: "60px",
  boxShadow: theme.shadows[3],
  maxWidth: 350,
  minHeight: 440,
  padding: theme.spacing(3),
  position: 'relative',
  overflow: 'visible',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  marginBottom: theme.spacing(30),
}));

const IconContainer = styled(Box)(({ theme }) => ({
  width: theme.spacing(11),
  height: theme.spacing(11),
  borderRadius: '50%',
  backgroundColor: theme.palette.iconColor.main,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  alignSelf: 'flex-start',
  marginRight: theme.spacing(2),
}));

const CircleButton = styled(IconButton)(({ theme }) => ({
  width: theme.spacing(7.5),
  height: theme.spacing(7.5),
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  position: 'absolute',
  bottom: theme.spacing(3),
  right: theme.spacing(3),
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const CardWrapper = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  minHeight: '300px',
});

// Interface for component props
interface SupportCardProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

const SupportCard: React.FC<{ elementData: any; containerTitle: string; }> = ({ elementData, containerTitle }) => {

const titles = elementData?.title?.map((t: { name: string }) => t.name) || [];

  return (
    <ThemeProvider theme={theme}>
      <CardWrapper>
        <StyledCard>
          <CardContent sx={{ p: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            <IconContainer>
            <Box component="img" src={elementData?.imageUrl} alt="Church Icon" sx={{ height: 40, mr: 1 }} />
            </IconContainer>

            
            {elementData?.description?.map((desc: { paragraph: string }, index: number) => (
          <Typography 
          key={index}
            variant="body2" 
            color="text.secondary"
            sx={{ 
              mb: 2, 
              mt: 2,
              fontSize: '1.25rem', 
              lineHeight: 1.6,
              textAlign: 'center',
              maxWidth: '90%' 
            }}
          >
            {desc.paragraph}
          </Typography>
              ))}
          
          <Box sx={{ flexGrow: 1 }} /> {/* Spacer that grows to push content apart */}
          
          {titles.map((title: string, index: string) => (
          <Typography 
          key={index}
            variant="subtitle1" 
            component="div"
            sx={{ 
              fontWeight: 600, 
              fontSize: '1.9rem',
              position: 'absolute',
              bottom: 24,
              left: 24
            }}
          >
            {title}
          </Typography>
              ))}

            <CircleButton aria-label="navigate">
              <ArrowOutwardOutlinedIcon />
            </CircleButton>
          </CardContent>
        </StyledCard>
      </CardWrapper>
    </ThemeProvider>
  );
};

export default SupportCard;
