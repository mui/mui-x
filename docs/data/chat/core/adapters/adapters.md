---
productId: x-chat
title: Chat - Core adapters
packageName: '@mui/x-chat/headless'
githubLabel: 'scope: chat'
---

# Chat - Core adapters

<p class="description">Connect your backend to the chat runtime by implementing the adapter interface.</p>

The `ChatAdapter` interface is the transport boundary between the core runtime and your backend.
Only one method is required: `sendMessage()`.
Everything else is optional and incrementally adopted.

```tsx
import type { ChatAdapter } from '@mui/x-chat/headless';
```

The following demo shows a minimal adapter in action:

{{"demo": "../examples/minimal-chat/MinimalHeadlessChat.js", "bg": "inline", "defaultCodeOpen": false, "hideToolbar": true}}

## Minimal adapter

A minimal adapter returns a `ReadableStream` of chunks from `sendMessage()`:

```tsx
const adapter: ChatAdapter = {
  async sendMessage({ message }) {
    return new ReadableStream({
      start(controller) {
        controller.enqueue({ type: 'start', messageId: 'response-1' });
        controller.enqueue({ type: 'text-start', id: 'text-1' });
        controller.enqueue({ type: 'text-delta', id: 'text-1', delta: 'Hello!' });
        controller.enqueue({ type: 'text-end', id: 'text-1' });
        controller.enqueue({ type: 'finish', messageId: 'response-1' });
        controller.close();
      },
    });
  },
};
```

`ChatProvider` then handles streaming, message normalization, and state updates.

## Adapter interface reference

```ts
interface ChatAdapter<Cursor = string> {
  // Required
  sendMessage(
    input: ChatSendMessageInput,
  ): Promise<ReadableStream<ChatMessageChunk | ChatStreamEnvelope>>;

  // Optional
  regenerate?(
    input: ChatRegenerateInput,
  ): Promise<ReadableStream<ChatMessageChunk | ChatStreamEnvelope>>;
  listConversations?(
    input?: ChatListConversationsInput<Cursor>,
  ): Promise<ChatListConversationsResult<Cursor>>;
  listMessages?(
    input: ChatListMessagesInput<Cursor>,
  ): Promise<ChatListMessagesResult<Cursor>>;
  reconnectToStream?(
    input: ChatReconnectToStreamInput,
  ): Promise<ReadableStream<ChatMessageChunk | ChatStreamEnvelope> | null>;
  setTyping?(input: ChatSetTypingInput): Promise<void>;
  markRead?(input: ChatMarkReadInput): Promise<void>;
  subscribe?(
    input: ChatSubscribeInput,
  ): Promise<ChatSubscriptionCleanup> | ChatSubscriptionCleanup;
  loadMore?(cursor?: Cursor): Promise<ChatLoadMoreResult<Cursor>>;
  addToolApprovalResponse?(input: ChatAddToolApproveResponseInput): Promise<void>;
  stop?(): void;
}
```

## Adapter methods

### Sending messages

Sends a user message and returns a readable stream of response chunks.

```ts
interface ChatSendMessageInput {
  conversationId?: string; // target conversation
  message: ChatMessage; // the user message being sent
  messages: ChatMessage[]; // full thread context
  attachments?: ChatDraftAttachment[]; // file attachments
  metadata?: Record<string, unknown>; // extra context
  signal: AbortSignal; // cancellation signal
}
```

The `signal` is connected to `stopStreaming()`—when the user cancels, the signal aborts, giving the adapter a chance to clean up.

### Regenerating responses

Regenerates the assistant reply identified by `messageId`, returning a fresh response stream (same shape as `sendMessage`).

```ts
interface ChatRegenerateInput {
  conversationId?: string;
  messageId: string; // the assistant message being regenerated (already removed)
  message: ChatMessage; // the user message that prompted the reply
  messages: ChatMessage[]; // thread context up to and including `message`
  signal: AbortSignal;
}
```

`regenerate` is **optional**: regeneration works without implementing it. When the adapter omits `regenerate`, the runtime re-sends the anchoring user message through `sendMessage`. Implement it when your backend distinguishes regeneration from a fresh send—for example, the [Vercel AI SDK](/x/react-chat/backend/built-in-adapters/ai-sdk-adapter/) uses `trigger: 'regenerate-message'`.

