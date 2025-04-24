"use client"

import * as React from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useDebounce } from "@/hooks/useDebounce"
import { searchLocations } from '@/app/actions'

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
  const [activeIndex, setActiveIndex] = React.useState(-1)
  const [error, setError] = React.useState<string | null>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const dropdownRef = React.useRef<HTMLDivElement>(null)
  const resultRefs = React.useRef<(HTMLLIElement | null)[]>([])
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  // Reset active index when results change
  React.useEffect(() => {
    setActiveIndex(-1)
    resultRefs.current = resultRefs.current.slice(0, searchResults.length)
  }, [searchResults])

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
      setError(null)
      searchLocations(debouncedSearchTerm)
        .then((results) => {
          setSearchResults(results)
          setIsOpen(true)
          setIsLoading(false)
        })
        .catch((error) => {
          console.error("Error fetching data:", error)
          setError("Failed to fetch search results. Please try again.")
          setIsLoading(false)
        })
    } else {
      setSearchResults([])
      setIsOpen(false)
      setError(null)
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
    setError(null)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return
    
    // Arrow down
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIndex(prev => {
        const newIndex = prev < searchResults.length - 1 ? prev + 1 : 0
        resultRefs.current[newIndex]?.scrollIntoView({ block: 'nearest' })
        return newIndex
      })
    }
    
    // Arrow up
    else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex(prev => {
        const newIndex = prev > 0 ? prev - 1 : searchResults.length - 1
        resultRefs.current[newIndex]?.scrollIntoView({ block: 'nearest' })
        return newIndex
      })
    }
    
    // Enter
    else if (e.key === "Enter") {
      e.preventDefault()
      if (activeIndex >= 0 && activeIndex < searchResults.length) {
        handleResultClick(searchResults[activeIndex])
      }
    }
    
    // Escape
    else if (e.key === "Escape") {
      e.preventDefault()
      setIsOpen(false)
    }
  }

  return (
    <div className="relative w-full">
      <Input
        ref={inputRef}
        type="text"
        placeholder="Search for points of interest..."
        className="border border-border/50 dark:text-white text-black font-onest font-semibold pl-10 pr-10 py-2 w-full bg-background/50 dark:bg-background/60 backdrop-blur-sm shadow-sm hover:border-accent-foreground/20 focus:border-border/60 focus:ring-border/60 dark:border-input/80 dark:hover:border-border/70 dark:focus:border-border/60 dark:focus:ring-border/60 rounded-lg transition-all duration-200"
        value={searchTerm}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        aria-label="Search locations"
        aria-autocomplete="list"
        aria-controls={isOpen ? "search-results" : undefined}
        aria-expanded={isOpen}
        aria-activedescendant={activeIndex >= 0 ? `result-${searchResults[activeIndex]?.id}` : undefined}
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 dark:text-white text-black" size={18} />
      {isLoading ? (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <svg 
            className="text-muted-foreground" 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <style jsx>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
              svg {
                animation: spin 1s linear infinite;
              }
            `}</style>
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        </div>
      ) : searchTerm ? (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Clear search"
        >
          <X size={18} />
        </button>
      ) : null}
      {isOpen && (
        <div
          ref={dropdownRef}
          id="search-results"
          className="absolute z-50 w-full mt-1 bg-background border border-input rounded-md shadow-lg dark:bg-background/60 backdrop-blur-sm transition-all duration-200"
          role="listbox"
        >
          {error ? (
            <div className="p-4 text-center text-destructive">
              <p>{error}</p>
              <button 
                onClick={() => setError(null)}
                className="mt-2 text-sm underline hover:text-foreground transition-colors"
              >
                Dismiss
              </button>
            </div>
          ) : searchResults.length > 0 ? (
            <ul className="max-h-[300px] overflow-auto py-1 font-onest scrollbar-thin">
              {searchResults.map((result, index) => (
                <li
                  ref={(el) => { resultRefs.current[index] = el }}
                  key={result.id}
                  id={`result-${result.id}`}
                  className={`px-4 py-2 cursor-pointer border-b border-border/50 dark:border-border/70 last:border-b-0 transition-colors ${
                    index === activeIndex 
                      ? "bg-accent/60 text-accent-foreground" 
                      : "hover:bg-accent/30"
                  }`}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleResultClick(result)}
                  onMouseEnter={() => setActiveIndex(index)}
                  role="option"
                  aria-selected={index === activeIndex}
                >
                  <div className="flex items-center">
                    <Search size={14} className="mr-2 flex-shrink-0 text-muted-foreground" />
                    <span className="truncate">{result.place_name}</span>
                  </div>
                </li>
              ))}
              <div className="px-4 py-2 text-xs text-muted-foreground border-t border-border/50 dark:border-border/70">
                {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
              </div>
            </ul>
          ) : (
            <div className="p-6 text-center">
              <div className="rounded-full bg-muted/30 inline-flex items-center justify-center p-3 mb-3">
                <Search size={18} className="text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No results found for &quot;{searchTerm}&quot;</p>
              <p className="text-xs text-muted-foreground mt-1">Try a different search term</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
