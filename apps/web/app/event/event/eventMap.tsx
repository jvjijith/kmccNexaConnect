// src/components/EventMap.tsx
"use client"

import { useEffect, useState } from "react"
import { Box, Typography, Paper, Chip } from "@mui/material"
import { LocationOn, Public, Warning } from "@mui/icons-material"
import dynamic from "next/dynamic"

interface EventMapProps {
  location: string
  coordinates: [number, number] // [longitude, latitude]
}

// Dynamically import the map component to avoid SSR issues
const DynamicMap = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5"
      }}
    >
      <Typography>Loading map...</Typography>
    </Box>
  )
})

export default function EventMap({ 
  location = "Location not available", 
  coordinates 
}: EventMapProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

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

  // Fallback component when coordinates are invalid
  const FallbackMap = () => (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
        position: "relative"
      }}
    >
      <Box
        sx={{
          textAlign: "center",
          padding: 3,
          maxWidth: 400
        }}
      >
        <Warning sx={{ fontSize: 48, color: "#ff9800", mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          Map Not Available
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Invalid coordinates provided for the map location.
        </Typography>
        <Box sx={{ mt: 2, p: 2, backgroundColor: "white", borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Event Location Details:
          </Typography>
          <Typography variant="body2">
            <strong>Location:</strong> {location}
          </Typography>
          {isValidCoordinates(coordinates) && (
            <>
              <Typography variant="body2">
                <strong>Coordinates:</strong> {coordinates[1].toFixed(6)}°N, {coordinates[0].toFixed(6)}°E
              </Typography>
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                <a 
                  href={`https://www.openstreetmap.org/?mlat=${coordinates[1]}&mlon=${coordinates[0]}&zoom=15`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#1976d2", textDecoration: "none" }}
                >
                  Open in OpenStreetMap →
                </a>
              </Typography>
            </>
          )}
        </Box>
      </Box>
    </Box>
  )

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
      {/* Header with location info */}
      <Box
        sx={{
          position: "absolute",
          top: 12,
          left: 12,
          right: 12,
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          gap: 1,
          flexWrap: "wrap"
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
            label="Interactive Map"
            size="small"
            color="success"
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(4px)",
            }}
          />
        )}
      </Box>

      {/* Map container */}
      <Box
        sx={{
          height: "100%",
          width: "100%",
          position: "relative",
        }}
      >
        {!isClient ? (
          <Box
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f5f5f5"
            }}
          >
            <Typography>Loading map...</Typography>
          </Box>
        ) : !isValidCoordinates(coordinates) ? (
          <FallbackMap />
        ) : (
          <DynamicMap 
            coordinates={coordinates} 
            location={location}
          />
        )}
      </Box>

      {/* Footer with location name */}
      {isValidCoordinates(coordinates) && (
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: 2,
            background: "linear-gradient(transparent, rgba(0, 0, 0, 0.7))",
            zIndex: 1000,
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
          <Typography 
            variant="caption" 
            sx={{ 
              color: "rgba(255, 255, 255, 0.8)",
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
            }}
          >
            Latitude: {coordinates[1].toFixed(6)}°, Longitude: {coordinates[0].toFixed(6)}°
          </Typography>
        </Box>
      )}
    </Paper>
  )
}