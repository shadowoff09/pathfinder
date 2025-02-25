"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface Coordinates {
  latitude: number
  longitude: number
}

interface CoordinatesContextType {
  coordinates: Coordinates
  setCoordinates: (coordinates: Coordinates) => void
  selectedLocation: Coordinates | null
  setSelectedLocation: (location: Coordinates | null) => void
}

const CoordinatesContext = createContext<CoordinatesContextType | undefined>(undefined)

export function CoordinatesProvider({ children }: { children: ReactNode }) {
  const [coordinates, setCoordinates] = useState<Coordinates>({
    latitude: 17.08385049329921,
    longitude: -4.649779746122704
  })
  const [selectedLocation, setSelectedLocation] = useState<Coordinates | null>(null)

  return (
    <CoordinatesContext.Provider 
      value={{ 
        coordinates, 
        setCoordinates, 
        selectedLocation, 
        setSelectedLocation 
      }}
    >
      {children}
    </CoordinatesContext.Provider>
  )
}

export function useCoordinates() {
  const context = useContext(CoordinatesContext)
  if (context === undefined) {
    throw new Error('useCoordinates must be used within a CoordinatesProvider')
  }
  return context
} 