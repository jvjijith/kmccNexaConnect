"use client"

import type React from "react"
import { useState } from "react"
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  IconButton,
  InputAdornment,
  Link as MuiLink,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from "@mui/material"
import { Visibility, VisibilityOff, Close } from "@mui/icons-material"
import { useRouter } from 'next/navigation'

interface LoginPageUIProps {
  email: string
  setEmail: (email: string) => void
  password: string
  setPassword: (password: string) => void
  showPassword: boolean
  toggleShowPassword: () => void
  loading: boolean
  error: string | null
  handleSubmit: (e: React.FormEvent) => void
  onForgotPassword?: (email: string) => Promise<void>
}

export default function LoginPageUI({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  toggleShowPassword,
  loading,
  error,
  handleSubmit,
  onForgotPassword,
}: LoginPageUIProps) {
  const router = useRouter()
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("")
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false)
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!forgotPasswordEmail.trim()) {
      setForgotPasswordMessage({
        type: 'error',
        text: 'Please enter your email address'
      })
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotPasswordEmail)) {
      setForgotPasswordMessage({
        type: 'error',
        text: 'Please enter a valid email address'
      })
      return
    }

    if (!onForgotPassword) {
      setForgotPasswordMessage({
        type: 'error',
        text: 'Forgot password functionality is not available'
      })
      return
    }

    setForgotPasswordLoading(true)
    setForgotPasswordMessage(null)

    try {
      await onForgotPassword(forgotPasswordEmail)
      setForgotPasswordMessage({
        type: 'success',
        text: 'Password reset email sent! Please check your inbox.'
      })
      // Clear the email field after successful submission
      setForgotPasswordEmail("")
    } catch (error: any) {
      setForgotPasswordMessage({
        type: 'error',
        text: error.message || 'Failed to send password reset email'
      })
    } finally {
      setForgotPasswordLoading(false)
    }
  }

  const handleCloseForgotPassword = () => {
    setShowForgotPassword(false)
    setForgotPasswordEmail("")
    setForgotPasswordMessage(null)
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        bgcolor: "grey.50"
      }}
    >
      <Container maxWidth="sm">
        <Card sx={{ width: "100%", maxWidth: "md" }}>
          <CardContent sx={{ p: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4, textAlign: "center" }}>
              <Typography variant="h4" component="h1" sx={{ mb: 1, fontWeight: 700 }}>
                Login
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Enter your email and password to access your account
              </Typography>
            </Box>

            {/* Error Message */}
            {error && (
              <Box
                sx={{
                  bgcolor: "error.light",
                  color: "error.main",
                  p: 1.5,
                  borderRadius: 1,
                  mb: 3,
                  fontSize: "0.875rem"
                }}
              >
                {error}
              </Box>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <Box sx={{ mb: 3 }}>
                <Typography
                  component="label"
                  htmlFor="email"
                  sx={{
                    display: "block",
                    mb: 1,
                    fontSize: "0.875rem",
                    fontWeight: 500
                  }}
                >
                  Email
                </Typography>
                <TextField
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  fullWidth
                  size="small"
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1
                  }}
                >
                  <Typography
                    component="label"
                    htmlFor="password"
                    sx={{
                      fontSize: "0.875rem",
                      fontWeight: 500
                    }}
                  >
                    Password
                  </Typography>
                  <MuiLink
                    component="button"
                    onClick={() => setShowForgotPassword(true)}
                    sx={{
                      fontSize: "0.875rem",
                      color: "primary.main",
                      textDecoration: "none",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      "&:hover": {
                        textDecoration: "underline"
                      }
                    }}
                  >
                    Forgot password?
                  </MuiLink>
                </Box>
                <TextField
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  fullWidth
                  size="small"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={toggleShowPassword}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Box>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  mt: 2,
                  py: 1.5,
                  textTransform: "none"
                }}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>

            {/* Footer */}
            <Box sx={{ mt: 4, textAlign: "center" }}>
              <Typography variant="body2">
                Don&apos;t have an account?{" "}
                <MuiLink
                  component="button"
                  onClick={() => router.push('/register')}
                  sx={{
                    color: "primary.main",
                    textDecoration: "none",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    "&:hover": {
                      textDecoration: "underline"
                    }
                  }}
                >
                  Register
                </MuiLink>
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Forgot Password Dialog */}
        <Dialog open={showForgotPassword} onClose={handleCloseForgotPassword}>
          <DialogTitle>Forgot Password</DialogTitle>
          <DialogContent>
            <Typography sx={{ mb: 2 }}>
              Enter your email address to receive password reset instructions.
            </Typography>
            {forgotPasswordMessage && (
              <Alert severity={forgotPasswordMessage.type} sx={{ mb: 2 }}>
                {forgotPasswordMessage.text}
              </Alert>
            )}
            <TextField
              autoFocus
              margin="dense"
              id="forgot-password-email"
              label="Email Address"
              type="email"
              fullWidth
              variant="outlined"
              value={forgotPasswordEmail}
              onChange={(e) => setForgotPasswordEmail(e.target.value)}
              disabled={forgotPasswordLoading}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseForgotPassword} disabled={forgotPasswordLoading}>
              Cancel
            </Button>
            <Button
              onClick={handleForgotPasswordSubmit}
              variant="contained"
              disabled={forgotPasswordLoading}
            >
              {forgotPasswordLoading ? "Sending..." : "Send Reset Email"}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  )
}