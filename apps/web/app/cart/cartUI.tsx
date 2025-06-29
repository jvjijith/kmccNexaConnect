"use client"

import { useRouter } from 'next/navigation'
import Image from "next/image"
import { 
  Button,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Divider,
  IconButton,
  Box,
  Container,
  Chip,
  Paper,
  Fade,
  Zoom,
  Alert,
  Skeleton
} from '@mui/material'
import { 
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingBag as ShoppingBagIcon,
  LocalShipping as ShippingIcon,
  Security as SecurityIcon,
  Favorite as FavoriteIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material'
import { CartItem } from '../../src/lib/purchases'

interface CartPageUIProps {
  cartItems: CartItem[]
  isLoggedIn: boolean
  calculateTotal: () => string
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemoveItem: (productId: string) => void
  onCheckout: () => void
}

export default function CartPageUI({
  cartItems,
  isLoggedIn,
  calculateTotal,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartPageUIProps) {
  const router = useRouter()

  // Calculate savings and other values
  const subtotal = parseFloat(calculateTotal())
  const tax = subtotal * 0.1
  const total = subtotal + tax
  const savings = cartItems.reduce((acc, item) => {
    const originalPrice = item.stock > 100 ? 119.99 : item.stock > 50 ? 69.99 : 29.99
    const currentPrice = item.stock > 100 ? 99.99 : item.stock > 50 ? 49.99 : 19.99
    return acc + ((originalPrice - currentPrice) * item.quantity)
  }, 0)

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 8 }, px: { xs: 2, md: 4 } }}>
      {/* Header */}
      <Box sx={{ mb: 6 }}>
        <Typography 
          variant="h3" 
          fontWeight="bold" 
          sx={{ 
            mb: 2,
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: { xs: '2rem', md: '3rem' }
          }}
        >
          Shopping Cart
        </Typography>
        {cartItems.length > 0 && (
          <Typography variant="h6" color="text.secondary">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
          </Typography>
        )}
      </Box>

      {cartItems.length === 0 ? (
        <Fade in timeout={800}>
          <Paper 
            elevation={0}
            sx={{ 
              width: '100%',
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
              borderRadius: 4,
              overflow: 'hidden'
            }}
          >
            <CardContent sx={{ 
              pt: 8, 
              pb: 8,
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              minHeight: '400px',
              textAlign: 'center'
            }}>
              <Zoom in timeout={1000}>
                <Box sx={{ mb: 4 }}>
                  <ShoppingBagIcon sx={{ 
                    fontSize: { xs: 80, md: 120 }, 
                    color: 'primary.main',
                    opacity: 0.7
                  }} />
                </Box>
              </Zoom>
              <Typography 
                variant="h4" 
                fontWeight="700" 
                sx={{ 
                  mb: 2,
                  fontSize: { xs: '1.5rem', md: '2rem' }
                }}
              >
                Your cart is empty
              </Typography>
              <Typography 
                variant="h6" 
                color="text.secondary" 
                sx={{ 
                  mb: 6,
                  maxWidth: '500px',
                  lineHeight: 1.6
                }}
              >
                Discover amazing products and start building your perfect collection today!
              </Typography>
              <Button 
                variant="contained" 
                size="large"
                endIcon={<ArrowForwardIcon />}
                onClick={() => router.push('/products')}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  borderRadius: 3,
                  background: 'linear-gradient(45deg, #FF6B6B 30%, #FF8E53 90%)',
                  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #FF5252 30%, #FF7043 90%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 10px 2px rgba(255, 105, 135, .3)',
                  }
                }}
              >
                Start Shopping
              </Button>
            </CardContent>
          </Paper>
        </Fade>
      ) : (
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, 
          gap: { xs: 4, md: 6 }
        }}>
          {/* Cart Items */}
          <Fade in timeout={600}>
            <Paper 
              elevation={0}
              sx={{ 
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                overflow: 'hidden'
              }}
            >
              <CardHeader 
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h5" fontWeight="700">
                      Cart Items
                    </Typography>
                    <Chip 
                      label={cartItems.length} 
                      color="primary" 
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>
                }
                sx={{ 
                  bgcolor: 'grey.50',
                  borderBottom: '1px solid',
                  borderColor: 'divider'
                }}
              />
              <CardContent sx={{ p: 0 }}>
                {cartItems.map((item, index) => {
                  const price = item.stock > 100 ? 99.99 : item.stock > 50 ? 49.99 : 19.99
                  const originalPrice = item.stock > 100 ? 119.99 : item.stock > 50 ? 69.99 : 29.99
                  const discount = ((originalPrice - price) / originalPrice * 100).toFixed(0)

                  return (
                    <Fade in timeout={800 + (index * 200)} key={item.productCode}>
                      <Box sx={{
                        p: { xs: 3, md: 4 },
                        borderBottom: index < cartItems.length - 1 ? '1px solid' : 'none',
                        borderColor: 'divider',
                        '&:hover': {
                          bgcolor: 'grey.50'
                        },
                        transition: 'background-color 0.2s ease'
                      }}>
                        <Box sx={{
                          display: 'flex',
                          flexDirection: { xs: 'column', sm: 'row' },
                          gap: { xs: 3, md: 4 },
                          alignItems: { xs: 'flex-start', sm: 'center' }
                        }}>
                          {/* Product Image */}
                          <Box sx={{ flexShrink: 0 }}>
                            <Paper 
                              elevation={2}
                              sx={{ 
                                position: 'relative', 
                                height: { xs: 120, md: 140 }, 
                                width: { xs: 120, md: 140 }, 
                                borderRadius: 2,
                                overflow: 'hidden',
                                bgcolor: 'grey.100'
                              }}
                            >
                              {item.images && item.images.length > 0 && item.images[0]?.url ? (
                                <Image
                                  src={item.images[0].url}
                                  alt={item.images[0].altText || item.name}
                                  fill
                                  style={{ objectFit: 'cover' }}
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/api/placeholder/400/400';
                                  }}
                                />
                              ) : (
                                <Box sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  height: '100%',
                                  width: '100%',
                                  bgcolor: 'grey.200'
                                }}>
                                  <ShoppingBagIcon sx={{ fontSize: 40, color: 'grey.400' }} />
                                </Box>
                              )}
                              
                              {/* Discount Badge */}
                              {discount !== '0' && (
                                <Chip
                                  label={`${discount}% OFF`}
                                  size="small"
                                  color="error"
                                  sx={{
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                    fontWeight: 700,
                                    fontSize: '0.75rem'
                                  }}
                                />
                              )}
                            </Paper>
                          </Box>

                          {/* Product Details */}
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography 
                              variant="h6" 
                              fontWeight="600"
                              sx={{ 
                                mb: 1,
                                fontSize: { xs: '1.1rem', md: '1.25rem' }
                              }}
                            >
                              {item.name}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{ mb: 0.5 }}
                            >
                              Brand: {item.brand}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{ mb: 2 }}
                            >
                              Model: {item.model}
                            </Typography>

                            {/* Stock Status */}
                            <Box sx={{ mb: 3 }}>
                              {item.stock > 10 ? (
                                <Chip 
                                  label="In Stock" 
                                  color="success" 
                                  size="small"
                                  sx={{ fontWeight: 600 }}
                                />
                              ) : item.stock > 0 ? (
                                <Chip 
                                  label={`Only ${item.stock} left`} 
                                  color="warning" 
                                  size="small"
                                  sx={{ fontWeight: 600 }}
                                />
                              ) : (
                                <Chip 
                                  label="Out of Stock" 
                                  color="error" 
                                  size="small"
                                  sx={{ fontWeight: 600 }}
                                />
                              )}
                            </Box>

                            {/* Quantity Controls */}
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'space-between',
                              flexWrap: 'wrap',
                              gap: 2
                            }}>
                              <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 1,
                                border: '2px solid',
                                borderColor: 'divider',
                                borderRadius: 2,
                                p: 0.5
                              }}>
                                <IconButton
                                  size="small"
                                  onClick={() => onUpdateQuantity(item.productCode, Math.max(1, item.quantity - 1))}
                                  disabled={item.quantity <= 1}
                                  sx={{
                                    '&:hover': {
                                      bgcolor: 'error.light',
                                      color: 'white'
                                    }
                                  }}
                                >
                                  <RemoveIcon fontSize="small" />
                                </IconButton>
                                <Typography 
                                  sx={{ 
                                    minWidth: 40, 
                                    textAlign: 'center',
                                    fontWeight: 600,
                                    fontSize: '1.1rem'
                                  }}
                                >
                                  {item.quantity}
                                </Typography>
                                <IconButton
                                  size="small"
                                  onClick={() => onUpdateQuantity(item.productCode, item.quantity + 1)}
                                  disabled={item.quantity >= item.stock}
                                  sx={{
                                    '&:hover': {
                                      bgcolor: 'success.light',
                                      color: 'white'
                                    }
                                  }}
                                >
                                  <AddIcon fontSize="small" />
                                </IconButton>
                              </Box>

                              <IconButton
                                onClick={() => onRemoveItem(item.productCode)}
                                sx={{
                                  color: 'error.main',
                                  '&:hover': {
                                    bgcolor: 'error.light',
                                    color: 'white'
                                  }
                                }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          </Box>

                          {/* Price Section */}
                          <Box sx={{ 
                            textAlign: { xs: 'left', sm: 'right' },
                            minWidth: 120
                          }}>
                            <Box sx={{ mb: 1 }}>
                              <Typography 
                                variant="h6" 
                                fontWeight="700"
                                color="primary.main"
                                sx={{ fontSize: '1.25rem' }}
                              >
                                ${price.toFixed(2)}
                              </Typography>
                              {discount !== '0' && (
                                <Typography 
                                  variant="body2" 
                                  color="text.secondary"
                                  sx={{ 
                                    textDecoration: 'line-through',
                                    fontSize: '0.875rem'
                                  }}
                                >
                                  ${originalPrice.toFixed(2)}
                                </Typography>
                              )}
                            </Box>
                            <Typography 
                              variant="body1" 
                              fontWeight="600"
                              color="text.primary"
                            >
                              Total: ${(price * item.quantity).toFixed(2)}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Fade>
                  )
                })}
              </CardContent>
            </Paper>
          </Fade>

          {/* Order Summary */}
          <Fade in timeout={1000}>
            <Paper 
              elevation={0}
              sx={{ 
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                height: 'fit-content',
                position: 'sticky',
                top: 20
              }}
            >
              <CardHeader 
                title={
                  <Typography variant="h5" fontWeight="700">
                    Order Summary
                  </Typography>
                }
                sx={{ 
                  bgcolor: 'grey.50',
                  borderBottom: '1px solid',
                  borderColor: 'divider'
                }}
              />
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ mb: 4 }}>
                  {/* Savings Alert */}
                  {savings > 0 && (
                    <Alert 
                      severity="success" 
                      sx={{ 
                        mb: 3,
                        borderRadius: 2,
                        '& .MuiAlert-message': {
                          fontWeight: 600
                        }
                      }}
                    >
                      You're saving ${savings.toFixed(2)} on this order!
                    </Alert>
                  )}

                  {/* Price Breakdown */}
                  <Box sx={{ '& > *:not(:last-child)': { mb: 2 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1">Subtotal</Typography>
                      <Typography variant="body1" fontWeight="600">
                        ${subtotal.toFixed(2)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ShippingIcon fontSize="small" color="success" />
                        <Typography variant="body1">Shipping</Typography>
                      </Box>
                      <Chip 
                        label="FREE" 
                        color="success" 
                        size="small"
                        sx={{ fontWeight: 700 }}
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1">Tax (10%)</Typography>
                      <Typography variant="body1" fontWeight="600">
                        ${tax.toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                    <Typography variant="h6" fontWeight="700">
                      Total
                    </Typography>
                    <Typography 
                      variant="h6" 
                      fontWeight="700"
                      color="primary.main"
                      sx={{ fontSize: '1.5rem' }}
                    >
                      ${total.toFixed(2)}
                    </Typography>
                  </Box>
                </Box>

                {/* Security Features */}
                <Box sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <SecurityIcon fontSize="small" color="success" />
                    <Typography variant="body2" color="text.secondary">
                      Secure checkout guaranteed
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <ShippingIcon fontSize="small" color="primary" />
                    <Typography variant="body2" color="text.secondary">
                      Free shipping on all orders
                    </Typography>
                  </Box>
                </Box>

                {/* Checkout Button */}
                <Button 
                  variant="contained" 
                  fullWidth 
                  size="large"
                  onClick={onCheckout}
                  disabled={!isLoggedIn}
                  sx={{
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    borderRadius: 3,
                    background: isLoggedIn 
                      ? 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
                      : 'grey.400',
                    boxShadow: isLoggedIn 
                      ? '0 3px 5px 2px rgba(33, 203, 243, .3)'
                      : 'none',
                    '&:hover': {
                      background: isLoggedIn 
                        ? 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)'
                        : 'grey.400',
                      transform: isLoggedIn ? 'translateY(-2px)' : 'none',
                      boxShadow: isLoggedIn 
                        ? '0 6px 10px 2px rgba(33, 203, 243, .3)'
                        : 'none',
                    },
                    '&:disabled': {
                      color: 'white'
                    }
                  }}
                >
                  {isLoggedIn ? "Proceed to Checkout" : "Login to Checkout"}
                </Button>

                {!isLoggedIn && (
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ mt: 2, textAlign: 'center' }}
                  >
                    Please log in to complete your purchase
                  </Typography>
                )}
              </CardContent>
            </Paper>
          </Fade>
        </Box>
      )}
    </Container>
  )
}