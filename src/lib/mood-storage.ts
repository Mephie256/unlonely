// Client-side mood storage utilities for when database is not available

export interface MoodEntry {
  id: string
  mood: string
  note: string | null
  createdAt: string
}

const MOOD_STORAGE_KEY = 'unlonely_mood_entries'

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined'

export const moodStorage = {
  // Get all mood entries from localStorage
  getEntries: (): MoodEntry[] => {
    if (!isBrowser) return []
    
    try {
      const stored = localStorage.getItem(MOOD_STORAGE_KEY)
      if (!stored) return []
      
      const entries = JSON.parse(stored)
      // Sort by createdAt descending (newest first)
      return entries.sort((a: MoodEntry, b: MoodEntry) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    } catch (error) {
      console.error('Error reading mood entries from localStorage:', error)
      return []
    }
  },

  // Save a new mood entry to localStorage
  saveEntry: (mood: string, note: string | null): MoodEntry => {
    if (!isBrowser) {
      throw new Error('Cannot save to localStorage in server environment')
    }

    const newEntry: MoodEntry = {
      id: `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      mood,
      note,
      createdAt: new Date().toISOString()
    }

    try {
      const existingEntries = moodStorage.getEntries()
      const updatedEntries = [newEntry, ...existingEntries]
      
      localStorage.setItem(MOOD_STORAGE_KEY, JSON.stringify(updatedEntries))
      return newEntry
    } catch (error) {
      console.error('Error saving mood entry to localStorage:', error)
      throw new Error('Failed to save mood entry')
    }
  },

  // Clear all mood entries (for testing or reset purposes)
  clearEntries: (): void => {
    if (!isBrowser) return
    
    try {
      localStorage.removeItem(MOOD_STORAGE_KEY)
    } catch (error) {
      console.error('Error clearing mood entries from localStorage:', error)
    }
  },

  // Get the count of stored entries
  getEntryCount: (): number => {
    return moodStorage.getEntries().length
  }
}
