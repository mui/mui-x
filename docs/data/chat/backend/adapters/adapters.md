---
productId: x-chat
title: Adapters
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
---

# Chat - Adapters

<p class="description">Connect your backend to the chat runtime by implementing the adapter interface.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

`ChatBox` renders a fully styled chat surface, but it knows nothing about your backend on its own.
The adapter is the single object that bridges them.
It receives user messages, communicates with your server, and returns a streaming response that the runtime turns into live UI updates.

## Adapter interface reference

The full interface is generic over your pagination cursor type.
The default cursor type is `string`, which covers the majority of REST and cursor-based APIs:

```ts
import type { ChatAdapter } from '@mui/x-chat/headless';

interface ChatAdapter<Cursor = string> {
  // Required
  sendMessage(
    input: ChatSendMessageInput,
  ): Promise<ReadableStream<ChatMessageChunk | ChatStreamEnvelope>>;

  // Optional — implement as your feature set grows
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
  addToolApprovalResponse?(input: ChatAddToolApproveResponseInput): Promise<void>;
  stop?(): void;
}
```

Only `sendMessage` is required.
Every other method is optional and incrementally adopted — start with just `sendMessage` and add methods as your product grows.

| Method                    | Required | The runtime calls it when…                                                                                                          |
| :------------------------ | :------- | :---------------------------------------------------------------------------------------------------------------------------------- |
| `sendMessage`             | Yes      | the user submits a message in the composer                                                                                          |
| `listConversations`       | No       | `ChatBox` mounts                                                                                                                    |
| `listMessages`            | No       | the active conversation changes and has no messages in the store                                                                    |
| `reconnectToStream`       | No       | a stream disconnects mid-response (one reconnect attempt)                                                                           |
| `setTyping`               | No       | the composer transitions between empty and non-empty — only when the opt-in `typingSignal` feature flag is enabled (off by default) |
| `markRead`                | No       | never — call it yourself from your own UI handlers                                                                                  |
| `subscribe`               | No       | `ChatBox` mounts (cleanup runs on unmount)                                                                                          |
| `addToolApprovalResponse` | No       | the user approves or denies a tool call                                                                                             |
| `stop`                    | No       | the abort signal fires                                                                                                              |

## Sending messages

`sendMessage` is the heart of the adapter.
It is called every time a user submits a message in the composer.

```ts
interface ChatSendMessageInput {
  conversationId?: string; // the active conversation ID
  message: ChatMessage; // the user's message being sent
  messages: ChatMessage[]; // full thread context for the model
  attachments?: ChatDraftAttachment[]; // file attachments from the composer
  metadata?: Record<string, unknown>; // arbitrary context from the composer
  signal: AbortSignal; // connected to the stop button
}
```

The method must return a `Promise<ReadableStream<ChatMessageChunk | ChatStreamEnvelope>>`.
The runtime reads this stream, processes each chunk type, and updates the UI live.

### Streaming protocol

The stream must begin with a `start` chunk and end with `finish` or `abort`.
Text arrives as a `text-start` … `text-delta` … `text-end` sequence, with one `text-delta` chunk per increment:

```tsx
// Minimal adapter — sendMessage is the only required method.
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

For the full chunk type reference, see [Streaming](/x/react-chat/behavior/streaming/).

Here is the same protocol running live — type a message and watch the chunks arrive:

{{"demo": "MinimalAdapterDemo.js", "bg": "inline"}}

### Abort signal

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

If your backend requires explicit cancellation (for example, sending a separate cancel request), implement the optional `stop()` method alongside the signal.

## Optional methods

The optional methods are listed roughly in the order you are likely to add them.
None are required — the runtime detects which methods exist and activates the corresponding features automatically.
For a complete adapter that implements several of these methods together, see [Building an adapter](/x/react-chat/backend/building-an-adapter/).

### Loading conversation state

Implement `listConversations(input?)` to load conversation state when `ChatBox` mounts.
If `features={{ conversationList: true }}` is enabled, the same data also powers the built-in conversation sidebar.
The runtime calls it once on startup, before any user interaction.

```ts
interface ChatListConversationsInput<Cursor> {
  cursor?: Cursor; // for paginated conversation lists
  query?: string; // optional search query
}

interface ChatListConversationsResult<Cursor> {
  conversations: ChatConversation[];
  cursor?: Cursor; // next page cursor, if applicable
  hasMore?: boolean; // whether additional pages exist
}
```

### Loading message history

Implement `listMessages(input)` to load message history when the user opens a conversation.
The runtime calls it whenever `activeConversationId` changes to a conversation that has no messages in the store yet.

```ts
interface ChatListMessagesInput<Cursor> {
  conversationId: string;
  cursor?: Cursor;
  direction?: 'forward' | 'backward'; // default: 'backward' (newest first)
}

