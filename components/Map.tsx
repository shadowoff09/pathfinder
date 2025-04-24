/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import * as React from "react"
import MapComponent, { Layer, MapRef, Marker, Popup } from "react-map-gl/mapbox"
import "mapbox-gl/dist/mapbox-gl.css"
import CoordinatesDisplay from "./CoordinatesDisplay"
import WeatherDisplay from "./WeatherDisplay"
import CurrentLocationButton from "./CurrentLocationButton"
import SearchBar from "./SearchBar"
import { LoadingSpinner } from "./ui/circular-spinner"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import ChangeMapStyleButton from "./ChangeMapStyleButton"
import { MapPin, X } from "lucide-react"
import Controls from "./Controls"
import DonationDialog from "./DonationDialog"
import { useCoordinates } from "@/hooks/useCoordinates"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"
import { toast } from "sonner"

/**
 * Available map styles for the application
 */
const MAP_STYLES = {
    STREETS: {
        light: "mapbox://styles/mapbox/streets-v12",
        dark: "mapbox://styles/mapbox/dark-v11"
    },
    SATELLITE: {
        light: "mapbox://styles/mapbox/satellite-streets-v12",
        dark: "mapbox://styles/mapbox/satellite-streets-v12"
    }
} as const

/**
 * Represents geographical coordinates with latitude and longitude
 */
interface Coordinates {
    longitude: number
    latitude: number
}

// ~2km threshold (about the size of a small city neighborhood)
const MOVEMENT_THRESHOLD = 0.02;

