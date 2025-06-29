// src/components/EventMap.tsx
"use client"

import { useEffect, useRef } from "react"
import { Box, Typography, Paper, Chip } from "@mui/material"
import { LocationOn, Public } from "@mui/icons-material"

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
           !isNaN(coords[1]) &&
           Math.abs(coords[0]) <= 180 &&
           Math.abs(coords[1]) <= 90
  }

  useEffect(() => {
    if (!mapRef.current) return

    const canvas = document.createElement("canvas")
    canvas.width = mapRef.current.clientWidth
    canvas.height = mapRef.current.clientHeight
    mapRef.current.appendChild(canvas)

    const ctx = canvas.getContext("2d")
    if (ctx) {
      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, "#e3f2fd")
      gradient.addColorStop(1, "#bbdefb")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw grid lines for map-like appearance
      ctx.strokeStyle = "#90caf9"
      ctx.lineWidth = 1
      ctx.setLineDash([5, 5])
      
      // Vertical lines
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }
      
      // Horizontal lines
      for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      // Reset line dash
      ctx.setLineDash([])

      // Draw some geographic features
      ctx.fillStyle = "#81c784"
      ctx.globalAlpha = 0.6
      
      // Draw some "land masses"
      for (let i = 0; i < 5; i++) {
        ctx.beginPath()
        const x = (i * canvas.width / 5) + Math.random() * 50
        const y = Math.random() * canvas.height
        const width = 60 + Math.random() * 80
        const height = 30 + Math.random() * 40
        
        ctx.ellipse(x, y, width, height, Math.random() * Math.PI, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.globalAlpha = 1

      // Calculate pin position based on coordinates if valid
      let pinX = canvas.width / 2
      let pinY = canvas.height / 2

      if (isValidCoordinates(coordinates)) {
        // Simple projection (not geographically accurate, but visually appealing)
        pinX = ((coordinates[0] + 180) / 360) * canvas.width
        pinY = ((90 - coordinates[1]) / 180) * canvas.height
        
        // Keep pin within canvas bounds with some margin
        pinX = Math.max(30, Math.min(canvas.width - 30, pinX))
        pinY = Math.max(30, Math.min(canvas.height - 30, pinY))
      }

      // Draw pin shadow
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)"
      ctx.beginPath()
      ctx.ellipse(pinX + 2, pinY + 25, 12, 4, 0, 0, Math.PI * 2)
      ctx.fill()

      // Draw pin base (teardrop shape)
      ctx.fillStyle = "#f44336"
      ctx.beginPath()
      ctx.arc(pinX, pinY, 18, 0, Math.PI * 2)
      ctx.fill()

      // Pin point
      ctx.beginPath()
      ctx.moveTo(pinX, pinY + 18)
      ctx.lineTo(pinX - 8, pinY + 30)
      ctx.lineTo(pinX + 8, pinY + 30)
      ctx.closePath()
      ctx.fill()

      // Pin center dot
      ctx.fillStyle = "#ffffff"
      ctx.beginPath()
      ctx.arc(pinX, pinY, 6, 0, Math.PI * 2)
      ctx.fill()

      // Add location label with background
      if (location && location !== "Location not available") {
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
        ctx.strokeStyle = "#e0e0e0"
        ctx.lineWidth = 1
        
        const textWidth = ctx.measureText(location).width
        const labelX = pinX - textWidth / 2 - 10
        const labelY = pinY - 40
        const labelWidth = textWidth + 20
        const labelHeight = 25
        
        // Draw label background
        ctx.beginPath()
        ctx.roundRect(labelX, labelY, labelWidth, labelHeight, 5)
        ctx.fill()
        ctx.stroke()
        
        // Draw label text
        ctx.fillStyle = "#333333"
        ctx.font = "14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(location, pinX, labelY + 16)
      }

      // Add coordinates text if valid
      if (isValidCoordinates(coordinates)) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
        ctx.strokeStyle = "#e0e0e0"
        ctx.lineWidth = 1
        
        const coordText = `${coordinates[1].toFixed(4)}°N, ${coordinates[0].toFixed(4)}°E`
        const textWidth = ctx.measureText(coordText).width
        const labelX = pinX - textWidth / 2 - 8
        const labelY = pinY + 45
        const labelWidth = textWidth + 16
        const labelHeight = 20
        
        // Draw coordinates background
        ctx.beginPath()
        ctx.roundRect(labelX, labelY, labelWidth, labelHeight, 3)
        ctx.fill()
        ctx.stroke()
        
        // Draw coordinates text
        ctx.fillStyle = "#666666"
        ctx.font = "11px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(coordText, pinX, labelY + 13)
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
        border: "1px solid #e0e0e0",
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
        {/* Header with location info */}
        <Box
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            right: 12,
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Chip
            icon={<LocationOn />}
            label="Event Location"
            size="small"
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(4px)",
              fontWeight: 500,
            }}
          />
          {isValidCoordinates(coordinates) && (
            <Chip
              icon={<Public />}
              label="GPS Coordinates Available"
              size="small"
              color="success"
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(4px)",
              }}
            />
          )}
        </Box>

        {/* Footer with location name */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: 2,
            background: "linear-gradient(transparent, rgba(0, 0, 0, 0.7))",
            zIndex: 2,
          }}
        >
          <Typography 
            variant="subtitle1" 
            sx={{ 
              color: "white", 
              fontWeight: 500,
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
            }}
          >
            {location || "Location not available"}
          </Typography>
          {isValidCoordinates(coordinates) && (
            <Typography 
              variant="caption" 
              sx={{ 
                color: "rgba(255, 255, 255, 0.8)",
                textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
              }}
            >
              Latitude: {coordinates[1].toFixed(6)}°, Longitude: {coordinates[0].toFixed(6)}°
            </Typography>
          )}
        </Box>
      </Box>
    </Paper>
  )
}