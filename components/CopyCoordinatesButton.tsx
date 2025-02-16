'use client'

import { Copy } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { useState } from 'react'


export default function CopyCoordinatesButton({ longitude, latitude }: { longitude: number, latitude: number }) {
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(`${longitude},${latitude}`)
        setCopied(true)
        setTimeout(() => {
            setCopied(false)
        }, 2000)
    }

    return (
        <Badge className="gap-2 cursor-pointer" onClick={handleCopy}>
            {copied ? "Copied" : "Copy Coordinates"}
            <Copy className="w-3 h-3" />
        </Badge>
    )
}

