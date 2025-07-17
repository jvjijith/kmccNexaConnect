// MapComponent.tsx
"use client"

import { useEffect, useRef } from "react"

interface MapComponentProps {
  coordinates: [number, number] // [longitude, latitude]
  location: string
}

export default function MapComponent({ coordinates, location }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Dynamically import Leaflet to avoid SSR issues
    const initMap = async () => {
      const L = await import("leaflet")

      // Fix for default markers in Leaflet with Next.js

      // Fix for default markers in Leaflet with Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      })

      // Create map instance
      const map = L.map(mapRef.current!).setView([coordinates[1], coordinates[0]], 15)

      // Add OpenStreetMap tiles (free, no API key required)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map)

      // Create custom marker icon
      const customIcon = L.divIcon({
        html: `
          <div style="
            width: 30px;
            height: 40px;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 0C6.716 0 0 6.716 0 15c0 8.284 15 25 15 25s15-16.716 15-25C30 6.716 23.284 0 15 0z" fill="#FF4444"/>
              <circle cx="15" cy="15" r="5" fill="white"/>
            </svg>
          </div>
        `,
        className: 'custom-marker',
        iconSize: [30, 40],
        iconAnchor: [15, 40],
        popupAnchor: [0, -40]
      })

      // Add marker
      const marker = L.marker([coordinates[1], coordinates[0]], { icon: customIcon }).addTo(map)

      // Add popup
      marker.bindPopup(`
        <div style="padding: 8px; max-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; color: #333;">${location}</h3>
          <p style="margin: 0; font-size: 12px; color: #666;">
            Lat: ${coordinates[1].toFixed(6)}°<br>
            Lng: ${coordinates[0].toFixed(6)}°
          </p>
          <a 
            href="https://www.openstreetmap.org/?mlat=${coordinates[1]}&mlon=${coordinates[0]}&zoom=15" 
            target="_blank" 
            rel="noopener noreferrer"
            style="color: #1976d2; text-decoration: none; font-size: 12px;"
          >
            View on OpenStreetMap →
          </a>
        </div>
      `)

      // Store map instance
      mapInstanceRef.current = map
    }

    initMap()

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [coordinates, location])

  // Update map when coordinates change
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([coordinates[1], coordinates[0]], 15)
    }
  }, [coordinates])

  return (
    <div 
      ref={mapRef} 
      style={{ 
        height: "100%", 
        width: "100%",
        zIndex: 1
      }} 
    />
  )
}