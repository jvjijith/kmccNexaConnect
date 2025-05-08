"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Box, Typography, Button, Paper, CircularProgress, Alert, Divider, Grid, Chip } from "@mui/material"
import { CancelOutlined as CancelIcon, ArrowBack as ArrowBackIcon } from "@mui/icons-material"
import { getRegisterEvent, updateEvent } from "../../../src/data/loader"
import Link from "next/link"

export default function PaymentCancelled() {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [registrationData, setRegistrationData] = useState<any>(null)

  useEffect(() => {
    const fetchRegistrationData = async () => {
      try {
        setLoading(true)
        
        // Get registration_id from URL parameters
        const registrationId = searchParams.get("registration_id")
        
        if (!registrationId) {
          throw new Error("Registration ID not found in URL parameters")
        }
        
        // Fetch registration data
        const data = await getRegisterEvent(registrationId)
        setRegistrationData(data)
        
        // Update the registration status to cancelled
        await updateEvent({
          registrationId: registrationId,
          status: "cancelled",
          paymentStatus: "cancelled"
        })
        
        setLoading(false)
      } catch (err) {
        console.error("Error processing payment cancellation:", err)
        setError(err instanceof Error ? err.message : "Failed to process payment cancellation")
        setLoading(false)
      }
    }
    
    fetchRegistrationData()
  }, [searchParams])

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date)
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" sx={{ mt: 3 }}>
          Processing your cancellation...
        </Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button 
          component={Link} 
          href="/"
          variant="contained" 
          startIcon={<ArrowBackIcon />}
        >
          Return to Home
        </Button>
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          borderRadius: 2,
          border: "1px solid #ffcccc",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)"
        }}
      >
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Box 
            sx={{ 
              display: "inline-flex", 
              p: 2, 
              borderRadius: "50%", 
              backgroundColor: "#fff5f5",
              mb: 2
            }}
          >
            <CancelIcon sx={{ fontSize: 64, color: "#d32f2f" }} />
          </Box>
          
          <Typography variant="h4" gutterBottom>
            Payment Cancelled
          </Typography>
          
          <Typography variant="body1" color="text.secondary">
            Your payment has been cancelled and no charges have been made.
          </Typography>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        {registrationData && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Registration Details
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Registration ID
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {registrationData._id}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Event
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {registrationData.eventName || "N/A"}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Attendee
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {registrationData.name || "N/A"}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {registrationData.email || "N/A"}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Registration Date
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {registrationData.createdAt ? formatDate(registrationData.createdAt) : "N/A"}
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Status
                </Typography>
                <Chip 
                  label="Cancelled" 
                  color="error" 
                  size="small" 
                  sx={{ fontWeight: 500 }}
                />
              </Grid>
              
              {registrationData.price && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Amount
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: registrationData.currency || 'USD'
                    }).format(parseFloat(registrationData.price))}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        )}
        
        <Alert severity="info" sx={{ mb: 4 }}>
          If you wish to register for this event again, you can return to the event page and start a new registration.
        </Alert>
        
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, flexWrap: "wrap" }}>
          <Button 
            component={Link} 
            href="/"
            variant="contained" 
            color="primary"
            startIcon={<ArrowBackIcon />}
            sx={{ 
              borderRadius: 2,
              px: 3,
              py: 1.5,
              fontSize: "1rem"
            }}
          >
            Return to Home
          </Button>
          
          {registrationData?.eventId && (
            <Button 
              component={Link} 
              href={`/events/${registrationData.eventId}`}
              variant="outlined" 
              color="primary"
              sx={{ 
                borderRadius: 2,
                px: 3,
                py: 1.5,
                fontSize: "1rem"
              }}
            >
              Back to Event
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  )
}