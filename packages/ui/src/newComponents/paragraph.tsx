import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Avatar,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  AppBar,
  Toolbar,
  IconButton,
  Tab,
  Tabs,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Person as PersonIcon,
  MenuBook as MenuBookIcon,
  FormatQuote as FormatQuoteIcon,
  History as HistoryIcon,
  ArrowForward as ArrowForwardIcon,
  Menu as MenuIcon,
  StarBorder as StarBorderIcon,
  Timeline as TimelineIcon,
  School as SchoolIcon,
  Groups as GroupsIcon,
  Home as HomeIcon,
  Info as InfoIcon,
  Event as EventIcon,
  Article as ArticleIcon
} from '@mui/icons-material';
import {Grid2 as Grid} from '@mui/material';

// Define the historical timeline item type
interface TimelineItem {
  period: string;
  title: string;
  description: string;
}

// Define the legend profile data type
interface LegendProfile {
  id: number;
  name: string;
  image: string;
  lifespan: string;
  shortDescription: string;
  biography: string[];
  keyContributions: string[];
  quotes: {
    text: string;
    source: string;
  }[];
  legacy: string;
  timeline: TimelineItem[];
  commitment: {
    title: string;
    description: string;
  };
  pillars: {
    title: string;
    description: string;
    icon: React.ReactNode;
  }[];
}

