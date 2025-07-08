"use client"

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { getCart, addToCart } from '../../src/data/loader'

export default function CartTestPage() {
  const { data: session } = useSession()
  const [cartData, setCartData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testCartAPI = async () => {
    if (!session?.accessToken) {
      setError("No session or access token")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const headers = {
        Authorization: `Bearer ${session.accessToken}`
      }
      console.log("Testing cart API with headers:", headers)
      const response = await getCart(headers)
      console.log("Cart API response:", response)
      setCartData(response)
    } catch (err) {
      console.error("Cart API error:", err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const addTestItem = async () => {
    if (!session?.accessToken) {
      setError("No session or access token")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const headers = {
        Authorization: `Bearer ${session.accessToken}`
      }
      
      // Add a test item to cart
      const testItem = {
        product: "TEST_PRODUCT_001",
        quantity: 1,
        price: 99.99,
        notes: "Test item added from cart test page"
      }
      
      console.log("Adding test item to cart:", testItem)
      const addResponse = await addToCart(testItem, headers)
      console.log("Add to cart response:", addResponse)
      
      // Then fetch the cart to see the updated data
      const cartResponse = await getCart(headers)
      console.log("Updated cart:", cartResponse)
      setCartData(cartResponse)
    } catch (err) {
      console.error("Add to cart error:", err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Cart API Test</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <p><strong>Session Status:</strong> {session ? 'Logged in' : 'Not logged in'}</p>
        {session && (
          <div>
            <p><strong>User:</strong> {session.user?.email}</p>
            <p><strong>User ID:</strong> {session.user?.id}</p>
            <p><strong>Access Token:</strong> {session.accessToken ? 'Present' : 'Missing'}</p>
            <p><strong>Token Length:</strong> {session.accessToken?.length || 0}</p>
            <details>
              <summary>Full Session Object</summary>
              <pre style={{ fontSize: '12px', background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
                {JSON.stringify(session, null, 2)}
              </pre>
            </details>
          </div>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testCartAPI} 
          disabled={!session || loading}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginRight: '10px'
          }}
        >
          {loading ? 'Testing...' : 'Get Cart'}
        </button>

        <button 
          onClick={addTestItem} 
          disabled={!session || loading}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#28a745', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Adding...' : 'Add Test Item'}
        </button>
      </div>

      {error && (
        <div style={{ 
          marginTop: '20px', 
          padding: '10px', 
          backgroundColor: '#f8d7da', 
          color: '#721c24', 
          border: '1px solid #f5c6cb',
          borderRadius: '4px'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {cartData && (
        <div style={{ 
          marginTop: '20px', 
          padding: '10px', 
          backgroundColor: '#d4edda', 
          color: '#155724', 
          border: '1px solid #c3e6cb',
          borderRadius: '4px'
        }}>
          <strong>Cart Data:</strong>
          <pre style={{ marginTop: '10px', fontSize: '12px', maxHeight: '400px', overflow: 'auto' }}>
            {JSON.stringify(cartData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}