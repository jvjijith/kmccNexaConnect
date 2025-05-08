// src/components/EventMap.tsx
"use client"

import { useEffect, useRef } from "react"
import { Box, Typography, Paper } from "@mui/material"

interface EventMapProps {
  location: string
  coordinates: [number, number] // [longitude, latitude]
}

export default function EventMap({ 
  location = "Location not available", 
  coordinates 
}: EventMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  const isValidCoordinates = (coords: any): coords is [number, number] => {
    return Array.isArray(coords) && 
           coords.length === 2 && 
           typeof coords[0] === 'number' && 
           typeof coords[1] === 'number' &&
           !isNaN(coords[0]) && 
           !isNaN(coords[1])
  }

  useEffect(() => {
    if (!mapRef.current) return

    const canvas = document.createElement("canvas")
    canvas.width = mapRef.current.clientWidth
    canvas.height = mapRef.current.clientHeight
    mapRef.current.appendChild(canvas)

    const ctx = canvas.getContext("2d")
    if (ctx) {
      // Draw a simple placeholder map
      ctx.fillStyle = "#e9ecef"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw some map-like elements
      ctx.fillStyle = "#adb5bd"
      for (let i = 0; i < 10; i++) {
        ctx.fillRect(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          Math.random() * 100 + 50,
          Math.random() * 20 + 10,
        )
      }

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      // Pin base
      ctx.fillStyle = "#dc3545"
      ctx.beginPath()
      ctx.arc(centerX, centerY, 15, 0, Math.PI * 2)
      ctx.fill()

      // Pin point
      ctx.fillStyle = "#ffffff"
      ctx.beginPath()
      ctx.arc(centerX, centerY, 5, 0, Math.PI * 2)
      ctx.fill()

      // Add location text
      ctx.fillStyle = "#212529"
      ctx.font = "16px Arial"
      ctx.textAlign = "center"
      ctx.fillText(location, centerX, centerY + 40)

      // Add coordinates text with validation
      ctx.font = "12px Arial"
      if (isValidCoordinates(coordinates)) {
        ctx.fillText(
          `Lat: ${coordinates[1].toFixed(4)}, Lng: ${coordinates[0].toFixed(4)}`, 
          centerX, 
          centerY + 60
        )
      } else {
        ctx.fillText("Location not updated", centerX, centerY + 60)
      }
    }

    return () => {
      if (mapRef.current && mapRef.current.contains(canvas)) {
        mapRef.current.removeChild(canvas)
      }
    }
  }, [location, coordinates])

  return (
    <Paper
      elevation={3}
      sx={{
        height: "100%",
        width: "100%",
        position: "relative",
        overflow: "hidden",
        borderRadius: 2,
      }}
    >
      <Box
        ref={mapRef}
        sx={{
          height: "100%",
          width: "100%",
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            padding: 1,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            zIndex: 1,
          }}
        >
          <Typography variant="subtitle1">
            {location || "Location not available"}
          </Typography>
        </Box>
      </Box>
    </Paper>
  )
}


