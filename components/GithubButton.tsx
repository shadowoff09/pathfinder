import React from 'react'
import { Button } from '@/components/ui/button'
import { FaGithub } from 'react-icons/fa'
import Link from 'next/link'
export default function GithubButton() {
  return (
    <div>
        <Button variant="ghost" size="icon" asChild>
          <Link href="https://github.com/shadowoff09">
            <FaGithub />
          </Link>
        </Button>
    </div>
  )
}
