/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import * as React from "react"
import { Search, Loader2, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useDebounce } from "@/hooks/use-debounce"

interface SearchResult {
  id: string
  place_name: string
  center: [number, number]
}

interface SearchBarProps {
  onSelectLocation: (longitude: number, latitude: number) => void
}

export default function SearchBar({ onSelectLocation }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [searchResults, setSearchResults] = React.useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const dropdownRef = React.useRef<HTMLDivElement>(null)
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current !== event.target
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  React.useEffect(() => {
    if (debouncedSearchTerm) {
      setIsLoading(true)
      fetch(
        `https://api.mapbox.com/search/geocode/v6/forward?q=${debouncedSearchTerm}&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`,
      )
        .then((response) => response.json())
        .then((data) => {
          const results = data.features.map((feature: any) => ({
            id: feature.id,
            place_name: feature.properties.full_address,
            center: [feature.properties.coordinates.longitude, feature.properties.coordinates.latitude],
          }))
          setSearchResults(results)
          setIsOpen(true)
          setIsLoading(false)
        })
        .catch((error) => {
          console.error("Error fetching data:", error)
          setIsLoading(false)
        })
    } else {
      setSearchResults([])
      setIsOpen(false)
    }
  }, [debouncedSearchTerm])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleResultClick = (result: SearchResult) => {
    setSearchTerm(result.place_name)
    setIsOpen(false)
    onSelectLocation(result.center[0], result.center[1])
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const handleClear = () => {
    setSearchTerm("")
    setSearchResults([])
    setIsOpen(false)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <div className="relative w-full">
      <Input
        ref={inputRef}
        type="text"
        placeholder="Search for points of interest..."
        className="border border-border/50 dark:text-white text-black font-onest font-semibold pl-10 pr-4 py-2 w-full bg-background/50 dark:bg-background/60 backdrop-blur-sm shadow-sm hover:border-accent-foreground/20 focus:border-border/60 focus:ring-border/60 dark:border-input/80 dark:hover:border-border/70 dark:focus:border-border/60 dark:focus:ring-border/60 rounded-lg"
        value={searchTerm}
        onChange={handleChange}
        aria-label="Search locations"
        aria-autocomplete="list"
        aria-controls="search-results"
        aria-expanded={isOpen}
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white " size={18} />
      {isLoading ? (
        <Loader2
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground animate-spin"
          size={18}
        />
      ) : searchTerm ? (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label="Clear search"
        >
          <X size={18} />
        </button>
      ) : null}
      {isOpen && (
        <div
          ref={dropdownRef}
          id="search-results"
          className="absolute z-50 w-full mt-1 bg-background border border-input rounded-md shadow-lg dark:bg-background/60 backdrop-blur-sm"
          role="listbox"
        >
          {searchResults.length > 0 ? (
            <ul className="max-h-[300px] overflow-auto py-1 font-onest">
              
              {searchResults.map((result) => (
                <li
                  key={result.id}
                  className="px-4 py-2 hover:bg-accent cursor-pointer border-b border-border/50 dark:border-border/70 last:border-b-0"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleResultClick(result)}
                  role="option"
                  aria-selected={searchTerm === result.place_name}
                >
                  {result.place_name}
                </li>
              ))}
              <div className="px-4 py-2 text-sm text-muted-foreground">
                {searchResults.length} results found
              </div>
            </ul>
          ) : (
            <p className="p-4 text-center text-muted-foreground">No results found</p>
          )}
        </div>
      )}
    </div>
  )
}
