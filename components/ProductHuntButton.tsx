import React from 'react'
import { Button } from '@/components/ui/button'
import { FaProductHunt } from 'react-icons/fa'
import Link from 'next/link'


export default function ProductHuntButton() {
  return (
    <div>
        <Button variant="ghost" size="icon" asChild className="relative overflow-hidden transition-colors duration-300 ease-in-out hover:text-accent-foreground cursor-pointer hover:bg-background/20 hover:dark:bg-background/60 backdrop-blur-sm">
          <Link href="https://producthunt.com/posts/pathfinder-11" target="_blank">
            <FaProductHunt className="text-white" />
          </Link>
        </Button>
    </div>
  )
}
