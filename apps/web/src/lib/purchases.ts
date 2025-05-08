import type { Event } from "../../types/event"
import type { Product } from "../../types/product"

export type CartItem = Product & { quantity: number }

// Get cart items
export async function getCartItems(): Promise<CartItem[]> {
  // In a real app, this would make an API call to get the cart items
  // For demo purposes, we'll just get from localStorage

  const cartData = localStorage.getItem("cart")
  if (!cartData) {
    return []
  }

  return JSON.parse(cartData)
}

// Get purchased items
export async function getPurchasedItems(): Promise<CartItem[]> {
  // In a real app, this would make an API call to get the purchased items
  // For demo purposes, we'll just get from localStorage

  const purchasedData = localStorage.getItem("purchasedItems")
  if (!purchasedData) {
    return []
  }

  return JSON.parse(purchasedData)
}

// Add purchased items
export async function addPurchasedItems(items: CartItem[]): Promise<CartItem[]> {
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

// Add booked event
export async function addBookedEvent(event: Event): Promise<Event[]> {
  const currentEvents = await getBookedEvents()

  const updatedEvents = [...currentEvents, event]

  // Save to localStorage
  localStorage.setItem("bookedEvents", JSON.stringify(updatedEvents))

  return updatedEvents
}

