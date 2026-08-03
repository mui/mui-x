---
productId: x-chat
title: Real-time sync
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatBox
---

# Chat - Real-time sync

<p class="description">Push typing indicators, presence updates, read receipts, and conversation changes from your backend into the chat runtime in real time.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

Implement `subscribe()` to push events from your backend into the chat runtime.
The runtime calls it on mount and tears it down on unmount, so the subscription lifecycle is fully managed for you.

## Managing the subscription lifecycle

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

The demo below wires a simulated backend through `subscribe()`. Each button emits a real-time event so you can watch the typing indicator, presence chip, incoming message bubble, and unread badge react without any composer input.

{{"demo": "RealtimeSyncSimulation.js"}}

## Event types

The `onEvent` callback receives `ChatRealtimeEvent` objects — a discriminated union on the `type` field, grouped into the following categories:

### Conversation events

| Event type             | Payload              | Store effect                                                             |
| :--------------------- | :------------------- | :----------------------------------------------------------------------- |
| `conversation-added`   | `{ conversation }`   | Adds the conversation to the store                                       |
| `conversation-updated` | `{ conversation }`   | Merges the payload into the existing conversation, or adds it if missing |
| `conversation-removed` | `{ conversationId }` | Removes the conversation and resets active ID if it matched              |

### Message events

| Event type        | Payload                          | Store effect                                                        |
| :---------------- | :------------------------------- | :------------------------------------------------------------------ |
| `message-added`   | `{ message }`                    | Adds the message to the store                                       |
| `message-updated` | `{ message }`                    | Merges the payload into the existing message, or adds it if missing |
| `message-removed` | `{ messageId, conversationId? }` | Removes the message from the store                                  |

### Typing events

| Event type | Payload                                | Store effect                                |
| :--------- | :------------------------------------- | :------------------------------------------ |
| `typing`   | `{ conversationId, userId, isTyping }` | Updates the typing map for the conversation |

### Presence events

| Event type | Payload                | Store effect                                             |
| :--------- | :--------------------- | :------------------------------------------------------- |
| `presence` | `{ userId, isOnline }` | Updates `isOnline` on matching conversation participants |

### Read events

| Event type | Payload                                   | Store effect                                                                                                                              |
| :--------- | :---------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------- |
| `read`     | `{ conversationId, messageId?, userId? }` | Marks the conversation read (sets readState and resets unreadCount); messageId and userId are accepted but currently have no store effect |

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

For `*-updated` events, the payload is shallow-merged into the stored record — omitted fields are preserved. For `conversation-updated`, only `id` is required, so send `id` plus the fields that changed. For `message-updated`, the `ChatMessage` type always requires `id`, `role`, and `parts`; other fields are optional and merged. If the record is not in the store yet, the payload is inserted as-is, so send a complete record when the entity may not be loaded. For `*-added` events, send the full record — the same required fields apply (`id` for conversations; `id`, `role`, and `parts` for messages).

## Consuming realtime state

This section covers scalar state that decorates existing records — typing, presence, and read status.

### Typing indicators

Use `useChatStatus()` to get the list of users currently typing:

```tsx
function TypingIndicator() {
  const { typingUserIds } = useChatStatus();

  if (typingUserIds.length === 0) return null;

  return (
    <span>
      {typingUserIds.length === 1
        ? 'Someone is'
        : `${typingUserIds.length} people are`}{' '}
      typing…
    </span>
  );
}
```

The `typingUserIds` selector returns user IDs for the active conversation by default.

Push typing events to update which users are currently typing:

```ts
onEvent({
  type: 'typing',
  conversationId: 'support',
  userId: 'user-1',
  isTyping: true,
});
```

### Presence

Presence events update the `isOnline` field on `ChatUser` objects inside conversation participants. Use `useConversation(id)` or `useConversations()` to see participant presence:

```ts
onEvent({
  type: 'presence',
  userId: 'user-1',
  isOnline: false,
});
```

Presence events only affect users that appear in the `participants` of a loaded conversation. An event for a user who is not a participant anywhere is silently ignored.

### Read state

