---
productId: x-chat
title: Real-Time Sync
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatBox
---

# Chat - Real-Time Sync

<p class="description">Push typing, presence, and collection changes into the runtime via the adapter's <code>subscribe()</code> method for live synchronization.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

The adapter's `subscribe()` method enables push-based updates from the backend. The runtime calls it on mount and cleans it up on unmount, keeping the subscription lifecycle fully managed.

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

The `onEvent` callback receives `ChatRealtimeEvent` objects. There are nine event variants organized in five categories.

### Conversation events

| Event type             | Payload              | Store effect                                                |
| :--------------------- | :------------------- | :---------------------------------------------------------- |
| `conversation-added`   | `{ conversation }`   | Adds the conversation to the store                          |
| `conversation-updated` | `{ conversation }`   | Upserts the conversation record (replaces if present, adds if missing) |
| `conversation-removed` | `{ conversationId }` | Removes the conversation and resets active ID if it matched |

### Message events

| Event type        | Payload                          | Store effect                       |
| :---------------- | :------------------------------- | :--------------------------------- |
| `message-added`   | `{ message }`                    | Adds the message to the store      |
| `message-updated` | `{ message }`                    | Upserts the message record (replaces if present, adds if missing) |
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

Each event is a plain object with a `type` field. Here are the full shapes:

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

### Read state

Read events update the `readState` and `unreadCount` fields on `ChatConversation`. Use `useConversation(id)` to reflect read status in the UI:

```ts
onEvent({
  type: 'read',
  conversationId: 'support',
  messageId: 'msg-42',
});
```

## Collection synchronization

Collection events drive structural changes to the message and conversation lists.

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

When a `conversation-removed` event arrives and the removed conversation is the active one, the runtime resets `activeConversationId` to `undefined`. Your UI can respond by showing a placeholder or selecting the next conversation.

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

## Sending typing indicators

Implement the `setTyping` adapter method to send typing indicators to your backend when the user is composing a message:

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

The runtime calls `setTyping` when the composer value changes from empty to non-empty (and vice versa). To receive typing indicators from other users, push `typing` events through the `onEvent` callback in `subscribe()`.

## See also

- [Read Receipts](/x/react-chat/multi-conversation/read-receipts/) for the `markRead()` adapter method and unread badge display.
- [Conversation List](/x/react-chat/multi-conversation/conversation-list/) for the sidebar that reflects realtime conversation updates.
- [Adapter](/x/react-chat/backend/adapters/) for the full `subscribe()` and `setTyping()` method reference.
