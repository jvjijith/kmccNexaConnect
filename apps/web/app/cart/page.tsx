"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CartItem, getPurchasedItems } from "../../src/lib/purchases"
import CartPageUI from "./cartUI"
import { isUserLoggedIn } from "../../src/lib/auth"

async function getCartItems(): Promise<CartItem[]> {
    // In a real app, this would make an API call to get the cart items
    // For demo purposes, we'll just get from localStorage
  
    const cartData = localStorage.getItem("cart")
    if (!cartData) {
      return []
    }
  
    return JSON.parse(cartData)
  }

  async function updateCartItemQuantity(productId: string, quantity: number): Promise<CartItem[]> {
    if (quantity < 1) {
      return getCartItems()
    }
  
    const currentCart = await getCartItems()
  
    const updatedCart = currentCart.map((item) => (item.productCode === productId ? { ...item, quantity } : item))
  
    // Save to localStorage
    localStorage.setItem("cart", JSON.stringify(updatedCart))
  
    return updatedCart
  }

  async function removeFromCart(productId: string): Promise<CartItem[]> {
    const currentCart = await getCartItems()
  
    const updatedCart = currentCart.filter((item) => item.productCode !== productId)
  
    // Save to localStorage
    localStorage.setItem("cart", JSON.stringify(updatedCart))
  
    return updatedCart
  }

  async function clearCart(): Promise<CartItem[]> {
    // Save to localStorage
    localStorage.setItem("cart", JSON.stringify([]))
  
    return []
  }

  function calculateCartTotal(cartItems: CartItem[]): string {
    return cartItems
      .reduce((total, item) => {
        // Using a mock price since the product schema doesn't include price
        const price = item.stock > 100 ? 99.99 : item.stock > 50 ? 49.99 : 19.99
        return total + price * item.quantity
      }, 0)
      .toFixed(2)
  }

  async function addPurchasedItems(items: CartItem[]): Promise<CartItem[]> {
    const currentPurchases = await getPurchasedItems()
  
    const updatedPurchases = [...currentPurchases, ...items]
  
    // Save to localStorage
    localStorage.setItem("purchasedItems", JSON.stringify(updatedPurchases))
  
    return updatedPurchases
  }
  
  // Get booked events
  export async function getBookedEvents(): Promise<Event[]> {
    // In a real app, this would make an API call to get the booked events
    // For demo purposes, we'll just get from localStorage
  
    const bookedData = localStorage.getItem("bookedEvents")
    if (!bookedData) {
      return []
    }
  
    return JSON.parse(bookedData)
  }

export default function CartPageData() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function loadData() {
      try {
        const [items, loggedIn] = await Promise.all([getCartItems(), isUserLoggedIn()])

        setCartItems(items)
        setIsLoggedIn(loggedIn)
      } catch (error) {
        console.error("Error loading cart data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

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
    if (!isLoggedIn) {
      router.push("/login")
      return
    }

    try {
      // In a real app, you would process the checkout here
      alert("Checkout process would start here!")

      // Add these items to purchased items
      await addPurchasedItems(cartItems)

      // Clear cart
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
      isLoggedIn={isLoggedIn}
      calculateTotal={() => calculateCartTotal(cartItems)}
      onUpdateQuantity={handleUpdateQuantity}
      onRemoveItem={handleRemoveItem}
      onCheckout={handleCheckout}
    />
  )
}

