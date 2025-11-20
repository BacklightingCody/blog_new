import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_MODEL_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'Missing GEMINI API KEY' }, { status: 401 })
    }

    const body = await request.json()
    // 将前端通用体转换为 Gemini 体（容错处理）
    const normalize = (payload: any) => {
      if (payload?.contents) return payload
      const messages = payload?.messages || []
      const contents = messages.map((m: any) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: Array.isArray(m.content)
          ? m.content.map((c: any) => (c.type === 'image_url' ? { fileData: { mimeType: 'image/*', data: c.image_url?.url } } : { text: c.text || '' }))
          : [{ text: String(m.content ?? '') }],
      }))
      const generationConfig: any = {}
      if (payload.temperature !== undefined) generationConfig.temperature = payload.temperature
      if (payload.max_tokens !== undefined) generationConfig.maxOutputTokens = payload.max_tokens
      if (payload.top_p !== undefined) generationConfig.topP = payload.top_p
      if (payload.top_k !== undefined) generationConfig.topK = payload.top_k
      return { contents, generationConfig }
    }
    const geminiBody = normalize(body)
    const preferSSE = (body?.streamFormat || 'sse') === 'sse'

    if (preferSSE) {
      const sseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse'
      const upstream = await fetch(sseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-goog-api-key': apiKey },
        body: JSON.stringify(geminiBody),
      })

      if (!upstream.body) {
        const data = await upstream.json().catch(() => ({}))
        return NextResponse.json(data, { status: upstream.status })
      }

      const stream = new ReadableStream({
        async start(controller) {
          const reader = upstream.body!.getReader()
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            controller.enqueue(value)
          }
          controller.close()
        }
      })

      return new NextResponse(stream as any, {
        status: 200,
        headers: {
          'Content-Type': 'text/event-stream; charset=utf-8',
          'Cache-Control': 'no-cache, no-transform',
          Connection: 'keep-alive',
          'X-Accel-Buffering': 'no',
        },
      })
    }

    const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-goog-api-key': apiKey, 'Accept': 'application/json' },
      body: JSON.stringify(geminiBody),
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'proxy error' }, { status: 500 })
  }
}


