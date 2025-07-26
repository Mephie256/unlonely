import { NextRequest, NextResponse } from 'next/server'

// Mock prisma for when it's not available
let prisma: any;
try {
  prisma = require('@/lib/db').prisma;
} catch (error) {
  console.warn('Prisma not available, using client-side storage fallback');
  prisma = null;
}

// Helper function to check if database is available
const isDatabaseAvailable = async () => {
  try {
    // If prisma is not available, return false
    if (!prisma) return false;

    // Check if we have a proper database URL for production
    if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL?.startsWith('http')) {
      return false
    }

    // Try a simple database operation
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    console.warn('Database not available:', error)
    return false
  }
}

// GET - Retrieve all mood entries
export async function GET() {
  try {
    const dbAvailable = await isDatabaseAvailable()

    if (!dbAvailable) {
      // Return a special response indicating client-side storage should be used
      return NextResponse.json({ useClientStorage: true, entries: [] })
    }

    const moodEntries = await prisma.moodEntry.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ useClientStorage: false, entries: moodEntries })
  } catch (error) {
    console.error('Error fetching mood entries:', error)
    // Fallback to client-side storage
    return NextResponse.json({ useClientStorage: true, entries: [] })
  }
}

// POST - Create a new mood entry
export async function POST(request: NextRequest) {
  try {
    const { mood, note } = await request.json()

    if (!mood) {
      return NextResponse.json(
        { error: 'Mood is required' },
        { status: 400 }
      )
    }

    // Validate mood value
    const validMoods = ['Happy', 'Meh', 'Sad']
    if (!validMoods.includes(mood)) {
      return NextResponse.json(
        { error: 'Invalid mood value. Must be Happy, Meh, or Sad' },
        { status: 400 }
      )
    }

    const dbAvailable = await isDatabaseAvailable()

    if (!dbAvailable) {
      // Return a success response but indicate client should handle storage
      const mockEntry = {
        id: `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        mood,
        note: note || null,
        createdAt: new Date().toISOString()
      }
      return NextResponse.json({
        useClientStorage: true,
        entry: mockEntry
      }, { status: 201 })
    }

    const moodEntry = await prisma.moodEntry.create({
      data: {
        mood,
        note: note || null,
      }
    })

    return NextResponse.json({
      useClientStorage: false,
      entry: moodEntry
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating mood entry:', error)
    // Fallback to client-side storage - let client handle the entry creation
    return NextResponse.json({
      useClientStorage: true,
      entry: null
    }, { status: 201 })
  }
}
