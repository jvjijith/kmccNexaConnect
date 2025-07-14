"use client"

import { useRouter } from 'next/navigation'
import { CartItem } from "../../src/lib/purchases"

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
  CircularProgress,
  Chip,
  Grid,
  Paper,
  Skeleton
} from '@mui/material'
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingBag as ShoppingBagIcon,
  ShoppingCart as ShoppingCartIcon,
  LocalShipping as ShippingIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material'

interface CartPageUIProps {
  cartItems: CartItem[]
  isLoggedIn: boolean
  calculateTotal: () => string
  calculateTotalWithTax: () => string
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemoveItem: (productId: string) => void
  onCheckout: () => void
  checkoutLoading: boolean
  color?: any
}

export default function CartPageUI({
  cartItems,
  isLoggedIn,
  calculateTotal,
  calculateTotalWithTax,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  checkoutLoading,
  color,
}: CartPageUIProps) {
  const router = useRouter()

  const subtotal = Number.parseFloat(calculateTotal())
  const tax = subtotal * 0.1
  const total = Number.parseFloat(calculateTotalWithTax())

  // Get primary color from theme
  const primaryColor = color?.theme?.palette?.primary?.main || '#1976d2'
  const primaryDark = color?.theme?.palette?.primary?.dark || '#1565c0'

  return (
    <Container maxWidth="lg" sx={{ py: 4, pt: 12 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography
          variant="h3"
          fontWeight="bold"
          sx={{
            mb: 2,
            background: (theme) => `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2
          }}
        >
          <ShoppingCartIcon sx={{ fontSize: 48, color: 'primary.main' }} />
          Your Shopping Cart
        </Typography>
        <Typography variant="h6" color="text.secondary">
          {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
        </Typography>
      </Box>

      {cartItems.length === 0 ? (
        <Paper 
          elevation={3}
          sx={{ 
            p: 6, 
            textAlign: 'center',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            borderRadius: 3
          }}
        >
          <ShoppingBagIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 3 }} />
          <Typography variant="h4" fontWeight="600" sx={{ mb: 2 }}>
            Your cart is empty
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Looks like you haven't added any products to your cart yet.
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Start shopping to fill your cart with amazing products!
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={4}>
          {/* Cart Items */}
          <Grid item xs={12} lg={8}>
            <Card 
              elevation={3}
              sx={{ 
                borderRadius: 3,
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 1) 100%)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <CardHeader 
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <ShoppingBagIcon sx={{ color: primaryColor }} />
                    <Typography variant="h5" fontWeight="bold" sx={{ color: primaryColor }}>
                      Cart Items ({cartItems.length})
                    </Typography>
                  </Box>
                }
                sx={{ 
                  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                  borderBottom: '1px solid #dee2e6'
                }}
              />
              <CardContent sx={{ p: 0 }}>
                {cartItems.map((item, index) => {
                  const price = item.price || 0
                  const itemKey = typeof item.productCode === 'string' ? item.productCode : `item-${index}`

                  return (
                    <Box key={itemKey}>
                      <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: 3,
                        p: 3,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: `rgba(${parseInt(primaryColor.slice(1, 3), 16)}, ${parseInt(primaryColor.slice(3, 5), 16)}, ${parseInt(primaryColor.slice(5, 7), 16)}, 0.02)`,
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                        }
                      }}>
                        {/* Product Image */}
                        <Box sx={{ flexShrink: 0 }}>
                          <Paper 
                            elevation={2}
                            sx={{ 
                              position: 'relative', 
                              height: 120, 
                              width: 120, 
                              borderRadius: 2,
                              overflow: 'hidden',
                              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
                            }}
                          >
                            {item.images && item.images.length > 0 && typeof item.images[0] === 'string' ? (
                              <img
                                src={item.images[0]}
                                alt={item.name}
                                style={{ 
                                  width: '100%', 
                                  height: '100%', 
                                  objectFit: 'cover',
                                  transition: 'transform 0.3s ease'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                              />
                            ) : (
                              <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                                width: '100%'
                              }}>
                                <ShoppingBagIcon sx={{ fontSize: 40, color: 'grey.400' }} />
                              </Box>
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
                              color: primaryColor,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {item.name}
                          </Typography>
                          
                          {item.brand && (
                            <Chip
                              label={typeof item.brand === 'string' ? item.brand : item.brand.name}
                              size="small"
                              sx={{
                                mb: 1,
                                mr: 1,
                                backgroundColor: `${primaryColor}20`,
                                color: primaryColor
                              }}
                            />
                          )}

                          {item.category && (
                            <Chip
                              label={typeof item.category === 'string' ? item.category : item.category.name}
                              size="small"
                              variant="outlined"
                              sx={{
                                mb: 1,
                                borderColor: primaryColor,
                                color: primaryColor
                              }}
                            />
                          )}

                          {/* Quantity Controls */}
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            mt: 2,
                            flexWrap: 'wrap',
                            gap: 2
                          }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <IconButton
                                size="small"
                                onClick={() => onUpdateQuantity(item.productCode, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                sx={{
                                  backgroundColor: 'rgba(25, 118, 210, 0.1)',
                                  '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.2)' }
                                }}
                              >
                                <RemoveIcon fontSize="small" />
                              </IconButton>
                              
                              <Paper 
                                elevation={1}
                                sx={{ 
                                  px: 2, 
                                  py: 1, 
                                  minWidth: 60, 
                                  textAlign: 'center',
                                  backgroundColor: '#f8f9fa'
                                }}
                              >
                                <Typography fontWeight="600">{item.quantity}</Typography>
                              </Paper>
                              
                              <IconButton
                                size="small"
                                onClick={() => onUpdateQuantity(item.productCode, item.quantity + 1)}
                                sx={{
                                  backgroundColor: 'rgba(25, 118, 210, 0.1)',
                                  '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.2)' }
                                }}
                              >
                                <AddIcon fontSize="small" />
                              </IconButton>
                            </Box>

                            <IconButton
                              onClick={() => onRemoveItem(item.productCode)}
                              color="error"
                              sx={{
                                backgroundColor: 'rgba(244, 67, 54, 0.1)',
                                '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.2)' }
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </Box>

                        {/* Price */}
                        <Box sx={{ textAlign: 'right', minWidth: 120 }}>
                          <Typography variant="h6" fontWeight="bold" color="primary">
                            ${price.toFixed(2)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            per item
                          </Typography>
                          <Divider sx={{ my: 1 }} />
                          <Typography variant="h6" fontWeight="bold">
                            ${(price * item.quantity).toFixed(2)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            total
                          </Typography>
                        </Box>
                      </Box>
                      
                      {index < cartItems.length - 1 && <Divider />}
                    </Box>
                  )
                })}
              </CardContent>
            </Card>
          </Grid>

          {/* Order Summary */}
          <Grid item xs={12} lg={4}>
            <Card
              elevation={3}
              sx={{
                borderRadius: 3,
                background: `linear-gradient(135deg, ${primaryColor}08 0%, rgba(255, 255, 255, 1) 100%)`,
                border: `1px solid ${primaryColor}20`,
                position: 'sticky',
                top: 20
              }}
            >
              <CardHeader
                title={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <ReceiptIcon sx={{ color: primaryColor }} />
                    <Typography variant="h5" fontWeight="bold">
                      Order Summary
                    </Typography>
                  </Box>
                }
                sx={{
                  background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryDark} 100%)`,
                  color: 'white',
                  '& .MuiCardHeader-title': { color: 'white' }
                }}
              />
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ '& > *:not(:last-child)': { mb: 3 } }}>
                  {/* Subtotal */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body1">Subtotal ({cartItems.length} items)</Typography>
                    <Typography variant="h6" fontWeight="600">${subtotal.toFixed(2)}</Typography>
                  </Box>
                  
                  {/* Shipping */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ShippingIcon sx={{ fontSize: 20, color: '#4caf50' }} />
                      <Typography variant="body1">Shipping</Typography>
                    </Box>
                    <Chip 
                      label="FREE" 
                      size="small" 
                      sx={{ 
                        backgroundColor: '#4caf50', 
                        color: 'white',
                        fontWeight: 'bold'
                      }} 
                    />
                  </Box>
                  
                  {/* Tax */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body1">Tax (10%)</Typography>
                    <Typography variant="body1" fontWeight="500">${tax.toFixed(2)}</Typography>
                  </Box>
                  
                  <Divider sx={{ borderStyle: 'dashed' }} />
                  
                  {/* Total */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    p: 2,
                    backgroundColor: `rgba(${parseInt(primaryColor.slice(1, 3), 16)}, ${parseInt(primaryColor.slice(3, 5), 16)}, ${parseInt(primaryColor.slice(5, 7), 16)}, 0.05)`,
                    borderRadius: 2,
                    border: `1px solid rgba(${parseInt(primaryColor.slice(1, 3), 16)}, ${parseInt(primaryColor.slice(3, 5), 16)}, ${parseInt(primaryColor.slice(5, 7), 16)}, 0.1)`
                  }}>
                    <Typography variant="h6" fontWeight="bold">Total</Typography>
                    <Typography variant="h5" fontWeight="bold" color="primary">
                      ${total.toFixed(2)}
                    </Typography>
                  </Box>
                </Box>

                {/* Checkout Button */}
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={onCheckout}
                  disabled={checkoutLoading || !isLoggedIn}
                  sx={{
                    mt: 3,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    borderRadius: 2,
                    background: checkoutLoading
                      ? 'linear-gradient(45deg, #ccc 30%, #999 90%)'
                      : `linear-gradient(45deg, ${primaryColor} 30%, ${primaryDark} 90%)`,
                    boxShadow: `0 3px 5px 2px ${primaryColor}50`,
                    '&:hover': {
                      background: checkoutLoading
                        ? 'linear-gradient(45deg, #ccc 30%, #999 90%)'
                        : `linear-gradient(45deg, ${primaryDark} 30%, ${color?.theme?.palette?.primary?.darker || '#0d47a1'} 90%)`,
                      transform: checkoutLoading ? 'none' : 'translateY(-2px)',
                      boxShadow: checkoutLoading
                        ? `0 3px 5px 2px ${primaryColor}50`
                        : `0 6px 10px 4px ${primaryColor}50`
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  {checkoutLoading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <CircularProgress size={20} sx={{ color: 'white' }} />
                      Processing...
                    </Box>
                  ) : (
                    isLoggedIn ? "Proceed to Checkout" : "Login to Checkout"
                  )}
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

                {/* Security Notice */}
                <Box sx={{ 
                  mt: 3, 
                  p: 2, 
                  backgroundColor: 'rgba(76, 175, 80, 0.05)',
                  borderRadius: 2,
                  border: '1px solid rgba(76, 175, 80, 0.2)'
                }}>
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                    🔒 Secure checkout with 256-bit SSL encryption
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  )
}