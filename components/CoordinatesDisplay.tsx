import React, { useState, useEffect } from 'react'
import { MapPin, Move, ZoomIn, ChevronUp, ChevronDown, Compass } from 'lucide-react'
import CopyCoordinatesButton from './CopyCoordinatesButton'
import { cn } from '../lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import { motion, AnimatePresence } from 'framer-motion'

interface CoordinatesDisplayProps {
  longitude: number
  latitude: number
  zoom: number
  className?: string
  decimalPrecision?: number
  zIndex?: number
}

export default function CoordinatesDisplay({ 
  longitude, 
  latitude, 
  zoom,
  className,
  decimalPrecision = 4,
  zIndex = 10
}: CoordinatesDisplayProps) {
  const [prevCoords, setPrevCoords] = useState({ longitude, latitude })
  const [isChanged, setIsChanged] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  
  // Get cardinal directions
  const latDir = latitude >= 0 ? 'N' : 'S'
  const lngDir = longitude >= 0 ? 'E' : 'W'
  
  useEffect(() => {
    if (prevCoords.longitude !== longitude || prevCoords.latitude !== latitude) {
      setPrevCoords({ longitude, latitude })
      setIsChanged(true)
      const timer = setTimeout(() => setIsChanged(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [longitude, latitude, prevCoords])

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "w-full md:w-auto font-onest",
        className
      )}
      style={{ zIndex }}
    >
      <motion.div 
        className={cn(
          "overflow-hidden backdrop-blur-md bg-gradient-to-br from-background/80 to-background/60",
          "dark:from-background/70 dark:to-background/40 rounded-xl",
          "transition-all duration-300"
        )}
        animate={{ 
          opacity: isChanged ? 0.95 : 0.9
        }}
        transition={{ duration: 0.3 }}
        aria-label="Map coordinates"
      >
        <div 
          className="px-4 py-3 flex items-center justify-between cursor-pointer"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <div className="flex items-center gap-2">
            <div className="relative">
              <MapPin className={cn(
                "w-5 h-5 text-primary transition-all duration-300",
                isChanged && "scale-110"
              )} />
            </div>
            <span className="text-sm font-medium text-foreground/90">Location Coordinates</span>
          </div>
          <div className="flex items-center gap-2 ml-2">
            <CopyCoordinatesButton longitude={longitude} latitude={latitude} />
            {isCollapsed ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        </div>
        
        <AnimatePresence initial={false}>
          {!isCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="px-4 pb-3"
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-1">
                <div className="flex items-center justify-between gap-1 px-3 py-1.5 rounded-lg bg-foreground/5 dark:bg-foreground/10">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
                      <Compass className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-xs text-muted-foreground">Coordinates</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={cn(
                      "text-sm font-mono font-semibold transition-colors duration-300",
                      isChanged && "text-primary"
                    )}>
                      {Math.abs(latitude).toFixed(decimalPrecision)}°{latDir}
                    </span>
                    <span className="text-muted-foreground mx-1">|</span>
                    <span className={cn(
                      "text-sm font-mono font-semibold transition-colors duration-300",
                      isChanged && "text-primary"
                    )}>
                      {Math.abs(longitude).toFixed(decimalPrecision)}°{lngDir}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <TooltipProvider delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg bg-foreground/5 dark:bg-foreground/10">
                          <div className="flex items-center gap-2">
                            <Move className="w-4 h-4 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Lng</span>
                          </div>
                          <span className={cn(
                            "text-sm font-mono font-medium transition-colors duration-300",
                            isChanged && "text-primary"
                          )}>
                            {longitude.toFixed(decimalPrecision)}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>Longitude</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg bg-foreground/5 dark:bg-foreground/10">
                          <div className="flex items-center gap-2">
                            <Move className="w-4 h-4 text-muted-foreground rotate-90" />
                            <span className="text-xs text-muted-foreground">Lat</span>
                          </div>
                          <span className={cn(
                            "text-sm font-mono font-medium transition-colors duration-300",
                            isChanged && "text-primary"
                          )}>
                            {latitude.toFixed(decimalPrecision)}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>Latitude</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg bg-foreground/5 dark:bg-foreground/10">
                        <div className="flex items-center gap-2">
                          <ZoomIn className="w-4 h-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Zoom Level</span>
                        </div>
                        <div className="w-full max-w-24 bg-background/80 h-2 rounded-full overflow-hidden ml-2">
                          <div 
                            className="h-full bg-primary/70" 
                            style={{ width: `${(zoom / 20) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-mono font-medium">
                          {zoom.toFixed(1)}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Current zoom level (0-20)</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
