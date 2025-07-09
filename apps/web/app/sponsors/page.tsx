"use client"

import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { ArrowBack, Language, Email, Phone } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

// Mock sponsors data - replace with actual data from your API
const sponsors = [
  {
    id: 1,
    name: "TechCorp Solutions",
    logo: "/placeholder.svg?height=100&width=200",
    description: "Leading technology solutions provider specializing in enterprise software and cloud services.",
    website: "https://techcorp.com",
    email: "contact@techcorp.com",
    phone: "+1 (555) 123-4567",
    tier: "Platinum",
    color: "#E5E7EB"
  },
  {
    id: 2,
    name: "Innovation Labs",
    logo: "/placeholder.svg?height=100&width=200",
    description: "Research and development company focused on cutting-edge AI and machine learning solutions.",
    website: "https://innovationlabs.com",
    email: "hello@innovationlabs.com",
    phone: "+1 (555) 234-5678",
    tier: "Gold",
    color: "#FEF3C7"
  },
  {
    id: 3,
    name: "Digital Dynamics",
    logo: "/placeholder.svg?height=100&width=200",
    description: "Full-service digital marketing agency helping businesses grow their online presence.",
    website: "https://digitaldynamics.com",
    email: "info@digitaldynamics.com",
    phone: "+1 (555) 345-6789",
    tier: "Silver",
    color: "#F3F4F6"
  },
  {
    id: 4,
    name: "Future Systems",
    logo: "/placeholder.svg?height=100&width=200",
    description: "Next-generation software development company building tomorrow's applications today.",
    website: "https://futuresystems.com",
    email: "contact@futuresystems.com",
    phone: "+1 (555) 456-7890",
    tier: "Bronze",
    color: "#FED7AA"
  }
];

const getTierColor = (tier: string) => {
  switch (tier) {
    case 'Platinum':
      return '#6B7280';
    case 'Gold':
      return '#F59E0B';
    case 'Silver':
      return '#9CA3AF';
    case 'Bronze':
      return '#D97706';
    default:
      return '#6B7280';
  }
};

export default function SponsorsPage() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.back()}
          sx={{ mb: 3 }}
          variant="outlined"
        >
          Back
        </Button>
        
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 'bold',
            mb: 2,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center'
          }}
        >
          Our Amazing Sponsors
        </Typography>
        
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ textAlign: 'center', mb: 4, maxWidth: 600, mx: 'auto' }}
        >
          We're grateful to our sponsors who make our platform possible. 
          These incredible partners support our mission and help us grow.
        </Typography>
      </Box>

      {/* Sponsors Grid */}
      <Grid container spacing={3}>
        {sponsors.map((sponsor) => (
          <Grid item xs={12} md={6} key={sponsor.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                }
              }}
            >
              <Box
                sx={{
                  background: sponsor.color,
                  p: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 120
                }}
              >
                <Box
                  component="img"
                  src={sponsor.logo}
                  alt={`${sponsor.name} logo`}
                  sx={{
                    maxWidth: '100%',
                    maxHeight: 80,
                    objectFit: 'contain'
                  }}
                />
              </Box>
              
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', flexGrow: 1 }}>
                    {sponsor.name}
                  </Typography>
                  <Chip
                    label={sponsor.tier}
                    sx={{
                      backgroundColor: getTierColor(sponsor.tier),
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                </Box>
                
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3, lineHeight: 1.6 }}
                >
                  {sponsor.description}
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Language sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {sponsor.website}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Email sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {sponsor.email}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {sponsor.phone}
                    </Typography>
                  </Box>
                </Box>
                
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    mt: 3,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
                    }
                  }}
                  onClick={() => window.open(sponsor.website, '_blank')}
                >
                  Visit Website
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Call to Action */}
      <Paper
        sx={{
          mt: 6,
          p: 4,
          textAlign: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}
      >
        <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
          Become a Sponsor
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
          Join our amazing community of sponsors and help us make a difference. 
          Contact us to learn about sponsorship opportunities.
        </Typography>
        <Button
          variant="contained"
          size="large"
          sx={{
            backgroundColor: 'white',
            color: '#667eea',
            fontWeight: 'bold',
            px: 4,
            py: 1.5,
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.9)'
            }
          }}
          onClick={() => router.push('/contact')}
        >
          Contact Us
        </Button>
      </Paper>
    </Container>
  );
}