"use client"

import type React from "react"

import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Divider,
  Button,
  Card,
  CardContent,
  CardMedia,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tab,
  Tabs,
} from "@mui/material"
import {
  CalendarMonth,
  LocationOn,
  AccessTime,
  People,
  Public,
  Lock,
  CheckCircle,
  Cancel,
  AttachMoney,
  MoneyOff,
} from "@mui/icons-material"
import { useState } from "react"

// Missing Event and RegistrationField interfaces
interface RegistrationField {
  name: string;
  displayName: string;
  type: string;
  valueType: string;
  options?: Array<{
    labelName: string;
    fieldName: string;
  }>;
}

interface Event {
  name: string;
  description: string;
  eventStatus: string;
  startingDate: string;
  endingDate: string;
  location: string;
  totalregisteredSeats: number;
  seatsAvailable: number;
  registrationStartDate: string;
  registrationEndDate: string;
  paymentType: string;
  priceConfig?: {
    type: string;
    amount: number;
  };
  type: string;
  allowGuest: boolean;
  allowLogin: boolean;
  allowMemberLogin: boolean;
  geoAllow: {
    location: string;
    coordinates: [number, number];
  };
  registrationFields?: RegistrationField[];
  metadata: {
    name: string;
    description: string;
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
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

interface EventDetailProps {
  event: Event;
}

export default function EventDetail({ event }: EventDetailProps) {
  const [tabValue, setTabValue] = useState(0)

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
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

  const isRegistrationOpen = () => {
    const now = new Date()
    const regStart = new Date(event.registrationStartDate)
    const regEnd = new Date(event.registrationEndDate)
    return now >= regStart && now <= regEnd && event.eventStatus === "Live"
  }

  return (
    <Box>
      <Card sx={{ mb: 4, overflow: "hidden" }}>
        <CardMedia
          component="img"
          height="300"
          image="/placeholder.svg?height=300&width=1200"
          alt={event.name}
          sx={{ objectFit: "cover" }}
        />
        <CardContent
          sx={{
            position: "relative",
            mt: -10,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderRadius: "16px 16px 0 0",
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Box sx={{ mb: 2 }}>
                <Chip label={event.eventStatus} color={getStatusColor() as any} size="small" sx={{ mb: 1 }} />
                <Typography variant="h3" component="h1" gutterBottom>
                  {event.name}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <CalendarMonth sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="body1">
                    {formatDate(event.startingDate)}
                    {event.startingDate.split("T")[0] !== event.endingDate.split("T")[0] &&
                      ` - ${formatDate(event.endingDate)}`}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <AccessTime sx={{ mr: 1, color: "primary.main" }} />
                  <Typography variant="body1">
                    {formatTime(event.startingDate)} - {formatTime(event.endingDate)}
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
            <Grid item xs={12} md={4}>
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
                  <Typography variant="body2">
                    {event.seatsAvailable - event.totalregisteredSeats} seats left
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={!isRegistrationOpen() || event.seatsAvailable <= event.totalregisteredSeats}
                >
                  Register Now
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Box sx={{ width: "100%", mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="event tabs">
            <Tab label="Details" id="event-tab-0" aria-controls="event-tabpanel-0" />
            <Tab label="Location" id="event-tab-1" aria-controls="event-tabpanel-1" />
            <Tab label="Registration Fields" id="event-tab-2" aria-controls="event-tabpanel-2" />
          </Tabs>
        </Box>
        <TabPanel value={tabValue} index={0}>
          <Typography variant="h5" gutterBottom>
            Event Details
          </Typography>
          <Typography variant="body1" paragraph>
            {event.description}
          </Typography>
          <Divider sx={{ my: 2 }} />
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
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" gutterBottom>
            Payment Information
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            {event.paymentType === "Free" ? (
              <>
                <MoneyOff sx={{ mr: 1, color: "primary.main" }} />
                <Typography variant="body1">Free Event</Typography>
              </>
            ) : (
              <>
                <AttachMoney sx={{ mr: 1, color: "primary.main" }} />
                <Typography variant="body1">
                  {event.paymentType} -
                  {event.priceConfig?.type === "fixed" ? ` $${event.priceConfig.amount}` : " Variable pricing"}
                </Typography>
              </>
            )}
          </Box>
          <Typography variant="h6" gutterBottom>
            Metadata
          </Typography>
          <Typography variant="subtitle1">{event.metadata.name}</Typography>
          <Typography variant="body1" paragraph>
            {event.metadata.description}
          </Typography>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h5" gutterBottom>
            Location
          </Typography>
          <Typography variant="body1" paragraph>
            {event.location}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {event.geoAllow.location}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Coordinates
            </Typography>
            <Typography variant="body1">
              Longitude: {event.geoAllow.coordinates[0]}, Latitude: {event.geoAllow.coordinates[1]}
            </Typography>
          </Box>
          <Box
            sx={{
              height: 300,
              width: "100%",
              mt: 3,
              bgcolor: "grey.200",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="body1" color="text.secondary">
              Map would be displayed here
            </Typography>
          </Box>
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h5" gutterBottom>
            Registration Fields
          </Typography>
          {event.registrationFields && event.registrationFields.length > 0 ? (
            <Grid container spacing={3}>
              {event.registrationFields.map((field: RegistrationField, index: number) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      {field.displayName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Field Name: {field.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Type: {field.type}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Value Type: {field.valueType}
                    </Typography>

                    {field.options && field.options.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Options:
                        </Typography>
                        <List dense>
                          {field.options.map((option, optionIndex) => (
                            <ListItem key={optionIndex}>
                              <ListItemText primary={option.labelName} secondary={`Field Name: ${option.fieldName}`} />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="body1" color="text.secondary">
              No registration fields have been defined for this event.
            </Typography>
          )}
        </TabPanel>
      </Box>
    </Box>
  )
}