import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "./firebase"
import { getAuth, login } from "../data/loader"
import React from "react"

// Constants for localStorage keys
const STORAGE_KEYS = {
  IS_LOGGED_IN: "isLoggedIn",
  USER_DATA: "userData",
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  USER_ID: "userId",
  LAST_LOGIN: "lastLogin"
} as const

export interface User {
  id: string
  customerId?: string
  firstName?: string
  lastName?: string
  email: string
  phone?: string
  lastLogin?: string
}

function decodeJWT(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT token format');
    }

    const base64Url = parts[1];
    if (!base64Url) {
      throw new Error('Invalid JWT token - missing payload');
    }

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
}

// Check if token is expired
export function isTokenExpired(token: string): boolean {
  try {
    const decoded = decodeJWT(token);
    if (!decoded || !decoded.exp) {
      return true; // If we can't decode or no expiration, consider expired
    }

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
}

// Get token expiration time in milliseconds
export function getTokenExpirationTime(token: string): number | null {
  try {
    const decoded = decodeJWT(token);
    if (!decoded || !decoded.exp) {
      return null;
    }
    return decoded.exp * 1000; // Convert to milliseconds
  } catch (error) {
    console.error('Error getting token expiration time:', error);
    return null;
  }
}

// Token monitoring interval ID
let tokenMonitorInterval: NodeJS.Timeout | null = null;

// Callbacks for token expiration
const tokenExpirationCallbacks: (() => void)[] = [];

// Add callback for token expiration
export function onTokenExpiration(callback: () => void): () => void {
  tokenExpirationCallbacks.push(callback);

  // Return unsubscribe function
  return () => {
    const index = tokenExpirationCallbacks.indexOf(callback);
    if (index > -1) {
      tokenExpirationCallbacks.splice(index, 1);
    }
  };
}

// Notify all callbacks about token expiration
function notifyTokenExpiration() {
  tokenExpirationCallbacks.forEach(callback => {
    try {
      callback();
    } catch (error) {
      console.error('Error in token expiration callback:', error);
    }
  });
}

// Start monitoring token expiration
export function startTokenMonitoring(): void {
  // Clear existing interval if any
  if (tokenMonitorInterval) {
    clearInterval(tokenMonitorInterval);
  }

  // Check token every 30 seconds
  tokenMonitorInterval = setInterval(() => {
    if (!isLocalStorageAvailable()) return;

    const accessToken = getLocalStorage(STORAGE_KEYS.ACCESS_TOKEN);
    const isLoggedIn = getLocalStorage(STORAGE_KEYS.IS_LOGGED_IN) === "true";

    if (isLoggedIn && accessToken) {
      if (isTokenExpired(accessToken)) {
        console.log('Access token expired, logging out...');
        handleTokenExpiration();
      }
    }
  }, 30000); // Check every 30 seconds
}

// Stop monitoring token expiration
export function stopTokenMonitoring(): void {
  if (tokenMonitorInterval) {
    clearInterval(tokenMonitorInterval);
    tokenMonitorInterval = null;
  }
}

// Handle token expiration
async function handleTokenExpiration(): Promise<void> {
  try {
    // First try to refresh the token
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      const newAccessToken = await refreshAuthToken();
      if (newAccessToken) {
        console.log('Token refreshed successfully');
        return;
      }
    }

    // If refresh fails or no refresh token, logout
    console.log('Token refresh failed, logging out user');
    await logoutUser();
    notifyTokenExpiration();
  } catch (error) {
    console.error('Error handling token expiration:', error);
    // Force logout even if there's an error
    await logoutUser();
    notifyTokenExpiration();
  }
}


export function getCustomerIdFromToken(): string | null {
  if (!isLocalStorageAvailable()) return null;

  const accessToken = getLocalStorage(STORAGE_KEYS.ACCESS_TOKEN);
  if (!accessToken) return null;

  const decoded = decodeJWT(accessToken);
  return decoded?.customerId || decoded?.sub || null;
}

interface TokenResponse {
  accessToken: string
  refreshToken: string
  id: string
}

interface RegisterRequest {
  emailId: string
  name: string
  phone: string
  customerUserId: string
  storeUser: boolean
  individual: boolean
  language: string
}

interface RegisterResponse {
  success: boolean
  message: string
  data?: {
    userId: string
    email: string
  }
  error?: string
}

// Helper function to safely store data in localStorage
function setLocalStorage(key: string, value: any): void {
  try {
    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value))
  } catch (error) {
    console.error(`Error storing ${key} in localStorage:`, error)
  }
}

