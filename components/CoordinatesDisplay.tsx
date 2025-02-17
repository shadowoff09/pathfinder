import React from 'react'
import { MapPin, Move } from 'lucide-react'
import CopyCoordinatesButton from './CopyCoordinatesButton'

interface CoordinatesDisplayProps {
  longitude: number
  latitude: number
  zoom: number
}

export default function CoordinatesDisplay({ longitude, latitude, zoom }: CoordinatesDisplayProps) {
  return (
    <div className="absolute hidden md:block md:top-[70px] right-2 font-onest">
      <div className="bg-background/70 dark:bg-background/60 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-border/50 transition-all duration-300 ease-in-out">
        <div className="flex items-center justify-between space-x-2 mb-1">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground/80">Current Location</span>
          </div>
          <CopyCoordinatesButton longitude={longitude} latitude={latitude} />
        </div>
        <div className="flex flex-col sm:flex-row sm:space-x-4">
          <div className="flex items-center space-x-2">
            <Move className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Longitude:</span>
            <span className="text-sm font-semibold">{longitude.toFixed(4)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Move className="w-4 h-4 text-muted-foreground rotate-90" />
            <span className="text-sm text-muted-foreground">Latitude:</span>
            <span className="text-sm font-semibold">{latitude.toFixed(4)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Zoom:</span>
            <span className="text-sm font-semibold">{zoom.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
