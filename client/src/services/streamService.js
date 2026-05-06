import { API_BASE_URL, TOKEN_STORAGE_KEY } from './api';

function buildStreamError(message, details = {}) {
  const error = new Error(message);
  Object.assign(error, details);
  return error;
}

function parseSseSegment(segment) {
  if (!segment.trim()) {
    return null;
  }

  const lines = segment.split('\n');
  let event = 'message';
  let data = '';

  for (const line of lines) {
    if (line.startsWith('event:')) {
      event = line.slice(6).trim();
    }

    if (line.startsWith('data:')) {
      data += line.slice(5).trim();
    }
  }

  return {
    event,
    data: data ? JSON.parse(data) : null,
  };
}

function dispatchStreamEvent(parsedEvent, handlers) {
  if (!parsedEvent) {
    return;
  }

  if (parsedEvent.event === 'start') {
    handlers.onStart?.(parsedEvent.data);
    return;
  }

  if (parsedEvent.event === 'token') {
    handlers.onToken?.(parsedEvent.data?.token || '');
    return;
  }

  if (parsedEvent.event === 'done') {
    handlers.onDone?.(parsedEvent.data);
    return;
  }

  if (parsedEvent.event === 'error') {
    const error = buildStreamError(
      parsedEvent.data?.message || 'The generation stream failed.',
      {
        code: parsedEvent.data?.code,
        details: parsedEvent.data,
      }
    );

    handlers.onError?.(error);
    throw error;
  }
}

export async function streamGeneration({
  type,
  payload,
  signal,
  onStart,
  onToken,
  onDone,
  onError,
}) {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  const response = await fetch(`${API_BASE_URL}/generate/${type}`, {
    method: 'POST',
    headers: {
      Accept: 'text/event-stream',
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
    signal,
  });

  if (!response.ok) {
    let errorPayload = {};

    try {
      errorPayload = await response.json();
    } catch (error) {
      errorPayload = {};
    }

    const streamError = buildStreamError(
      errorPayload.message || 'Unable to start generation.',
      {
        code: errorPayload.code,
        details: errorPayload,
      }
    );

    onError?.(streamError);
    throw streamError;
  }

  if (!response.body) {
    const unsupportedError = buildStreamError(
      'Streaming is not supported in this browser.'
    );
    onError?.(unsupportedError);
    throw unsupportedError;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      buffer += decoder.decode(value || new Uint8Array(), { stream: !done });

      const segments = buffer.split('\n\n');
      buffer = segments.pop() ?? '';

      for (const segment of segments) {
        const parsedEvent = parseSseSegment(segment);
        dispatchStreamEvent(parsedEvent, { onStart, onToken, onDone, onError });
      }

      if (done) {
        break;
      }
    }

    if (buffer.trim()) {
      const parsedEvent = parseSseSegment(buffer);
      dispatchStreamEvent(parsedEvent, { onStart, onToken, onDone, onError });
    }
  } finally {
    reader.releaseLock();
  }
}
