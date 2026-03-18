---
productId: x-chat
title: Chat - Headless realtime
packageName: '@mui/x-chat-headless'
---

# Headless realtime

<p class="description">Push typing, presence, read state, and collection changes into the runtime through the adapter's <code>subscribe()</code> method.</p>

The adapter's `subscribe()` method enables push-based updates from the backend.
The runtime calls it on mount and cleans it up on unmount, keeping the subscription lifecycle fully managed.

## Subscription lifecycle

When `ChatProvider` mounts and the adapter implements `subscribe()`, the runtime:

1. Calls `subscribe({ onEvent })` with a callback.
2. Stores the returned cleanup function.
3. On unmount, calls the cleanup function to close the connection.

```ts
const adapter: ChatAdapter = {
  async sendMessage(input) { /* ... */ },

  subscribe({ onEvent }) {
    const ws = new WebSocket('/api/realtime');
    ws.onmessage = (event) => onEvent(JSON.parse(event.data));
    return () => ws.close();
  },
};
```

The cleanup function can be returned directly or from a resolved promise, supporting both synchronous and asynchronous setup.

## Event types

The `onEvent` callback receives `ChatRealtimeEvent` objects.
There are eight event variants:

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

## Adjacent pages

- [Adapters](/x/react-chat/headless/adapters/) for the full adapter interface including `subscribe()`.
- [Hooks](/x/react-chat/headless/hooks/) for `useChatStatus()` and the typing/presence consumption pattern.
- [Realtime](/x/react-chat/headless/examples/realtime/) for a recipe covering subscriptions, typing, and presence.
- [Realtime thread sync](/x/react-chat/headless/examples/realtime-thread-sync/) for add, update, and remove events.
