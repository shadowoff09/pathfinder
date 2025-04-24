import { Button } from "@/components/ui/button";
import { AlertCircle, MapPin, RefreshCw } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { LoadingSpinner } from "./ui/circular-spinner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

type CurrentLocationButtonProps = {
  onUpdateCoordinates: (coordinates: { latitude: number, longitude: number }) => void;
  className?: string;
};

type ErrorType = {
  message: string;
  code?: number;
};

export default function CurrentLocationButton({ 
  onUpdateCoordinates, 
  className = "" 
}: CurrentLocationButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<ErrorType | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    
    const clearStates = () => {
        setIsLoading(false);
        setError(null);
        setIsSuccess(false);
    };

    // Clear timeout when component unmounts
    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    // Show success feedback briefly
    useEffect(() => {
        if (isSuccess) {
            const successTimeout = setTimeout(() => {
                setIsSuccess(false);
            }, 2000);
            
            return () => clearTimeout(successTimeout);
        }
    }, [isSuccess]);

    const getLocationErrorMessage = (error: GeolocationPositionError): ErrorType => {
        switch(error.code) {
            case 1:
                return { 
                    message: "Permission denied. Please allow location access.", 
                    code: error.code 
                };
            case 2:
                return { 
                    message: "Location unavailable. Check device settings.", 
                    code: error.code 
                };
            case 3:
                return { 
                    message: "Request timed out. Try again.", 
                    code: error.code 
                };
            default:
                return { 
                    message: error.message || "Unknown error occurred", 
                    code: error.code 
                };
        }
    };

    const handleGetLocation = () => {
        // If already loading, don't do anything
        if (isLoading) return;
        
        // Clear previous states
        clearStates();
        setIsLoading(true);
        
        // Set timeout for geolocation request
        timeoutRef.current = setTimeout(() => {
            setIsLoading(false);
            setError({ message: "Location request timed out. Please try again." });
        }, 10000);

        const options = {
            timeout: 10000,
            enableHighAccuracy: true
        };

        navigator.geolocation.getCurrentPosition(
            (position) => {
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                
                const newCoordinates = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                
                onUpdateCoordinates(newCoordinates);
                setIsLoading(false);
                setIsSuccess(true);
            },
            (error) => {
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                setError(getLocationErrorMessage(error));
                setIsLoading(false);
            },
            options
        );
    };
    
    const getButtonContent = () => {
        if (isLoading) return <LoadingSpinner size={20} />;
        if (isSuccess) return <RefreshCw className="w-4 h-4 text-green-500" />;
        if (error) return <AlertCircle className="w-4 h-4 text-red-500" />;
        return <MapPin className="w-4 h-4" />;
    };
    
    const getTooltipContent = () => {
        if (isLoading) return "Getting location...";
        if (isSuccess) return "Location updated!";
        if (error) return error.message;
        return "Use current location";
    };
    
    return (
        <TooltipProvider>
            <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                    <Button 
                        variant="outline" 
                        size="icon" 
                        className={`bg-background/70 dark:bg-background/60 backdrop-blur-sm border border-border/50 ${className}`}
                        onClick={handleGetLocation}
                        aria-label="Get current location"
                        disabled={isLoading}
                    >
                        {getButtonContent()}
                    </Button>
                </TooltipTrigger>
                <TooltipContent 
                    className={`font-onest bg-background/70 dark:bg-background/60 backdrop-blur-sm p-2 rounded-lg shadow-lg border border-border/50 transition-all duration-300 ease-in-out text-dark dark:text-white ${error ? 'text-red-500' : ''} ${isSuccess ? 'text-green-500' : ''}`}
                    side="bottom"
                >
                    <p>{getTooltipContent()}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
