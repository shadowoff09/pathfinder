import Map from "@/components/Map"
import Navbar from "@/components/Navbar"

export default function Home() {
  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 relative">
        <Map />
      </div>
    </div>
  )
}

