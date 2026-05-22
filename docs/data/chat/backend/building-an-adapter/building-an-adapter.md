---
productId: x-chat
title: Building an Adapter
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
---

# Chat - Building an Adapter

<p class="description">A step-by-step tutorial for connecting your chat UI to any backend.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

This page walks you through building a `ChatAdapter` from scratch.
You will start with the minimum viable adapter (`sendMessage` only), then progressively add history loading and conversation management.

## Step 1: The minimal adapter

The only required method is `sendMessage`.
It receives the user's message and must return a `ReadableStream` of typed chunks.

```tsx
import { ChatBox } from '@mui/x-chat';
import type { ChatAdapter } from '@mui/x-chat/headless';

const adapter: ChatAdapter = {
  async sendMessage({ message, signal }) {
    const res = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
      signal,
    });
    return res.body!; // ReadableStream<ChatMessageChunk>
  },
};

export default function App() {
  return <ChatBox adapter={adapter} sx={{ height: 500 }} />;
}
```

The runtime handles streaming, message normalization, error surfacing, and state updates.
Your adapter only needs to know how to talk to your backend.

## Step 2: Implement streaming from scratch

If your backend does not return a `ReadableStream` natively (for example, you are using a WebSocket or a custom protocol), you can construct the stream manually.

The stream must begin with a `start` chunk and end with `finish` or `abort`.
Text arrives in `text-start`, `text-delta`, and `text-end` triplets:

```tsx
const adapter: ChatAdapter = {
  async sendMessage({ message }) {
    return new ReadableStream({
      start(controller) {
        controller.enqueue({ type: 'start', messageId: 'msg-1' });
        controller.enqueue({ type: 'text-start', id: 'text-1' });
        controller.enqueue({ type: 'text-delta', id: 'text-1', delta: 'Hello!' });
        controller.enqueue({ type: 'text-end', id: 'text-1' });
        controller.enqueue({ type: 'finish', messageId: 'msg-1' });
        controller.close();
      },
    });
  },
};
```

For a real integration, you would typically read from your backend inside the `start` callback and enqueue chunks as they arrive:

```tsx
const adapter: ChatAdapter = {
  async sendMessage({ message, signal }) {
    return new ReadableStream({
      async start(controller) {
        const response = await fetch('/api/chat', {
          method: 'POST',
          body: JSON.stringify({
            text: message.parts[0]?.type === 'text' ? message.parts[0].text : '',
          }),
          signal,
        });

        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        const messageId = `msg-${Date.now()}`;

        controller.enqueue({ type: 'start', messageId });
        controller.enqueue({ type: 'text-start', id: 'text-1' });

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const text = decoder.decode(value, { stream: true });
            controller.enqueue({ type: 'text-delta', id: 'text-1', delta: text });
          }
          controller.enqueue({ type: 'text-end', id: 'text-1' });
          controller.enqueue({ type: 'finish', messageId });
        } catch (error) {
          controller.enqueue({ type: 'text-end', id: 'text-1' });
          controller.enqueue({ type: 'abort', messageId });
        } finally {
          controller.close();
        }
      },
    });
  },
};
```

## Step 3: Wire up the abort signal

`input.signal` is an `AbortSignal` that fires when the user clicks the stop button.
Pass it to your `fetch` call so the HTTP request is cancelled automatically:

```tsx
async sendMessage({ message, signal }) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ message }),
    signal, // browser cancels the request when the user stops
  });
  return res.body!;
},
```

If your backend requires explicit cancellation (for example, sending a separate cancel request), implement the optional `stop()` method alongside the signal:

```tsx
stop() {
  fetch('/api/chat/cancel', { method: 'POST' });
},
```

## Step 4: Add message history with `listMessages`

Implement `listMessages` to load history when the user opens a conversation.
The runtime calls it whenever `activeConversationId` changes to a conversation that has no messages in the store yet.

