'use client'

import { CalendarDays, Compass, Home, Map, BarChart } from 'lucide-react'
import Link from "next/link"
import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils"

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 flex justify-around items-center p-4 bg-white border-t">
      <Link href="/plan" className={cn("flex flex-col items-center", pathname === "/plan" ? "text-black" : "text-gray-400")}>
        <CalendarDays className="h-6 w-6 fill-current" />
        <span className="text-xs mt-1">Plan</span>
      </Link>
      <Link href="/explore" className={cn("flex flex-col items-center", pathname === "/explore" ? "text-black" : "text-gray-400")}>
        <Compass className="h-6 w-6 fill-current" />
        <span className="text-xs mt-1">Explore</span>
      </Link>
      <Link href="/" className={cn("flex flex-col items-center", pathname === "/" ? "text-black" : "text-gray-400")}>
        <Home className="h-6 w-6 fill-current" />
        <span className="text-xs mt-1">Home</span>
      </Link>
      <Link href="/journey" className={cn("flex flex-col items-center", pathname === "/journey" ? "text-black" : "text-gray-400")}>
        <Map className="h-6 w-6 fill-current" />
        <span className="text-xs mt-1">Journey</span>
      </Link>
      <Link href="/trends" className={cn("flex flex-col items-center", pathname === "/trends" ? "text-black" : "text-gray-400")}>
        <BarChart className="h-6 w-6 fill-current" />
        <span className="text-xs mt-1">Trends</span>
      </Link>
    </nav>
  )
}

