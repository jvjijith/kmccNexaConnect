"use client"

import type React from "react"
import {
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  Box,
  IconButton,
  Container,
  InputAdornment
} from "@mui/material"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import { useRouter } from 'next/navigation'

interface RegisterPageUIProps {
  firstName: string
  setFirstName: (firstName: string) => void
  lastName: string
  setLastName: (lastName: string) => void
  email: string
  setEmail: (email: string) => void
  password: string
  setPassword: (password: string) => void
  showPassword: boolean
  toggleShowPassword: () => void
  loading: boolean
  error: string | null
  handleSubmit: (e: React.FormEvent) => void
  phone: string
  setPhone: (phone: string) => void
}

export default function RegisterPageUI({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  toggleShowPassword,
  loading,
  error,
  phone,
  setPhone,
  handleSubmit,
}: RegisterPageUIProps) {
  const router = useRouter()

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
                Create an account
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Enter your information to create an account
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
                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                  <Box>
                    <Typography
                      component="label"
                      htmlFor="firstName"
                      sx={{
                        display: "block",
                        mb: 1,
                        fontSize: "0.875rem",
                        fontWeight: 500
                      }}
                    >
                      First Name
                    </Typography>
                    <TextField
                      id="firstName"
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      fullWidth
                      size="small"
                    />
                  </Box>
                  <Box>
                    <Typography
                      component="label"
                      htmlFor="lastName"
                      sx={{
                        display: "block",
                        mb: 1,
                        fontSize: "0.875rem",
                        fontWeight: 500
                      }}
                    >
                      Last Name
                    </Typography>
                    <TextField
                      id="lastName"
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      fullWidth
                      size="small"
                    />
                  </Box>
                </Box>
              </Box>

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

              {/* Add phone field in the form: */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  component="label"
                  htmlFor="phone"
                  sx={{
                    display: "block",
                    mb: 1,
                    fontSize: "0.875rem",
                    fontWeight: 500
                  }}
                >
                  Phone Number
                </Typography>
                <TextField
                  id="phone"
                  placeholder="+91 99xxxxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  fullWidth
                  size="small"
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography
                  component="label"
                  htmlFor="password"
                  sx={{
                    display: "block",
                    mb: 1,
                    fontSize: "0.875rem",
                    fontWeight: 500
                  }}
                >
                  Password
                </Typography>
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
                {loading ? "Creating account..." : "Register"}
              </Button>
            </form>

            {/* Footer */}
            <Box sx={{ mt: 4, textAlign: "center" }}>
              <Typography variant="body2">
                Already have an account?{" "}
                <Button
                  onClick={() => router.push('/login')}
                  sx={{
                    p: 0,
                    minWidth: 'auto',
                    textTransform: 'none',
                    fontWeight: 'normal',
                    fontSize: 'inherit',
                    color: 'primary.main',
                    '&:hover': {
                      background: 'none',
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Login
                </Button>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}