"use client"

// Force dynamic rendering to prevent build timeouts
export const dynamic = 'force-dynamic'

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { SessionProvider } from "next-auth/react"
import { getCart, updateCart, removeFromCart, createCartPayment } from "../../src/data/loader"
import CartPageUI from "./cartUI"
import { CartItem } from "../../src/lib/purchases"

function CartPageContent() {
  const { data: session } = useSession()
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

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

      if (paymentResponse && typeof paymentResponse === 'object' && 'paymentUrl' in paymentResponse) {
        console.log("Redirecting to payment URL:", paymentResponse.paymentUrl)
        // Redirect to the payment URL
        window.location.href = paymentResponse.paymentUrl as string
      } else {
        console.error("No payment URL received:", paymentResponse)
        alert("Failed to create payment session. Please try again.")
      }

    } catch (error) {
      console.error("Checkout error:", error)
      alert("Failed to process checkout. Please try again.")
    }
  }

  if (loading) {
    return <div>Loading cart...</div>
  }

  return (
    <CartPageUI
      cartItems={cartItems}
      isLoggedIn={!!session}
      calculateTotal={() => calculateCartTotal(cartItems)}
      onUpdateQuantity={handleUpdateQuantity}
      onRemoveItem={handleRemoveItem}
      onCheckout={handleCheckout}
    />
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