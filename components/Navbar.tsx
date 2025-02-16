import { Waypoints } from "lucide-react"
import { ModeToggle } from "@/components/ui/theme-toggle"
export default function Navbar() {
  return (
    <nav className="bg-black/10 backdrop-blur-sm shadow-md px-4 py-3 absolute w-full top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between">
        <div className="flex items-center text-white">
          <Waypoints className="h-6 w-6 mr-2" />
          <span className="text-xl font-semibold font-onest">Pathfinder</span>
        </div>
        <div className="flex items-center space-x-2">
          <ModeToggle />
        </div>
      </div>
    </nav>
  )
}

