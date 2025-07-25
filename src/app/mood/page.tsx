"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Calendar, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { getMoodEmoji, formatDate } from "@/lib/utils"
import toast from "react-hot-toast"

interface MoodEntry {
  id: string
  mood: string
  note?: string
  createdAt: string
}

const moods = [
  { value: 'Happy', label: 'Happy', emoji: '😊', color: 'bg-green-100 hover:bg-green-200 border-green-300' },
  { value: 'Meh', label: 'Meh', emoji: '😐', color: 'bg-yellow-100 hover:bg-yellow-200 border-yellow-300' },
  { value: 'Sad', label: 'Sad', emoji: '😢', color: 'bg-blue-100 hover:bg-blue-200 border-blue-300' },
]

export default function MoodPage() {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([])
  const [selectedMood, setSelectedMood] = useState<string>('')
  const [note, setNote] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    fetchMoodEntries()
  }, [])

  const fetchMoodEntries = async () => {
    try {
      const response = await fetch('/api/mood')
      if (response.ok) {
        const entries = await response.json()
        setMoodEntries(Array.isArray(entries) ? entries : [])
      } else {
        console.warn('Failed to fetch mood entries, using empty array')
        setMoodEntries([])
      }
    } catch (error) {
      console.error('Error fetching mood entries:', error)
      setMoodEntries([])
    }
  }

  const saveMoodEntry = async () => {
    if (!selectedMood) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/mood', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mood: selectedMood,
          note: note.trim() || null,
        }),
      })

      if (response.ok) {
        const newEntry = await response.json()
        setMoodEntries(prev => [newEntry, ...prev])
        setSelectedMood('')
        setNote('')
        setShowForm(false)
        toast.success('Mood saved! 💙')
      } else {
        throw new Error('Failed to save mood')
      }
    } catch (error) {
      console.error('Error saving mood:', error)
      toast.error('Failed to save mood. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 px-2">
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold">Mood Tracker</h1>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base">
          Track your emotions and reflect on your journey
        </p>
      </div>

      {/* Add Mood Button */}
      {!showForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Button
            onClick={() => setShowForm(true)}
            size="lg"
            className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 min-h-[48px] w-full sm:w-auto max-w-xs"
          >
            <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            Log Your Mood
          </Button>
        </motion.div>
      )}

      {/* Mood Entry Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>How are you feeling right now?</CardTitle>
                <CardDescription>
                  Select your mood and optionally add a note about your day
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Mood Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  {moods.map((mood) => (
                    <motion.button
                      key={mood.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedMood(mood.value)}
                      className={`p-4 sm:p-6 rounded-lg border-2 transition-all min-h-[80px] sm:min-h-[100px] ${
                        selectedMood === mood.value
                          ? `${mood.color} ring-2 ring-primary`
                          : `${mood.color} opacity-70`
                      }`}
                    >
                      <div className="text-3xl sm:text-4xl mb-1 sm:mb-2">{mood.emoji}</div>
                      <div className="font-medium text-sm sm:text-base">{mood.label}</div>
                    </motion.button>
                  ))}
                </div>

                {/* Note Input */}
                {selectedMood && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2"
                  >
                    <label className="text-sm font-medium">
                      Journal Note (Optional)
                    </label>
                    <Textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="What's on your mind? How was your day?"
                      className="min-h-[100px]"
                    />
                  </motion.div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowForm(false)
                      setSelectedMood('')
                      setNote('')
                    }}
                    className="w-full sm:w-auto min-h-[44px]"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={saveMoodEntry}
                    disabled={!selectedMood || isLoading}
                    className="w-full sm:w-auto min-h-[44px]"
                  >
                    {isLoading ? 'Saving...' : 'Save Mood'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mood History */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold flex items-center gap-2">
          <Calendar className="h-5 w-5 sm:h-6 sm:w-6" />
          Your Mood History
        </h2>

        {moodEntries.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8 sm:py-12">
              <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🌱</div>
              <h3 className="text-lg sm:text-xl font-medium mb-2">No moods logged yet</h3>
              <p className="text-muted-foreground text-sm sm:text-base">
                Start tracking your emotions to see your journey over time
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {moodEntries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="text-2xl sm:text-3xl flex-shrink-0">{getMoodEmoji(entry.mood)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                          <span className="font-medium text-sm sm:text-base">{entry.mood}</span>
                          <span className="text-xs sm:text-sm text-muted-foreground">
                            {formatDate(new Date(entry.createdAt))}
                          </span>
                        </div>
                        {entry.note && (
                          <div className="flex items-start gap-2 mt-2">
                            <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                              {entry.note}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
