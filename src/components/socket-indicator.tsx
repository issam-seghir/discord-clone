"use client"

import { useSocket } from "@/contexts/socket-provider"
import { Badge } from "@/components/ui/badge"


export function SocketIndicator() {
    const {isConnected} = useSocket()
    if(!isConnected) {
        return (
            <Badge variant="outline"  className="bg-yellow-600 text-white border-none">
                Fallback: Polling every 1s
            </Badge>

        )
    }
    return (
        <Badge variant="outline" className="bg-emerald-600 text-white border-none">
            Connected
        </Badge>
    )
}
