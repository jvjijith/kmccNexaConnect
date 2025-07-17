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
  CheckCircle as CheckCircleIcon,
  Event as EventIcon,
  Person as PersonIcon,
  ShoppingCart as ShoppingCartIcon,
  Home as HomeIcon
} from "@mui/icons-material"
import {
  createSalesInvoice,
  updateEvent,
  updateMemberPaymentStatus,
  getColor,
  getCart,
  getRegisterEvent
} from "../../../src/data/loader"
import { createDynamicTheme } from "@repo/ui/theme"

// JWT decode function
function decodeJWT(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3 || !parts[1]) {
      throw new Error('Invalid JWT format');
    }
    
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
}

function PaymentSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [color, setColor] = useState<any>(null)
  const [colorLoading, setColorLoading] = useState(true)
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)

  const sessionId = searchParams.get('session_id')
  const type = searchParams.get('type')
  const eventId = searchParams.get('id') // For event payments (legacy)
  const registrationId = searchParams.get('registration_id') // For event registration payments
  const memberId = searchParams.get('memberId') // For member payments

  // Initialize access token from localStorage on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem("accessToken");
      setAccessToken(token);
    }
  }, []);

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

  useEffect(() => {
    if (!sessionId) {
      setError("Missing payment information")
      setLoading(false)
      return
    }
console.log("Starting payment processing...")
    processPayment()
  }, [sessionId, type, accessToken])

  const processPayment = async () => {
    try {
      setProcessing(true)
      setError(null)

      if (!accessToken) {
        setError("Authentication required")
        return
      }

      const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }

      // Decode JWT to get user ID
      const decodedToken = decodeJWT(accessToken)
      if (!decodedToken || !decodedToken.id) {
        setError('Authentication error. Please log in again.')
        return
      }

      const userId = decodedToken.id

      if(type){switch (type) {
        case 'cart':
          await handleCartPayment(headers, userId)
          break
        case 'event':
          await handleEventPayment(headers, userId)
          break
        case 'member':
          await handleMemberPayment(headers, userId)
          break
        default:
          setError(`Unknown payment type: ${type}`)
          return
      }}
      console.log("Payment processing completed successfully.");
if(registrationId){await handleEventPayment(headers, userId)}
      setSuccess(true)
    } catch (error: any) {
      console.error('Payment processing error:', error)
      setError(error.message || 'Failed to process payment')
    } finally {
      setProcessing(false)
      setLoading(false)
    }
  }

  const handleCartPayment = async (headers: any, userId: string) => {
    // For cart payments, get cart data and create sales invoice
    try {
      console.log("Fetching cart data for sales invoice...")
      const cartResponse = await getCart(headers)
      console.log("Cart response:", cartResponse)

      if (!cartResponse?.items || !Array.isArray(cartResponse.items)) {
        throw new Error("No cart items found")
      }

      // Store order details for display
      setOrderDetails({
        items: cartResponse.items,
        subtotal: cartResponse.totalAmount || 0,
        tax: (cartResponse.totalAmount || 0) * 0.1,
        total: (cartResponse.totalAmount || 0) * 1.1
      })

      // Calculate totals from cart data
      const subtotal = cartResponse.totalAmount || 0
      const tax = subtotal * 0.1 // 10% tax
      const finalAmount = subtotal + tax

      // Prepare products array for sales invoice
      const products = cartResponse.items.map((item: any) => ({
        productId: item.product._id,
        quantity: item.quantity,
        unitPrice: item.price,
        discount: 0,
        totalPrice: item.price * item.quantity
      }))

      const salesInvoiceData = {
        invoiceTemplate: process.env.NEXT_PUBLIC_INVOICE_TEMPLATE || "default-template",
        invoiceStatus: "Draft",
        customer: userId,
        invoiceNotes: `Cart payment completed on ${new Date().toISOString()}. Session ID: ${sessionId}`,
        products: products,
        totalAmount: subtotal,
        totalDiscount: 0,
        finalAmount: finalAmount,
        paymentTerms: "Immediate",
        dueDate: new Date().toISOString(),
        paymentHistory: [{
          paymentDate: new Date().toISOString(),
          amount: finalAmount,
          method: "stripe",
          stripeSessionId: sessionId
        }],
        paymentStatus: "paid",
        createdBy: process.env.NEXT_PUBLIC_EMPLOYEE_ID,
        editedBy: process.env.NEXT_PUBLIC_EMPLOYEE_ID,
        termsAndConditions: []
      }

      console.log("Creating sales invoice for cart payment:", salesInvoiceData)
      const invoiceResult = await createSalesInvoice(salesInvoiceData, headers)
      console.log("Sales invoice created successfully:", invoiceResult)

      return invoiceResult
    } catch (error) {
      console.error("Error in handleCartPayment:", error)
      throw error
    }
  }

  const handleEventPayment = async (headers: any, userId: string) => {
    // Use registration_id if available, otherwise fall back to eventId for backward compatibility
    const regId = registrationId || eventId;

    console.log("Processing event payment with registration ID:", regId);

    if (!regId) {
      throw new Error("Registration ID or Event ID is required for event payments")
    }

    if (!accessToken) {
      throw new Error("Authentication required")
    }

    try {
      // Step 1: Get the event registration details using the registration ID
      console.log("Fetching event registration details for ID:", regId)
      const registrationDetails = await getRegisterEvent(regId, headers)
      console.log("Registration details:", registrationDetails)

      if (!registrationDetails) {
        throw new Error("Event registration not found")
      }

      // Step 2: Prepare the update data with the retrieved registration details
      const eventUpdateData = {
        eventId: registrationDetails.eventId,
        userId: registrationDetails.userId || userId,
        email: registrationDetails.email,
        eventData: registrationDetails.eventData || [],
        price: registrationDetails.price || "0",
        stripeId: sessionId || registrationDetails.stripeId,
        currency: registrationDetails.currency || "USD",
        status: "completed", // Update status to completed after successful payment
        paymentStatus: "paid", // Update payment status to paid
        id: regId,
      }

      console.log("Updating event registration with payment success:", eventUpdateData)

      // Step 3: Update the event registration with the new payment status
      const updateResult = await updateEvent(eventUpdateData, headers)
      console.log("Event registration updated successfully:", updateResult)

      // Store registration details for display
      setOrderDetails({
        registrationId: regId,
        eventId: registrationDetails.eventId,
        email: registrationDetails.email,
        price: registrationDetails.price,
        currency: registrationDetails.currency,
        registrationDate: registrationDetails.registrationDate,
        eventData: registrationDetails.eventData
      })

      return updateResult
    } catch (error) {
      console.error("Error in handleEventPayment:", error)
      throw error
    }

  }

  const handleMemberPayment = async (headers: any, userId: string) => {
    if (!memberId) {
      throw new Error("Member ID is required for member payments")
    }

    const memberUpdateData = {
      paymentStatus: "paid",
      stripeId: sessionId
    }

    console.log("Updating member payment status:", memberUpdateData)
    await updateMemberPaymentStatus(memberId, memberUpdateData, headers)
  }

  const getPaymentTypeInfo = () => {
    switch (type) {
      case 'cart':
        return {
          icon: <ShoppingCartIcon sx={{ fontSize: 60 }} />,
          title: "Order Confirmed!",
          description: "Your order has been successfully processed and a sales invoice has been created.",
          color: '#4caf50'
        }
      case 'event':
        return {
          icon: <EventIcon sx={{ fontSize: 60 }} />,
          title: "Event Registration Confirmed!",
          description: "Your event registration has been confirmed and updated.",
          color: '#2196f3'
        }
      case 'member':
        return {
          icon: <PersonIcon sx={{ fontSize: 60 }} />,
          title: "Membership Payment Confirmed!",
          description: "Your membership payment has been processed successfully.",
          color: '#ff9800'
        }
      default:
        return {
          icon: <CheckCircleIcon sx={{ fontSize: 60 }} />,
          title: "Payment Confirmed!",
          description: "Your payment has been processed successfully.",
          color: '#4caf50'
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
            Loading payment confirmation...
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
              margin: '0 auto 2rem',
              animation: loading ? 'pulse 2s infinite' : 'none'
            }}>
              {loading || processing ? (
                <CircularProgress size={60} sx={{ color: 'white' }} />
              ) : error ? (
                <Typography variant="h3" sx={{ color: 'white' }}>❌</Typography>
              ) : (
                paymentInfo.icon
              )}
            </Box>
            
            <Typography variant="h3" fontWeight="bold" sx={{ mb: 2 }}>
              {loading || processing ? "Processing..." : error ? "Payment Error" : paymentInfo.title}
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
            {error ? (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            ) : loading || processing ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {processing ? "Updating records..." : "Loading payment details..."}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Please wait while we process your payment
                </Typography>
              </Box>
            ) : success ? (
              <>
                <Alert severity="success" sx={{ mb: 3 }}>
                  {paymentInfo.description}
                </Alert>

                {/* Order Details for Cart Payments */}
                {type === 'cart' && orderDetails && (
                  <Card sx={{ mb: 3, border: `1px solid ${primaryColor}20` }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2, color: primaryColor }}>
                        Order Summary
                      </Typography>

                      {orderDetails.items.map((item: any, index: number) => (
                        <Box key={index} sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          py: 1,
                          borderBottom: index < orderDetails.items.length - 1 ? '1px solid #eee' : 'none'
                        }}>
                          <Box>
                            <Typography variant="body1" fontWeight="500">
                              {item.product.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Qty: {item.quantity} × ${item.price.toFixed(2)}
                            </Typography>
                          </Box>
                          <Typography variant="body1" fontWeight="600">
                            ${(item.price * item.quantity).toFixed(2)}
                          </Typography>
                        </Box>
                      ))}

                      <Divider sx={{ my: 2 }} />

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body1">Subtotal:</Typography>
                        <Typography variant="body1">${orderDetails.subtotal.toFixed(2)}</Typography>
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body1">Tax (10%):</Typography>
                        <Typography variant="body1">${orderDetails.tax.toFixed(2)}</Typography>
                      </Box>

                      <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        pt: 1,
                        borderTop: '2px solid #eee'
                      }}>
                        <Typography variant="h6" fontWeight="bold">Total:</Typography>
                        <Typography variant="h6" fontWeight="bold" color="primary">
                          ${orderDetails.total.toFixed(2)}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                )}

                {/* Event Registration Details */}
                {(type === 'event' || registrationId) && orderDetails && (
                  <Card sx={{ mb: 3, border: `1px solid ${primaryColor}20` }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2, color: primaryColor }}>
                        <EventIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Event Registration Details
                      </Typography>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">Registration ID</Typography>
                        <Typography variant="body1" fontWeight="500">
                          {orderDetails.registrationId}
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">Event ID</Typography>
                        <Typography variant="body1" fontWeight="500">
                          {orderDetails.eventId}
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">Email</Typography>
                        <Typography variant="body1" fontWeight="500">
                          {orderDetails.email}
                        </Typography>
                      </Box>

                      {orderDetails.registrationDate && (
                        <Box sx={{ mb: 2 }}>
                          <Typography variant="body2" color="text.secondary">Registration Date</Typography>
                          <Typography variant="body1" fontWeight="500">
                            {new Date(orderDetails.registrationDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </Typography>
                        </Box>
                      )}

                      <Divider sx={{ my: 2 }} />

                      <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <Typography variant="h6" fontWeight="bold">Amount Paid:</Typography>
                        <Typography variant="h6" fontWeight="bold" color="primary">
                          {orderDetails.currency?.toUpperCase() || 'USD'} {parseFloat(orderDetails.price || '0').toFixed(2)}
                        </Typography>
                      </Box>

                      <Box sx={{ mt: 2 }}>
                        <Chip
                          label="Payment Confirmed"
                          color="success"
                          icon={<CheckCircleIcon />}
                          sx={{ mr: 1 }}
                        />
                        <Chip
                          label="Registration Complete"
                          color="primary"
                          icon={<EventIcon />}
                        />
                      </Box>

                      {/* Event Data Fields */}
                      {orderDetails.eventData && orderDetails.eventData.length > 0 && (
                        <>
                          <Divider sx={{ my: 2 }} />
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Registration Information:
                          </Typography>
                          {orderDetails.eventData.map((field: any, index: number) => (
                            <Box key={index} sx={{ mb: 1 }}>
                              <Typography variant="body2" color="text.secondary">
                                {field.fieldName}:
                              </Typography>
                              <Typography variant="body2">
                                {field.fieldValue}
                              </Typography>
                            </Box>
                          ))}
                        </>
                      )}
                    </CardContent>
                  </Card>
                )}

                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    What happens next?
                  </Typography>
                  
                  <Box sx={{ textAlign: 'left', maxWidth: 500, mx: 'auto' }}>
                    {type === 'cart' && orderDetails && (
                      <>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          • Invoice #{orderDetails.invoiceId} has been created
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          • {orderDetails.items.length} items totaling ${orderDetails.total.toFixed(2)}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          • You will receive an email confirmation shortly
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          • Your order will be processed and shipped
                        </Typography>
                      </>
                    )}
                    
                    {type === 'event' || registrationId && (
                      <>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          • Your event registration has been confirmed
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          • You will receive event details via email
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          • Check your calendar for event reminders
                        </Typography>
                      </>
                    )}
                    
                    {type === 'member' && (
                      <>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          • Your membership payment has been processed
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          • Your membership status will be updated
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          • You now have access to member benefits
                        </Typography>
                      </>
                    )}
                  </Box>
                </Box>
              </>
            ) : null}

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
                startIcon={<HomeIcon />}
                onClick={() => router.push('/')}
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
                Back to Home
              </Button>
              
              {/* {type === 'cart' && (
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<ShoppingCartIcon />}
                  onClick={() => router.push('/products')}
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
                  Continue Shopping
                </Button>
              )} */}
              
              {type === 'member' && (
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<PersonIcon />}
                  onClick={() => router.push('/membership')}
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
                  View Membership
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>

        <style jsx>{`
          @keyframes pulse {
            0% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.05);
              opacity: 0.8;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}</style>
      </Container>
    </ThemeProvider>
  )
}

export default function PaymentSuccessPage() {
  return (
    <SessionProvider>
      <PaymentSuccessContent />
    </SessionProvider>
  )
}