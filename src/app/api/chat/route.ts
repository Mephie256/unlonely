import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_PROMPT = `You are a supportive and emotionally intelligent AI companion who talks to teenagers about their feelings. You offer kind, gentle responses and help them feel safe and understood. 

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

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'UnLonely - AI Companion',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistralai/mixtral-8x7b-instruct',
        messages: chatMessages,
        temperature: 0.7,
        max_tokens: 500,
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1,
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('OpenRouter API error:', errorData)
      return NextResponse.json(
        { error: 'Failed to get response from AI' },
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
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