// Helper function to safely get data from localStorage
function getLocalStorage(key: string): any {
  try {
    const item = localStorage.getItem(key)
    return item ? (item.startsWith('{') || item.startsWith('[') ? JSON.parse(item) : item) : null
  } catch (error) {
    console.error(`Error retrieving ${key} from localStorage:`, error)
    return null
  }
}

// Helper function to clear specific keys from localStorage
function clearLocalStorage(keys: string[]): void {
  keys.forEach(key => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error)
    }
  })
}

export async function loginUser(email: string, password: string): Promise<User> {
  try {
    // Step 1: Firebase authentication
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    const firebaseToken = await user.getIdToken()

    if (!user.email) {
      throw new Error('User email is required')
    }

    // Step 2: Get backend tokens using the loader's login function
    const loginData = {
      emailId: user.email
    }

    const customHeaders = {
      "Authorization": `Bearer ${firebaseToken}`,
    }

    const tokenResponse = await login(loginData, customHeaders) as TokenResponse

    // Step 3: Create user data object
    const userData: User = {
      id: tokenResponse.id || user.uid, // Use backend ID if available
      email: user.email,
      firstName: user.displayName?.split(' ')[0],
      lastName: user.displayName?.split(' ')[1],
      lastLogin: new Date().toISOString()
    }

    // Step 4: Store everything in localStorage
    setLocalStorage(STORAGE_KEYS.USER_DATA, userData)
    setLocalStorage(STORAGE_KEYS.IS_LOGGED_IN, "true")
    setLocalStorage(STORAGE_KEYS.ACCESS_TOKEN, tokenResponse.accessToken)
    setLocalStorage(STORAGE_KEYS.REFRESH_TOKEN, tokenResponse.refreshToken)
    setLocalStorage(STORAGE_KEYS.USER_ID, tokenResponse.id)
    setLocalStorage(STORAGE_KEYS.LAST_LOGIN, new Date().toISOString())

    // Start token monitoring
    startTokenMonitoring()

    return userData
  } catch (error: any) {
    console.error("Login error:", error)
    throw new Error(error.code ? `Authentication failed: ${error.message}` : 'Login failed')
  }
}

export async function registerUser(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  phone: string
): Promise<User> {
  try {
    console.log('Starting registration process for:', email)

    // Step 1: Firebase registration
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    console.log('Firebase user created:', user.uid)

    const firebaseToken = await user.getIdToken()
    console.log('Firebase token obtained')

    await updateProfile(user, {
      displayName: `${firstName} ${lastName}`
    })
    console.log('Firebase profile updated')

    // Step 2: Register with backend
    const registerData: RegisterRequest = {
      emailId: email,
      name: `${firstName} ${lastName}`,
      phone,
      customerUserId: user.uid,
      storeUser: true,
      individual: true,
      language: "en"
    }

    const customHeaders = {
      "Authorization": `Bearer ${firebaseToken}`,
    }

    console.log('Sending registration request to backend...')
    const response = await getAuth(registerData, customHeaders) as any
    console.log('Backend registration response:', response)

    // Check if the response has tokens (successful registration)
    if (response && response.accessToken && response.refreshToken && response.id) {
      console.log('Backend registration successful - tokens received')

      // Step 3: Create user data object
      const userData: User = {
        id: response.id,
        firstName,
        lastName,
        email,
        phone,
        lastLogin: new Date().toISOString()
      }

      // Step 4: Store everything in localStorage
      setLocalStorage(STORAGE_KEYS.USER_DATA, userData)
      setLocalStorage(STORAGE_KEYS.IS_LOGGED_IN, "true")
      setLocalStorage(STORAGE_KEYS.ACCESS_TOKEN, response.accessToken)
      setLocalStorage(STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken)
      setLocalStorage(STORAGE_KEYS.USER_ID, response.id)
      setLocalStorage(STORAGE_KEYS.LAST_LOGIN, new Date().toISOString())

      // Start token monitoring
      startTokenMonitoring()

      // Trigger auth state change event for NavBar
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('authStateChanged'))
      }

      console.log('Registration completed successfully')
      return userData
    } else {
      // If response doesn't have tokens, check for error structure
      if (response && response.error) {
        console.error('Backend registration failed:', response.error)
        throw new Error(response.error)
      } else if (response && response.success === false) {
        console.error('Backend registration failed:', response.message)
        throw new Error(response.message || 'Registration failed')
      } else {
        console.error('Unexpected response format:', response)
        throw new Error('Unexpected response from server')
      }
    }
  } catch (error: any) {
    console.error("Registration error:", error)

    // Clear localStorage if there's an error
    clearLocalStorage(Object.values(STORAGE_KEYS))

    if (error.code) {
      const errorMessages: Record<string, string> = {
        'auth/email-already-in-use': 'Email already registered',
        'auth/invalid-email': 'Invalid email format',
        'auth/weak-password': 'Password is too weak (minimum 6 characters)',
        'auth/operation-not-allowed': 'Email/password accounts are not enabled',
        'auth/network-request-failed': 'Network error. Please check your connection'
      }
      throw new Error(errorMessages[error.code] || error.message)
    }

    // Handle API errors
    if (error.message) {
      throw new Error(error.message)
    }

    throw new Error('Registration failed. Please try again.')
  }
}