export default function Map() {
    // Context for coordinates
    const { coordinates, setCoordinates, selectedLocation, setSelectedLocation } = useCoordinates()
    
    // Other state Management
    const [mapRef, setMapRef] = useState<{ current?: MapRef }>({})
    const [loading, setLoading] = useState(true)
    const [zoom, setZoom] = useState(mapRef.current?.getZoom() || 0)
    const { resolvedTheme } = useTheme()
    const [mapStyle, setMapStyle] = useState<'STREETS' | 'SATELLITE'>('STREETS')
    const [lastWeatherCoordinates, setLastWeatherCoordinates] = useState<Coordinates | null>(null)
    const [showPopup, setShowPopup] = useState(false)

    // Ref callback to store the map reference
    const measuredRef = React.useCallback((node: any) => node && setMapRef({ current: node }), [])

    /**
     * Handles map movement and updates coordinates and zoom level
     */
    const handleMove = React.useCallback(
        (event: { viewState: { longitude: number; latitude: number; zoom: number } }) => {
            const { longitude, latitude, zoom } = event.viewState
            setCoordinates({ longitude, latitude })
            setZoom(zoom)

            if (lastWeatherCoordinates) {
                const distanceMoved = Math.sqrt(
                    Math.pow(longitude - lastWeatherCoordinates.longitude, 2) +
                    Math.pow(latitude - lastWeatherCoordinates.latitude, 2)
                )

                if (distanceMoved > MOVEMENT_THRESHOLD) {
                    setLastWeatherCoordinates({ longitude, latitude })
                }
            } else {
                setLastWeatherCoordinates({ longitude, latitude })
            }
        },
        [lastWeatherCoordinates, setCoordinates]
    )

    /**
     * Updates map coordinates and animates to the new location
     * @param newCoordinates - The new coordinates to fly to
     */
    const updateCoordinates = (newCoordinates: Coordinates) => {
        setCoordinates(newCoordinates)
        mapRef.current?.flyTo({
            center: [newCoordinates.longitude, newCoordinates.latitude],
            zoom: 16,
            pitch: 60,
            bearing: -20,
        })
        setSelectedLocation(newCoordinates)
        setLastWeatherCoordinates(newCoordinates)
    }

    /**
     * Handles location selection from the search bar
     * @param longitude - The selected longitude
     * @param latitude - The selected latitude
     */
    const handleSelectLocation = (longitude: number, latitude: number) => {
        const newLocation = { longitude, latitude }
        setSelectedLocation(newLocation)
        updateCoordinates(newLocation)
        setZoom(14)
    }

    /**
     * Reset view to initial state when Ctrl+Q is pressed
     */
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.key === 'q') {
                event.preventDefault()
                mapRef.current?.flyTo({
                    center: [-4.649779746122704, 17.08385049329921],
                    zoom: 2,
                    pitch: 0,
                    bearing: 0,
                })
                setCoordinates({
                    longitude: -4.649779746122704,
                    latitude: 17.08385049329921
                })
                setZoom(2)
                setSelectedLocation(null)
                setLastWeatherCoordinates(null)
            }
        }

        window.addEventListener('keydown', handleKeyPress)
        return () => window.removeEventListener('keydown', handleKeyPress)
    }, [mapRef, setCoordinates, setSelectedLocation, setLastWeatherCoordinates])

    /**
     * Handles the end of a marker drag
     */
    const handleDragEnd = (event: any) => {
        const longitude = event.lngLat.lng;
        const latitude = event.lngLat.lat;
        setSelectedLocation({ longitude, latitude });
        setCoordinates({ longitude, latitude });
        setLastWeatherCoordinates({ longitude, latitude });
    };

    /**
     * Copies location coordinates to clipboard
     */
    const shareLocation = () => {
        if (selectedLocation) {
            const locationText = `${selectedLocation.latitude.toFixed(6)},${selectedLocation.longitude.toFixed(6)}`;
            navigator.clipboard.writeText(locationText);
            toast(`${locationText} copied to clipboard`, {
                duration: 3000,
            });
        }
    };

    return (
        <>
            <div className="w-full h-full">
                <MapComponent
                    mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
                    ref={measuredRef}
                    style={{
                        width: "100vw",
                        height: "100vh",
                    }}
                    mapStyle={MAP_STYLES[mapStyle][resolvedTheme === 'dark' ? 'dark' : 'light']}
                    projection="globe"
                    onMove={handleMove}
                    onLoad={() => {
                        setLoading(false)
                    }}
                    initialViewState={{
                        longitude: coordinates.longitude,
                        latitude: coordinates.latitude,
                        zoom: 2,
                        pitch: 0,
                        bearing: 0,
                    }}
                >
                    {loading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
                            <div className="flex flex-col items-center gap-2">
                                <LoadingSpinner />
                                <p className="text-sm text-muted-foreground">Loading map...</p>
                            </div>
                        </div>
                    )}

                    {selectedLocation && (
                        <>
                            <Marker
                                longitude={selectedLocation.longitude}
                                latitude={selectedLocation.latitude}
                                onClick={() => setShowPopup(!showPopup)}
                                draggable
                                onDragEnd={handleDragEnd}
                                anchor="center"
                            >
                                <div className="relative flex items-center justify-center transition-all duration-300 hover:scale-110">
                                    {/* Outer pulse effect */}
                                    <div className="absolute w-14 h-14 rounded-full bg-primary/10 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
                                    
                                    {/* Middle pulse effect */}
                                    <div className="absolute w-10 h-10 rounded-full bg-primary/15 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" />
                                    
                                    {/* Inner glow */}
                                    <div className="absolute w-8 h-8 rounded-full bg-primary/20" />
                                    
                                    {/* Solid background */}
                                    <div className={cn(
                                        "absolute w-5 h-5 rounded-full",
                                        mapStyle === 'SATELLITE' 
                                            ? "bg-primary shadow-[0_0_15px_rgba(255,255,255,0.7)]" 
                                            : resolvedTheme === 'dark'
                                                ? "bg-primary shadow-[0_0_15px_rgba(255,255,255,0.3)]" 
                                                : "bg-primary shadow-[0_0_15px_rgba(0,0,0,0.2)]"
                                    )} />
                                    
                                    {/* Pin itself */}
                                    <MapPin 
                                        className={cn(
                                            "w-7 h-7 z-10 drop-shadow-lg transform-gpu transition-transform",
                                            mapStyle === 'SATELLITE' 
                                                ? "text-white fill-primary stroke-[3]" 
                                                : resolvedTheme === 'dark' 
                                                    ? "text-white fill-primary/10 stroke-[3]" 
                                                    : "text-primary fill-white/70 stroke-[3]"
                                        )}
                                    />
                                    
                                    {/* Shadow effect */}
                                    <div className="absolute -bottom-4 w-3 h-1 bg-black/30 rounded-full blur-sm"></div>
                                </div>
                            </Marker>
                            
                            {showPopup && (
                                <Popup
                                    longitude={selectedLocation.longitude}
                                    latitude={selectedLocation.latitude}
                                    anchor="bottom"
                                    onClose={() => setShowPopup(false)}
                                    closeButton={false}
                                    className="z-10"
                                    closeOnClick={false}
                                    offset={25}
                                >
                                    <div className={cn(
                                        "p-4 max-w-xs rounded-xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-300",
                                        "backdrop-blur-md border border-primary/10 bg-red-500", 
                                        resolvedTheme === 'dark'
                                            ? "bg-gradient-to-br from-background/95 to-background/80 shadow-[0_0_15px_rgba(0,0,0,0.6)]"
                                            : "bg-gradient-to-br from-background/95 to-background/80 shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
                                    )}>
                                        <div className="flex justify-between items-center mb-3.5 relative">
                                            <div className="absolute -left-4 -top-4 w-12 h-12 rounded-full bg-primary/10 blur-xl"></div>
                                            <h3 className="font-medium tracking-tight">
                                                <span className="text-primary">•</span> Location Details
                                            </h3>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-6 w-6 rounded-full hover:bg-primary/10" 
                                                onClick={() => setShowPopup(false)}
                                            >
                                                <X className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                        
                                        <div className="space-y-3 mb-4">
                                            <div className={cn(
                                                "rounded-lg overflow-hidden",
                                                resolvedTheme === 'dark'
                                                    ? "bg-black/20 border border-white/5"
                                                    : "bg-black/5 border border-black/5"
                                            )}>
                                                <div className="px-3 py-2 border-b border-primary/5 flex items-center gap-2">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-primary/60"></div>
                                                    <p className="text-xs tracking-tight font-medium">Coordinates</p>
                                                </div>
                                                <div className="p-3 space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs text-muted-foreground">Latitude</span>
                                                        <span className="text-xs font-mono bg-primary/5 px-2 py-1 rounded">{selectedLocation.latitude.toFixed(6)}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs text-muted-foreground">Longitude</span>
                                                        <span className="text-xs font-mono bg-primary/5 px-2 py-1 rounded">{selectedLocation.longitude.toFixed(6)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <Button 
                                            variant="default" 
                                            size="sm" 
                                            className={cn(
                                                "w-full h-9 text-xs gap-2 relative overflow-hidden transition-all duration-300 group",
                                                "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
                                            )}
                                            onClick={shareLocation}
                                        >
                                            <span className="absolute inset-0 w-full h-full bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300"></span>
                                            <span className="relative z-10 flex items-center gap-1.5">
                                                <span className="w-3.5 h-3.5 flex items-center justify-center rounded-full bg-white/20 group-hover:bg-white/30 transition-colors duration-300">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                                                </span>
                                                Copy Coordinates
                                            </span>
                                        </Button>
                                        
                                        <div className="mt-3 flex items-center justify-center">
                                            <p className="text-[10px] tracking-tight text-muted-foreground">Drag pin to adjust position</p>
                                        </div>
                                    </div>
                                </Popup>
                            )}
                        </>
                    )}

                    {mapStyle === 'STREETS' && (
                        <Layer
                            id="3d-buildings"
                            source="composite"
                            source-layer="building"
                            type="fill-extrusion"
                            minzoom={15}
                            paint={{
                                "fill-extrusion-color": resolvedTheme === "dark" ? "#444444" : "#aaa",
                                "fill-extrusion-height": ["get", "height"],
                                "fill-extrusion-base": ["get", "min_height"],
                                "fill-extrusion-opacity": 0.6,
                            }}
                        />
                    )}

                    <div className="flex justify-center md:justify-start absolute top-[70px] w-full md:w-auto md:left-4 px-4 md:px-0">
                        <div className="w-full md:max-w-xl max-w-md">
                            <SearchBar onSelectLocation={handleSelectLocation} />
                        </div>
                    </div>

                </MapComponent>

                <div className="fixed top-[70px] right-2 md:right-4 flex flex-col gap-3 items-end z-10">
                  <CoordinatesDisplay
                      longitude={coordinates.longitude}
                      latitude={coordinates.latitude}
                      zoom={zoom}
                      zIndex={10}
                  />

                  {zoom >= 14 && lastWeatherCoordinates && (
                      <WeatherDisplay
                          longitude={lastWeatherCoordinates.longitude}
                          latitude={lastWeatherCoordinates.latitude}
                          className="weather-widget"
                          zIndex={9}
                      />
                  )}
                </div>

                <div className="absolute bottom-6 right-4 flex flex-row gap-[5px] items-center">
                    <DonationDialog showButton={true} />
                    <Controls />
                    
                    <ChangeMapStyleButton
                        mapStyle={mapStyle}
                        onToggle={() => setMapStyle(current => current === 'STREETS' ? 'SATELLITE' : 'STREETS')}
                    />
                    <CurrentLocationButton onUpdateCoordinates={updateCoordinates} />
                </div>
            </div>
        </>
    )
}
