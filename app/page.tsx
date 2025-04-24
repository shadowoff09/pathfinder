import React from 'react'
import { ArrowRight, Map, Heart, Github } from 'lucide-react'
import Link from 'next/link'
import { ModeToggle } from '@/components/ui/theme-toggle'
import GlobeDemo from '@/components/Globe'

export default function Page() {
  return (
    <main className="min-h-screen relative bg-background text-foreground overflow-hidden transition-colors duration-300">
      {/* Theme toggle in the corner */}
      <div className="absolute top-4 right-4 z-50">
        <ModeToggle />
      </div>

      {/* Grainy gradient background that spans both sides - enhanced for theme modes */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-50 via-zinc-100 to-zinc-200 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 opacity-90 transition-colors duration-500"></div>
      
      {/* Grainy texture overlay */}
      <div className="absolute inset-0 opacity-20 dark:opacity-30 mix-blend-soft-light transition-opacity duration-500">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.80" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>
      
      <div className="flex flex-col md:flex-row min-h-screen relative z-10 max-w-screen-2xl mx-auto">
        {/* Left section */}
        <section className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-16 border-b md:border-b-0 border-border/10 dark:border-border/20 transition-colors duration-300">
          <div className="relative max-w-xl mx-auto md:mx-0 animate-fade-up [animation-delay:0.2s]">
            <span className="inline-block px-3 py-1 text-sm font-medium bg-background/50 dark:bg-background/30 backdrop-blur-sm rounded-full mb-4 text-muted-foreground border border-border/30 transition-all duration-300 shadow-sm">
              Welcome to the future of navigation
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tighter font-onest text-foreground/90 dark:text-foreground transition-colors duration-300">
              Path<span className="text-primary/80 dark:text-primary/70">finder</span>
            </h1>
            <p className="text-lg md:text-xl font-light mb-8 leading-relaxed text-muted-foreground font-onest transition-colors duration-300">
              Navigate Your World, <span className='text-primary/80 dark:text-primary/70 font-semibold'>Beautifully</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/map" className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-all duration-300 flex items-center justify-center hover:shadow-lg hover:scale-[1.02] font-onest group">
                Go to Map
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link 
                href="https://github.com/shadowoff09/pathfinder" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-6 py-3 bg-background/50 dark:bg-background/30 backdrop-blur-sm font-onest border border-border/30 text-foreground rounded-lg hover:bg-accent hover:text-accent-foreground transition-all duration-300 hover:shadow-md flex items-center justify-center gap-2"
              >
                <Github className="h-4 w-4" />
                Source Code
              </Link>
            </div>
          </div>

          {/* Features section */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 relative max-w-xl mx-auto md:mx-0 animate-fade-up [animation-delay:0.4s]">
            <div className="flex items-start gap-2 group">
              <div className="rounded-full p-1.5 bg-background/50 dark:bg-background/30 backdrop-blur-sm border border-border/30 transition-all duration-300 group-hover:border-primary/50 group-hover:bg-background/70">
                <Map className="h-4 w-4 text-foreground/80 group-hover:text-primary transition-colors duration-300" />
              </div>
              <div>
                <h3 className="text-sm font-medium font-onest text-foreground/90 group-hover:text-foreground transition-colors duration-300">Accurate Mapping</h3>
                <p className="text-xs text-muted-foreground transition-colors duration-300">Precise navigation and routing</p>
              </div>
            </div>
            <div className="flex items-start gap-2 group">
              <div className="rounded-full p-1.5 bg-background/50 dark:bg-background/30 backdrop-blur-sm border border-border/30 transition-all duration-300 group-hover:border-primary/50 group-hover:bg-background/70">
                <svg className="h-4 w-4 text-foreground/80 group-hover:text-primary transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium font-onest text-foreground/90 group-hover:text-foreground transition-colors duration-300">3D Visualization</h3>
                <p className="text-xs text-muted-foreground transition-colors duration-300">See your surroundings clearly</p>
              </div>
            </div>
            <div className="flex items-start gap-2 group">
              <div className="rounded-full p-1.5 bg-background/50 dark:bg-background/30 backdrop-blur-sm border border-border/30 transition-all duration-300 group-hover:border-primary/50 group-hover:bg-background/70">
                <svg className="h-4 w-4 text-foreground/80 group-hover:text-primary transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium font-onest text-foreground/90 group-hover:text-foreground transition-colors duration-300">Privacy Focused</h3>
                <p className="text-xs text-muted-foreground transition-colors duration-300">Your data stays with you</p>
              </div>
            </div>
          </div>

          {/* Footer links */}
          <div className="mt-12 flex items-center justify-center text-sm text-muted-foreground transition-colors duration-300 max-w-xl mx-auto md:mx-0">
            <div className="flex items-center gap-1.5 font-medium font-onest">
              <span>Made with</span>
              <Heart className="h-3.5 w-3.5 text-primary fill-primary/20" />
              <span>by</span>
              <Link href="https://github.com/shadowoff09" target="_blank" rel="noopener noreferrer" className="text-foreground/90 hover:text-primary transition-colors duration-200">Shadow</Link>
            </div>
          </div>
        </section>
        
        {/* Right section */}
        <section className="w-full md:w-1/2 flex items-center justify-center p-0 md:p-8 relative min-h-[500px] bg-transparent transition-colors duration-300">
          <div className="absolute inset-0 w-full h-full">
            <GlobeDemo />
          </div>
        </section>
      </div>
    </main>
  )
}
