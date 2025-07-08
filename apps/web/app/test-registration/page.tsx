"use client"

import { useState } from "react"

export default function TestRegistration() {
  const [result, setResult] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const testRegistration = async () => {
    setLoading(true)
    setResult("")
    
    try {
      // Test API connectivity first
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '',
        }
      })
      
      if (response.ok) {
        setResult("✅ API is reachable")
      } else {
        setResult(`❌ API returned status: ${response.status}`)
      }
    } catch (error: any) {
      setResult(`❌ API connection failed: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Registration Test Page</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Environment Variables:</h3>
        <p><strong>API Base URL:</strong> {process.env.NEXT_PUBLIC_API_BASE_URL || 'Not set'}</p>
        <p><strong>API Key:</strong> {process.env.NEXT_PUBLIC_API_KEY ? 'Set' : 'Not set'}</p>
        <p><strong>Firebase Project ID:</strong> {process.env.NEXT_PUBLIC_FB_PROJECT_ID || 'Not set'}</p>
      </div>

      <button 
        onClick={testRegistration} 
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Testing...' : 'Test API Connection'}
      </button>

      {result && (
        <div style={{ 
          marginTop: '20px', 
          padding: '10px', 
          backgroundColor: result.includes('✅') ? '#d4edda' : '#f8d7da',
          border: `1px solid ${result.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '4px'
        }}>
          {result}
        </div>
      )}

      <div style={{ marginTop: '30px' }}>
        <h3>Next Steps:</h3>
        <ol>
          <li>Test API connection above</li>
          <li>If API is reachable, go to <a href="/register">/register</a> to test registration</li>
          <li>Check browser console for detailed logs during registration</li>
        </ol>
      </div>
    </div>
  )
}