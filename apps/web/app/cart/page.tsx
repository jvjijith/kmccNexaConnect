"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CartItem, getPurchasedItems } from "../../src/lib/purchases"
import CartPageUI from "./cartUI"
import { isUserLoggedIn } from "../../src/lib/auth"
import { getCart, addToCart, updateCart, removeFromCart as removeCartItem, clearCart as clearCartItems } from "../../src/data/loader"
import { useSession, SessionProvider } from "next-auth/react"

function CartPageContent() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { data: session } = useSession()

  // Get cart items from API
  async function fetchCartItems(): Promise<CartItem[]> {
    if (!session?.accessToken) return []
    
    try {
      const headers = {
        Authorization: `Bearer ${session.accessToken}`
      }
      const response = await getCart(headers)
      return response.items || []
    } catch (error) {
      console.error("Error fetching cart:", error)
      return []
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
        productCode: productId,
        quantity
      }

      await updateCart(data, headers)
      return await fetchCartItems()
    } catch (error) {
      console.error("Error updating cart:", error)
      return cartItems
    }
  }

  // Remove item from cart
  async function removeFromCart(productId: string): Promise<CartItem[]> {
    if (!session?.accessToken) return cartItems

    try {
      const headers = {
        Authorization: `Bearer ${session.accessToken}`
      }
      
      const data = {
        productCode: productId
      }

      await removeCartItem(data, headers)
      return await fetchCartItems()
    } catch (error) {
      console.error("Error removing item:", error)
      return cartItems
    }
  }

  // Clear cart
  async function clearCart(): Promise<CartItem[]> {
    if (!session?.accessToken) return cartItems

    try {
      const headers = {
        Authorization: `Bearer ${session.accessToken}`
      }

      await clearCartItems(headers)
      return []
    } catch (error) {
      console.error("Error clearing cart:", error)
      return cartItems
    }
  }

  function calculateCartTotal(cartItems: CartItem[]): string {
    return cartItems
      .reduce((total, item) => {
        const price = item.stock > 100 ? 99.99 : item.stock > 50 ? 49.99 : 19.99
        return total + price * item.quantity
      }, 0)
      .toFixed(2)
  }

  useEffect(() => {
    async function loadData() {
      try {
        const items = await fetchCartItems()
        setCartItems(items)
      } catch (error) {
        console.error("Error loading cart data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [session]) // Re-fetch when session changes

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    try {
      const updatedCart = await updateCartItemQuantity(productId, quantity)
      setCartItems(updatedCart)
    } catch (error) {
      console.error("Error updating quantity:", error)
    }
  }

  const handleRemoveItem = async (productId: string) => {
    try {
      const updatedCart = await removeFromCart(productId)
      setCartItems(updatedCart)
    } catch (error) {
      console.error("Error removing item:", error)
    }
  }

  const handleCheckout = async () => {
    if (!session) {
      router.push("/login")
      return
    }

    try {
      // Add checkout logic here
      alert("Checkout process would start here!")

      // Clear cart after successful checkout
      const emptyCart = await clearCart()
      setCartItems(emptyCart)
    } catch (error) {
      console.error("Error during checkout:", error)
    }
  }

  if (loading) {
    return <div className="container mx-auto py-8 px-4">Loading cart...</div>
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