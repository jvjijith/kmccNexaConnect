import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "./firebase"
import { getAuth } from "../data/loader"

export interface User {
  id: string
  firstName?: string
  lastName?: string
  email: string
  phone?: string
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

export async function loginUser(email: string, password: string): Promise<User> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    if (!user.email) {
      throw new Error('User email is required')
    }

    const userData: User = {
      id: user.uid,
      email: user.email,
      firstName: user.displayName?.split(' ')[0],
      lastName: user.displayName?.split(' ')[1],
    }

    localStorage.setItem("isLoggedIn", "true")
    localStorage.setItem("user", JSON.stringify(userData))

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
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    const accessToken = await user.getIdToken()

    console.log("accessToken",accessToken);

    console.log("user",user);

    await updateProfile(user, {
      displayName: `${firstName} ${lastName}`
    })

    const registerData: RegisterRequest = {
      emailId: email,
      name: `${firstName} ${lastName}`,
      phone,
      customerUserId: user.uid,
      storeUser: true,
      individual: true,
      language: "en"
    }

    const userData: User = {
      id: user.uid,
      firstName,
      lastName,
      email,
      phone
    }

    localStorage.setItem("isLoggedIn", "true")
    localStorage.setItem("user", JSON.stringify(userData))

    const customHeaders = {
      "Authorization": `Bearer ${accessToken}`,
    }

    const response = await getAuth(registerData, customHeaders) as RegisterResponse

    if (response.error || !response.success) {
      throw new Error(response.error || response.message || 'Registration failed')
    }

    return userData
  } catch (error: any) {
    console.error("Registration error:", error)
    
    if (error.code) {
      const errorMessages: Record<string, string> = {
        'auth/email-already-in-use': 'Email already registered',
        'auth/invalid-email': 'Invalid email format',
        'auth/weak-password': 'Password is too weak'
      }
      throw new Error(errorMessages[error.code] || error.message)
    }
    throw error
  }
}

export async function isUserLoggedIn(): Promise<boolean> {
  return localStorage.getItem("isLoggedIn") === "true"
}

export function getCurrentUser(): User | null {
  try {
    const userString = localStorage.getItem("user")
    return userString ? JSON.parse(userString) : null
  } catch (error) {
    console.error("Error parsing user data:", error)
    return null
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await auth.signOut()
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("user")
  } catch (error: any) {
    console.error("Logout error:", error)
    throw new Error('Logout failed: ' + error.message)
  }
}

export function onAuthStateChanged(callback: (user: User | null) => void): () => void {
  return auth.onAuthStateChanged((firebaseUser) => {
    if (firebaseUser) {
      const user: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        firstName: firebaseUser.displayName?.split(' ')[0],
        lastName: firebaseUser.displayName?.split(' ')[1],
      }
      callback(user)
    } else {
      callback(null)
    }
  })
}