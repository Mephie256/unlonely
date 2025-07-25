"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Heart, MessageCircle, BarChart3, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const features = [
  {
    icon: MessageCircle,
    title: "AI Companion",
    description: "Chat with a supportive AI that understands your feelings and offers gentle guidance."
  },
  {
    icon: BarChart3,
    title: "Mood Tracking",
    description: "Track your emotions over time and reflect on your journey with optional journal notes."
  },
  {
    icon: Heart,
    title: "Safe Space",
    description: "A judgment-free environment where you can express yourself freely and feel understood."
  }
]

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-12rem)] sm:min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center px-4">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center space-y-4 sm:space-y-6 mb-8 sm:mb-16 max-w-4xl mx-auto"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="flex justify-center"
        >
          <div className="relative">
            <Heart className="h-16 w-16 sm:h-20 sm:w-20 text-primary" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2"
            >
              <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500" />
            </motion.div>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-4xl sm:text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent leading-tight"
        >
          UnLonely
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto px-4 leading-relaxed"
        >
          Your kind AI companion for emotional support, understanding, and growth.
          You're never alone on your journey.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full max-w-md sm:max-w-none mx-auto"
        >
          <Link href="/chat" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 min-h-[48px]">
              <MessageCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Start Chatting
            </Button>
          </Link>
          <Link href="/mood" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 min-h-[48px]">
              <BarChart3 className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              Track Your Mood
            </Button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto w-full"
      >
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + index * 0.2 }}
              className="w-full"
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader className="text-center p-4 sm:p-6">
                  <div className="mx-auto mb-3 sm:mb-4 p-2 sm:p-3 bg-primary/10 rounded-full w-fit">
                    <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <CardDescription className="text-center text-sm sm:text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