```tsx
const adapter: ChatAdapter = {
  async sendMessage(input) {
    /* ... from Step 1 ... */
  },

  async listMessages({ conversationId, cursor }) {
    const params = new URLSearchParams({ cursor: cursor ?? '' });
    const res = await fetch(
      `/api/conversations/${conversationId}/messages?${params}`,
    );
    const { messages, nextCursor, hasMore } = await res.json();
    return { messages, cursor: nextCursor, hasMore };
  },
};
```

When `hasMore` is `true`, `ChatBox` shows a "Load earlier messages" control that calls `listMessages` again with the previous cursor.

## Step 5: Add conversation listing with `listConversations`

Implement `listConversations` to populate the conversation sidebar when `ChatBox` mounts.
The runtime calls it once on startup, before any user interaction.

```tsx
const adapter: ChatAdapter = {
  async sendMessage(input) {
    /* ... */
  },

  async listMessages(input) {
    /* ... from Step 4 ... */
  },

  async listConversations() {
    const res = await fetch('/api/conversations');
    const { conversations } = await res.json();
    return { conversations };
  },
};
```

For paginated conversation lists, return a `cursor` and `hasMore`:

```tsx
async listConversations({ cursor }) {
  const params = new URLSearchParams();
  if (cursor) params.set('cursor', cursor);
  const res = await fetch(`/api/conversations?${params}`);
  const { conversations, nextCursor, hasMore } = await res.json();
  return { conversations, cursor: nextCursor, hasMore };
},
```

## Step 6: Handle stream reconnection

Implement `reconnectToStream` to resume an interrupted stream—for example, when an SSE connection drops mid-response.
The runtime calls it automatically after detecting a disconnected stream.

```tsx
async reconnectToStream({ conversationId, messageId, signal }) {
  const params = new URLSearchParams();
  if (conversationId) params.set('conversationId', conversationId);
  if (messageId) params.set('messageId', messageId);
  const res = await fetch('/api/chat/reconnect', {
    method: 'POST',
    body: params.toString(),
    signal,
  });
  if (res.status === 404) return null; // message no longer resumable
  return res.body!;
},
```

Return `null` if the interrupted message cannot be resumed.

## Complete adapter

Here is a complete adapter that combines all the steps:

```tsx
import type { ChatAdapter } from '@mui/x-chat/headless';

const adapter: ChatAdapter = {
  async sendMessage({ message, signal }) {
    const res = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
      signal,
    });
    return res.body!;
  },

  async listMessages({ conversationId, cursor }) {
    const params = new URLSearchParams({ cursor: cursor ?? '' });
    const res = await fetch(
      `/api/conversations/${conversationId}/messages?${params}`,
    );
    const { messages, nextCursor, hasMore } = await res.json();
    return { messages, cursor: nextCursor, hasMore };
  },

  async listConversations() {
    const res = await fetch('/api/conversations');
    const { conversations } = await res.json();
    return { conversations };
  },

  async reconnectToStream({ conversationId, messageId, signal }) {
    const res = await fetch('/api/chat/reconnect', {
      method: 'POST',
      body: JSON.stringify({ conversationId, messageId }),
      signal,
    });
    if (res.status === 404) return null;
    return res.body!;
  },
};
```

## Error handling

:::info
You do not need to catch errors inside adapter methods—the runtime handles them for you.
:::

When an adapter method throws, the runtime records a `ChatError`, surfaces it through the built-in error UI and the `onError` callback, and marks the error `recoverable` or `retryable` when applicable.

To handle errors at the application level:

```tsx
<ChatBox
  adapter={adapter}
  onError={(error) => {
    console.error('[Chat error]', error.source, error.message);
  }}
/>
```

## See also

- [Adapters](/x/react-chat/backend/adapters/) for the full interface reference.
- [Streaming](/x/react-chat/behavior/streaming/) for the full stream chunk protocol reference.
- [Real-time adapters](/x/react-chat/backend/real-time-adapters/) for adding `subscribe()`, `setTyping()`, and `markRead()`.

## API
