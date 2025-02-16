import { Button } from "@/components/ui/button";
import { MapPin, X } from "lucide-react";
import { useState, useEffect } from "react";
import { LoadingSpinner } from "./ui/circular-spinner";

type CurrentLocationButtonProps = {
  onUpdateCoordinates: (coordinates: { latitude: number, longitude: number }) => void;
};

export default function CurrentLocationButton({ onUpdateCoordinates }: CurrentLocationButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Clear loading state if geolocation request times out
    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        if (isLoading) {
            timeoutId = setTimeout(() => {
                setIsLoading(false);
                setError("Location request timed out. Please try again.");
            }, 10000); // 10 second timeout
        }
        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [isLoading]);

    const handleClick = () => {
        setIsLoading(true);
        setError(null);
        
        // Add options with timeout
        const options = {
            timeout: 10000,
            enableHighAccuracy: true
        };

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const newCoordinates = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                onUpdateCoordinates(newCoordinates);
                setIsLoading(false);
            },
            (error) => {
                setError(error.message);
                console.log(error);
                setIsLoading(false);
            },
            options
        );
    };
    
    return (
        <Button variant="outline" size="icon" className="absolute bottom-6 right-1" onClick={handleClick}>
            {isLoading ? <LoadingSpinner size={20} /> : error ? <X className="w-4 h-4 text-red-500" /> : <MapPin className="w-4 h-4" />}
        </Button>
    );
}
