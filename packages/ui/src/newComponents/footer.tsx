"use client";  // 👈 Add this line at the top

import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Link, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  IconButton,
  Divider,
  styled
} from '@mui/material';
import { 
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Instagram as InstagramIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { Grid2 as Grid } from '@mui/material';

// Custom styled components
const StyledListItem = styled(ListItem)({
  padding: '4px 0',
});

const StyledListItemIcon = styled(ListItemIcon)({
  minWidth: '30px',
  color: '#FF5722', // Orange color for icons
});

const StyledLink = styled(Link)({
  color: 'white',
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
    color: '#FF5722', // Orange color on hover
  },
});

const BulletPoint = styled('span')({
  color: '#FF5722',
  marginRight: '8px',
});

const Footer: React.FC = () => {
  return (
    <Box sx={{ bgcolor: 'black', color: 'white', py: 6 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo and Description */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box component="img" src="/church-icon.svg" alt="Church Icon" sx={{ height: 40, mr: 1 }} />
              <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                <Box component="span" sx={{ color: 'white' }}>AVE</Box>
                <Box component="span" sx={{ color: '#FF5722' }}>NIX</Box>
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2, color: 'rgba(255,255,255,0.7)' }}>
              Lorem Ipsum is simply dummy text of printing and typesetting industry. Lorem Ipsum has been the industry's.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <IconButton color="inherit" aria-label="Facebook">
                <FacebookIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Twitter">
                <TwitterIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="LinkedIn">
                <LinkedInIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Instagram">
                <InstagramIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Quick Links
            </Typography>
            <List dense disablePadding>
              <StyledListItem>
                <BulletPoint>•</BulletPoint>
                <StyledLink href="#">Home</StyledLink>
              </StyledListItem>
              <StyledListItem>
                <BulletPoint>•</BulletPoint>
                <StyledLink href="#">About Us</StyledLink>
              </StyledListItem>
              <StyledListItem>
                <BulletPoint>•</BulletPoint>
                <StyledLink href="#">Services</StyledLink>
              </StyledListItem>
              <StyledListItem>
                <BulletPoint>•</BulletPoint>
                <StyledLink href="#">Blog</StyledLink>
              </StyledListItem>
              <StyledListItem>
                <BulletPoint>•</BulletPoint>
                <StyledLink href="#">Contact Us</StyledLink>
              </StyledListItem>
            </List>
          </Grid>

          {/* Our Services */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Our Services
            </Typography>
            <List dense disablePadding>
              <StyledListItem>
                <BulletPoint>•</BulletPoint>
                <StyledLink href="#">Support Groups</StyledLink>
              </StyledListItem>
              <StyledListItem>
                <BulletPoint>•</BulletPoint>
                <StyledLink href="#">Special Events</StyledLink>
              </StyledListItem>
              <StyledListItem>
                <BulletPoint>•</BulletPoint>
                <StyledLink href="#">Online Services</StyledLink>
              </StyledListItem>
              <StyledListItem>
                <BulletPoint>•</BulletPoint>
                <StyledLink href="#">Pastoral Care</StyledLink>
              </StyledListItem>
            </List>
          </Grid>

          {/* Contact */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Contact
            </Typography>
            <List dense disablePadding>
              <StyledListItem>
                <StyledListItemIcon>
                  <PhoneIcon />
                </StyledListItemIcon>
                <ListItemText primary="(+01) 789 3456 012" />
              </StyledListItem>
              <StyledListItem>
                <StyledListItemIcon>
                  <EmailIcon />
                </StyledListItemIcon>
                <ListItemText primary="domain@gmail.com" />
              </StyledListItem>
              <StyledListItem>
                <StyledListItemIcon>
                  <LocationIcon />
                </StyledListItemIcon>
                <ListItemText primary="24/11 Robert Road,New York,USA" />
              </StyledListItem>
            </List>
          </Grid>
        </Grid>

        {/* Bottom section */}
        <Box sx={{ mt: 5, pt: 3, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid>
              <Typography variant="body2" color="text.secondary" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                Copyright 2024 Avenix. All Rights Reserved.
              </Typography>
            </Grid>
            <Grid>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <StyledLink href="#">Term & Condition</StyledLink>
                <Typography color="text.secondary" sx={{ color: 'rgba(255,255,255,0.7)' }}>/</Typography>
                <StyledLink href="#">Support</StyledLink>
                <Typography color="text.secondary" sx={{ color: 'rgba(255,255,255,0.7)' }}>/</Typography>
                <StyledLink href="#">Privacy Policy</StyledLink>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;