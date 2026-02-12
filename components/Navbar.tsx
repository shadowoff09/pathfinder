import { ModeToggle } from "@/components/ui/theme-toggle"
import { RouteIcon } from "./ui/route"
import GithubButton from "./GithubButton"
import ProductHuntButton from "./ProductHuntButton"
import Link from "next/link"

export default function Navbar() {

  return (
    <nav className="bg-black/10 backdrop-blur-sm shadow-md px-4 py-3 absolute w-full top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between">
        <Link href="/" className="flex items-center text-white">
          <RouteIcon className="h-9 w-9 mr-2 hover:bg-transparent" />
          <span className="text-xl font-semibold font-onest">Pathfinder</span>
        </Link>
        <div className="flex items-center space-x-2">
          <ModeToggle />
          <GithubButton />
          <ProductHuntButton />
        </div>
      </div>
    </nav>
  )
}

