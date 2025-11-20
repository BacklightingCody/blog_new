import { ChatCompletionRequest } from '@/store/chat'; // Assuming chat store will be moved/created
import { api } from './client';

export type StreamCallback = (chunk: string) => void;

export const chatApi = {
  send: async (
    req: ChatCompletionRequest,
    apiKey: string,
    onStream?: StreamCallback,
    endpoint: string = '/api/chat/gemini',
    signal?: AbortSignal
  ): Promise<string> => {

    // Transform messages for Gemini if needed, similar to original service
    const contents = req.messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: Array.isArray(m.content)
        ? (m.content as any[]).map((c: any) =>
          c.type === 'image_url'
            ? { fileData: { mimeType: 'image/*', data: c.image_url?.url } }
            : { text: c.text || '' }
        )
        : [{ text: String(m.content) }],
    }));

    const body = {
      contents,
      generationConfig: {
        temperature: req.temperature,
        maxOutputTokens: req.max_tokens,
        topP: req.top_p,
        topK: req.top_k,
      },
    };

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (req.stream) {
      headers['Accept'] = 'text/event-stream';
    } else {
      headers['Accept'] = 'application/json';
    }

    // Note: In the original code, apiKey was only sent if !isLocalProxy. 
    // Here we assume the proxy handles it or we pass it if needed.
    // headers['X-goog-api-key'] = apiKey; 

    if (req.stream) {
      // Custom fetch for streaming since api.post doesn't support streaming callbacks easily yet
      // or we can extend api.post. For now, using fetch directly for stream is fine
      // but we should try to use the configured base URL if possible.

      const res = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        signal
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('text/event-stream')) {
        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let fullText = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const rawLine of lines) {
            const line = rawLine.trim();
            if (!line || !line.startsWith('data:')) continue;

            const payload = line.slice(5).trim();
            if (!payload || payload === '[DONE]') continue;

            try {
              const json = JSON.parse(payload);
              const parts = json?.candidates?.[0]?.content?.parts;
              if (Array.isArray(parts)) {
                const delta = parts.map((p: any) => p?.text).filter(Boolean).join('');
                if (delta) {
                  fullText += delta;
                  if (onStream) onStream(delta);
                }
              }
            } catch {
              // ignore
            }
          }
        }
        return fullText;
      }

      const json = await res.json();
      const txt = extractTextFromGemini(json);
      if (txt && onStream) onStream(txt);
      return txt;
    }

    // Non-streaming
    const res = await api.post<any>(endpoint, body, { headers, signal } as any);
    if (!res.success) throw new Error(res.error);
    return extractTextFromGemini(res.data);
  }
};

function extractTextFromGemini(data: any): string {
  try {
    const parts = data?.candidates?.[0]?.content?.parts;
    if (Array.isArray(parts)) {
      return parts.map((p: any) => p?.text).filter(Boolean).join('\n') || '';
    }
    return '';
  } catch {
    return '';
  }
}
