/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import * as React from "react"
import MapComponent, { MapRef } from "react-map-gl/mapbox"
import "mapbox-gl/dist/mapbox-gl.css"
import CoordinatesDisplay from "./CoordinatesDisplay"
import WeatherDisplay from "./WeatherDisplay"
import CurrentLocationButton from "./CurrentLocationButton"
import SearchBar from "./SearchBar"

type Coordinates = {
    longitude: number
    latitude: number
}


export default function Map() {
    const [coordinates, setCoordinates] = React.useState<Coordinates>({ longitude: -4.649779746122704, latitude: 17.08385049329921 })
    const [mapRef, setMapRef] = React.useState<{ current?: MapRef }>({})
    const measuredRef = React.useCallback((node: any) => node && setMapRef({ current: node }), [])
    const [zoom, setZoom] = React.useState(2)

    const handleMove = React.useCallback(
        (event: { viewState: { longitude: number; latitude: number; zoom: number } }) => {
            const { longitude, latitude, zoom } = event.viewState
            setCoordinates({ longitude, latitude })
            setZoom(zoom)
        },
        [],
    )

    const updateCoordinates = (newCoordinates: Coordinates) => {
        setCoordinates(newCoordinates)
        mapRef.current?.flyTo({
            center: [newCoordinates.longitude, newCoordinates.latitude],
            zoom: 14,
        })
    }

    const handleSelectLocation = (longitude: number, latitude: number) => {
        updateCoordinates({ longitude, latitude })
        
    }

    const add3DBuildings = () => {
        const map = mapRef.current?.getMap()
        if (!map) return

        if (!map.getLayer("3d-buildings")) {
            map.addLayer({
                id: "3d-buildings",
                source: "composite",
                "source-layer": "building",
                type: "fill-extrusion",
                paint: {
                    "fill-extrusion-color": "#aaa",
                    "fill-extrusion-height": ["get", "height"],
                    "fill-extrusion-base": ["get", "min_height"],
                    "fill-extrusion-opacity": 0.6,
                },
            })
        }
    }

    return (
        <div className="w-full h-full">
            <MapComponent
                mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
                ref={measuredRef}
                style={{
                    width: "100vw",
                    height: "100vh",
                }}
                mapStyle="mapbox://styles/mapbox/streets-v12"
                onMove={handleMove}
                onLoad={add3DBuildings} // Adiciona a camada 3D ao carregar o mapa
                initialViewState={{
                    longitude: coordinates.longitude,
                    latitude: coordinates.latitude,
                    zoom: 15,
                    pitch: 60, // Inclinação da câmera para melhor visualização dos edifícios 3D
                    bearing: -20, // Rotação do mapa para melhor visualização
                }}
            >
                
            </MapComponent>
            <div className="absolute top-[70px] left-1/2 -translate-x-1/2 md:left-2 md:translate-x-0 md:top-[70px] transform w-full max-w-md">
                <SearchBar onSelectLocation={handleSelectLocation} />
            </div>

            <CoordinatesDisplay longitude={coordinates.longitude} latitude={coordinates.latitude} zoom={zoom} />
            {zoom >= 14 && <WeatherDisplay longitude={coordinates.longitude} latitude={coordinates.latitude} />}
            <CurrentLocationButton onUpdateCoordinates={updateCoordinates} />
        </div>
    )
}

