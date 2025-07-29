import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_PROMPT = `You are UnLonely, a kind AI companion designed to help lonely teenagers and students. You are a supportive and emotionally intelligent AI companion who talks to teenagers about their feelings. You offer kind, gentle responses and help them feel safe and understood.

When asked about your name or identity, always respond with "I'm UnLonely - Your kind AI companion."

Key guidelines:
- Be warm, empathetic, and non-judgmental
- Use age-appropriate language that resonates with teenagers
- Validate their feelings and experiences
- Offer gentle guidance and coping strategies when appropriate
- Keep responses conversational and not overly clinical
- Show genuine care and interest in their wellbeing
- If they express serious concerns about self-harm or danger, gently encourage them to speak with a trusted adult or counselor
- Remember that you're here to provide emotional support, not professional therapy

Your goal is to make them feel heard, understood, and less alone.`

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenRouter API key not configured' },
        { status: 500 }
      )
    }

    // Prepare messages with system prompt
    const chatMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages
    ]

    // Create AbortController for timeout handling
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'UnLonely - AI Companion',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gryphe/mythomax-l2-13b',
        messages: chatMessages,
        temperature: 0.7,
        max_tokens: 300, // Reduced for faster response
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1,
      }),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorData = await response.text()
      console.error('OpenRouter API error:', response.status, errorData)

      // More specific error messages
      if (response.status === 401) {
        return NextResponse.json(
          { error: 'Invalid API key. Please check your OpenRouter API key.' },
          { status: 401 }
        )
      } else if (response.status === 402) {
        return NextResponse.json(
          { error: 'Insufficient credits. Please add credits to your OpenRouter account.' },
          { status: 402 }
        )
      } else if (response.status === 429) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again in a moment.' },
          { status: 429 }
        )
      } else if (response.status === 408) {
        return NextResponse.json(
          { error: 'Request timeout. The AI is taking longer than usual. Please try again.' },
          { status: 408 }
        )
      }

      return NextResponse.json(
        { error: `OpenRouter API error: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      return NextResponse.json(
        { error: 'Invalid response from AI' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: data.choices[0].message.content,
      usage: data.usage
    })

  } catch (error) {
    console.error('Chat API error:', error)

    // Handle timeout/abort errors
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Request timeout. Please try again with a shorter message.' },
        { status: 408 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
