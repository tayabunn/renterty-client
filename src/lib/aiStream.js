import { API_URL } from './config';

/**
 * Consumes the SSE stream from /api/ai/assistant/stream
 * Handles tokens, tool lifecycle events, error states, and abort signals
 */
export async function streamAssistantMessage({
  message,
  conversationHistory = [],
  onToken,
  onToolCall,
  onToolExecuting,
  onToolResult,
  onDone,
  onError,
  signal
}) {
  const url = `${API_URL}/ai/assistant/stream`;

  const headers = {
    'Content-Type': 'application/json'
  };

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('renterty_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ message, conversationHistory }),
      signal,
      credentials: 'include'
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Stream failed with status ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n\n');
      buffer = lines.pop() || '';

      for (const block of lines) {
        if (!block.trim()) continue;
        const blockLines = block.split('\n');
        let event = 'message';
        let dataStr = '';

        for (const line of blockLines) {
          if (line.startsWith('event: ')) {
            event = line.slice(7).trim();
          } else if (line.startsWith('data: ')) {
            dataStr = line.slice(6).trim();
          }
        }

        if (!dataStr) continue;

        let parsedData = {};
        try {
          parsedData = JSON.parse(dataStr);
        } catch {
          parsedData = { text: dataStr };
        }

        switch (event) {
          case 'token':
            if (onToken) onToken(parsedData.delta || '');
            break;
          case 'tool_call':
            if (onToolCall) onToolCall(parsedData);
            break;
          case 'tool_executing':
            if (onToolExecuting) onToolExecuting(parsedData);
            break;
          case 'tool_result':
            if (onToolResult) onToolResult(parsedData);
            break;
          case 'done':
            if (onDone) onDone(parsedData);
            break;
          case 'error':
            if (onError) onError(new Error(parsedData.message || 'Error occurred'));
            break;
          default:
            break;
        }
      }
    }
  } catch (err) {
    if (err.name === 'AbortError') {
      // User pressed Stop
      return;
    }
    if (onError) onError(err);
  }
}
