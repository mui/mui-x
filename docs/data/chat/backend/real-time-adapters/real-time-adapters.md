---
productId: x-chat
title: Real-time adapters
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
---

# Chat - Real-time adapters

<p class="description">Push typing indicators, presence updates, read receipts, and conversation changes from your backend into the chat runtime in real time.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

The adapter's `subscribe()` method enables push-based updates from the backend.
The runtime calls it on mount and cleans it up on unmount, keeping the subscription lifecycle fully managed.

## Subscription lifecycle

When `ChatProvider` mounts and the adapter implements `subscribe()`, the runtime:

1. Calls `subscribe({ onEvent })` with a callback.
2. Stores the returned cleanup function.
3. On unmount, calls the cleanup function to close the connection.

```ts
const adapter: ChatAdapter = {
  async sendMessage(input) {
    /* ... */
  },

  subscribe({ onEvent }) {
    const ws = new WebSocket('/api/realtime');
    ws.onmessage = (event) => onEvent(JSON.parse(event.data));
    return () => ws.close();
  },
};
```

The cleanup function can be returned directly or from a resolved promise, supporting both synchronous and asynchronous setup:

```tsx
async subscribe({ onEvent }) {
  const sub = await myClient.subscribe((event) => onEvent(event));
  return () => sub.unsubscribe();
},
```

The runtime calls `subscribe()` once per mount and does not monitor or retry the connection.
Reconnection and backoff for the event channel are your responsibility — handle `onclose`/`onerror` inside `subscribe()` and re-emit missed events after reconnecting.
This is separate from `reconnectToStream()`, which only resumes an interrupted assistant message stream.

## Dispatching events from the backend

Each event is a plain object with a `type` field.
The available event shapes are shown below:

```ts
// Conversation events
{ type: 'conversation-added', conversation: ChatConversation }
{ type: 'conversation-updated', conversation: ChatConversation }
{ type: 'conversation-removed', conversationId: string }

// Message events
{ type: 'message-added', message: ChatMessage }
{ type: 'message-updated', message: ChatMessage }
{ type: 'message-removed', messageId: string, conversationId?: string }

// Typing
{ type: 'typing', conversationId: string, userId: string, isTyping: boolean }

// Presence
{ type: 'presence', userId: string, isOnline: boolean }

// Read
{ type: 'read', conversationId: string, messageId?: string, userId?: string }
```

## Sending typing indicators

Implement `setTyping()` to send a typing indicator to your backend when the user is composing a message.

Outbound typing signals are opt-in.
When `features.typingSignal` is enabled (default `false`) and the adapter implements `setTyping()`, the runtime calls it automatically for the active conversation: `{ isTyping: true }` when the composer value changes from empty (`''`) to non-empty, and `{ isTyping: false }` when it changes back to empty—including when a message is sent, since sending clears the composer.
Switching conversations sends `{ isTyping: false }` for the previous conversation and, if the draft is non-empty, `{ isTyping: true }` for the new one; the same applies at mount when an initial draft is present, and unmounting sends a final `{ isTyping: false }`.
Keystrokes that keep the composer non-empty produce no additional calls, there is no built-in idle timeout, and `setTyping()` failures are swallowed (dev-only warning).
With the flag off—the default—the runtime never calls `setTyping()`; if you enable it, remove any manual composer `onChange` wiring to avoid double-firing.

```ts
interface ChatSetTypingInput {
  conversationId: string;
  isTyping: boolean;
}
```

```tsx
async setTyping({ conversationId, isTyping }) {
  await fetch('/api/typing', {
    method: 'POST',
    body: JSON.stringify({ conversationId, isTyping }),
  });
},
```

To receive typing indicators from other users in the UI, implement `subscribe()` and emit `typing` events through the `onEvent` callback.

## Marking messages as read

Implement `markRead()` to signal to your backend that the user has seen a conversation or a specific message.
The runtime does not call this automatically — call `adapter.markRead()` directly from your own UI event handler.

```ts
interface ChatMarkReadInput {
  conversationId: string;
  messageId?: string; // mark all messages up to this one as read
}
```

```tsx
async markRead({ conversationId, messageId }) {
  await fetch('/api/read', {
    method: 'POST',
    body: JSON.stringify({ conversationId, messageId }),
  });
},
```

## Consuming realtime state

The demo below uses an in-memory adapter whose `subscribe()` hands `onEvent` to the buttons — click them to emit `typing`, `presence`, and `read` events and watch the hooks react.

{{"demo": "../../core/examples/realtime/RealtimeHeadlessChat.js", "bg": "inline", "defaultCodeOpen": false, "hideToolbar": true}}

### Typing indicators

Use `useChatStatus()` to get the list of users currently typing:

```tsx
function TypingIndicator() {
  const { typingUserIds } = useChatStatus();

  if (typingUserIds.length === 0) return null;

  return (
    <span>
      {typingUserIds.length} {typingUserIds.length === 1 ? 'user is' : 'users are'}{' '}
      typing…
    </span>
  );
}
```