interface ChatListMessagesResult<Cursor> {
  messages: ChatMessage[];
  cursor?: Cursor;
  hasMore?: boolean;
}
```

When `hasMore` is `true`, `ChatBox` automatically loads earlier messages as the user scrolls to the top of the list, calling `listMessages` again with the previous cursor. See [History and pagination](/x/react-chat/multi-conversation/history-and-pagination/).

:::warning
The legacy `loadMore(cursor?)` method is deprecated.
The runtime still falls back to it when `listMessages` is absent, but new adapters should implement `listMessages` with `direction: 'backward'` instead.
:::

### Resuming an interrupted stream

Implement `reconnectToStream(input)` to resume an interrupted stream — for example, when an SSE connection drops mid-response.
The runtime calls it automatically after detecting a disconnected stream, with one reconnect attempt for the interrupted assistant message.

```ts
interface ChatReconnectToStreamInput {
  conversationId?: string;
  messageId?: string; // the message being streamed when the disconnect happened
  signal: AbortSignal;
}
```

Return `null` if the interrupted message cannot be resumed.

### Sending typing indicators

Implement `setTyping(input)` to send a typing indicator to your backend when the user is composing a message.
The runtime calls it automatically only when the opt-in `typingSignal` feature flag is enabled (it is off by default).
When enabled, the trigger is the composer value transitioning between empty (the literal value `''`) and non-empty; switching conversations with a non-empty draft sends `isTyping: false` for the previous conversation and `isTyping: true` for the new one.
Rejections are swallowed with a dev-only warning, and the local user is never echoed back into the typing state shown in your own UI.

```ts
interface ChatSetTypingInput {
  conversationId: string;
  isTyping: boolean;
}
```

To receive typing indicators from other users in the UI, implement `subscribe()` and emit `typing` events through the `onEvent` callback.

### Marking messages as read

Implement `markRead(input)` to signal to your backend that the user has seen a conversation or a specific message.
The runtime does not call this automatically — call `adapter.markRead()` directly from your own UI event handler.

```ts
interface ChatMarkReadInput {
  conversationId: string;
  messageId?: string; // mark all messages up to this one as read
}
```

### Receiving real-time events

Implement `subscribe(input)` to receive real-time events pushed from your backend — new messages, typing indicators, read receipts, or conversation updates.
The runtime calls `subscribe()` on mount and invokes the returned cleanup function on unmount.

```ts
interface ChatSubscribeInput {
  onEvent: (event: ChatRealtimeEvent) => void;
}

type ChatSubscriptionCleanup = () => void;
```

The cleanup function can also be returned from a `Promise` for async subscription setups.

For the full list of realtime event types, see [Real-time adapters](/x/react-chat/backend/real-time-adapters/).

### Responding to tool approvals

Implement `addToolApprovalResponse(input)` when your backend supports human-in-the-loop tool confirmation.
The runtime calls it when the user approves or denies a tool call that was flagged with a `tool-approval-request` stream chunk.

```ts
interface ChatAddToolApproveResponseInput {
  id: string; // the approval request ID from the stream chunk
  approved: boolean; // true = approved, false = denied
  reason?: string; // optional reason surfaced to the model when denied
}
```

### Stopping in-flight requests

Implement `stop()` when aborting the `signal` is not sufficient for server-side cleanup.
The runtime calls `stop()` at the same moment the abort signal fires.

```tsx
stop() {
  fetch('/api/chat/cancel', { method: 'POST' });
},
```

Most adapters do not need `stop()` — passing `signal` to `fetch` is enough for HTTP-based transports.

## Cursor generics

`ChatAdapter<Cursor>` is generic over the type used for pagination cursors.
The default is `string`, which covers opaque server cursors, Base64 tokens, and ISO timestamps.

If your API uses a structured cursor, provide the type at the call site:

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
    // cursor is typed as MyCursor | undefined here
    const page = cursor?.page ?? 1;
    const res = await fetch(`/api/messages?page=${page}`);
    const { messages, nextPage, token } = await res.json();
    return {
      messages,
      cursor: { page: nextPage, token },
      hasMore: !!nextPage,
    };
  },
};
```

The cursor type flows automatically through `ChatBox`, the store, hooks, and all adapter input and output types.

## Error handling

:::info
You do not need to catch errors inside adapter methods — the runtime handles them for you.
:::

When an adapter method throws, the runtime:

1. Records a `ChatError` with the appropriate `source` field (`'send'`, `'stream'`, `'history'`, `'render'`, or `'adapter'`).
2. Surfaces it through [`ChatBox`'s built-in error UI](/x/react-chat/behavior/error-handling/), `useChat().error`, and the `onError` callback on `ChatBox`.
3. Marks the error `recoverable` when applicable (for example, stream disconnects) and `retryable` when the user can reasonably try again.

Each `ChatError` also carries a `code`, which you can read from `useChat().error.code` or the `onError` callback when building custom error UIs:

| Code                 | Recorded when                                  |
| :------------------- | :--------------------------------------------- |
| `'HISTORY_ERROR'`    | loading conversations or message history fails |
| `'SEND_ERROR'`       | `sendMessage` rejects before a stream starts   |
| `'STREAM_ERROR'`     | the response stream errors mid-flight          |
| `'REALTIME_ERROR'`   | a realtime subscription or event fails         |
| `'REGENERATE_ERROR'` | a regeneration request fails                   |

If you want to transform or enrich an error before the runtime sees it, throw a plain `Error` with a custom message.
The runtime wraps it in a `ChatError` with source `'adapter'`.

To handle errors at the application level, use the `onError` callback prop:

```tsx
<ChatBox
  adapter={adapter}
  onError={(error) => {
    console.error('[Chat error]', error.source, error.message);
  }}
/>
```

## See also

- [Building an adapter](/x/react-chat/backend/building-an-adapter/) for a step-by-step tutorial.
- [Real-time adapters](/x/react-chat/backend/real-time-adapters/) for the event types used by `subscribe()`.
- [Streaming](/x/react-chat/behavior/streaming/) for the full stream chunk protocol reference.
- [Hooks reference](/x/react-chat/resources/hooks/) to see which runtime actions trigger adapter methods.
- [Error handling](/x/react-chat/behavior/error-handling/) for what users see when an adapter method throws.
