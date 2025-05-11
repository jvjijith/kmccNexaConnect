// app/api/auth/[...nextauth]/options.ts
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../../../../src/lib/firebase"
import { login } from "../../../../src/data/loader"
import { AuthResponse } from "../../../../types/api"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required")
        }
        
        try {
          // Firebase Authentication
          const userCredential = await signInWithEmailAndPassword(
            auth,
            credentials.email,
            credentials.password
          )
          
          const user = userCredential.user
          const firebaseToken = await user.getIdToken()

          // Get backend tokens
          const loginData = {
            emailId: credentials.email
          }

          const customHeaders = {
            "Authorization": `Bearer ${firebaseToken}`
          }

          const tokenResponse = await login(loginData, customHeaders) as AuthResponse

          if (!user || !user.email) {
            throw new Error("No user found")
          }
          
          return {
            id: user.uid,
            email: user.email,
            name: user.displayName || user.email,
            accessToken: tokenResponse.accessToken,
            refreshToken: tokenResponse.refreshToken
          }
        } catch (error) {
          console.error("NextAuth credentials error:", error)
          throw new Error("Authentication failed")
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken
        }
      }
      return token
    },
    async session({ session, token }) {
      return {
        ...session,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        user: {
          ...session.user,
          id: token.id
        }
      }
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error"
  }
}