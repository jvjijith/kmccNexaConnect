"use client";

import React from 'react';
import { 
  Box, 
  Typography, 
  LinearProgress, 
  Fade,
  Container,
  Card,
  CardContent,
  Skeleton,
  Chip
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import {
  CloudDownload,
  DataObject,
  Palette,
  ViewModule,
  CheckCircle
} from '@mui/icons-material';

// Floating animation for elements
const floatAnimation = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

// Pulse animation for the main loader
const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

// Shimmer effect for skeletons
const shimmerAnimation = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const LoadingContainer = styled(Box)(() => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'transparent',
  position: 'relative',
  overflow: 'hidden',
}));

const LoadingCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  borderRadius: '20px',
  padding: theme.spacing(4),
  minWidth: '400px',
  maxWidth: '500px',
  width: '90%',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  animation: `${pulseAnimation} 3s ease-in-out infinite`,
  position: 'relative',
  zIndex: 1,
}));

const LogoContainer = styled(Box)({
  animation: `${floatAnimation} 3s ease-in-out infinite`,
  marginBottom: '2rem',
});

const LoadingDots = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '8px',
  marginTop: '1rem',
  '& .dot': {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: '#16a249',
    animation: `${pulseAnimation} 1.5s ease-in-out infinite`,
    '&:nth-of-type(1)': {
      animationDelay: '0s',
    },
    '&:nth-of-type(2)': {
      animationDelay: '0.2s',
    },
    '&:nth-of-type(3)': {
      animationDelay: '0.4s',
    },
  }
});

const ContentSkeleton = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  '& .MuiSkeleton-root': {
    backgroundColor: 'rgba(22, 162, 73, 0.1)',
    background: `linear-gradient(90deg, 
      rgba(22, 162, 73, 0.1) 0%, 
      rgba(22, 162, 73, 0.2) 50%, 
      rgba(22, 162, 73, 0.1) 100%)`,
    backgroundSize: '200px 100%',
    animation: `${shimmerAnimation} 1.5s infinite`,
  }
}));

const LoadingSteps = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  '& .step': {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
    padding: theme.spacing(0.5),
    borderRadius: theme.spacing(1),
    transition: 'all 0.3s ease',
    '&.active': {
      backgroundColor: 'rgba(22, 162, 73, 0.1)',
      transform: 'translateX(5px)',
    },
    '&.completed': {
      opacity: 0.7,
    },
    '& .step-icon': {
      marginRight: theme.spacing(1),
      fontSize: '1.2rem',
    },
    '& .step-text': {
      fontSize: '0.875rem',
      fontWeight: 500,
    }
  }
}));

interface LoadingStep {
  id: string;
  label: string;
  icon: React.ReactNode;
  completed: boolean;
  active: boolean;
}

interface BeautifulLoadingScreenProps {
  loadingText?: string;
  progress?: number;
  showProgress?: boolean;
  steps?: LoadingStep[];
}

const BeautifulLoadingScreen: React.FC<BeautifulLoadingScreenProps> = ({
  loadingText = "Loading your content...",
  progress = 0,
  showProgress = true,
  steps
}) => {
  const defaultSteps: LoadingStep[] = [
    {
      id: 'fetch',
      label: 'Fetching page data',
      icon: <CloudDownload />,
      completed: progress > 20,
      active: progress <= 20 && progress > 0
    },
    {
      id: 'process',
      label: 'Processing components',
      icon: <DataObject />,
      completed: progress > 60,
      active: progress > 20 && progress <= 60
    },
    {
      id: 'theme',
      label: 'Applying theme',
      icon: <Palette />,
      completed: progress > 80,
      active: progress > 60 && progress <= 80
    },
    {
      id: 'render',
      label: 'Rendering content',
      icon: <ViewModule />,
      completed: progress > 95,
      active: progress > 80 && progress <= 95
    }
  ];

  const loadingSteps = steps || defaultSteps;

  return (
    <LoadingContainer>
      <Fade in={true} timeout={1000}>
        <Container maxWidth="sm">
          <LoadingCard>
            <CardContent sx={{ textAlign: 'center', padding: '2rem !important' }}>
              {/* Logo/Brand Section */}
              <LogoContainer>
                <Typography 
                  variant="h4" 
                  component="h1" 
                  sx={{ 
                    fontWeight: 700,
                    color: 'primary.main',
                    marginBottom: 1,
                    background: 'linear-gradient(45deg, #16a249, #4caf50)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  KMCC Australia
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'text.secondary',
                    fontWeight: 500 
                  }}
                >
                  Kerala Muslim Cultural Centre
                </Typography>
              </LogoContainer>

              {/* Loading Message */}
              <Typography 
                variant="h6" 
                sx={{ 
                  color: 'primary.main',
                  fontWeight: 600,
                  marginBottom: 2
                }}
              >
                {loadingText}
              </Typography>

              {/* Progress Bar */}
              {showProgress && (
                <Box sx={{ width: '100%', marginBottom: 2 }}>
                  <LinearProgress 
                    variant={progress > 0 ? "determinate" : "indeterminate"}
                    value={progress}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: 'rgba(22, 162, 73, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        background: 'linear-gradient(45deg, #16a249, #4caf50)',
                      }
                    }}
                  />
                  {progress > 0 && (
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'text.secondary',
                        marginTop: 1,
                        fontSize: '0.875rem'
                      }}
                    >
                      {Math.round(progress)}% Complete
                    </Typography>
                  )}
                </Box>
              )}

              {/* Loading Steps */}
              {showProgress && progress > 0 && (
                <LoadingSteps>
                  {loadingSteps.map((step) => (
                    <Box 
                      key={step.id}
                      className={`step ${step.active ? 'active' : ''} ${step.completed ? 'completed' : ''}`}
                    >
                      <Box className="step-icon" sx={{ color: step.completed ? 'success.main' : step.active ? 'primary.main' : 'text.secondary' }}>
                        {step.completed ? <CheckCircle /> : step.icon}
                      </Box>
                      <Typography className="step-text" sx={{ color: step.active ? 'primary.main' : 'text.secondary' }}>
                        {step.label}
                      </Typography>
                      {step.completed && (
                        <Chip 
                          size="small" 
                          label="✓" 
                          sx={{ 
                            marginLeft: 'auto',
                            backgroundColor: 'success.main',
                            color: 'white',
                            fontSize: '0.75rem',
                            height: '20px'
                          }} 
                        />
                      )}
                    </Box>
                  ))}
                </LoadingSteps>
              )}

              {/* Animated Loading Dots */}
              <LoadingDots>
                <div className="dot" />
                <div className="dot" />
                <div className="dot" />
              </LoadingDots>

              {/* Content Preview Skeletons */}
              <ContentSkeleton>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'text.secondary',
                    marginBottom: 2,
                    fontStyle: 'italic'
                  }}
                >
                  Preparing your experience...
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Skeleton variant="text" width="80%" height={24} />
                  <Skeleton variant="text" width="60%" height={20} />
                  <Skeleton variant="rectangular" width="100%" height={60} sx={{ borderRadius: 1 }} />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Skeleton variant="rectangular" width="48%" height={40} sx={{ borderRadius: 1 }} />
                    <Skeleton variant="rectangular" width="48%" height={40} sx={{ borderRadius: 1 }} />
                  </Box>
                </Box>
              </ContentSkeleton>
            </CardContent>
          </LoadingCard>
        </Container>
      </Fade>
    </LoadingContainer>
  );
};

export default BeautifulLoadingScreen;