const LegendProfilePage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [tabValue, setTabValue] = React.useState(0);
  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  // Sample data based on the image provided
  const legendData: LegendProfile = {
    id: 1,
    name: "C H Muhammad Koya",
    image: "/path/to/muhammad-koya-image.jpg",
    lifespan: "1927 - 1983",
    shortDescription: "The former president of Indian organization, Kerala Muslim Cultural Center (KMCC) who significantly contributed to the legacy of the community in Kerala.",
    biography: [
      "C H Mohammed Koya was born on July 15, 1927, in Atholi, Kozhikode. He was educated at Atholi Government School, Calicut and Madras.",
      "He served as the Chief Minister of Kerala, becoming the first Muslim to hold this prestigious position in 1979, although his term was brief.",
      "Known for his intellectual prowess and political acumen, C H Mohammed Koya was a multi-faceted personality, serving as editor, publisher, and educationist.",
      "He played a pivotal role in the development of Kerala through education reforms, community leadership, and intellectual contributions.",
      "Throughout his career, Koya was known for his vision, empathy, intellectual depth, and unwavering faith, qualities that earned him respect across political and religious lines."
    ],
    keyContributions: [
      "Championed educational reforms that supported equitable access through government initiatives",
      "Established influential community organizations focusing on integration",
      "Pioneered several literacy and education programs for underprivileged communities",
      "Served as Chief Minister of Kerala briefly"
    ],
    quotes: [
      {
        text: "Education is not merely about literacy. It's about empowering individuals to think critically, and contribute meaningfully to society.",
        source: "C H Muhammad Koya, Address to Teachers, 1977"
      },
      {
        text: "The true measure of a community is how it treats its minorities, not how proud it is of its majority culture. Regardless of their faith or background, all citizens deserve dignity and respect.",
        source: "Parliamentary Address, 1970"
      }
    ],
    legacy: "The KMCC was established by KMCC Australia members to honor his vision, combining service to the community with dedication to cultural preservation. His emphasis on education, community service, and social harmony continues to inspire and educate new generations.",
    timeline: [
      {
        period: "1950s - 1960s",
        title: "Freedom Struggle Era",
        description: "Active participation alongside C H Muhammad Koya in India's independence movement, establishing the foundation for what would become KMCC."
      },
      {
        period: "1970s - 1980s",
        title: "Organizational Development: Kerala Muslim Cultural Center Formation",
        description: "Establishment of formal organizational structure, creating robust governance frameworks with guidance from visionary leaders including C H Muhammad Koya."
      },
      {
        period: "1970s - 1980s",
        title: "Educational Reforms & Social Development",
        description: "Implementation of significant educational initiatives in Kerala, championing access to education for marginalized communities following C H Muhammad Koya's vision."
      },
      {
        period: "1990s - 2000s",
        title: "Community Leadership & Interstate Outreach",
        description: "Expansion beyond Kerala to develop intelligent, socially-minded citizens, establishing forums for cultural dialogue and exchange."
      },
      {
        period: "Present Day",
        title: "Global Expansion & Ongoing Legacy",
        description: "KMCC Australia continues to develop connections from Kerala tradition to the Australian context, creating collaborative partnerships among diverse communities."
      }
    ],
    commitment: {
      title: "KMCC Australia's Commitment",
      description: "In his spirit, we aim to preserve the cultural heritage while pushing forward the legacy of Delhi community leaders. Their principles of education, community service, and cultural preservation guide our present-day initiatives."
    },
    pillars: [
      {
        title: "Educational Initiatives",
        description: "Continuing his dedication to accessible education with scholarship programs, educational workshops, and mentoring programs.",
        icon: <SchoolIcon />
      },
      {
        title: "Healthcare Services",
        description: "Providing health awareness programs to ensure community members have access to information and preventative healthcare services.",
        icon: <MenuBookIcon />
      },
      {
        title: "Community Integration",
        description: "Creating cultural dialogue with wider Australian community through events, partnerships, and collaborative projects fostering mutual respect and understanding.",
        icon: <GroupsIcon />
      }
    ]
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header/Nav Bar */}
      <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: '1px solid #e0e0e0' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            KMCC Australia
          </Typography>
          {isMobile ? (
            <>
              <IconButton
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={handleMenuClick}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem>Home</MenuItem>
                <MenuItem>About Us</MenuItem>
                <MenuItem>Projects</MenuItem>
                <MenuItem>Resources</MenuItem>
                <MenuItem>Our Legends</MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex' }}>
              <Button color="inherit">Home</Button>
              <Button color="inherit">About Us</Button>
              <Button color="inherit">Projects</Button>
              <Button color="inherit">Resources</Button>
              <Button color="inherit" sx={{ fontWeight: 'bold' }}>Our Legends</Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Paper
        sx={{
          position: 'relative',
          bgcolor: 'grey.300',
          color: '#fff',
          mb: 4,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(https://source.unsplash.com/random/1600x400/?heritage)',
          height: '200px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Container>
          <Typography component="h1" variant="h3" color="inherit" gutterBottom sx={{ fontWeight: 'bold' }}>
            Honoring Our Heritage
          </Typography>
          <Typography variant="subtitle1" color="inherit" paragraph>
            The legacy and vision of great inspirations, figures, and leaders that contributed to the heritage of
            KMCC Australia.
          </Typography>
        </Container>
      </Paper>

      <Container maxWidth="lg">
        {/* Navigation Breadcrumb */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            C H Muhammad Koya Profile
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Quick Navigation <ArrowForwardIcon fontSize="small" sx={{ fontSize: 14, verticalAlign: 'middle' }} /> Through C H Muhammad Koya
          </Typography>
          <Typography variant="body2" color="text.secondary">
            KMCC Australia Archive
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Left Column - Profile Image and Basic Info */}
          <Grid size={{ xs:12, md:4}}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, mb: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                <Avatar
                  alt={legendData.name}
                  src={legendData.image}
                  sx={{ width: 150, height: 150, mb: 2, border: '4px solid #f5f5f5' }}
                />
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                  {legendData.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                  {legendData.lifespan}
                </Typography>
                <Divider sx={{ width: '80%', my: 2 }} />
                <Typography variant="body2" sx={{ textAlign: 'center', fontStyle: 'italic' }}>
                  {legendData.shortDescription}
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={1}>
                <Grid size={{ xs:6 }}>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    startIcon={<PersonIcon />}
                    size="small"
                    sx={{ textTransform: 'none', justifyContent: 'flex-start' }}
                  >
                    Biography
                  </Button>
                </Grid>
                <Grid size={{ xs:6 }}>
                  <Button 
                    variant="outlined" 
                    fullWidth
                    startIcon={<StarBorderIcon />}
                    size="small"
                    sx={{ textTransform: 'none', justifyContent: 'flex-start' }}
                  >
                    Contributions
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Main Content Area */}
          <Grid size={{ xs:12, md:8}}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
              {/* Tabs for mobile */}
              {isMobile && (
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{ mb: 3 }}
                >
                  <Tab label="Biography" icon={<PersonIcon />} iconPosition="start" />
                  <Tab label="Contributions" icon={<StarBorderIcon />} iconPosition="start" />
                  <Tab label="Quotes" icon={<FormatQuoteIcon />} iconPosition="start" />
                  <Tab label="Timeline" icon={<TimelineIcon />} iconPosition="start" />
                </Tabs>
              )}

              {/* Biography Section */}
              <Box id="biography" sx={{ mb: 4 }}>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main, display: 'flex', alignItems: 'center' }}>
                  <PersonIcon sx={{ mr: 1 }} /> Biography
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {legendData.biography.map((paragraph, index) => (
                  <Typography key={index} variant="body1" paragraph>
                    {paragraph}
                  </Typography>
                ))}
              </Box>

              {/* Key Contributions Section */}
              <Box id="key-contributions" sx={{ mb: 4 }}>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main, display: 'flex', alignItems: 'center' }}>
                  <StarBorderIcon sx={{ mr: 1 }} /> Key Contributions
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <List>
                  {legendData.keyContributions.map((contribution, index) => (
                    <ListItem key={index} sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <ArrowForwardIcon color="primary" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={contribution} />
                    </ListItem>
                  ))}
                </List>
              </Box>

              {/* Notable Quotes Section */}
              <Box id="quotes" sx={{ mb: 4 }}>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main, display: 'flex', alignItems: 'center' }}>
                  <FormatQuoteIcon sx={{ mr: 1 }} /> Notable Quotes
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {legendData.quotes.map((quote, index) => (
                  <Card key={index} elevation={0} sx={{ mb: 2, bgcolor: 'grey.50', border: '1px solid #e0e0e0' }}>
                    <CardContent>
                      <Typography variant="body1" gutterBottom sx={{ fontStyle: 'italic' }}>
                        "{quote.text}"
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        — {quote.source}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>

             {/* Legacy Section */}
             <Box id="legacy" sx={{ mb: 4 }}>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main, display: 'flex', alignItems: 'center' }}>
                  <MenuBookIcon sx={{ mr: 1 }} /> Legacy
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body1" paragraph>
                  {legendData.legacy}
                </Typography>
              </Box>

              {/* Historical Context Section */}
              <Box id="historical-context" sx={{ mb: 4 }}>
                <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main, display: 'flex', alignItems: 'center' }}>
                  <HistoryIcon sx={{ mr: 1 }} /> Historical Context
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                {legendData.timeline.map((item, index) => (
                  <Card key={index} elevation={0} sx={{ mb: 3, bgcolor: 'grey.50', border: '1px solid #e0e0e0' }}>
                    <CardContent sx={{ pb: 1 }}>
                      <Chip 
                        label={item.period} 
                        size="small" 
                        color="primary" 
                        variant="outlined" 
                        sx={{ mb: 1 }} 
                      />
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                        {item.title}
                      </Typography>
                      <Typography variant="body2">
                        {item.description}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Continuing the Legacy Section */}
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
            Continuing Their Legacy
          </Typography>
          <Divider sx={{ mb: 4 }} />
          
          <Paper elevation={0} sx={{ p: 3, borderRadius: 2, bgcolor: 'background.paper', mb: 4 }}>
            <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
              {legendData.commitment.title}
            </Typography>
            <Typography variant="body1" paragraph>
              {legendData.commitment.description}
            </Typography>
          </Paper>
          
          <Grid container spacing={3}>
            {legendData.pillars.map((pillar, index) => (
              <Grid size={{ xs:12, md:4}} key={index}>
                <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2 }}>
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                      <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 60, height: 60 }}>
                        {pillar.icon}
                      </Avatar>
                    </Box>
                    <Typography variant="h6" component="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                      {pillar.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {pillar.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
        
        {/* Call to Action */}
        <Box sx={{ textAlign: 'center', my: 4 }}>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            sx={{ px: 4, py: 1, borderRadius: 8 }}
          >
            Learn More
          </Button>
        </Box>
      </Container>
      
      {/* Footer */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 4, mt: 4 }}>
        <Container>
          <Grid container spacing={3}>
            <Grid size={{ xs:12, md:4}}>
              <Typography variant="h6" gutterBottom>
                KMCC Australia
              </Typography>
              <Typography variant="body2">
                Preserving heritage, building community, and creating a better future together.
              </Typography>
            </Grid>
            <Grid size={{ xs:12, md:4}}>
              <Typography variant="h6" gutterBottom>
                Quick Links
              </Typography>
              <Typography variant="body2">
                Home | About | Events | Resources | Contact
              </Typography>
            </Grid>
            <Grid size={{ xs:12, md:4}}>
              <Typography variant="h6" gutterBottom>
                Contact Us
              </Typography>
              <Typography variant="body2">
                info@kmccaustralia.org<br />
                +61 2 1234 5678
              </Typography>
            </Grid>
          </Grid>
          <Typography variant="body2" sx={{ mt: 4, textAlign: 'center' }}>
            © {new Date().getFullYear()} KMCC Australia. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default LegendProfilePage;