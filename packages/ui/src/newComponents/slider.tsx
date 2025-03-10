import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Paper,
  Stack,
  styled
} from '@mui/material';
import {Grid2 as Grid} from '@mui/material';

// Define tab types
type TabType = 'vision' | 'mission' | 'approach';

interface TabOption {
  id: TabType;
  label: string;
}

// Styled components
const TabButton = styled(Button, {
    shouldForwardProp: (prop) => prop !== "active",
  })<{ active?: boolean }>(({ active }) => ({
    borderRadius: 50,
    padding: "12px 24px",
    fontWeight: 600,
    textTransform: "none",
    backgroundColor: active ? "#FF5733" : "#FFF8F3",
    color: active ? "white" : "black",
    margin: "0 4px",
    boxShadow: "none",
    "&:hover": {
      backgroundColor: active ? "#FF5733" : "#FFE6E0",
    },
  }));
  
  const TabContainer = styled(Paper)({
    borderRadius: 50,
    padding: "4px",
    display: "inline-flex",
    backgroundColor: "#FFFFFF",
    boxShadow: "none",
    alignItems: "center",
  });

const MainContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#FFF8F3', // Light orange background
  minHeight: '100vh',
  padding: theme.spacing(4, 2),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(8, 4),
  },
}));

const SectionIcon = styled(Typography)(({ theme }) => ({
  color: theme.palette.warning.main,
  fontWeight: 600,
  marginBottom: theme.spacing(2),
}));

const RoundedImage = styled(Box)(({ theme }) => ({
  borderRadius: theme.spacing(4),
  overflow: 'hidden',
  height: '100%',
  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  }
}));

// Main component
const ChurchVisionSection: React.FC<{ elementData: any; pageArray: any; }> = ({ elementData, pageArray }) => {
  const [activeTab, setActiveTab] = useState<TabType>('vision');

  const handleTabChange = (tab: TabType): void => {
    setActiveTab(tab);
  };

  const tabs: TabOption[] = [
    { id: 'vision', label: 'Our Vision' },
    { id: 'mission', label: 'Our Mission' },
    { id: 'approach', label: 'Our Approach' }
  ];

  const renderContent = (): React.ReactNode => {
    switch(activeTab) {
      case 'vision':
        return (
          <Grid container spacing={4} sx={{ mt: 4 }}>
            <Grid size={{xs: 12, lg:6}}>
              <SectionIcon variant="subtitle1">❋ OUR VISION</SectionIcon>
              <Typography variant="h3" component="h1" fontWeight={700} mb={3}>
                OUR VISION TO SERVE,<br />
                <Box component="span" color="warning.main">LOVE, AND GROW.</Box>
              </Typography>
              <Typography variant="h6" fontWeight={600} mb={4} maxWidth="xl">
                Our Vision Is To Share God's Love, Foster Spiritual Growth, And Serve Our Community With Compassion And Purpose.
              </Typography>
              <Typography color="text.secondary" mb={4}>
                Our vision is to serve our community with compassion, love unconditionally, and foster spiritual growth. 
                Through dedicated service, heartfelt worship, and supportive fellowship, we strive to create a nurturing 
                environment where individuals can deepen their faith, connect with others, and make a positive impact. 
                Join us as we live out our commitment to serve, love, and grow together.
              </Typography>
            </Grid>
            <Grid size={{xs: 12, lg:6}}>
              <RoundedImage>
                <img 
                  src="/api/placeholder/800/600" 
                  alt="Church interior with wooden pews and arched ceiling" 
                />
              </RoundedImage>
            </Grid>
          </Grid>
        );
      case 'mission':
        return (
          <Grid container spacing={4} sx={{ mt: 4 }}>
            <Grid size={{xs: 12, lg:6}}>
              <SectionIcon variant="subtitle1">❋ OUR MISSION</SectionIcon>
              <Typography variant="h3" component="h1" fontWeight={700} mb={3}>
                OUR MISSION TO REACH,<br />
                <Box component="span" color="warning.main">TEACH, AND CARE.</Box>
              </Typography>
              <Typography variant="h6" fontWeight={600} mb={4} maxWidth="xl">
                Our Mission Is To Reach Out To All, Teach God's Word, And Care For Those In Need With Open Hearts.
              </Typography>
              <Typography color="text.secondary" mb={4}>
                We are committed to reaching out to our community and beyond, teaching the timeless truths of 
                Scripture, and caring for the spiritual, emotional, and physical needs of all people. Through 
                worship, discipleship, fellowship, and service, we seek to follow Christ's example and share 
                His message of hope and redemption.
              </Typography>
            </Grid>
            <Grid size={{xs: 12, lg:6}}>
              <RoundedImage>
                <img 
                  src="/api/placeholder/800/600" 
                  alt="Church community outreach" 
                />
              </RoundedImage>
            </Grid>
          </Grid>
        );
      case 'approach':
        return (
          <Grid container spacing={4} sx={{ mt: 4 }}>
            <Grid size={{xs: 12, lg:6}}>
              <SectionIcon variant="subtitle1">❋ OUR APPROACH</SectionIcon>
              <Typography variant="h3" component="h1" fontWeight={700} mb={3}>
                OUR APPROACH TO WELCOME,<br />
                <Box component="span" color="warning.main">INSPIRE, AND EMPOWER.</Box>
              </Typography>
              <Typography variant="h6" fontWeight={600} mb={4} maxWidth="xl">
                Our Approach Is To Welcome All People, Inspire Faith Through Authentic Worship, And Empower Disciples For Service.
              </Typography>
              <Typography color="text.secondary" mb={4}>
                We are guided by principles of inclusivity, authenticity, and faithful service. We welcome 
                people from all walks of life, inspire spiritual growth through engaging worship and teaching, 
                and empower individuals to discover and use their gifts in service to God and others. Through 
                prayer, study, and community, we seek to live out our faith in meaningful ways.
              </Typography>
            </Grid>
            <Grid size={{xs: 12, lg:6}}>
              <RoundedImage>
                <img 
                  src="/api/placeholder/800/600" 
                  alt="Church worship service" 
                />
              </RoundedImage>
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <MainContainer>
      <Container maxWidth="lg">
        <Stack alignItems="center" mb={4}>
          <TabContainer>
            {tabs.map((tab) => (
              <TabButton
                key={tab.id}
                active={activeTab === tab.id}
                onClick={() => handleTabChange(tab.id)}
              >
                {tab.label}
              </TabButton>
            ))}
          </TabContainer>
        </Stack>
        
        {renderContent()}
      </Container>
    </MainContainer>
  );
};

export default ChurchVisionSection;