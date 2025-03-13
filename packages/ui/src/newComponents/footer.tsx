"use client";

import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Link,
  IconButton,
  styled
} from '@mui/material';
import { Grid2 as Grid } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

// Custom styled components
const StyledLink = styled(Link)({
  color: '#667085',
  textDecoration: 'none',
  display: 'block',
  marginBottom: '12px',
  '&:hover': {
    color: '#1D2939',
  },
});

const SocialIconButton = styled(IconButton)({
  color: '#667085',
  padding: '8px',
  '&:hover': {
    color: '#1D2939',
    background: 'rgba(0, 0, 0, 0.04)',
  },
});

const ContactItem = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '12px',
  color: '#667085',
});

const ContactIcon = styled(Box)({
  marginRight: '12px',
  color: '#667085',
  display: 'flex',
  alignItems: 'center',
});

const Footer = () => {
  return (
    <Box sx={{ bgcolor: '#F9FAFB', py: 5, borderTop: '1px solid #EAECF0' }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo and Description */}
          <Grid size={{xs:12, md:3}}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 2 }}>
              KMCC Australia
            </Typography>
            <Typography variant="body2" sx={{ color: '#667085', mb: 2 }}>
              Kerala Muslim Cultural Centre Australia - Serving the Muslim community in Australia
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              <SocialIconButton aria-label="Facebook">
                <FacebookIcon fontSize="small" />
              </SocialIconButton>
              <SocialIconButton aria-label="Instagram">
                <InstagramIcon fontSize="small" />
              </SocialIconButton>
              <SocialIconButton aria-label="Twitter">
                <TwitterIcon fontSize="small" />
              </SocialIconButton>
              <SocialIconButton aria-label="YouTube">
                <YouTubeIcon fontSize="small" />
              </SocialIconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid size={{xs:12, md:3}}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Quick Links
            </Typography>
            <Box>
              <StyledLink href="#">Home</StyledLink>
              <StyledLink href="#">About Us</StyledLink>
              <StyledLink href="#">Projects</StyledLink>
              <StyledLink href="#">Resources</StyledLink>
              <StyledLink href="#">Our Legends</StyledLink>
              <StyledLink href="#">Sponsors</StyledLink>
              <StyledLink href="#">Contact</StyledLink>
            </Box>
          </Grid>

          {/* Resources */}
          <Grid size={{xs:12, md:3}}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Resources
            </Typography>
            <Box>
              <StyledLink href="#">Career Opportunities</StyledLink>
              <StyledLink href="#">Accommodation Guide</StyledLink>
              <StyledLink href="#">Mosques & Musallahs</StyledLink>
              <StyledLink href="#">Events Calendar</StyledLink>
              <StyledLink href="#">News & Updates</StyledLink>
            </Box>
          </Grid>

          {/* Contact */}
          <Grid size={{xs:12, md:3}}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Contact Us
            </Typography>
            <Box>
              <ContactItem>
                <ContactIcon>
                  <LocationOnIcon fontSize="small" />
                </ContactIcon>
                <Typography variant="body2">
                  123 Main Street, Melbourne, VIC 3000, Australia
                </Typography>
              </ContactItem>
              <ContactItem>
                <ContactIcon>
                  <PhoneIcon fontSize="small" />
                </ContactIcon>
                <Typography variant="body2">
                  +61 3 1234 5678
                </Typography>
              </ContactItem>
              <ContactItem>
                <ContactIcon>
                  <EmailIcon fontSize="small" />
                </ContactIcon>
                <Typography variant="body2">
                  info@kmccaustralia.org
                </Typography>
              </ContactItem>
            </Box>
          </Grid>
        </Grid>

        {/* Copyright section */}
        <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #EAECF0', textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: '#667085' }}>
            © 2025 KMCC Australia. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;