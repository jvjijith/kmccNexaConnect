"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { SessionProvider } from "next-auth/react"
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  ThemeProvider
} from "@mui/material"
import {
  Cancel as CancelIcon,
  ShoppingCart as ShoppingCartIcon,
  Event as EventIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  Refresh as RefreshIcon
} from "@mui/icons-material"
import { getColor } from "../../../src/data/loader"
import { createDynamicTheme } from "@repo/ui/theme"

function PaymentCancelContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [color, setColor] = useState<any>(null)
  const [colorLoading, setColorLoading] = useState(true)
  
  const sessionId = searchParams.get('session_id')
  const type = searchParams.get('type')
  const eventId = searchParams.get('id')
  const memberId = searchParams.get('memberId')

  // Color system integration
  useEffect(() => {
    async function fetchColors() {
      try {
        setColorLoading(true)
        const colorData = await getColor("light");
        if (colorData?.theme?.palette?.primary?.main) {
          setColor(colorData);
        }
      } catch (error) {
        console.error("Error fetching colors:", error);
      } finally {
        setColorLoading(false)
      }
    }
    fetchColors();
  }, []);

  const getPaymentTypeInfo = () => {
    switch (type) {
      case 'cart':
        return {
          icon: <ShoppingCartIcon sx={{ fontSize: 60 }} />,
          title: "Order Cancelled",
          description: "Your order was not completed. Your cart items are still saved.",
          returnPath: "/cart",
          returnLabel: "Return to Cart",
          color: '#f44336'
        }
      case 'event':
        return {
          icon: <EventIcon sx={{ fontSize: 60 }} />,
          title: "Event Registration Cancelled",
          description: "Your event registration was not completed. You can try again anytime.",
          returnPath: `/events/${eventId || ''}`,
          returnLabel: "Return to Event",
          color: '#ff9800'
        }
      case 'member':
        return {
          icon: <PersonIcon sx={{ fontSize: 60 }} />,
          title: "Membership Payment Cancelled",
          description: "Your membership payment was not completed. You can retry the payment.",
          returnPath: "/membership",
          returnLabel: "Return to Membership",
          color: '#9c27b0'
        }
      default:
        return {
          icon: <CancelIcon sx={{ fontSize: 60 }} />,
          title: "Payment Cancelled",
          description: "Your payment was not completed.",
          returnPath: "/",
          returnLabel: "Go Home",
          color: '#f44336'
        }
    }
  }

  // Show loading state while colors are being fetched
  if (colorLoading) {
    return (
      <Container 
        maxWidth="md" 
        sx={{ 
          py: 4, 
          pt: 12,
          minHeight: "100vh", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center"
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress size={60} sx={{ mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Loading...
          </Typography>
        </Box>
      </Container>
    )
  }

  const primaryColor = color?.theme?.palette?.primary?.main || '#1976d2'
  const primaryDark = color?.theme?.palette?.primary?.dark || '#1565c0'
  const paymentInfo = getPaymentTypeInfo()

  return (
    <ThemeProvider theme={createDynamicTheme(color || {})}>
      <Container 
        maxWidth="md" 
        sx={{ 
          py: 4, 
          pt: 12,
          minHeight: "100vh",
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
        }}
      >
        <Card 
          elevation={8}
          sx={{ 
            borderRadius: 4,
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 1) 100%)',
            backdropFilter: 'blur(10px)',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <Box sx={{
            background: `linear-gradient(135deg, ${paymentInfo.color} 0%, ${paymentInfo.color}dd 100%)`,
            color: 'white',
            p: 4,
            textAlign: 'center'
          }}>
            <Box sx={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 2rem'
            }}>
              {paymentInfo.icon}
            </Box>
            
            <Typography variant="h3" fontWeight="bold" sx={{ mb: 2 }}>
              {paymentInfo.title}
            </Typography>
            
            {sessionId && (
              <Chip 
                label={`Session: ${sessionId.slice(-8)}`}
                sx={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontWeight: 'bold'
                }}
              />
            )}
          </Box>

          <CardContent sx={{ p: 4 }}>
            <Alert severity="warning" sx={{ mb: 3 }}>
              {paymentInfo.description}
            </Alert>
            
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                What can you do next?
              </Typography>
              
              <Box sx={{ textAlign: 'left', maxWidth: 500, mx: 'auto' }}>
                {type === 'cart' && (
                  <>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      • Your cart items are still saved and available
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      • You can review your items and try again
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      • Contact support if you're experiencing issues
                    </Typography>
                  </>
                )}
                
                {type === 'event' && (
                  <>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      • The event registration is still available
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      • You can try registering again
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      • Check event details and requirements
                    </Typography>
                  </>
                )}
                
                {type === 'member' && (
                  <>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      • Your membership application is still pending
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      • You can retry the payment process
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      • Contact us if you need assistance
                    </Typography>
                  </>
                )}
                
                <Typography variant="body1" sx={{ mb: 1 }}>
                  • No charges were made to your account
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Action Buttons */}
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<RefreshIcon />}
                onClick={() => router.push(paymentInfo.returnPath)}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  background: `linear-gradient(45deg, ${primaryColor} 30%, ${primaryDark} 90%)`,
                  '&:hover': {
                    background: `linear-gradient(45deg, ${primaryDark} 30%, ${color?.theme?.palette?.primary?.darker || '#0d47a1'} 90%)`,
                  }
                }}
              >
                {paymentInfo.returnLabel}
              </Button>
              
              <Button
                variant="outlined"
                size="large"
                startIcon={<HomeIcon />}
                onClick={() => router.push('/')}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  borderColor: primaryColor,
                  color: primaryColor,
                  '&:hover': {
                    borderColor: primaryDark,
                    backgroundColor: `${primaryColor}10`
                  }
                }}
              >
                Back to Home
              </Button>
            </Box>

            {/* Help Section */}
            <Box sx={{ 
              mt: 4, 
              p: 3, 
              backgroundColor: 'rgba(25, 118, 210, 0.05)',
              borderRadius: 2,
              border: '1px solid rgba(25, 118, 210, 0.1)',
              textAlign: 'center'
            }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Need Help?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                If you're experiencing issues with payment or have questions, we're here to help.
              </Typography>
              <Button
                variant="text"
                size="small"
                onClick={() => router.push('/contact')}
                sx={{ color: primaryColor }}
              >
                Contact Support
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </ThemeProvider>
  )
}

export default function PaymentCancelPage() {
  return (
    <SessionProvider>
      <PaymentCancelContent />
    </SessionProvider>
  )
}