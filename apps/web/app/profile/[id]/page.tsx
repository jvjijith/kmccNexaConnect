"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Receipt as ReceiptIcon,
  Event as EventIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import { 
  getMembershipByCustomerId, 
  getSalesInvoices, 
  getUserEventRegistrations, 
  getEvent,
  decodeAccessToken 
} from '../../../src/data/loader';

interface MembershipData {
  supportKMCC: boolean;
  readBylaw: boolean;
  byLaw: string;
  applicationFor: string;
  amountTobePaid: number;
  firstName: string;
  lastName: string;
  partnerFirstName?: string;
  partnerLastName?: string;
  partnerEmail?: string;
  partnerDob?: string;
  partnerMobileNumber?: string;
  partnerWhatsappNumber?: string;
  dob: string;
  email: string;
  address: string;
  rejectionNotes?: string;
  mobileNumber: string;
  whatsappNumber: string;
  visaStatus: string;
  emergencyContactName: string;
  emergencyContactMobile: string;
  addressInKerala: string;
  assemblyName: string;
  district: string;
  emergencyContactNameKerala: string;
  emergencyContactNumberKerala: string;
  shareInfoNorka: boolean;
  signatureURL: string;
  paymentStatus: string;
  memberStatus: string;
  stripeId: string;
  createdAt: string;
  updatedAt: string;
  customer: string;
}

interface SalesInvoice {
  _id: string;
  invoiceNumber: string;
  invoiceTemplate: string;
  invoiceStatus: string;
  quoteId: string;
  salesman: string;
  customer: string;
  invoiceNotes: string;
  products: Array<{
    productId: string;
    variantId: string;
    quantity: number;
    unitPrice: number;
    discount: number;
    totalPrice: number;
    _id: string;
  }>;
  totalAmount: number;
  totalDiscount: number;
  finalAmount: number;
  paymentTerms: string;
  dueDate: string;
  paymentHistory: Array<{
    _id: string;
    paymentDate: string;
    paymentAmount: number;
    paymentMethod: string;
    paymentReference: string;
  }>;
  paymentStatus: string;
  termsAndConditions: Array<{
    _id: string;
    name: string;
    content: string;
  }>;
  createdBy: string;
  editedBy: string;
  editedCount: number;
  editedNotes: string[];
  createdAt: string;
  updatedAt: string;
}

interface EventRegistration {
  eventId: string;
  userId: string;
  email: string;
  eventData: Array<{
    fieldName: string;
    fieldValue: string;
    _id: string;
  }>;
  price: string;
  stripeId: string;
  currency: string;
  status: string;
  paymentStatus: string;
  registrationDate: string;
  createdAt: string;
  updatedAt: string;
  _id: string;
  __v: number;
}

interface EventDetails {
  name: string;
  description: string;
  type: string;
  metadata: {
    name: string;
    description: string;
  };
  location: string;
  GeoAllow: {
    location: string;
    coordinates: number[];
  };
  allowGuest: boolean;
  allowLogin: boolean;
  allowMemberLogin: boolean;
  seatsAvailable: number;
  totalregisteredSeats: number;
  registrationFields: Array<{
    name: string;
    displayName: string;
    type: string;
    options: Array<{
      fieldName: string;
      parentName: string;
      labelName: string;
      _id: string;
    }>;
    valueType: string;
    fixedValue: string;
    userValue: string;
    truthValue: string;
    falseValue: string;
    formula: Array<{
      type: string;
      fieldName: string;
      operationName: string;
      _id: string;
    }>;
    _id: string;
  }>;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  eventStatus: string;
  startingDate: string;
  endingDate: string;
  paymentType: string;
  priceConfig: {
    type: string;
    amount: number;
    dependantField: string;
  };
  registrationStartDate: string;
  registrationEndDate: string;
}

