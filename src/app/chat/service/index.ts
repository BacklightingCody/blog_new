import { ChatCompletionRequest, ApiResponse } from '../types';

/**
 * 发送聊天请求
 */
export async function sendChatRequest(
  request: ChatCompletionRequest,
  apiKey: string,
  onChunk: (chunk: string) => void,
  apiUrl: string,
  abortSignal?: AbortSignal
): Promise<string> {
  console.log('发送聊天请求:', { url: apiUrl, request });
  // 携带与后端约定的token
  const token = encodeBase64(apiKey);
  let result = '';
  if (request.model === 'hunyuan-turbos-vision') {
    request.useNewKey = true;
  }
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
        Accept: 'text/event-stream',
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify(request),
      signal: abortSignal
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      // JSON 响应处理
      const jsonResponse: ApiResponse = await response.json();

      if (jsonResponse.code === 0 && jsonResponse.data?.answer) {
        result = jsonResponse.data.answer;
        return result;
      } else {
        throw new Error(jsonResponse.message || '请求失败');
      }
    } else if (
      contentType.includes('text/event-stream') ||
      contentType.includes('text/plain')
    ) {
      // SSE 流式响应处理
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('无法获取响应流');
      }

      const decoder = new TextDecoder();
      let buffer = ''; // 用于处理跨chunk的数据，缓存区数据

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log('🔚 Reader 完成');
          break;
        }

        // 将新数据添加到缓冲区
        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        // 按行分割处理
        const lines = buffer.split('\n');
        // 保留最后一行（可能不完整）
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmedLine = line.trim();

          // 处理 SSE 数据行
          if (trimmedLine.startsWith('data: ')) {
            const content = trimmedLine.slice(6).trim();

            // 检查结束标志
            if (content === '[DONE]') {
              console.log('🏁 SSE 流结束');
              return result;
            }

            // 跳过空数据行
            if (!content) continue;

            try {
              const data = JSON.parse(content);

              // 提取内容增量
              const delta = data.choices?.[0]?.delta?.content;
              if (delta !== undefined && delta !== null) {
                result += delta;
                // 立即显示每个词语，不做批量处理
                onChunk(delta);
                console.log('📝', delta);
              }

              // 检查是否完成
              const finishReason = data.choices?.[0]?.finish_reason;
              if (finishReason === 'stop') {
                console.log('✅ 流式响应完成');
                return result;
              }
            } catch (e) {
              console.warn('❌ 解析 SSE 数据失败:', { line: trimmedLine, error: e });
            }
          }
        }
      }

      return result;
    } else {
      throw new Error('不支持的响应类型');
    }
  } catch (error) {
    console.error('聊天请求失败:', error);
    throw error;
  }
}

/**
 * Base64 编码
 */
function encodeBase64(str: string): string {
  if (typeof window !== 'undefined') {
    return window.btoa(
      encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => {
        return String.fromCharCode(parseInt(p1, 16));
      })
    );
  }
  // 浏览器环境的 fallback
  return btoa(unescape(encodeURIComponent(str)));
}