Read events update the `readState` and `unreadCount` fields on `ChatConversation`. Use `useConversation(id)` to reflect read status in the UI:

```ts
onEvent({
  type: 'read',
  conversationId: 'support',
  messageId: 'msg-42',
});
```

The optional `messageId` and `userId` fields are part of the wire type for forward compatibility, but the runtime currently ignores them — only the conversation-level read state is updated.

Inbound `read` events update the store automatically, but the outbound direction is manual: the runtime never calls the `markRead()` adapter method for you — see [Read receipts](/x/react-chat/multi-conversation/read-receipts/) for wiring patterns.

## Collection synchronization

Collection events drive structural changes to the message and conversation lists.
The examples below show each variant in turn:

### Adding a message from another user

```ts
onEvent({
  type: 'message-added',
  message: {
    id: 'msg-new',
    conversationId: 'support',
    role: 'assistant',
    parts: [{ type: 'text', text: 'New message from the backend.' }],
    status: 'sent',
  },
});
```

### Removing a conversation

When a `conversation-removed` event arrives and the removed conversation is the active one, the runtime resets `activeConversationId` to `undefined`.
Your UI can respond by showing a placeholder or selecting the next conversation.

```ts
onEvent({
  type: 'conversation-removed',
  conversationId: 'old-thread',
});
```

### Updating a conversation

Use `conversation-updated` to change a conversation's title, metadata, or read state:

```ts
onEvent({
  type: 'conversation-updated',
  conversation: {
    id: 'support',
    title: 'Support (renamed)',
    unreadCount: 0,
    readState: 'read',
  },
});
```

## Reconnection

The runtime manages subscription cleanup automatically on unmount. For reconnection handling after network drops, implement the logic inside your `subscribe()` method:

```tsx
subscribe({ onEvent }) {
  let ws: WebSocket;
  let timeoutId: ReturnType<typeof setTimeout>;

  function connect() {
    ws = new WebSocket('/api/realtime');
    ws.onmessage = (event) => onEvent(JSON.parse(event.data));
    ws.onclose = () => {
      // Reconnect after a delay
      timeoutId = setTimeout(connect, 3000);
    };
  }

  connect();
  return () => {
    clearTimeout(timeoutId);
    ws.close();
  };
},
```

### Event delivery guarantees

Re-delivering events after a reconnect is safe: `*-added` and `*-updated` events with an already-known `id` update the existing record instead of duplicating it, so backends can replay a window of recent events on reconnect without deduplication on the client.

Message events are applied to the thread store regardless of their `conversationId`. If your backend streams events for many conversations over one connection, filter message events to the active conversation before calling `onEvent` (for example, read the active id from your own state, or only subscribe to the active conversation's channel). Conversation, typing, presence, and read events carry their own ids and are always safe to forward.

## Sending typing indicators

Implement the `setTyping()` adapter method to send typing indicators to your backend when the user is composing a message:

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

Outbound typing signals are opt-in: enable `features.typingSignal` (off by default) and implement `setTyping()`. When enabled, the runtime calls `setTyping()` with `isTyping: true` when the composer transitions from empty (literally `''`) to non-empty, and `isTyping: false` when it transitions back — including when sending a message clears the composer. Switching the active conversation while a draft is non-empty signals `isTyping: false` for the previous conversation and `isTyping: true` for the new one. The runtime never calls it repeatedly while typing continues and provides no built-in idle timeout; rejected `setTyping()` promises are swallowed (with a dev-only warning). See [Real-time adapters](/x/react-chat/backend/real-time-adapters/) for the full contract.

To receive typing indicators from other users, push `typing` events through the `onEvent` callback in `subscribe()`.

## See also

- See [Read receipts](/x/react-chat/multi-conversation/read-receipts/) for the `markRead()` adapter method and unread badge display.
- See [Conversation list](/x/react-chat/multi-conversation/conversation-list/) for the sidebar that reflects real-time conversation updates.
- See [Adapters](/x/react-chat/backend/adapters/) for the full `subscribe()` and `setTyping()` method reference.
- See the [Hooks reference](/x/react-chat/resources/hooks/) for the full `useChatStatus()`, `useConversation()`, and `useConversations()` selector surface.
