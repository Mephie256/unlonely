"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Heart, MessageCircle, BarChart3 } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Home", href: "/", icon: Heart },
  { name: "Chat", href: "/chat", icon: MessageCircle },
  { name: "Mood Tracker", href: "/mood", icon: BarChart3 },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          {/* Logo - Centered on mobile */}
          <div className="flex items-center justify-center flex-1 sm:flex-none sm:justify-start">
            <Link href="/" className="flex items-center space-x-2 p-2">
              <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              <span className="text-lg sm:text-xl font-bold">UnLonely</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-2">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-2 px-4 py-3 rounded-md text-sm font-medium transition-colors min-h-[44px]",
                      pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Theme toggle - Always visible */}
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Mobile navigation - Always visible on mobile */}
      <div className="md:hidden border-t bg-background/95">
        <div className="px-4 py-2">
          <div className="flex justify-around space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center px-3 py-3 rounded-md text-xs font-medium transition-colors min-h-[60px] flex-1",
                    pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <Icon className="h-5 w-5 mb-1" />
                  <span className="text-center">{item.name}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