export async function isUserLoggedIn(): Promise<boolean> {
  const isLoggedIn = getLocalStorage(STORAGE_KEYS.IS_LOGGED_IN) === "true"
  const accessToken = getLocalStorage(STORAGE_KEYS.ACCESS_TOKEN)
  const userData = getLocalStorage(STORAGE_KEYS.USER_DATA)

  // Check if user is logged in and has valid token
  if (!isLoggedIn || !accessToken || !userData) {
    return false
  }

  // Check if token is expired
  if (isTokenExpired(accessToken)) {
    console.log('Token expired during login check, logging out...')
    await logoutUser()
    return false
  }

  return true
}

export function getCurrentUser(): User | null {
  try {
    return getLocalStorage(STORAGE_KEYS.USER_DATA)
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

export function getAccessToken(): string | null {
  return getLocalStorage(STORAGE_KEYS.ACCESS_TOKEN)
}

export function getRefreshToken(): string | null {
  return getLocalStorage(STORAGE_KEYS.REFRESH_TOKEN)
}

export function getUserId(): string | null {
  return getLocalStorage(STORAGE_KEYS.USER_ID)
}

export async function logoutUser(): Promise<void> {
  try {
    // Stop token monitoring
    stopTokenMonitoring();

    await auth.signOut()
    clearLocalStorage(Object.values(STORAGE_KEYS))

    // Trigger auth state change event for NavBar
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('authStateChanged'))
    }
  } catch (error: any) {
    console.error("Logout error:", error)
    throw new Error('Logout failed: ' + error.message)
  }
}

export function onAuthStateChanged(callback: (user: User | null) => void): () => void {
  return auth.onAuthStateChanged((firebaseUser) => {
    if (firebaseUser) {
      // Check if we have user data in localStorage
      const storedUser = getCurrentUser()
      
      if (storedUser) {
        callback(storedUser)
      } else {
        // If no stored user but Firebase is authenticated, create minimal user object
        const user: User = {
          id: getUserId() || firebaseUser.uid,
          email: firebaseUser.email || '',
          firstName: firebaseUser.displayName?.split(' ')[0],
          lastName: firebaseUser.displayName?.split(' ')[1],
          lastLogin: getLocalStorage(STORAGE_KEYS.LAST_LOGIN)
        }
        callback(user)
      }
    } else {
      callback(null)
    }
  })
}

// Utility function to get auth headers for API calls
export function getAuthHeaders(): Record<string, string> {
  const accessToken = getAccessToken()
  return accessToken ? {
    "Authorization": `Bearer ${accessToken}`
  } : {}
}

// Function to refresh token if needed
export async function refreshAuthToken(): Promise<string | null> {
  try {
    const refreshToken = getRefreshToken()
    if (!refreshToken) return null
    
    // Implement your token refresh logic here
    // This would typically call an API endpoint with the refresh token
    // For now, we'll just return the current access token
    
    return getAccessToken()
  } catch (error) {
    console.error("Error refreshing token:", error)
    return null
  }
}

// Function to check if localStorage is available
export function isLocalStorageAvailable(): boolean {
  try {
    const test = '__storage_test__'
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch (e) {
    return false
  }
}

// React hook for handling automatic logout on token expiration
export function useTokenExpiration() {
  if (typeof window === 'undefined') return;

  React.useEffect(() => {
    // Start monitoring when component mounts
    startTokenMonitoring();

    // Add callback for token expiration
    const unsubscribe = onTokenExpiration(() => {
      // Redirect to login page or show notification
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    });

    // Cleanup on unmount
    return () => {
      unsubscribe();
      stopTokenMonitoring();
    };
  }, []);
}

// Initialize token monitoring on app start
export function initializeTokenMonitoring(): void {
  if (typeof window !== 'undefined') {
    // Check if user is logged in and start monitoring
    const isLoggedIn = getLocalStorage(STORAGE_KEYS.IS_LOGGED_IN) === "true";
    const accessToken = getLocalStorage(STORAGE_KEYS.ACCESS_TOKEN);

    if (isLoggedIn && accessToken) {
      startTokenMonitoring();
    }
  }
}