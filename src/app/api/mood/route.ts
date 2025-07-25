import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET - Retrieve all mood entries
export async function GET() {
  try {
    // Check if we're in a serverless environment without persistent storage
    if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL?.startsWith('http')) {
      console.warn('Database not configured for production, returning empty array')
      return NextResponse.json([])
    }

    const moodEntries = await prisma.moodEntry.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(moodEntries)
  } catch (error) {
    console.error('Error fetching mood entries:', error)
    // Return empty array if database is not accessible
    return NextResponse.json([])
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

    // Check if we're in a serverless environment without persistent storage
    if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL?.startsWith('http')) {
      console.warn('Database not configured for production')
      return NextResponse.json(
        { error: 'Mood tracking is not available in this deployment. Please configure a cloud database.' },
        { status: 503 }
      )
    }

    const moodEntry = await prisma.moodEntry.create({
      data: {
        mood,
        note: note || null,
      }
    })

    return NextResponse.json(moodEntry, { status: 201 })
  } catch (error) {
    console.error('Error creating mood entry:', error)
    return NextResponse.json(
      { error: 'Database not available. Please configure a cloud database for mood tracking.' },
      { status: 503 }
    )
  }
}
