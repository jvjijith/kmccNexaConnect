"use client"

// Force dynamic rendering to prevent build timeouts
export const dynamic = 'force-dynamic'

import { useState, useEffect } from "react"
import { Container, Box, Typography, CircularProgress, ThemeProvider } from "@mui/material"
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { SessionProvider } from "next-auth/react"
import { getCart, updateCart, removeFromCart, createCartPayment, createSalesInvoice, getColor } from "../../src/data/loader"
import { createDynamicTheme } from "@repo/ui/theme"
import CartPageUI from "./cartUI"
import { CartItem } from "../../src/lib/purchases"

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

function CartPageContent() {
  const { data: session } = useSession()
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [color, setColor] = useState<any>(null)
  const [colorLoading, setColorLoading] = useState(true)

  // Color system integration - fetch colors on component mount
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

  // Get cart items from API
  async function fetchCartItems(): Promise<CartItem[]> {
    try {
      if (!session?.accessToken) {
        console.log("No access token available")
        return []
      }

      const headers = {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json'
      }

      console.log("Fetching cart with headers:", {
        hasAuth: !!headers.Authorization,
        authFormat: headers.Authorization.substring(0, 20) + "..."
      })

      const cartResponse = await getCart(headers)
      console.log("Cart response:", cartResponse)

      if (!cartResponse?.items || !Array.isArray(cartResponse.items)) {
        console.log("No cart items found or invalid format")
        return []
      }

      // Map cart items using the product details already included in the response
      const cartItemsWithDetails = cartResponse.items.map((item: any) => {
        const product = item.product
        
        return {
          id: item._id,
          productCode: product._id,
          name: product.name,
          brand: typeof product.brand === 'string' ? product.brand : product.brand?.name || '',
          model: product.model || '',
          price: item.price || 0,
          quantity: item.quantity || 1,
          image: product.images?.[0]?.url || '',
          description: product.description || '',
          category: typeof product.category === 'string' ? product.category : product.category?.name || '',
          subCategory: typeof product.subCategory === 'string' ? product.subCategory : product.subCategory?.name || '',
          stock: product.stock || 0,
          images: product.images?.map((img: any) => img.url) || [],
          HSN: product.HSN || '',
          RFQ: product.RFQ || false,
          notes: product.notes || [],
          variants: product.variants || [],
          active: product.active || false,
          created_at: product.created_at,
          updated_at: product.updated_at
        }
      })

      console.log("Cart items with product details:", cartItemsWithDetails)
      return cartItemsWithDetails

    } catch (error) {
      console.error("Error fetching cart items:", error)
      throw error
    }
  }

  // Update cart item quantity
  async function updateCartItemQuantity(productId: string, quantity: number): Promise<CartItem[]> {
    if (!session?.accessToken || quantity < 1) return cartItems

    try {
      const headers = {
        Authorization: `Bearer ${session.accessToken}`
      }

      const data = {
        productId: productId,
        quantity: quantity
      }

      console.log("Updating cart item:", data)
      await updateCart(data, headers)
      
      // Refresh cart items
      const updatedItems = await fetchCartItems()
      return updatedItems
    } catch (error) {
      console.error("Error updating cart:", error)
      return cartItems
    }
  }

  // Remove item from cart
  async function removeFromCartById(productId: string): Promise<CartItem[]> {
    if (!session?.accessToken) return cartItems

    try {
      const headers = {
        Authorization: `Bearer ${session.accessToken}`
      }

      const data = {
        productId: productId
      }

      console.log("Removing cart item:", data)
      await removeFromCart(data, headers)
      
      // Refresh cart items
      const updatedItems = await fetchCartItems()
      return updatedItems
    } catch (error) {
      console.error("Error removing item:", error)
      return cartItems
    }
  }

  function calculateCartTotal(cartItems: CartItem[]): string {
    return cartItems
      .reduce((total, item) => {
        const price = item.price || 0
        return total + price * item.quantity
      }, 0)
      .toFixed(2)
  }

  function calculateTotalWithTax(cartItems: CartItem[]): string {
    const subtotal = Number.parseFloat(calculateCartTotal(cartItems))
    return (subtotal * 1.1).toFixed(2) // 10% tax
  }

  useEffect(() => {
    async function loadData() {
      console.log("Loading cart data...")
      console.log("Session:", session)
      setLoading(true)
      try {
        const items = await fetchCartItems()
        console.log("Setting cart items:", items)
        setCartItems(items)
      } catch (error) {
        console.error("Error loading cart data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (session) {
      loadData()
    } else {
      console.log("No session, not loading cart")
      setLoading(false)
    }
  }, [session])

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    const updatedItems = await updateCartItemQuantity(productId, quantity)
    setCartItems(updatedItems)
  }

  const handleRemoveItem = async (productId: string) => {
    const updatedItems = await removeFromCartById(productId)
    setCartItems(updatedItems)
  }

  const handleCheckout = async () => {
    try {
      setCheckoutLoading(true)

      if (!session?.accessToken) {
        alert("Please log in to proceed with checkout")
        router.push("/auth/signin")
        return
      }

      if (cartItems.length === 0) {
        alert("Your cart is empty")
        return
      }

      console.log("Starting checkout process...")
      console.log("Cart items for checkout:", cartItems)

      const headers = {
        'Authorization': `Bearer ${session.accessToken}`,
        'Content-Type': 'application/json'
      }

      // Create payment session for the cart
      console.log("Creating cart payment...")
      const paymentResponse = await createCartPayment(headers)
      console.log("Payment response:", paymentResponse)

      if (paymentResponse && typeof paymentResponse === 'object' && 'url' in paymentResponse) {
        console.log("Redirecting to payment URL:", paymentResponse.url)
        // Redirect to the payment URL
        window.location.href = paymentResponse.url as string
      } else {
        console.error("No payment URL received:", paymentResponse)
        alert("Failed to create payment session. Please try again.")
      }

    } catch (error) {
      console.error("Checkout error:", error)
      alert("Failed to process checkout. Please try again.")
    } finally {
      setCheckoutLoading(false)
    }
  }

  // Show loading state while colors are being fetched
  if (colorLoading) {
    return (
      <Container 
        maxWidth="lg" 
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
            Loading cart application...
          </Typography>
        </Box>
      </Container>
    )
  }

  if (loading) {
    return (
      <ThemeProvider theme={createDynamicTheme(color || {})}>
        <Container 
          maxWidth="lg" 
          sx={{ 
            py: 4, 
            pt: 12, // Add top padding to avoid navbar overlap
            minHeight: "100vh", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Box sx={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: `linear-gradient(45deg, ${color?.theme?.palette?.primary?.main || '#1976d2'} 30%, ${color?.theme?.palette?.primary?.dark || '#1565c0'} 90%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 3rem',
              boxShadow: `0 8px 32px ${color?.theme?.palette?.primary?.main || '#1976d2'}30`,
              animation: 'pulse 2s infinite'
            }}>
              <ShoppingCartIcon sx={{ fontSize: 60, color: 'white' }} />
            </Box>
            <CircularProgress 
              size={60} 
              sx={{ 
                mb: 3,
                color: color?.theme?.palette?.primary?.main || '#1976d2',
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round',
                }
              }} 
            />
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: color?.theme?.palette?.primary?.main || '#1976d2' }}>
              Loading your cart...
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Please wait while we fetch your items
            </Typography>
          </Box>
          <style jsx>{`
            @keyframes pulse {
              0% {
                transform: scale(1);
                box-shadow: 0 8px 32px ${color?.theme?.palette?.primary?.main || '#1976d2'}30;
              }
              50% {
                transform: scale(1.05);
                box-shadow: 0 12px 40px ${color?.theme?.palette?.primary?.main || '#1976d2'}40;
              }
              100% {
                transform: scale(1);
                box-shadow: 0 8px 32px ${color?.theme?.palette?.primary?.main || '#1976d2'}30;
              }
            }
          `}</style>
        </Container>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider theme={createDynamicTheme(color || {})}>
      <CartPageUI
        cartItems={cartItems}
        isLoggedIn={!!session}
        calculateTotal={() => calculateCartTotal(cartItems)}
        calculateTotalWithTax={() => calculateTotalWithTax(cartItems)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
        checkoutLoading={checkoutLoading}
        color={color}
      />
    </ThemeProvider>
  )
}

// Wrap the page with SessionProvider
export default function CartPageData() {
  return (
    <SessionProvider>
      <CartPageContent />
    </SessionProvider>
  )
}