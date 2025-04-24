"use client"

import * as React from "react"
import { Moon, Sun, Laptop, Check } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

export function ModeToggle() {
  const { setTheme, theme } = useTheme()
  const [isOpen, setIsOpen] = React.useState(false)

  const themes = [
    { name: "Light", value: "light", icon: Sun },
    { name: "Dark", value: "dark", icon: Moon },
    { name: "System", value: "system", icon: Laptop },
  ]

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative overflow-hidden transition-colors duration-300 ease-in-out  hover:text-accent-foreground cursor-pointer hover:bg-background/20 hover:dark:bg-background/60 backdrop-blur-sm border-none"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0 text-black dark:text-white" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100 text-black dark:text-white" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="space-y-1 font-onest mt-2 w-56 dark:bg-black/90 dark:border-slate-900/80 bg-white/90 border-slate-200 backdrop-blur-sm z-0 animate-in slide-in-from-top-2 fade-in-20 duration-200"
      >
        <DropdownMenuLabel className="font-normal">
          <span className="block text-sm font-medium mb-1">Theme</span>
          <span className="block text-xs text-muted-foreground">
            {theme === "system" ? "System" : `${theme?.charAt(0).toUpperCase()}${theme?.slice(1)}`} theme
          </span>
        </DropdownMenuLabel>
        {themes.map((item) => (
          <DropdownMenuItem
            key={item.value}
            onClick={() => {
              setTheme(item.value)
              setIsOpen(false)
            }}
            className={cn(
              "flex items-center justify-between cursor-pointer transition-colors duration-200",
              theme === item.value
                ? "bg-accent text-accent-foreground"
                : "hover:bg-accent hover:text-accent-foreground",
            )}
          >
            <div className="flex items-center gap-2">
              <item.icon className="h-4 w-4" />
              <span>{item.name}</span>
            </div>
            {theme === item.value && <Check className="h-4 w-4 text-white" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

