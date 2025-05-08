"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Box,
  Typography,
  Paper,
  Divider,
  Chip,
  CircularProgress,
  Button,
  Grid,
  Alert,
  styled,
  Container,
} from "@mui/material"
import {
  CheckCircle as CheckCircleIcon,
  Receipt as ReceiptIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Print as PrintIcon,
  Home as HomeIcon,
} from "@mui/icons-material"
import { getRegisterEvent, updateEvent } from "../../../src/data/loader"

// Import API functions

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: 12,
  padding: theme.spacing(4),
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
  marginBottom: theme.spacing(4),
}));

const SuccessIcon = styled(CheckCircleIcon)(({ theme }) => ({
  fontSize: 80,
  color: theme.palette.success.main,
  marginBottom: theme.spacing(2),
}));

const AnimatedButton = styled(Button)(({ theme }) => ({
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
  },
}));

const ConfirmationChip = styled(Chip)(({ theme }) => ({
  fontSize: "1.2rem",
  padding: theme.spacing(3, 2),
  marginBottom: theme.spacing(3),
  fontWeight: 500,
}));

export default function PaymentSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registrationData, setRegistrationData] = useState<any>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Format utilities
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };

  const formatCurrency = (amount: string): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(amount));
  };

  useEffect(() => {
    const fetchAndUpdateRegistration = async () => {
      try {
        setLoading(true);
        
        // Get registration ID from URL
        const registrationId = searchParams.get('registration_id');
        const sessionId = searchParams.get('session_id');
        
        if (!registrationId) {
          throw new Error('Registration ID not found in URL');
        }
        
        // Fetch registration data
        const registrationResponse = await getRegisterEvent(registrationId);

        console.log("registrationResponse :",registrationResponse);
        
        // Find the specific registration by ID
        const registration = Array.isArray(registrationResponse) 
          ? registrationResponse.find((reg: any) => reg._id === registrationId)
          : registrationResponse;
        
        if (!registration) {
          throw new Error('Registration not found');
        }
        
        setRegistrationData(registration);
        
        // Prepare data for update
        const updateData = {
          eventId: registration.eventId,
          userId: registration.userId,
          email: registration.email,
          eventData: registration.eventData.map((item: any) => ({
            fieldName: item.fieldName,
            fieldValue: item.fieldValue
          })),
          price: registration.price,
          stripeId: sessionId || registration.stripeId,
          currency: registration.currency,
          status: "completed",
          paymentStatus: "paid"
        };
        
        console.log("updateData : ",updateData);

        // Update registration status
        await updateEvent(updateData);
        setUpdateSuccess(true);
        
      } catch (error) {
        console.error('Error processing payment success:', error);
        setError(error instanceof Error ? error.message : 'An error occurred processing your payment');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAndUpdateRegistration();
  }, [searchParams]);

  // Get attendee name from registration data
  const getAttendeeName = () => {
    if (!registrationData || !registrationData.eventData) return 'Attendee';
    
    const nameField = registrationData.eventData.find(
      (field: any) => field.fieldName === 'fullName'
    );
    
    return nameField ? nameField.fieldValue : 'Attendee';
  };

  // Handle print function
  const handlePrint = () => {
    window.print();
  };

  // Handle return home
  const handleReturnHome = () => {
    router.push('/');
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={60} sx={{ mb: 3 }} />
        <Typography variant="h5">
          Processing your payment...
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          Please wait while we confirm your registration.
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
          {error}
        </Alert>
        <StyledPaper>
          <Typography variant="h5" gutterBottom>
            There was a problem processing your payment
          </Typography>
          <Typography variant="body1" paragraph>
            We encountered an error while confirming your registration. Please contact support with your registration ID.
          </Typography>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <AnimatedButton
              variant="contained"
              color="primary"
              startIcon={<HomeIcon />}
              onClick={handleReturnHome}
              sx={{ borderRadius: 2 }}
            >
              Return Home
            </AnimatedButton>
          </Box>
        </StyledPaper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <StyledPaper>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <SuccessIcon />
          <Typography variant="h4" gutterBottom>
            Payment Successful!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Your registration has been confirmed and payment has been processed successfully.
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Registration ID
          </Typography>
          <ConfirmationChip 
            label={registrationData?._id} 
            color="primary" 
          />
        </Box>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ReceiptIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">
                Payment Details
              </Typography>
            </Box>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Amount Paid
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {formatCurrency(registrationData?.price || '0')}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Payment Status
                  </Typography>
                  <Chip 
                    label="Paid" 
                    color="success" 
                    size="small" 
                    sx={{ fontWeight: 500 }} 
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Payment Date
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(new Date().toISOString())}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Payment Method
                  </Typography>
                  <Typography variant="body1">
                    Credit/Debit Card
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CalendarIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">
                Event Information
              </Typography>
            </Box>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Event
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {/* Display event name if available */}
                    Event Name
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Registration Date
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(registrationData?.registrationDate || new Date().toISOString())}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Status
                  </Typography>
                  <Chip 
                    label="Confirmed" 
                    color="success" 
                    size="small" 
                    sx={{ fontWeight: 500 }} 
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PersonIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">
                Attendee Information
              </Typography>
            </Box>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Name
                  </Typography>
                  <Typography variant="body1">
                    {getAttendeeName()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1">
                    {registrationData?.email}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary" paragraph>
            A confirmation email has been sent to your email address with all the details.
          </Typography>
          <Alert severity="info" sx={{ mb: 4, borderRadius: 2, textAlign: 'left' }}>
            Please save or print this confirmation for your records. You may need to present it at the event.
          </Alert>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          <AnimatedButton
            variant="outlined"
            color="primary"
            startIcon={<PrintIcon />}
            onClick={handlePrint}
            sx={{ borderRadius: 2 }}
          >
            Print Confirmation
          </AnimatedButton>
          <AnimatedButton
            variant="contained"
            color="primary"
            startIcon={<HomeIcon />}
            onClick={handleReturnHome}
            sx={{ borderRadius: 2 }}
          >
            Return Home
          </AnimatedButton>
        </Box>
      </StyledPaper>
    </Container>
  );
}