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
  Container
} from '@mui/material'
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingBag as ShoppingBagIcon
} from '@mui/icons-material'

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
  console.log("cartItems",cartItems)
  return (
    <Container sx={{ py: 8, px: 4 }}>
      <Typography variant="h3" fontWeight="bold" sx={{ mb: 6 }}>
        Your Shopping Cart
      </Typography>

      {cartItems.length === 0 ? (
        <Card sx={{ width: '100%' }}>
          <CardContent sx={{ 
            pt: 6, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            minHeight: '300px'
          }}>
            <ShoppingBagIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 4 }} />
            <Typography variant="h5" fontWeight="600" sx={{ mb: 2 }}>
              Your cart is empty
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 6 }}>
              Looks like you haven't added any products to your cart yet.
            </Typography>
            <Button variant="contained" onClick={() => router.push('/products')}>
              Browse Products
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { md: '2fr 1fr' }, 
          gap: 6 
        }}>
          <Card>
            <CardHeader 
              title={`Cart Items (${cartItems.length})`}
            />
            <CardContent sx={{ '& > *:not(:last-child)': { mb: 4 } }}>
              {cartItems.map((item, index) => {
                const price = item.price || 0 // Use actual price from API
                const itemKey = typeof item.productCode === 'string' ? item.productCode : `item-${index}`

                return (
                  <Box key={itemKey} sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 4,
                    py: 4
                  }}>
                    <Box sx={{ flexShrink: 0 }}>
                      <Box sx={{ 
                        position: 'relative', 
                        height: 96, 
                        width: 96, 
                        borderRadius: 1,
                        overflow: 'hidden',
                        bgcolor: 'grey.100'
                      }}>
                        {item.images && item.images.length > 0 && typeof item.images[0] === 'string' ? (
                          <img
                            src={item.images[0]}
                            alt={item.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
                            <ShoppingBagIcon sx={{ fontSize: 32, color: 'grey.400' }} />
                          </Box>
                        )}
                      </Box>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography fontWeight="500" sx={{ mb: 2 }}>{item.name}</Typography>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        mt: 2 
                      }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <IconButton
                            size="small"
                            onClick={() => onUpdateQuantity(item.productCode, item.quantity - 1)}
                          >
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                          <Typography fontWeight="500">Qty: {item.quantity}</Typography>
                          <IconButton
                            size="small"
                            onClick={() => onUpdateQuantity(item.productCode, item.quantity + 1)}
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Box>
                        <IconButton
                          size="small"
                          onClick={() => onRemoveItem(item.productCode)}
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography fontWeight="500">${price.toFixed(2)}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total: ${(price * item.quantity).toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                )
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader title="Order Summary" />
            <CardContent>
              <Box sx={{ '& > *:not(:last-child)': { mb: 4 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Subtotal</Typography>
                  <Typography>${calculateTotal()}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Shipping</Typography>
                  <Typography>Free</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Tax</Typography>
                  <Typography>
                    ${(Number.parseFloat(calculateTotal()) * 0.1).toFixed(2)}
                  </Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography fontWeight="500">Total</Typography>
                  <Typography fontWeight="500">
                    ${(Number.parseFloat(calculateTotal()) * 1.1).toFixed(2)}
                  </Typography>
                </Box>
              </Box>
              <Button 
                variant="contained" 
                fullWidth 
                onClick={onCheckout}
                sx={{ mt: 4 }}
              >
                {isLoggedIn ? "Checkout" : "Login to Checkout"}
              </Button>
            </CardContent>
          </Card>
        </Box>
      )}
    </Container>
  )
}