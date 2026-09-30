---
title: Chat - Real-time
productId: x-chat
packageName: '@mui/x-chat/headless'
githubLabel: 'scope: chat'
---

# Chat - Real-time

<p class="description">Push typing indicators, presence updates, and read receipts from your backend into the chat runtime in real time.</p>

The example below shows how the runtime handles real-time push updates through the adapter's `subscribe()` method:

- The adapter's `subscribe()` method and its cleanup lifecycle.
- Typing events that update `useChatStatus().typingUserIds`.
- Presence events that update participant `isOnline` state.
- Read events that update conversation read state.

## Key concepts

### Receiving real-time events

When `ChatProvider` mounts and the adapter implements `subscribe()`, the runtime calls it with an `onEvent` callback.
The adapter pushes events through this callback and returns a cleanup function:

```tsx
const adapter: ChatAdapter = {
  async sendMessage(input) {
    /* ... */
  },

  subscribe({ onEvent }) {
    const ws = new WebSocket('/api/events');

    ws.onmessage = (event) => {
      onEvent(JSON.parse(event.data));
    };

    return () => ws.close();
  },
};
```

### Typing indicators

Push typing events to update which users are currently typing:

```ts
onEvent({
  type: 'typing',
  conversationId: 'support',
  userId: 'user-1',
  isTyping: true,
});
```

Read the result with `useChatStatus()`:

```tsx
const { typingUserIds } = useChatStatus();
// typingUserIds: ['user-1']
```

### Presence updates

Push presence events to update user online status:

```ts
onEvent({
  type: 'presence',
  userId: 'user-1',
  isOnline: false,
});
```

Presence changes update `isOnline` on matching `ChatUser` objects inside conversation participants.

### Read state

Push read events to mark conversations as read:

```ts
onEvent({
  type: 'read',
  conversationId: 'support',
  messageId: 'msg-42',
});
```

The demo below wires all three event types into a single adapter:

{{"demo": "RealtimeHeadlessChat.js"}}

## Key takeaways

- The runtime fully manages the subscription lifecycle—`subscribe()` on mount, cleanup on unmount.
- Typing, presence, and read events update the store automatically.
- `useChatStatus().typingUserIds` is the primary hook for typing indicators.
- Presence and read updates surface through conversation-level selectors.

## See also

- See [Real-time](/x/react-chat/core/realtime/) for the full event-type reference and store effects.
- See [Adapters](/x/react-chat/core/adapters/) for the `subscribe()` method reference.
- See [Real-time thread sync](/x/react-chat/core/examples/realtime-thread-sync/) for message and conversation add/update/remove events.

## API

- [ChatRoot](/x/api/chat/chat-root/)
