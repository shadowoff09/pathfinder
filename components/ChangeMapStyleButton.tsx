import React from "react"
import { Button } from "./ui/button"
import { Map as MapIcon, Satellite } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"

interface MapStyleToggleButtonProps {
    mapStyle: 'STREETS' | 'SATELLITE'
    onToggle: () => void
}

const MapStyleToggleButton: React.FC<MapStyleToggleButtonProps> = ({ mapStyle, onToggle }) => {
    return (
        <div className="absolute right-12 bottom-6">
            <TooltipProvider>
                <Tooltip delayDuration={700}>
                    <TooltipTrigger asChild>
                        <Button
                            variant="outline"
                            className="bg-background font-onest"
                            onClick={onToggle}
                        >

                            {mapStyle === 'STREETS' ? (
                                <>
                                    <span className="mr-2">Switch to Satellite</span>
                                    <Satellite className="h-4 w-4" />
                                </>
                            ) : (
                                <>
                                    <span className="mr-2">Switch to Streets</span>
                                    <MapIcon className="h-4 w-4" />
                                </>
                            )}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent className="font-onest bg-background/70 dark:bg-background/60 backdrop-blur-sm p-2 rounded-lg shadow-lg border border-border/50 transition-all duration-300 ease-in-out text-dark dark:text-white">
                        <p>Switch Map Style</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    )
}

export default MapStyleToggleButton