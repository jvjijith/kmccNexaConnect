
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { Event, Donor } from "../../../types/event"
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Divider,
  useMediaQuery,
  LinearProgress,
  Card,
  CardContent,
  CardMedia,
  Tab,
  Tabs,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ThemeProvider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material"
import {
  CalendarMonth,
  LocationOn,
  AccessTime,
  People,
  Info,
  Description,
  Public,
  Lock,
  CheckCircle,
  Cancel,
  HowToReg,
  Close as CloseIcon,
  Favorite,
  AttachMoney,
} from "@mui/icons-material"
import EventCountdown from "./eventCountdown"
import EventMap from "./eventMap"
import EventRegistrationForm from "./registrationForm"
import { createDynamicTheme } from "@repo/ui/theme"
import { getEventDonors } from "../../../lib/api"
import { getMembershipByCustomerId } from "../../../src/data/loader"
import { useClientSide } from "../../../src/hooks/useClientSide"

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

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
  IUMLContact: string;
  queryType: string;
  supportDocuments: Array<{
    docuName: string;
    docuUrl: string;
  }>;
  query: string;
  queryFullName: string;
  queryEmail: string;
  queryAddress: string;
  queryMobileNumber: string;
  customer: string;
  iuMLContactName: string;
  iuMLContactPosition: string;
  iuMLContactNumber: string;
  iuMLLocation: string;
  photoURL: string;
  acceptKmcc: boolean;
  shareInfoNorka: boolean;
  signatureURL: string;
  paymentStatus: string;
  memberStatus: string;
  stripeId: string;
  createdAt: string;
  updatedAt: string;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`event-tabpanel-${index}`}
      aria-labelledby={`event-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

interface EventDetailPageProps {
  event: Event
  themes: any;
  id: any;
}

export default function EventDetailPage({ event, themes, id }: EventDetailPageProps) {
  const theme = createDynamicTheme({themes});
  const isClient = useClientSide();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [tabValue, setTabValue] = useState(0)
  const [showRegistration, setShowRegistration] = useState(false)
  const [donors, setDonors] = useState<Donor[]>([])
    const [membershipData, setMembershipData] = useState<MembershipData | null>(null);
    const [loadingMembership, setLoadingMembership] = useState<boolean>(false);

  // Check if this is a donation or fundraiser event
  const isDonationEvent = event.eventType === "donation" || event.eventType === "fundraiser"

    // Function to decode JWT token and extract customer ID
    const decodeToken = (token: string) => {
      try {
        const base64Url = token.split('.')[1];
        if (!base64Url) return null;
        
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    };
  
    // Function to fetch membership data
    const fetchMembershipData = async () => {
      if (!isClient) return;
      
      const token = localStorage.getItem('accessToken');
      if (!token) return;
  
      try {
        setLoadingMembership(true);
        const decodedToken = decodeToken(token);
        
        if (!decodedToken || !decodedToken.id) {
          console.error('No customer ID found in token');
          return;
        }
  
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };
  
        const membershipResponse = await getMembershipByCustomerId(decodedToken.id, headers);
        
        if (membershipResponse && membershipResponse.length > 0) {
          setMembershipData(membershipResponse[0]);
        }
      } catch (error) {
        console.error('Error fetching membership data:', error);
      } finally {
        setLoadingMembership(false);
      }
    };

  // Fetch donors for donation events
  useEffect(() => {
    if (isDonationEvent) {
      const fetchDonors = async () => {
        try {
          const donorData = await getEventDonors(id)
          setDonors(donorData)
        } catch (error) {
          console.error('Error fetching donors:', error)
        }
      }
      fetchDonors()
    }
  }, [isDonationEvent, id])

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleCloseRegistration = () => {
    setShowRegistration(false)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const registrationProgress = Math.min(
    100,
    Math.round((event.totalregisteredSeats / event.seatsAvailable) * 100)
  )

  const isRegistrationOpen = () => {
    const now = new Date()
    const regStart = new Date(event.registrationStartDate)
    const regEnd = new Date(event.registrationEndDate)
    return now >= regStart && now <= regEnd && event.eventStatus === "Live"
  }

  const getStatusColor = () => {
    switch (event.eventStatus) {
      case "Live":
        return "success"
      case "Draft":
      case "Staging":
      case "Prestaging":
        return "warning"
      case "Closed":
        return "error"
      default:
        return "default"
    }
  }

  const getFormattedEndDate = () => {
    if (!event.endingDate) return ""
    return formatDate(event.endingDate)
  }

  const getDayTwoDate = () => {
    if (!event.endingDate) return ""
    const endDate = new Date(event.endingDate)
    return formatDate(endDate.toISOString())
  }

  // Default coordinates if none provided (e.g., San Francisco)
  const defaultCoordinates: [number, number] = [37.7749, -122.4194]

  const mapCoordinates = event.GeoAllow?.coordinates || defaultCoordinates

  const memberStatus = membershipData?.memberStatus?.toLowerCase() || '';
  const paymentStatus = membershipData?.paymentStatus?.toLowerCase() || '';

  console.log("event",event);

  // DonorList component for donation events
  const DonorList = () => {
    // Helper function to get donor name with masking logic
    const getDonorName = (donor: Donor) => {
      const showNameField = donor.eventData.find(field => field.fieldName === 'anonymous_donation');
      const nameField = donor.eventData.find(field => field.fieldName === 'name' || field.fieldName === 'fullName' || field.fieldName === 'firstName');

      // If showName field exists and is false, mask the name
      if (showNameField && showNameField.fieldValue === 'false') {
        return 'Anonymous Donor';
      }

      // Otherwise, show the name if available
      if (nameField) {
        return nameField.fieldValue;
      }

      // Fallback to email if no name field
      return donor.email || 'Anonymous Donor';
    };

    // Helper function to get donation amount
    const getDonationAmount = (donor: Donor) => {
      return parseFloat(donor.price) || 0;
    };

    return (
      <Box>
        <Typography variant="h5" gutterBottom>
          Our Generous Donors
        </Typography>
        {donors.length > 0 ? (
          <>
            <Typography variant="body1" paragraph color="text.secondary">
              Thank you to all our supporters who have contributed to this cause.
            </Typography>
            <Grid container spacing={2}>
              {donors.map((donor) => (
                <Grid item xs={12} sm={6} md={4} key={donor._id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                          <Favorite />
                        </Avatar>
                        <Box>
                          <Typography variant="h6">
                            {getDonorName(donor)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(donor.registrationDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <AttachMoney sx={{ color: 'success.main', mr: 1 }} />
                        <Typography variant="h6" color="success.main">
                          ${getDonationAmount(donor).toFixed(2)} {donor.currency?.toUpperCase() || 'USD'}
                        </Typography>
                      </Box>
                      {/* Show message if available in eventData */}
                      {donor.eventData.find(field => field.fieldName === 'message')?.fieldValue && (
                        <Typography variant="body2" sx={{ fontStyle: 'italic', mt: 1 }}>
                          "{donor.eventData.find(field => field.fieldName === 'message')?.fieldValue}"
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Paper sx={{ p: 3, bgcolor: 'success.light', color: 'success.contrastText' }}>
                <Typography variant="h5" gutterBottom>
                  Total Raised
                </Typography>
                <Typography variant="h3" fontWeight="bold">
                  ${donors.reduce((total, donor) => total + getDonationAmount(donor), 0).toFixed(2)}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  from {donors.length} generous donor{donors.length !== 1 ? 's' : ''}
                </Typography>
              </Paper>
            </Box>
          </>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Avatar sx={{ bgcolor: 'grey.300', mx: 'auto', mb: 2, width: 64, height: 64 }}>
              <Favorite />
            </Avatar>
            <Typography variant="h6" gutterBottom>
              Be the First Donor
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Your contribution will make a difference. Be the first to support this cause!
            </Typography>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Card sx={{ mb: 4, overflow: "hidden" }}>
          <CardMedia
            component="img"
            height="300"
            image={event.metadata?.imageUrl}
            alt={event.name}
            sx={{ objectFit: "cover" }}
          />
          <CardContent
            sx={{
              position: "relative",
              mt: { xs: 0, md: -10 },
              backgroundColor: { xs: "transparent", md: "rgba(255, 255, 255, 0.9)" },
              borderRadius: { xs: 0, md: "16px 16px 0 0" },
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Box sx={{ mb: 2 }}>
                  <Chip 
                    label={event.eventStatus} 
                    color={getStatusColor() as any} 
                    size="small" 
                    sx={{ mb: 1 }} 
                  />
                  <Typography variant="h3" component="h1" gutterBottom>
                    {event.name}
                  </Typography>
                  {(!isDonationEvent) && <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <CalendarMonth sx={{ mr: 1, color: "primary.main" }} />
                    <Typography variant="body1">
                      {formatDate(event.startingDate)}
                      {event.startingDate && event.endingDate && 
                        event.startingDate.split("T")[0] !== event.endingDate.split("T")[0] &&
                        ` - ${getFormattedEndDate()}`}
                    </Typography>
                  </Box>}
                  {(!isDonationEvent) && <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <AccessTime sx={{ mr: 1, color: "primary.main" }} />
                    <Typography variant="body1">
                      {formatTime(event.startingDate)} - {event.endingDate && formatTime(event.endingDate)}
                    </Typography>
                  </Box>}
                  {(!isDonationEvent) && <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <LocationOn sx={{ mr: 1, color: "primary.main" }} />
                    <Typography variant="body1">{event.location}</Typography>
                  </Box>}
                  {/* {(!isDonationEvent) && <Box sx={{ display: "flex", alignItems: "center" }}>
                    <People sx={{ mr: 1, color: "primary.main" }} />
                    <Typography variant="body1">
                      {event.totalregisteredSeats} / {event.seatsAvailable} registered
                    </Typography>
                  </Box>} */}
                </Box>
              </Grid>
              <Grid item xs={12} md={4} sx={{mb: 5, mt: 3}}>
                <Paper elevation={3} sx={{ p: 1, height: (!isDonationEvent) ? "100%" : "auto" }}>
                  <Typography variant="h6" gutterBottom>
                    {(!isDonationEvent)?"Registration" : "Donation"}
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {(!isDonationEvent)?"Registration period : " : "Donation Period :"}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {formatDate(event.registrationStartDate)} - {formatDate(event.registrationEndDate)}
                    </Typography>
                  </Box>
                  {(!isDonationEvent) && <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Price:
                    </Typography>
                    <Typography variant="h5" color="primary" gutterBottom>
                      {event.paymentType === "Free"
                        ? "Free"
                        : event.priceConfig?.type === "fixed"
                        ? `$${event.priceConfig.amount}`
                        : "Variable pricing"}
                    </Typography>
                  </Box>}
                  {/* {(!isDonationEvent) && <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Available seats:
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={registrationProgress}
                      sx={{ mb: 1, height: 10, borderRadius: 5 }}
                    />
                    <Typography variant="body2">
                      {event.seatsAvailable - event.totalregisteredSeats} seats left
                    </Typography>
                  </Box>} */}
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => {
                      if (event.allowLogin) {
                        const accessToken = localStorage.getItem('accessToken');
                        if (!accessToken) {
                          alert("Please login to your account first to register for this event.");
                          return;
                        }
                      }
                      if (event.allowMemberLogin) {
                        const accessToken = localStorage.getItem('accessToken');
                        if (!accessToken) {
                          alert("Please login to your account first to register for this event.");
                          return;
                        } else {
                        fetchMembershipData()
                        if (!(memberStatus === 'accepted' && paymentStatus === 'paid')) {
                          alert("Please login to your account first to register for this event.");
                          return;
                        }
                      }
                      }
                      setShowRegistration(true);
                    }}
                  >
                    {isDonationEvent ? "Donate Now" : "Register Now"}
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {!isMobile || (!isDonationEvent) && (
          <Box sx={{ mb: 4 }}>
            <EventCountdown targetDate={event.startingDate} />
          </Box>
        )}

        <Box sx={{ width: "100%", mb: 4 }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="event tabs"
              variant={isMobile ? "scrollable" : "fullWidth"}
              scrollButtons={isMobile ? "auto" : undefined}
              sx={{
                '& .MuiTab-root': {
                  color: theme.palette.text.secondary,
                },
                '& .Mui-selected': {
                  color: theme.palette.primary.main,
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: theme.palette.primary.main,
                }
              }}
            >
              <Tab 
                icon={<Description />} 
                label="Description" 
                id="event-tab-0" 
                aria-controls="event-tabpanel-0" 
              />
              {!isDonationEvent && (
                <Tab 
                  icon={<LocationOn />} 
                  label="Location" 
                  id="event-tab-1" 
                  aria-controls="event-tabpanel-1" 
                />
              )}
              {isDonationEvent && (
                <Tab 
                  icon={<Favorite />} 
                  label="Donors" 
                  id="event-tab-1" 
                  aria-controls="event-tabpanel-1" 
                />
              )}
            </Tabs>
          </Box>

          {/* Description Tab - Always index 0 */}
          <TabPanel value={tabValue} index={0}>
            <Typography variant="h5" gutterBottom>
              About This Event
            </Typography>
            <Typography variant="body1" paragraph>
              {event.description}
            </Typography>
            <Typography variant="body1" paragraph>
              {event.metadata?.description}
            </Typography>
          </TabPanel>

          {/* Location Tab - Only for non-donation events, index 1 */}
          {!isDonationEvent && (
            <TabPanel value={tabValue} index={1}>
              <Typography variant="h5" gutterBottom>
                Location
              </Typography>
              <Typography variant="body1" paragraph>
                {event.location}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {event.GeoAllow?.location}
              </Typography>
              <Box sx={{ height: 400, width: "100%", mb: 3 }}>
                <EventMap 
                  location={event.GeoAllow?.location || ""} 
                  coordinates={mapCoordinates}
                />
              </Box>
            </TabPanel>
          )}

          {/* Donors Tab - Only for donation events, index 1 */}
          {isDonationEvent && (
            <TabPanel value={tabValue} index={1}>
              <DonorList />
            </TabPanel>
          )}
        </Box>

        {/* Registration Dialog Popup */}
        <Dialog
          open={showRegistration}
          onClose={handleCloseRegistration}
          maxWidth="md"
          fullWidth
          aria-labelledby="registration-dialog-title"
        >
          <DialogTitle id="registration-dialog-title" sx={{ m: 0, p: 2 }}>
            <Typography variant="h6">{isDonationEvent ? "Donation Form" : "Registration Form"}</Typography>
            <IconButton
              aria-label="close"
              onClick={handleCloseRegistration}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <EventRegistrationForm eventData={event} id={id} />
          </DialogContent>
          <DialogActions>
            {/* <Button onClick={handleCloseRegistration} color="primary">
              Cancel
            </Button> */}
          </DialogActions>
        </Dialog>
      </Container>
    </ThemeProvider>
  )
}