const ProfilePage: React.FC = () => {
  const params = useParams();
  const userId = params.id as string;

  const [membershipData, setMembershipData] = useState<MembershipData | null>(null);
  const [salesInvoices, setSalesInvoices] = useState<SalesInvoice[]>([]);
  const [eventRegistrations, setEventRegistrations] = useState<EventRegistration[]>([]);
  const [eventDetails, setEventDetails] = useState<{[key: string]: EventDetails}>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('accessToken');
        
        if (!token) {
          setError('No authentication token found');
          return;
        }

        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        // Verify token and user ID match
        const decodedToken = decodeAccessToken(token);
        if (!decodedToken || decodedToken.userId !== userId) {
          setError('Unauthorized access');
          return;
        }

        // Fetch membership data
        try {
          const membershipResponse = await getMembershipByCustomerId(userId, headers);
          if (membershipResponse && membershipResponse.length > 0) {
            setMembershipData(membershipResponse[0]);
          }
        } catch (err) {
          console.error('Error fetching membership data:', err);
        }

        // Fetch sales invoices
        try {
          const invoicesResponse = await getSalesInvoices(userId, headers);
          if (invoicesResponse && invoicesResponse.invoices) {
            setSalesInvoices(invoicesResponse.invoices);
          }
        } catch (err) {
          console.error('Error fetching sales invoices:', err);
        }

        // Fetch event registrations
        try {
          const registrationsResponse = await getUserEventRegistrations(userId, headers);
          if (registrationsResponse && Array.isArray(registrationsResponse)) {
            setEventRegistrations(registrationsResponse);
            
            // Fetch event details for each registration
            const eventDetailsMap: {[key: string]: EventDetails} = {};
            for (const registration of registrationsResponse) {
              try {
                const eventData = await getEvent(registration.eventId);
                if (eventData) {
                  eventDetailsMap[registration.eventId] = eventData;
                }
              } catch (err) {
                console.error(`Error fetching event details for ${registration.eventId}:`, err);
              }
            }
            setEventDetails(eventDetailsMap);
          }
        } catch (err) {
          console.error('Error fetching event registrations:', err);
        }

      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProfileData();
    }
  }, [userId]);

  const categorizeEvents = () => {
    const now = new Date();
    const upcoming: Array<{registration: EventRegistration, details: EventDetails}> = [];
    const ongoing: Array<{registration: EventRegistration, details: EventDetails}> = [];
    const past: Array<{registration: EventRegistration, details: EventDetails}> = [];

    eventRegistrations.forEach(registration => {
      const details = eventDetails[registration.eventId];
      if (!details) return;

      const startDate = new Date(details.startingDate);
      const endDate = new Date(details.endingDate);

      if (now < startDate) {
        upcoming.push({ registration, details });
      } else if (now >= startDate && now <= endDate) {
        ongoing.push({ registration, details });
      } else {
        past.push({ registration, details });
      }
    });

    return { upcoming, ongoing, past };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  const { upcoming, ongoing, past } = categorizeEvents();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Profile Header */}
      <Card sx={{ mb: 4, background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)', color: 'white' }}>
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" alignItems="center" gap={3}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                fontSize: '2.5rem',
                fontWeight: 'bold',
                border: '4px solid rgba(255, 255, 255, 0.3)'
              }}
            >
              {membershipData?.firstName?.charAt(0) || 'U'}
            </Avatar>
            <Box flex={1}>
              <Typography variant="h3" component="h1" gutterBottom>
                {membershipData ? `${membershipData.firstName} ${membershipData.lastName}` : 'User Profile'}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
                Member ID: {membershipData?.customer || userId}
              </Typography>
              {membershipData && (
                <Box display="flex" gap={1.5} flexWrap="wrap">
                  <Chip
                    label={membershipData.memberStatus?.toUpperCase() || 'PENDING'}
                    sx={{
                      backgroundColor: membershipData.memberStatus === 'accepted' ? '#4caf50' : '#ff9800',
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                  <Chip
                    label={`Payment: ${membershipData.paymentStatus?.toUpperCase() || 'PENDING'}`}
                    sx={{
                      backgroundColor: membershipData.paymentStatus === 'paid' ? '#4caf50' : '#f44336',
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                  <Chip
                    label={`Application: ${membershipData.applicationFor?.toUpperCase() || 'GENERAL'}`}
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={4}>
        {/* Personal Information */}
        {membershipData && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Personal Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <List>
                  <ListItem>
                    <ListItemIcon><EmailIcon /></ListItemIcon>
                    <ListItemText primary="Email" secondary={membershipData.email} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><PhoneIcon /></ListItemIcon>
                    <ListItemText primary="Mobile" secondary={membershipData.mobileNumber} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><LocationIcon /></ListItemIcon>
                    <ListItemText primary="Address" secondary={membershipData.address} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><CalendarIcon /></ListItemIcon>
                    <ListItemText primary="Date of Birth" secondary={formatDate(membershipData.dob)} />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Product History (Sales Invoices) */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                <ReceiptIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Product History
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {salesInvoices.length > 0 ? (
                <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
                  {salesInvoices.map((invoice) => (
                    <Accordion key={invoice._id}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box display="flex" justifyContent="space-between" width="100%" alignItems="center">
                          <Typography variant="subtitle1">
                            Invoice #{invoice.invoiceNumber}
                          </Typography>
                          <Chip
                            label={invoice.paymentStatus.toUpperCase()}
                            color={invoice.paymentStatus === 'paid' ? 'success' : 'warning'}
                            size="small"
                          />
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <TableContainer component={Paper} variant="outlined">
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Product</TableCell>
                                <TableCell align="right">Qty</TableCell>
                                <TableCell align="right">Unit Price</TableCell>
                                <TableCell align="right">Total</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {invoice.products.map((product) => (
                                <TableRow key={product._id}>
                                  <TableCell>{product.productId}</TableCell>
                                  <TableCell align="right">{product.quantity}</TableCell>
                                  <TableCell align="right">{formatCurrency(product.unitPrice)}</TableCell>
                                  <TableCell align="right">{formatCurrency(product.totalPrice)}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                        <Box mt={2} display="flex" justifyContent="space-between">
                          <Typography variant="body2">
                            Created: {formatDate(invoice.createdAt)}
                          </Typography>
                          <Typography variant="h6">
                            Total: {formatCurrency(invoice.finalAmount)}
                          </Typography>
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              ) : (
                <Typography color="text.secondary">No purchase history found</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Registered Events */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                <EventIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Registered Events
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {eventRegistrations.length > 0 ? (
                <Box>
                  {/* Ongoing Events */}
                  {ongoing.length > 0 && (
                    <Box mb={3}>
                      <Typography variant="h6" color="success.main" gutterBottom>
                        <CheckCircleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Ongoing Events ({ongoing.length})
                      </Typography>
                      <Grid container spacing={2}>
                        {ongoing.map(({ registration, details }) => (
                          <Grid item xs={12} md={6} key={registration._id}>
                            <Card variant="outlined" sx={{ borderColor: 'success.main' }}>
                              <CardContent>
                                <Typography variant="h6" gutterBottom>{details.name}</Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                  {details.description}
                                </Typography>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                                  <Chip
                                    label={registration.paymentStatus.toUpperCase()}
                                    color={registration.paymentStatus === 'paid' ? 'success' : 'warning'}
                                    size="small"
                                  />
                                  <Typography variant="body2">
                                    {formatDate(details.startingDate)} - {formatDate(details.endingDate)}
                                  </Typography>
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )}

                  {/* Upcoming Events */}
                  {upcoming.length > 0 && (
                    <Box mb={3}>
                      <Typography variant="h6" color="primary.main" gutterBottom>
                        <ScheduleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Upcoming Events ({upcoming.length})
                      </Typography>
                      <Grid container spacing={2}>
                        {upcoming.map(({ registration, details }) => (
                          <Grid item xs={12} md={6} key={registration._id}>
                            <Card variant="outlined" sx={{ borderColor: 'primary.main' }}>
                              <CardContent>
                                <Typography variant="h6" gutterBottom>{details.name}</Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                  {details.description}
                                </Typography>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                                  <Chip
                                    label={registration.paymentStatus.toUpperCase()}
                                    color={registration.paymentStatus === 'paid' ? 'success' : 'warning'}
                                    size="small"
                                  />
                                  <Typography variant="body2">
                                    {formatDate(details.startingDate)} - {formatDate(details.endingDate)}
                                  </Typography>
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )}

                  {/* Past Events */}
                  {past.length > 0 && (
                    <Box>
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        <HistoryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Past Events ({past.length})
                      </Typography>
                      <Grid container spacing={2}>
                        {past.map(({ registration, details }) => (
                          <Grid item xs={12} md={6} key={registration._id}>
                            <Card variant="outlined" sx={{ borderColor: 'grey.300' }}>
                              <CardContent>
                                <Typography variant="h6" gutterBottom>{details.name}</Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                  {details.description}
                                </Typography>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                                  <Chip
                                    label={registration.paymentStatus.toUpperCase()}
                                    color={registration.paymentStatus === 'paid' ? 'success' : 'default'}
                                    size="small"
                                  />
                                  <Typography variant="body2">
                                    {formatDate(details.startingDate)} - {formatDate(details.endingDate)}
                                  </Typography>
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )}
                </Box>
              ) : (
                <Typography color="text.secondary">No event registrations found</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfilePage;