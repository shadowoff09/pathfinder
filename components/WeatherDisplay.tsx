'use client'
import React, { useEffect, useState, useRef } from 'react'
import { Sun, Thermometer, ThermometerSun, Droplets, Gauge, Wind, Compass, Cloud, CloudRain, CloudSnow, CloudLightning, CloudDrizzle, CloudFog } from 'lucide-react'
import { getWeather } from '@/app/actions'
import { LoadingSpinner } from './ui/circular-spinner';
import Image from 'next/image';

interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
    clouds: number;
    visibility: number;
    rain: {
      '1h': number;
    };
    
  };
  wind: {
    speed: number;
    deg: number;
  };
  weather: {
    main: string;
  }[];
  name: string;
  sys: {
    country: string;
  };
  // Add more fields as needed
}

interface WeatherDisplayProps {
  longitude: number;
  latitude: number;
}

export default function WeatherDisplay({ longitude, latitude }: WeatherDisplayProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      getWeather(longitude, latitude)
        .then((data) => {
          console.log('Weather data:', data);
          setWeather(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching weather data:', err);
          setError('Failed to fetch weather data');
          setLoading(false);
        });
    }, 500);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [longitude, latitude]);

  return (
    <div className="absolute top-[115px] md:top-[145px] right-2 font-onest pointer-events-none">
      <div className="bg-background/70 dark:bg-background/60 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-border/50 transition-all duration-300 ease-in-out hover:scale-105">
        {!loading && !error && (
          <div className="flex items-center space-x-2 mb-1">
            {weather?.weather?.[0]?.main === 'Clear' ? (
              <Sun className="w-4 h-4 text-yellow-500" />
            ) : weather?.weather?.[0]?.main === 'Clouds' ? (
              <Cloud className="w-4 h-4 text-gray-500 dark:text-white" />
            ) : weather?.weather?.[0]?.main === 'Rain' ? (
              <CloudRain className="w-4 h-4 text-blue-500" />
            ) : weather?.weather?.[0]?.main === 'Snow' ? (
              <CloudSnow className="w-4 h-4 text-blue-200" />
            ) : weather?.weather?.[0]?.main === 'Thunderstorm' ? (
              <CloudLightning className="w-4 h-4 text-yellow-600" />
            ) : weather?.weather?.[0]?.main === 'Drizzle' ? (
              <CloudDrizzle className="w-4 h-4 text-blue-400" />
            ) : weather?.weather?.[0]?.main === 'Mist' || weather?.weather?.[0]?.main === 'Fog' ? (
              <CloudFog className="w-4 h-4 text-gray-400 dark:text-white" />
            ) : (
              <Sun className="w-4 h-4 text-primary" />
            )}
            <span className="text-sm font-medium text-foreground/80">Weather</span>
          </div>
        )}
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <LoadingSpinner size={20} />
            <span className="text-sm text-black dark:text-white">Loading weather...</span>
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <Image src={`https://flagcdn.com/w20/${weather?.sys.country.toLowerCase()}.png`} alt="Weather icon" width={20} height={20} />
              <span className="text-sm text-black dark:text-white">City:</span>
              <span className="text-sm font-semibold">{weather?.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Thermometer className="w-4 h-4 text-black dark:text-white" />
              <span className="text-sm text-black dark:text-white">Temperature:</span>
              <span className="text-sm font-semibold">{weather?.main?.temp}°C</span>
            </div>
            <div className="flex items-center space-x-2">
              <ThermometerSun className="w-4 h-4 text-black dark:text-white" />
              <span className="text-sm text-black dark:text-white">Feels like:</span>
              <span className="text-sm font-semibold">{weather?.main?.feels_like}°C</span>
            </div>
            <div className="flex items-center space-x-2">
              <Droplets className="w-4 h-4 text-black dark:text-white" />
              <span className="text-sm text-black dark:text-white">Humidity:</span>
              <span className="text-sm font-semibold">{weather?.main?.humidity}%</span>
            </div>
            <div className="flex items-center space-x-2">
              <Gauge className="w-4 h-4 text-black dark:text-white" />
              <span className="text-sm text-black dark:text-white">Pressure:</span>
              <span className="text-sm font-semibold">{weather?.main?.pressure} hPa</span>
            </div>
            <div className="flex items-center space-x-2">
              <Wind className="w-4 h-4 text-black dark:text-white" />
              <span className="text-sm text-black dark:text-white">Wind speed:</span>
              <span className="text-sm font-semibold">{weather?.wind?.speed} m/s</span>
            </div>
            <div className="flex items-center space-x-2">
              <Compass className="w-4 h-4 text-black dark:text-white" />
              <span className="text-sm text-black dark:text-white">Wind direction:</span>
              <span className="text-sm font-semibold">{weather?.wind?.deg}°</span>
            </div>


          </div>
        )}
      </div>
    </div>
  );
}
