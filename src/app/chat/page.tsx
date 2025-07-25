"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  isTyping?: boolean
}

// Simple typewriter component
function TypewriterText({ text, onComplete }: { text: string; onComplete?: () => void }) {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, 15) // Faster typing speed (was 30ms, now 15ms)

      return () => clearTimeout(timer)
    } else if (onComplete) {
      onComplete()
    }
  }, [currentIndex, text, onComplete])

  return <span>{displayedText}</span>
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleTypingComplete = (messageId: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, isTyping: false } : msg
      )
    )
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Add welcome message on mount
  useEffect(() => {
    const welcomeMessage: Message = {
      id: '1',
      role: 'assistant',
      content: "Hi there! I'm here to listen and support you. How are you feeling today? 💙",
      timestamp: new Date()
    }
    setMessages([welcomeMessage])
  }, [])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
        isTyping: true
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I'm having trouble responding right now. Please try again in a moment. 💙",
        timestamp: new Date(),
        isTyping: true
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-16rem)] sm:h-[calc(100vh-12rem)] flex flex-col">
      <div className="mb-4 sm:mb-6 px-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-center">Chat with Your AI Companion</h1>
        <p className="text-muted-foreground text-center mt-2 text-sm sm:text-base">
          Share your thoughts and feelings in a safe, supportive space
        </p>
      </div>

      {/* Messages Container */}
      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-3 sm:space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 sm:gap-3 ${
                message.role === 'user' ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === 'assistant' && (
                <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center">
                  <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-primary-foreground" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-lg px-3 py-2 sm:px-4 sm:py-2 ${
                  message.role === 'user'
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm sm:text-base leading-relaxed">
                  {message.role === 'assistant' && message.isTyping ? (
                    <TypewriterText
                      text={message.content}
                      onComplete={() => handleTypingComplete(message.id)}
                    />
                  ) : (
                    message.content
                  )}
                </p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              {message.role === 'user' && (
                <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-secondary rounded-full flex items-center justify-center">
                  <User className="w-3 h-3 sm:w-4 sm:h-4 text-secondary-foreground" />
                </div>
              )}
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-2 sm:gap-3 justify-start">
              <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center">
                <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-primary-foreground" />
              </div>
              <div className="bg-muted rounded-lg px-3 py-2 sm:px-4 sm:py-2">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </CardContent>

        {/* Input Form */}
        <div className="border-t p-3 sm:p-4">
          <form onSubmit={sendMessage} className="flex gap-2 sm:gap-3">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Share what's on your mind..."
              disabled={isLoading}
              className="flex-1 text-base sm:text-sm min-h-[44px]"
              autoFocus
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="min-h-[44px] min-w-[44px] px-3"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}