Typing and presence changes arrive without user interaction, so announce them politely: wrap the indicator in an `aria-live="polite"` region, or use the built-in [`ChatTypingIndicator`](/x/react-chat/behavior/typing-indicators/) (and the headless `TypingIndicator`), which already render a polite live region. See the [Accessibility](/x/react-chat/accessibility/) page for the full announcement model.

The `typingUserIds` selector returns user IDs for the active conversation by default.
For a specific conversation, use `chatSelectors.typingUserIds` with a conversation ID argument.

### Presence

Presence events update the `isOnline` field on `ChatUser` objects inside conversation participants.
Use `useConversation(id)` or `useConversations()` to see participant presence.

### Read state

Read events update the `readState` and `unreadCount` fields on `ChatConversation`.
Use `useConversation(id)` to reflect read status in the UI.

## Stream reconnection

Implement `reconnectToStream()` to resume an interrupted stream — for example, when an SSE connection drops mid-response.
The runtime calls it automatically after detecting a disconnected stream, with one reconnect attempt for the interrupted assistant message.
See [Streaming](/x/react-chat/behavior/streaming/) for the full reconnection and chunk-protocol reference.

```ts
interface ChatReconnectToStreamInput {
  conversationId?: string;
  messageId?: string; // the message being streamed when the disconnect happened
  signal: AbortSignal;
}
```

Return `null` if the interrupted message cannot be resumed:

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
  return res.body!; // decode bytes into ChatMessageChunk objects — see callout
},
```

:::info
These examples assume the endpoint emits the chat stream protocol. `res.body` is a byte stream — pipe it through a transform that parses your wire format (for example, NDJSON) into `ChatMessageChunk` objects. See [Streaming](/x/react-chat/behavior/streaming/) for the chunk protocol.
:::

## WebSocket integration example

The example below brings the methods from this page together into a complete adapter with WebSocket-based real-time events:

```tsx
import type { ChatAdapter } from '@mui/x-chat/headless';

const adapter: ChatAdapter = {
  async sendMessage({ message, signal }) {
    const res = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
      signal,
    });
    return res.body!; // decode bytes into ChatMessageChunk objects — see callout
  },

  subscribe({ onEvent }) {
    const ws = new WebSocket('/api/ws');
    ws.onmessage = (e) => onEvent(JSON.parse(e.data));
    return () => ws.close(); // cleanup on unmount
  },

  async setTyping({ conversationId, isTyping }) {
    await fetch('/api/typing', {
      method: 'POST',
      body: JSON.stringify({ conversationId, isTyping }),
    });
  },

  async markRead({ conversationId, messageId }) {
    await fetch('/api/read', {
      method: 'POST',
      body: JSON.stringify({ conversationId, messageId }),
    });
  },

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
    return res.body!; // decode bytes into ChatMessageChunk objects — see callout
  },
};
```

## Event reference

The `onEvent` callback can emit nine event variants organized into five categories.

Events are processed in arrival order and are safe to re-deliver: `message-added` and `conversation-added` upsert by ID (a duplicate replaces the record instead of duplicating it), `message-updated` and `conversation-updated` fall back to adding the record when it does not exist yet, and `typing` is last-write-wins per user and conversation.
The runtime performs no reordering or de-duplication beyond this — if strict ordering matters (for example, `message-updated` racing `message-removed`), sequence events on the backend before emitting them.

### Conversation events

| Event type             | Payload              | Store effect                                                |
| :--------------------- | :------------------- | :---------------------------------------------------------- |
| `conversation-added`   | `{ conversation }`   | Adds the conversation to the store                          |
| `conversation-updated` | `{ conversation }`   | Replaces the conversation record                            |
| `conversation-removed` | `{ conversationId }` | Removes the conversation and resets active ID if it matched |

### Message events

| Event type        | Payload                          | Store effect                       |
| :---------------- | :------------------------------- | :--------------------------------- |
| `message-added`   | `{ message }`                    | Adds the message to the store      |
| `message-updated` | `{ message }`                    | Replaces the message record        |
| `message-removed` | `{ messageId, conversationId? }` | Removes the message from the store |

### Typing events

| Event type | Payload                                | Store effect                                |
| :--------- | :------------------------------------- | :------------------------------------------ |
| `typing`   | `{ conversationId, userId, isTyping }` | Updates the typing map for the conversation |

### Presence events

| Event type | Payload                | Store effect                                             |
| :--------- | :--------------------- | :------------------------------------------------------- |
| `presence` | `{ userId, isOnline }` | Updates `isOnline` on matching conversation participants |

### Read events

| Event type | Payload                                   | Store effect                          |
| :--------- | :---------------------------------------- | :------------------------------------ |
| `read`     | `{ conversationId, messageId?, userId? }` | Updates the conversation's read state |

## See also

- See [Adapters](/x/react-chat/backend/adapters/) for the full adapter interface including `subscribe()`.
- See [Streaming](/x/react-chat/behavior/streaming/) for the stream chunk protocol and reconnection lifecycle.
- See [Hooks reference](/x/react-chat/resources/hooks/) for `useChatStatus()` and the typing/presence consumption pattern.
- See [Selectors reference](/x/react-chat/resources/selectors/) for `chatSelectors.typingUserIds` and other store selectors.
