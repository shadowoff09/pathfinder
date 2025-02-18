/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import * as React from "react"
import MapComponent, { Layer, MapRef, Marker } from "react-map-gl/mapbox"
import "mapbox-gl/dist/mapbox-gl.css"
import { useRouter, usePathname } from "next/navigation"
import CoordinatesDisplay from "./CoordinatesDisplay"
import WeatherDisplay from "./WeatherDisplay"
import CurrentLocationButton from "./CurrentLocationButton"
import SearchBar from "./SearchBar"
import { LoadingSpinner } from "./ui/circular-spinner"
import { useTheme } from "next-themes"
import { useEffect, useState, useCallback } from "react"
import ChangeMapStyleButton from "./ChangeMapStyleButton"
import { MapPin } from "lucide-react"
import Controls from "./Controls"

/**
 * Debounce function to limit the rate at which a function is called
 */
function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null

    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            timeout = null
            func(...args)
        }

        if (timeout) {
            clearTimeout(timeout)
        }
        timeout = setTimeout(later, wait)
    }
}

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

/**
 * Generate Google Maps style URL
 */
const generateMapUrl = (state: {
    latitude: number,
    longitude: number,
    zoom: number,
    pitch: number,
    bearing: number,
    mapStyle: 'STREETS' | 'SATELLITE'
}) => {
    const viewType = state.mapStyle === 'SATELLITE' ? 'satellite' : 'streets'
    let url = `/@${state.latitude.toFixed(6)},${state.longitude.toFixed(6)},${state.zoom.toFixed(2)}`
    
    // Add pitch and bearing if they're not 0
    if (state.pitch !== 0) {
        url += `,${state.pitch.toFixed(0)}a`
    }
    if (state.bearing !== 0) {
        url += `,${state.bearing.toFixed(0)}y`
    }

    // Add map style
    url += `/${viewType}`
    
    return url
}

/**
 * Parse URL path into map state
 * Handles formats like: /@40.7128,-74.0060,15/streets
 * or /@40.7128,-74.0060,12.5,30a,60y/satellite
 */
const parseMapPath = (path: string) => {
    const defaultState = {
        longitude: -4.649779746122704,
        latitude: 17.08385049329921,
        zoom: 2,
        pitch: 0,
        bearing: 0,
        mapStyle: 'STREETS' as const
    }

    // Check if path matches our map format
    const mapRegex = /\/?@(-?\d+\.?\d*),(-?\d+\.?\d*),(\d+\.?\d*)(?:,(\d+)(?:a|y))?(?:,(\d+)(?:h|y))?(?:\/(\w+))?/
    const matches = path.match(mapRegex)

    if (!matches) return defaultState

    const [, lat, lng, zoom, angle, heading, viewType] = matches

    return {
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
        zoom: parseFloat(zoom),
        pitch: angle ? parseFloat(angle) : 0,
        bearing: heading ? parseFloat(heading) : 0,
        mapStyle: (viewType === 'satellite' ? 'SATELLITE' : 'STREETS') as 'STREETS' | 'SATELLITE'
    }
}

