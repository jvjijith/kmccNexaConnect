import React from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  Container, 
  Grid,
  Paper
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import SendIcon from '@mui/icons-material/Send';

const ContactUs: React.FC = () => {
  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      {/* <Typography variant="h1" component="h1" gutterBottom fontWeight="bold" sx={{ fontSize: "3.5rem" }}>
        Contact Us
      </Typography>
      
      <Typography variant="h6" paragraph mb={5} sx={{ fontSize: "1.2rem" }}>
        We'd love to hear from you. Please fill out the form below or use our contact information to get in touch.
      </Typography> */}

      <Container
            sx={{
              py: 12,
              display: 'flex',
              flexDirection: 'column',
              gap: 16
            }}
          >
            <Box
              sx={{
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                marginTop: 5
              }}
            >
              <Typography  variant="h2" component="h1" fontWeight="bold" sx={{ letterSpacing: '-0.025em' }}>
              Contact Us
              </Typography>
            
              <Typography 
                variant="body1" 
                color="text.secondary"
                sx={{
                  maxWidth: '42rem',
                  mx: 'auto'
                }}
              >
                We'd love to hear from you. Please fill out the form below or use our contact information to get in touch.
              </Typography>
            </Box>
          </Container>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Grid container direction="column" spacing={4}>
            <Grid item>
              <Card elevation={2} sx={{ height: '100%', p: 1 }}>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" mb={3}>
                    <LocationOnIcon color="success" sx={{ mr: 2, fontSize: "2rem" }} />
                    <Typography variant="h5" component="h2" fontWeight="bold">
                      Our Location
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ fontSize: "1.1rem", mb: 1 }}>123 Main Street</Typography>
                  <Typography variant="body1" sx={{ fontSize: "1.1rem", mb: 1 }}>Melbourne, VIC 3000</Typography>
                  <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>Australia</Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item>
              <Card elevation={2} sx={{ p: 1 }}>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" mb={3}>
                    <PhoneIcon color="success" sx={{ mr: 2, fontSize: "2rem" }} />
                    <Typography variant="h5" component="h2" fontWeight="bold">
                      Phone
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>+61 3 1234 5678</Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item>
              <Card elevation={2} sx={{ p: 1 }}>
                <CardContent sx={{ p: 3 }}>
                  <Box display="flex" alignItems="center" mb={3}>
                    <EmailIcon color="success" sx={{ mr: 2, fontSize: "2rem" }} />
                    <Typography variant="h5" component="h2" fontWeight="bold">
                      Email
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>info@kmccaustralia.org</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 4 }}>
            <Typography variant="h4" component="h2" gutterBottom fontWeight="bold" mb={2}>
              Send us a Message
            </Typography>
            <Typography variant="body1" paragraph sx={{ fontSize: "1.1rem", mb: 4 }}>
              Fill out the form below and we'll get back to you as soon as possible.
            </Typography>
            
            <Box component="form" noValidate>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" fontWeight="medium" mb={1} sx={{ fontSize: "1.1rem" }}>
                    Your Name
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="John Doe"
                    variant="outlined"
                    size="medium"
                    InputProps={{ style: { fontSize: '1.1rem', padding: '12px 14px' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" fontWeight="medium" mb={1} sx={{ fontSize: "1.1rem" }}>
                    Email Address
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="john@example.com"
                    variant="outlined"
                    size="medium"
                    InputProps={{ style: { fontSize: '1.1rem', padding: '12px 14px' } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1" fontWeight="medium" mb={1} sx={{ fontSize: "1.1rem" }}>
                    Subject
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="How can we help you?"
                    variant="outlined"
                    size="medium"
                    InputProps={{ style: { fontSize: '1.1rem', padding: '12px 14px' } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1" fontWeight="medium" mb={1} sx={{ fontSize: "1.1rem" }}>
                    Message
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={5}
                    placeholder="Your message here..."
                    variant="outlined"
                    InputProps={{ style: { fontSize: '1.1rem' } }}
                  />
                </Grid>
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Button 
                    variant="contained" 
                    color="success" 
                    fullWidth 
                    size="large"
                    endIcon={<SendIcon sx={{ fontSize: "1.5rem" }} />}
                    sx={{ 
                      fontSize: "1.2rem", 
                      py: 1.5, 
                      borderRadius: 1.5
                    }}
                  >
                    Send Message
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ContactUs;