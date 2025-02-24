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
        <div >
            <TooltipProvider>
                <Tooltip delayDuration={700}>
                    <TooltipTrigger asChild>
                        <Button
                            variant="outline"
                            className="bg-background/70 dark:bg-background/60 backdrop-blur-sm font-onest border border-border/50"
                            onClick={onToggle}
                        >

                            {mapStyle === 'STREETS' ? (
                                <>
                                    <span className="mr-2">Streets</span>
                                    <Satellite className="h-4 w-4" />
                                </>
                            ) : (
                                <>
                                    <span className="mr-2">Satellite</span>
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