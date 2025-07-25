import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Toaster } from "react-hot-toast"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "UnLonely - Your AI Companion",
  description: "A kind, minimal AI companion app to help lonely teenagers and students. Chat with a friendly AI bot, track your mood, and view your emotional history.",
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          defaultTheme="system"
          storageKey="unlonely-ui-theme"
        >
          <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
              {children}
            </main>
          </div>
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: 'hsl(var(--card))',
                color: 'hsl(var(--card-foreground))',
                border: '1px solid hsl(var(--border))',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