export default function Map() {
    const router = useRouter()
    const pathname = usePathname()
    
    // Parse initial state from URL
    const initialState = parseMapPath(pathname)

    // State Management
    const [coordinates, setCoordinates] = useState<Coordinates>({
        longitude: initialState.longitude,
        latitude: initialState.latitude
    })
    const [mapRef, setMapRef] = useState<{ current?: MapRef }>({})
    const [loading, setLoading] = useState(true)
    const [zoom, setZoom] = useState(initialState.zoom)
    const [pitch, setPitch] = useState(initialState.pitch)
    const [bearing, setBearing] = useState(initialState.bearing)
    const { resolvedTheme } = useTheme()
    const [mapStyle, setMapStyle] = useState<'STREETS' | 'SATELLITE'>(initialState.mapStyle)
    const [selectedLocation, setSelectedLocation] = useState<Coordinates | null>(null)

    // Update URL when map state changes
    const updateUrl = useCallback((newState: {
        longitude: number,
        latitude: number,
        zoom: number,
        pitch: number,
        bearing: number,
        mapStyle: 'STREETS' | 'SATELLITE'
    }) => {
        const url = generateMapUrl({
            latitude: newState.latitude,
            longitude: newState.longitude,
            zoom: newState.zoom,
            pitch: newState.pitch,
            bearing: newState.bearing,
            mapStyle: newState.mapStyle
        })
        
        router.replace(url, { scroll: false })
    }, [router])

    // Debounced URL update to prevent too many history entries
    const debouncedUpdateUrl = useCallback(
        debounce((state: any) => updateUrl(state), 300),
        [updateUrl]
    )

    // Ref callback to store the map reference
    const measuredRef = React.useCallback((node: any) => node && setMapRef({ current: node }), [])

    /**
     * Handles map movement and updates coordinates and zoom level
     */
    const handleMove = useCallback(
        (event: { viewState: { longitude: number; latitude: number; zoom: number; pitch: number; bearing: number } }) => {
            const { longitude, latitude, zoom, pitch, bearing } = event.viewState
            setCoordinates({ longitude, latitude })
            setZoom(zoom)
            setPitch(pitch)
            setBearing(bearing)
            
            // Update URL with new state (debounced)
            debouncedUpdateUrl({
                longitude,
                latitude,
                zoom,
                pitch,
                bearing,
                mapStyle
            })
        },
        [mapStyle, debouncedUpdateUrl],
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
    }

    /**
     * Handles location selection from the search bar
     * @param longitude - The selected longitude
     * @param latitude - The selected latitude
     */
    const handleSelectLocation = (longitude: number, latitude: number) => {
        const newLocation = { longitude, latitude }
        const newZoom = 14
        const newPitch = 60
        const newBearing = -20
        
        setSelectedLocation(newLocation)
        setCoordinates(newLocation)
        setZoom(newZoom)
        setPitch(newPitch)
        setBearing(newBearing)
        
        mapRef.current?.flyTo({
            center: [longitude, latitude],
            zoom: newZoom,
            pitch: newPitch,
            bearing: newBearing,
        })
        
        // Update URL with new state
        updateUrl({
            ...newLocation,
            zoom: newZoom,
            pitch: newPitch,
            bearing: newBearing,
            mapStyle
        })
    }

    /**
     * Reset view to initial state when Ctrl+R is pressed
     */
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.key === 'r') {
                event.preventDefault()
                const initialView = {
                    longitude: -4.649779746122704,
                    latitude: 17.08385049329921,
                    zoom: 2,
                    pitch: 0,
                    bearing: 0,
                }
                mapRef.current?.flyTo({
                    center: [initialView.longitude, initialView.latitude],
                    zoom: initialView.zoom,
                    pitch: initialView.pitch,
                    bearing: initialView.bearing,
                })
                setCoordinates({
                    longitude: initialView.longitude,
                    latitude: initialView.latitude
                })
                setZoom(initialView.zoom)
                setPitch(initialView.pitch)
                setBearing(initialView.bearing)
                setSelectedLocation(null)
                setMapStyle('STREETS')
                
                // Update URL with initial state
                updateUrl({
                    ...initialView,
                    mapStyle: 'STREETS'
                })
            }
        }

        window.addEventListener('keydown', handleKeyPress)
        return () => window.removeEventListener('keydown', handleKeyPress)
    }, [mapRef, updateUrl])
    
    return (
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
                    longitude: initialState.longitude,
                    latitude: initialState.latitude,
                    zoom: initialState.zoom,
                    pitch: initialState.pitch,
                    bearing: initialState.bearing,
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

                {/* Renderiza o marcador apenas se uma localização tiver sido selecionada */}
                {selectedLocation && (
                    <Marker
                        longitude={selectedLocation.longitude}
                        latitude={selectedLocation.latitude}
                        onClick={() => {
                            setSelectedLocation(null)
                        }}
                        anchor="bottom"
                    >
                        <MapPin className="w-6 h-6 dark:text-white text-black" />
                    </Marker>
                )}

                {/* Only show 3D buildings in streets mode */}
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
            </MapComponent>

            {/* UI Overlay Components */}
            <div className="absolute top-[70px] left-1/2 -translate-x-1/2 md:left-2 md:translate-x-0 md:top-[70px] transform w-full max-w-md">
                <SearchBar onSelectLocation={handleSelectLocation} />
            </div>

            <CoordinatesDisplay
                longitude={coordinates.longitude}
                latitude={coordinates.latitude}
                zoom={zoom}
            />


            <Controls />

            {zoom >= 14 && (
                <WeatherDisplay
                    longitude={coordinates.longitude}
                    latitude={coordinates.latitude}
                />
            )}

            <CurrentLocationButton onUpdateCoordinates={updateCoordinates} />

            <ChangeMapStyleButton
                mapStyle={mapStyle}
                onToggle={() => setMapStyle(current => current === 'STREETS' ? 'SATELLITE' : 'STREETS')}
            />
        </div>
    )
}
