import type { ChatCompletionRequest } from '@/zustand/stores/chatStore'
import { getModelUrl } from '@/constants/chat'

export type StreamCallback = (chunk: string) => void


export async function sendChatRequest(
  req: ChatCompletionRequest,
  apiKey: string,
  onStream?: StreamCallback,
  endpoint?: string,
  signal?: AbortSignal
): Promise<string> {
  // 强制使用本地代理，避免前端携带密钥
  const proxy = endpoint || '/api/chat/gemini'

  // 将通用 messages 转换为 Gemini generateContent 请求体
  const toGeminiBody = (r: ChatCompletionRequest) => {
    const contents = r.messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: Array.isArray(m.content)
        ? (m.content as any[]).map((c: any) =>
            c.type === 'image_url'
              ? { fileData: { mimeType: 'image/*', data: c.image_url?.url } }
              : { text: c.text || '' }
          )
        : [{ text: String(m.content) }],
    }))
    return {
      contents,
      generationConfig: {
        temperature: req.temperature,
        maxOutputTokens: req.max_tokens,
        topP: req.top_p,
        topK: req.top_k,
      },
    }
  }

  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (req.stream) {
    headers['Accept'] = 'text/event-stream'
  } else {
    headers['Accept'] = 'application/json'
  }
  if (!isLocalProxy) headers['X-goog-api-key'] = apiKey

  const body = toGeminiBody(req)

  // 流式
  if (req.stream) {
    const res = await fetch(proxy, { method: 'POST', headers, body: JSON.stringify(body), signal })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const contentType = res.headers.get('content-type') || ''
    if (contentType.includes('text/event-stream')) {
      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let fullText = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })

        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const rawLine of lines) {
          const line = rawLine.trim()
          if (!line) continue
          if (!line.startsWith('data:')) continue
          const payload = line.slice(5).trim()
          if (!payload) continue
          if (payload === '[DONE]') continue
          try {
            const json = JSON.parse(payload)
            const parts = json?.candidates?.[0]?.content?.parts
            if (Array.isArray(parts)) {
              const delta = parts.map((p: any) => p?.text).filter(Boolean).join('')
              if (delta) {
                fullText += delta
                if (onStream) onStream(delta)
              }
            }
          } catch {
            // 忽略单行解析错误
          }
        }
      }
      return fullText
    }

    // JSON fallback
    const json = await res.json()
    const txt = extractTextFromGemini(json)
    if (txt && onStream) onStream(txt)
    return txt
  }

  // 非流式
  const res = await fetch(proxy, { method: 'POST', headers, body: JSON.stringify(body), signal })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  return extractTextFromGemini(data)
}

function extractTextFromGemini(data: any): string {
  try {
    const parts = data?.candidates?.[0]?.content?.parts
    if (Array.isArray(parts)) {
      return parts.map((p: any) => p?.text).filter(Boolean).join('\n') || ''
    }
    return ''
  } catch {
    return ''
  }
}