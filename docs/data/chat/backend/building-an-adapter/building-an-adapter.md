---
productId: x-chat
title: Building an adapter
packageName: '@mui/x-chat'
components: ChatBox
githubLabel: 'scope: chat'
---

# Chat - Building an adapter

<p class="description">Implement a <code>ChatAdapter</code> step by step to connect any backend to the Chat runtime.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

Build a `ChatAdapter` from scratch by starting with a minimum viable adapter (`sendMessage` only), then progressively add history loading and conversation management.
This page is the hands-on tutorial — for the complete interface reference, see [Adapters](/x/react-chat/backend/adapters/).

## Step 1: Building a minimal adapter

The only required method is `sendMessage`.
It receives the user's message and must return a `ReadableStream` of typed chunks.
The `message` argument is a `ChatMessage` — its content lives in a `parts` array (text, files, and other part types), not a plain string. See [Messages](/x/react-chat/basics/messages/) for the full shape.

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
The adapter only needs to know how to talk to the backend.

## Step 2: Implementing streaming from scratch

If your backend does not return a `ReadableStream` natively (for example, you are using a WebSocket or a custom protocol), you can construct the stream manually.

The stream must begin with a `start` chunk and end with `finish` or `abort`.
Text arrives in `text-start` / `text-delta` / `text-end` triplets:
These are only the text chunks — for the complete list of chunk types (reasoning, tools, sources, files, and more), see the [chunk type reference](/x/react-chat/behavior/streaming/#chunk-type-reference).

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

The `messageId` identifies the assistant message being streamed and must be unique per message — the next example generates one per request.

For a real integration, read from the backend inside the `start` callback and enqueue chunks as they arrive — here the adapter extracts the plain text from the message's first `parts` entry before posting it:

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

## Step 3: Wiring up the abort signal

The `signal` argument is an `AbortSignal` that fires when streaming is cancelled — for example when the headless `stopStreaming()` action from `useChat()` is called. (`ChatBox` does not render a stop button by default; its send button is disabled while streaming.)
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

`stop()` takes no arguments and returns nothing. The runtime calls it in addition to aborting the signal — not instead of it — so keep passing `signal` to your requests.

The following demo combines Steps 2 and 3: a hand-rolled adapter that streams a canned reply chunk by chunk. `ChatBox` does not render a stop button of its own, so the demo adds one with the headless `stopStreaming()` action — pressing it mid-stream fires the abort signal.

{{"demo": "ManualStreamAdapterDemo.js"}}

## Step 4: Adding message history

Implement `listMessages` to load history when the user opens a conversation.
The runtime calls it whenever the active conversation changes to one that has no messages in the store yet.

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

When `hasMore` is `true`, `ChatBox` automatically loads earlier messages as the user scrolls to the top of the list, calling `listMessages` again with the previous cursor. See [History and pagination](/x/react-chat/multi-conversation/history-and-pagination/).

## Step 5: Listing conversations

Implement `listConversations` to load conversation state when `ChatBox` mounts.
If `features={{ conversationList: true }}` is enabled, the same data also powers the built-in conversation sidebar.
The runtime calls it once on startup, before any user interaction.

```tsx
const adapter: ChatAdapter = {
  async sendMessage(input) {
    /* ... from Step 1 ... */
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

## Step 6: Handling stream reconnection

Implement `reconnectToStream` to resume an interrupted stream—for example, when an SSE connection drops mid-response.
The runtime calls it automatically after detecting a disconnected stream, with one reconnect attempt for the interrupted assistant message.

```tsx
async reconnectToStream({ conversationId, messageId, signal }) {
  const res = await fetch('/api/chat/reconnect', {
    method: 'POST',
    body: JSON.stringify({ conversationId, messageId }),
    signal,
  });
  if (res.status === 404) return null; // message no longer resumable
  return res.body!;
},
```

Return `null` if the interrupted message cannot be resumed.

## Complete adapter

The following adapter combines all the steps:

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

  stop() {
    fetch('/api/chat/cancel', { method: 'POST' });
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

Errors marked `retryable` expose a retry action in the built-in error UI. See [Error handling](/x/react-chat/behavior/error-handling/) for the full error model and customization options.

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

- See [Adapters](/x/react-chat/backend/adapters/) for the full `ChatAdapter` interface reference and pagination cursor typing.
- See [Streaming](/x/react-chat/behavior/streaming/) for the stream lifecycle, envelopes, and the chunk type reference.
- See [Real-time adapters](/x/react-chat/backend/real-time-adapters/) for push-based updates with `subscribe()`, `setTyping()`, and `markRead()`.
- See [Error handling](/x/react-chat/behavior/error-handling/) for the `ChatError` model and error UI.

## API
