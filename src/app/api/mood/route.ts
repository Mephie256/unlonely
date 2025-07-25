import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET - Retrieve all mood entries
export async function GET() {
  try {
    const moodEntries = await prisma.moodEntry.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(moodEntries)
  } catch (error) {
    console.error('Error fetching mood entries:', error)
    return NextResponse.json(
      { error: 'Failed to fetch mood entries' },
      { status: 500 }
    )
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
      { error: 'Failed to create mood entry' },
      { status: 500 }
    )
  }
}
