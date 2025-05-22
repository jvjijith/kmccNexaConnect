"use client"

import type React from "react"
import { useState } from "react"
import type { Event } from "../../../types/event" 
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
} from "@mui/icons-material"
import EventCountdown from "./eventCountdown"
import EventMap from "./eventMap"
import RegistrationForm from "./registrationForm"
import { createDynamicTheme } from "@repo/ui/theme"

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
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
  
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [tabValue, setTabValue] = useState(0)
  const [showRegistration, setShowRegistration] = useState(false)

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

  // Ensure event has required metadata for RegistrationForm
  const eventDataForRegistration = {
    ...event,
    metadata: {
      name: event.metadata?.name || event.name,
      description: event.metadata?.description || event.description,
      imageUrl: event.metadata?.imageUrl || ''
    }
  }

  console.log("event",event);

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
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <CalendarMonth sx={{ mr: 1, color: "primary.main" }} />
                    <Typography variant="body1">
                      {formatDate(event.startingDate)}
                      {event.startingDate && event.endingDate && 
                        event.startingDate.split("T")[0] !== event.endingDate.split("T")[0] &&
                        ` - ${getFormattedEndDate()}`}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <AccessTime sx={{ mr: 1, color: "primary.main" }} />
                    <Typography variant="body1">
                      {formatTime(event.startingDate)} - {event.endingDate && formatTime(event.endingDate)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <LocationOn sx={{ mr: 1, color: "primary.main" }} />
                    <Typography variant="body1">{event.location}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <People sx={{ mr: 1, color: "primary.main" }} />
                    <Typography variant="body1">
                      {event.totalregisteredSeats} / {event.seatsAvailable} registered
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={4} sx={{mb: 5}}>
                <Paper elevation={3} sx={{ p: 3, height: "100%" }}>
                  <Typography variant="h6" gutterBottom>
                    Registration
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Registration period:
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {formatDate(event.registrationStartDate)} - {formatDate(event.registrationEndDate)}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
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
                  </Box>
                  <Box sx={{ mb: 2 }}>
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
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    // disabled={!isRegistrationOpen() || event.seatsAvailable <= event.totalregisteredSeats}
                    onClick={() => {
                      if (event.allowMemberLogin) {
                        const accessToken = localStorage.getItem('accessToken');
                        if (!accessToken) {
                          // Show login message
                          alert("Please login to your account first to register for this event.");
                          return;
                        }
                      }
                      setShowRegistration(true);
                    }}
                    sx={{
                      backgroundColor: "#41bf40",
                      "&:hover": {
                        backgroundColor: "#2a9e29"
                      }
                    }}
                  >
                    Register Now
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {!isMobile && (
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
              <Tab icon={<Description />} label="Description" id="event-tab-0" aria-controls="event-tabpanel-0" />
              <Tab icon={<Info />} label="Details" id="event-tab-1" aria-controls="event-tabpanel-1" />
              <Tab icon={<LocationOn />} label="Location" id="event-tab-2" aria-controls="event-tabpanel-2" />
              {(isRegistrationOpen() && event.seatsAvailable > event.totalregisteredSeats) && 
              <Tab icon={<HowToReg />} label="Registration" id="event-tab-3" aria-controls="event-tabpanel-3" />}
            </Tabs>
          </Box>
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
          <TabPanel value={tabValue} index={1}>
            <Typography variant="h5" gutterBottom>
              Event Details
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Event Type
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    {event.type === "public" ? (
                      <>
                        <Public sx={{ mr: 1, color: "primary.main" }} />
                        <Typography variant="body1">Public Event</Typography>
                      </>
                    ) : (
                      <>
                        <Lock sx={{ mr: 1, color: "primary.main" }} />
                        <Typography variant="body1">Members-Only Event</Typography>
                      </>
                    )}
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    Access Settings
                  </Typography>
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        {event.allowGuest ? <CheckCircle color="success" /> : <Cancel color="error" />}
                      </ListItemIcon>
                      <ListItemText primary="Guest Access" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        {event.allowLogin ? <CheckCircle color="success" /> : <Cancel color="error" />}
                      </ListItemIcon>
                      <ListItemText primary="Login Access" />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        {event.allowMemberLogin ? <CheckCircle color="success" /> : <Cancel color="error" />}
                      </ListItemIcon>
                      <ListItemText primary="Member Login" />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, height: "100%" }}>
                  <Typography variant="h6" gutterBottom>
                    Registration Period
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <CalendarMonth sx={{ mr: 1, color: "primary.main" }} />
                    <Typography variant="body1">
                      {formatDate(event.registrationStartDate)} - {formatDate(event.registrationEndDate)}
                    </Typography>
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    Payment Information
                  </Typography>
                  <Typography variant="body1">Payment Type: {event.paymentType}</Typography>
                  {event.paymentType !== "Free" && event.priceConfig && (
                    <Typography variant="body1">
                      Price:{" "}
                      {event.priceConfig.type === "fixed"
                        ? `$${event.priceConfig.amount}`
                        : "Variable pricing based on registration options"}
                    </Typography>
                  )}
                </Paper>
              </Grid>
            </Grid>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Event Schedule
              </Typography>
              <Paper sx={{ p: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Day 1: {formatDate(event.startingDate)}
                    </Typography>
                    <Divider sx={{ my: 1, backgroundColor: "#e0e0e0" }} />
                    <Grid container spacing={2}>
                      <Grid item xs={3} sm={2}>
                        <Typography variant="body2" color="text.secondary">
                          9:00 AM
                        </Typography>
                      </Grid>
                      <Grid item xs={9} sm={10}>
                        <Typography variant="body1">Registration & Welcome Coffee</Typography>
                      </Grid>
                      <Grid item xs={3} sm={2}>
                        <Typography variant="body2" color="text.secondary">
                          10:00 AM
                        </Typography>
                      </Grid>
                      <Grid item xs={9} sm={10}>
                        <Typography variant="body1">Opening Keynote</Typography>
                      </Grid>
                      <Grid item xs={3} sm={2}>
                        <Typography variant="body2" color="text.secondary">
                          12:00 PM
                        </Typography>
                      </Grid>
                      <Grid item xs={9} sm={10}>
                        <Typography variant="body1">Lunch Break</Typography>
                      </Grid>
                      <Grid item xs={3} sm={2}>
                        <Typography variant="body2" color="text.secondary">
                          1:30 PM
                        </Typography>
                      </Grid>
                      <Grid item xs={9} sm={10}>
                        <Typography variant="body1">Workshop Sessions</Typography>
                      </Grid>
                      <Grid item xs={3} sm={2}>
                        <Typography variant="body2" color="text.secondary">
                          5:00 PM
                        </Typography>
                      </Grid>
                      <Grid item xs={9} sm={10}>
                        <Typography variant="body1">Networking Reception</Typography>
                      </Grid>
                    </Grid>
                  </Grid>

                  {event.endingDate && event.startingDate.split("T")[0] !== event.endingDate.split("T")[0] && (
                    <Grid item xs={12} sx={{ mt: 2 }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Day 2: {getDayTwoDate()}
                      </Typography>
                      <Divider sx={{ my: 1, backgroundColor: "#e0e0e0" }} />
                      <Grid container spacing={2}>
                        <Grid item xs={3} sm={2}>
                          <Typography variant="body2" color="text.secondary">
                            9:30 AM
                          </Typography>
                        </Grid>
                        <Grid item xs={9} sm={10}>
                          <Typography variant="body1">Panel Discussion</Typography>
                        </Grid>
                        <Grid item xs={3} sm={2}>
                          <Typography variant="body2" color="text.secondary">
                            11:00 AM
                          </Typography>
                        </Grid>
                        <Grid item xs={9} sm={10}>
                          <Typography variant="body1">Technical Workshops</Typography>
                        </Grid>
                        <Grid item xs={3} sm={2}>
                          <Typography variant="body2" color="text.secondary">
                            12:30 PM
                          </Typography>
                        </Grid>
                        <Grid item xs={9} sm={10}>
                          <Typography variant="body1">Lunch Break</Typography>
                        </Grid>
                        <Grid item xs={3} sm={2}>
                          <Typography variant="body2" color="text.secondary">
                            2:00 PM
                          </Typography>
                        </Grid>
                        <Grid item xs={9} sm={10}>
                          <Typography variant="body1">Closing Keynote</Typography>
                        </Grid>
                        <Grid item xs={3} sm={2}>
                          <Typography variant="body2" color="text.secondary">
                            4:00 PM
                          </Typography>
                        </Grid>
                        <Grid item xs={9} sm={10}>
                          <Typography variant="body1">Closing Remarks & Farewell</Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              </Paper>
            </Box>
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
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

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Getting There
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Paper sx={{ p: 3, height: "100%" }}>
                    <Typography variant="subtitle1" gutterBottom>
                      By Car
                    </Typography>
                    <Typography variant="body2">
                      Parking is available at the convention center garage for $25 per day.
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Paper sx={{ p: 3, height: "100%" }}>
                    <Typography variant="subtitle1" gutterBottom>
                      By Public Transit
                    </Typography>
                    <Typography variant="body2">
                      The venue is accessible via BART and MUNI. Exit at Powell Street Station.
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Paper sx={{ p: 3, height: "100%" }}>
                    <Typography variant="subtitle1" gutterBottom>
                      From Airport
                    </Typography>
                    <Typography variant="body2">SFO is approximately 30 minutes by car or 45 minutes by BART.</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </TabPanel>
          {(isRegistrationOpen() && event.seatsAvailable > event.totalregisteredSeats) &&
          <TabPanel value={tabValue} index={3}>
            <Typography variant="h5" gutterBottom>
              Registration
            </Typography>
            <RegistrationForm eventData={eventDataForRegistration} id={id} />
          </TabPanel>}
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
            <Typography variant="h6">Registration Form</Typography>
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
            <RegistrationForm eventData={eventDataForRegistration} id={id} />
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