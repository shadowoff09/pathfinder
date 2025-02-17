import React from "react"
import { Button } from "./ui/button"
import { Mouse, Move } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { PiMouseScrollLight, PiMouseRightClickFill, PiMouseLeftClickFill } from "react-icons/pi";
import { Badge } from "./ui/badge";

const Controls = () => {
    return (
        <div className="hidden md:block md:absolute right-[245px] bottom-6">
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                        className="bg-background/70 dark:bg-background/60 backdrop-blur-sm font-onest border border-border/50"
                    >

                        <Mouse />
                        <span className="text-sm font-medium text-foreground/80">Controls</span>
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Controls</DialogTitle>
                        <DialogDescription>
                            Controls for the map.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4 w-full">
                        <div className="flex items-center gap-2">
                            <Button variant="outline">
                                <PiMouseLeftClickFill />
                                <Move />
                                <span className="text-sm font-medium text-foreground/80">Move on the map</span>
                            </Button> 
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline">
                                <PiMouseScrollLight size={50} />
                                <span className="text-sm font-medium text-foreground/80">Zoom in/out</span>
                            </Button>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline">
                                <PiMouseRightClickFill />
                                <span className="text-sm font-medium text-foreground/80">Pitch</span>
                            </Button>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" className={'pl-1'}>
                                <Badge className="text-sm font-medium text-foreground/80 bg-background/70 dark:bg-background/60 backdrop-blur-sm font-onest border border-border/50">CTRL + R</Badge>
                                <span className="text-sm font-medium text-foreground/80">Reset view</span>
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div >
    )
}

export default Controls