The UI is driven by the runtime, not by calling the adapter directly: trigger regeneration with [`chat.regenerate(message.id)`](/x/react-chat/customization/structure/#adding-a-regenerate-action-on-assistant-messages). If the adapter call rejects before any output streams, the runtime restores the removed reply (no data is lost). Once the stream starts, partial output is kept with the stream-reported status.

### Listing conversations

Loads the conversation list, typically called on mount.

```ts
interface ChatListConversationsInput<Cursor> {
  cursor?: Cursor; // pagination cursor
  query?: string; // search filter
}

interface ChatListConversationsResult<Cursor> {
  conversations: ChatConversation[];
  cursor?: Cursor; // next page cursor
  hasMore?: boolean; // whether more pages exist
}
```

### Loading message history

Loads messages for a conversation, called when `activeConversationId` changes.

```ts
interface ChatListMessagesInput<Cursor> {
  conversationId: string;
  cursor?: Cursor;
  direction?: PaginationDirection; // 'forward' | 'backward'
}

interface ChatListMessagesResult<Cursor> {
  messages: ChatMessage[];
  cursor?: Cursor;
  hasMore?: boolean;
}
```

### Reconnecting to an interrupted stream

Resumes an interrupted stream, for example after an SSE disconnect.

```ts
interface ChatReconnectToStreamInput {
  conversationId?: string;
  messageId?: string;
  signal: AbortSignal;
}
```

Returns `null` if reconnection is not possible.

### Sending typing indicators

Sends a typing indicator to the backend.
When `features.typingSignal` is enabled, the runtime calls this automatically—see [Real-time adapters](/x/react-chat/backend/real-time-adapters/).

```ts
interface ChatSetTypingInput {
  conversationId: string;
  isTyping: boolean;
}
```

### Marking messages as read

Marks a conversation or specific message as read.

```ts
interface ChatMarkReadInput {
  conversationId: string;
  messageId?: string; // mark up to this message
}
```

### Receiving real-time events

Starts a realtime subscription.
Called on mount, returns a cleanup function called on unmount.

```ts
interface ChatSubscribeInput {
  onEvent: (event: ChatRealtimeEvent) => void;
}

type ChatSubscriptionCleanup = () => void;
```

### Loading older messages

Loads older messages for the current conversation using a pagination cursor.

```ts
interface ChatLoadMoreResult<Cursor> {
  messages: ChatMessage[];
  cursor?: Cursor;
  hasMore?: boolean;
}
```

### Sending tool approval responses

Sends a tool approval decision back to the backend.

```ts
interface ChatAddToolApproveResponseInput {
  id: string; // the approval request ID
  approved: boolean; // whether the tool call is approved
  reason?: string; // optional reason for denial
}
```

### Stopping an in-flight request

Called alongside the abort signal when the user stops streaming.
Use this for server-side cleanup that goes beyond closing the stream.

## Cursor generics

`ChatAdapter<Cursor>` is generic over the pagination cursor type.
The default is `string`, but you can use any type your backend requires:

```ts
interface MyCursor {
  page: number;
  token: string;
}

const adapter: ChatAdapter<MyCursor> = {
  async sendMessage(input) {
    /* ... */
  },
  async listMessages({ cursor }) {
    // cursor is typed as MyCursor | undefined
    const page = cursor?.page ?? 1;
    // ...
  },
};
```

The cursor type flows through `ChatProvider`, store, hooks, and all adapter input/output types.

## Writing your first adapter

### Step 1: Echo adapter

Start with a basic adapter that echoes user messages:

```tsx
const adapter: ChatAdapter = {
  async sendMessage({ message }) {
    const text = message.parts
      .filter((p) => p.type === 'text')
      .map((p) => p.text)
      .join('');

    return new ReadableStream({
      start(controller) {
        const id = `response-${message.id}`;
        controller.enqueue({ type: 'start', messageId: id });
        controller.enqueue({ type: 'text-start', id: 'text-1' });
        controller.enqueue({
          type: 'text-delta',
          id: 'text-1',
          delta: `You said: "${text}"`,
        });
        controller.enqueue({ type: 'text-end', id: 'text-1' });
        controller.enqueue({ type: 'finish', messageId: id });
        controller.close();
      },
    });
  },
};
```

### Step 2: Add history

Implement `listConversations()` and `listMessages()` to load initial data:

```tsx
const adapter: ChatAdapter = {
  async sendMessage(input) {
    /* ... */
  },

  async listConversations() {
    const res = await fetch('/api/conversations');
    const conversations = await res.json();
    return { conversations };
  },

  async listMessages({ conversationId, cursor }) {
    const res = await fetch(
      `/api/conversations/${conversationId}/messages?cursor=${cursor ?? ''}`,
    );
    const { messages, nextCursor, hasMore } = await res.json();
    return { messages, cursor: nextCursor, hasMore };
  },
};
```

### Step 3: Add realtime

Implement `subscribe()` for push updates:

```tsx
const adapter: ChatAdapter = {
  async sendMessage(input) {
    /* ... */
  },

  subscribe({ onEvent }) {
    const ws = new WebSocket('/api/ws');
    ws.onmessage = (e) => onEvent(JSON.parse(e.data));
    return () => ws.close();
  },
};
```

### Step 4: Add cancellation

Implement `stop()` for server-side cleanup:

```tsx
const adapter: ChatAdapter = {
  async sendMessage({ signal }) {
    // signal.aborted is checked by the runtime
    // ...
  },

  stop() {
    fetch('/api/cancel', { method: 'POST' });
  },
};
```

## Error handling

When an adapter method throws, the runtime:

1. Records a `ChatError` with the appropriate `source` field (`'send'`, `'history'`, or `'adapter'`).
2. Surfaces the error through `useChat().error`, `useChatStatus().error`, and the `onError` callback.
3. Sets `recoverable` based on the error type—stream disconnects are typically recoverable, while send failures may be retryable.

:::info
You do not need to catch errors inside adapter methods—the runtime handles them for you. When an adapter method throws, the runtime records a `ChatError`, surfaces it through the UI and callbacks, and marks it recoverable or retryable when applicable.
:::

## See also

- [Streaming](/x/react-chat/core/streaming/) for the full stream chunk protocol.
- [Realtime](/x/react-chat/core/realtime/) for the event types used by `subscribe()`.
- [Hooks](/x/react-chat/core/hooks/) for the runtime actions that trigger adapter methods.
- [Minimal core chat](/x/react-chat/core/examples/minimal-chat/) for the smallest working adapter.
- [Conversation history](/x/react-chat/core/examples/conversation-history/) for adapter-driven history loading.

## API

- [`ChatRoot`](/x/api/chat/chat-root/)
