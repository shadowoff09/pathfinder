'use client'
import React, { useEffect, useState, useRef } from 'react'
import { Sun, Thermometer, ThermometerSun, Droplets, Gauge, Wind, Compass, Cloud, CloudRain, 
  CloudSnow, CloudLightning, CloudDrizzle, CloudFog, ChevronUp, ChevronDown, Globe } from 'lucide-react'
import { getWeather } from '@/app/actions'
import { LoadingSpinner } from './ui/circular-spinner'
import Image from 'next/image'
import { cn } from '../lib/utils'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import { motion, AnimatePresence } from 'framer-motion'

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
    description: string;
    icon: string;
  }[];
  name: string;
  sys: {
    country: string;
  };
}

interface WeatherDisplayProps {
  longitude: number;
  latitude: number;
  className?: string;
  zIndex?: number;
}

const getWindDirection = (deg: number): string => {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(deg / 45) % 8;
  return directions[index];
};

export default function WeatherDisplay({ longitude, latitude, className, zIndex = 9 }: WeatherDisplayProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [prevCoords, setPrevCoords] = useState({ longitude, latitude });
  const [isChanged, setIsChanged] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (prevCoords.longitude !== longitude || prevCoords.latitude !== latitude) {
      setPrevCoords({ longitude, latitude });
      setIsChanged(true);
      const timer = setTimeout(() => setIsChanged(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [longitude, latitude, prevCoords]);

  useEffect(() => {
    setLoading(true);
    setError(null);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      getWeather(longitude, latitude)
        .then((data) => {
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

  const getWeatherIcon = () => {
    if (!weather?.weather?.[0]?.main) return <Sun className="w-5 h-5 text-primary" />;
    
    switch (weather.weather[0].main) {
      case 'Clear': return <Sun className="w-5 h-5 text-yellow-500" />;
      case 'Clouds': return <Cloud className="w-5 h-5 text-gray-500 dark:text-gray-400" />;
      case 'Rain': return <CloudRain className="w-5 h-5 text-blue-500" />;
      case 'Snow': return <CloudSnow className="w-5 h-5 text-blue-200" />;
      case 'Thunderstorm': return <CloudLightning className="w-5 h-5 text-yellow-600" />;
      case 'Drizzle': return <CloudDrizzle className="w-5 h-5 text-blue-400" />;
      case 'Mist':
      case 'Fog': return <CloudFog className="w-5 h-5 text-gray-400" />;
      default: return <Sun className="w-5 h-5 text-primary" />;
    }
  };

  // If we can't get basic weather data and we're not loading, don't show anything
  if (!loading && !error && 
    (!weather?.weather?.[0] || !weather?.main?.temp || !weather?.wind)) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "w-full md:w-auto font-onest pointer-events-auto",
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
        aria-label="Weather information"
      >
        <div 
          className="px-4 py-3 flex items-center justify-between cursor-pointer"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <div className="flex items-center gap-2">
            <div className="relative">
              {loading ? (
                <LoadingSpinner size={20} />
              ) : (
                <>
                  {getWeatherIcon()}
                </>
              )}
            </div>
            <span className="text-sm font-medium text-foreground/90">
              {loading ? "Loading Weather..." : weather?.name || "Weather"}
            </span>
          </div>
          <div className="flex items-center gap-2 ml-2">
            {!loading && weather?.main?.temp && (
              <span className="text-sm font-mono font-semibold">
                {Math.round(weather.main.temp)}°C
              </span>
            )}
            {isCollapsed ? (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        </div>
        
        <AnimatePresence initial={false}>
          {!isCollapsed && !loading && !error && weather && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="px-4 pb-3"
            >
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center justify-between gap-1 px-3 py-1.5 rounded-lg bg-foreground/5 dark:bg-foreground/10">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
                      <Globe className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-xs text-muted-foreground">Location</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {weather?.sys?.country && (
                      <Image 
                        src={`https://flagcdn.com/w20/${weather.sys.country.toLowerCase()}.png`} 
                        alt={weather.sys.country} 
                        width={16} 
                        height={12}
                        className="mr-1"
                      />
                    )}
                    <span className="text-sm font-mono font-semibold">
                      {weather.name}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <TooltipProvider delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg bg-foreground/5 dark:bg-foreground/10">
                          <div className="flex items-center gap-2">
                            <Thermometer className="w-4 h-4 text-red-500" />
                            <span className="text-xs text-muted-foreground">Temp</span>
                          </div>
                          <span className="text-sm font-mono font-medium">
                            {weather.main.temp.toFixed(1)}°C
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>Current temperature</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg bg-foreground/5 dark:bg-foreground/10">
                          <div className="flex items-center gap-2">
                            <ThermometerSun className="w-4 h-4 text-orange-400" />
                            <span className="text-xs text-muted-foreground">Feels</span>
                          </div>
                          <span className="text-sm font-mono font-medium">
                            {weather.main.feels_like.toFixed(1)}°C
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>Feels like temperature</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <TooltipProvider delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg bg-foreground/5 dark:bg-foreground/10">
                          <div className="flex items-center gap-2">
                            <Droplets className="w-4 h-4 text-blue-400" />
                            <span className="text-xs text-muted-foreground">Humidity</span>
                          </div>
                          <div className="w-full max-w-16 bg-background/80 h-2 rounded-full overflow-hidden ml-2">
                            <div 
                              className="h-full bg-blue-400/70" 
                              style={{ width: `${weather.main.humidity}%` }}
                            />
                          </div>
                          <span className="text-sm font-mono font-medium">
                            {weather.main.humidity}%
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>Humidity percentage</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg bg-foreground/5 dark:bg-foreground/10">
                          <div className="flex items-center gap-2">
                            <Wind className="w-4 h-4 text-cyan-500" />
                            <span className="text-xs text-muted-foreground">Wind</span>
                          </div>
                          <span className="text-sm font-mono font-medium">
                            {weather.wind.speed} m/s
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>Wind speed</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg bg-foreground/5 dark:bg-foreground/10">
                        <div className="flex items-center gap-2">
                          <Compass className="w-4 h-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Direction</span>
                        </div>
                        <div className="relative h-6 w-6 flex items-center justify-center">
                          <Compass className="w-5 h-5 text-muted-foreground absolute" />
                          <div 
                            className="w-4 h-0.5 bg-primary absolute top-1/2 left-1/2 -translate-y-1/2 origin-center"
                            style={{ 
                              transform: `translateX(-25%) translateY(-50%) rotate(${weather.wind.deg}deg)` 
                            }}
                          />
                        </div>
                        <span className="text-sm font-mono font-medium">
                          {getWindDirection(weather.wind.deg)}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Wind direction: {weather.wind.deg}°</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {weather?.main?.pressure && (
                  <TooltipProvider delayDuration={300}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg bg-foreground/5 dark:bg-foreground/10">
                          <div className="flex items-center gap-2">
                            <Gauge className="w-4 h-4 text-purple-400" />
                            <span className="text-xs text-muted-foreground">Pressure</span>
                          </div>
                          <span className="text-sm font-mono font-medium">
                            {weather.main.pressure} hPa
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        <p>Atmospheric pressure</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {loading && (
          <div className="px-4 py-2 flex justify-center">
            <LoadingSpinner size={24} />
          </div>
        )}
        
        {error && (
          <div className="px-4 py-2">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
