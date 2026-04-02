---
productId: x-chat
title: Real-Time Adapters
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
---

# Chat - Real-Time Adapters

<p class="description">Push typing indicators, presence updates, read receipts, and collection changes into the runtime through the adapter's <code>subscribe()</code> method.</p>



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

## Event types

The `onEvent` callback receives `ChatRealtimeEvent` objects.
There are nine event variants organized into five categories.

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

## Dispatching events from the backend

Each event is a plain object with a `type` field.
Here are the full shapes:

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

## The `setTyping()` method

Implement `setTyping()` to send a typing indicator to your backend when the user is composing a message.
The runtime calls it when the composer value changes from empty to non-empty (and vice versa).

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

## The `markRead()` method

Implement `markRead()` to signal to your backend that the user has seen a conversation or a specific message.
The runtime does not call this automatically — call `adapter.markRead()` directly from your own UI event handler.

```ts
interface ChatMarkReadInput {
  conversationId: string;
  messageId?: string; // mark all messages up to this one as read
}
```

## Stream reconnection

Implement `reconnectToStream()` to resume an interrupted stream — for example, when an SSE connection drops mid-response.
The runtime calls it automatically after detecting a disconnected stream.

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
  return res.body!;
},
```

## Consuming realtime state

### Typing indicators

Use `useChatStatus()` to get the list of users currently typing:

```tsx
function TypingIndicator() {
  const { typingUserIds } = useChatStatus();

  if (typingUserIds.length === 0) return null;

  return <span>{typingUserIds.length} user(s) typing...</span>;
}
```

The `typingUserIds` selector returns user IDs for the active conversation by default.
For a specific conversation, use `chatSelectors.typingUserIds` with a conversation ID argument.

### Presence

Presence events update the `isOnline` field on `ChatUser` objects inside conversation participants.
Use `useConversation(id)` or `useConversations()` to see participant presence.

### Read state

Read events update the `readState` and `unreadCount` fields on `ChatConversation`.
Use `useConversation(id)` to reflect read status in the UI.

## WebSocket integration example

A complete adapter with WebSocket-based real-time events:

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
};
```

## API

## See also

- [Adapters](/x/react-chat/backend/adapters/) for the full adapter interface including `subscribe()`.
- [Hooks Reference](/x/react-chat/resources/hooks/) for `useChatStatus()` and the typing/presence consumption pattern.
- [Selectors Reference](/x/react-chat/resources/selectors/) for `chatSelectors.typingUserIds` and other store selectors.
