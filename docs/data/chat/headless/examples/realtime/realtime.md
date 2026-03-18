---
title: Chat - Realtime
productId: x-chat
packageName: '@mui/x-chat-headless'
---

# Realtime

<p class="description">Feed typing, presence, and read-state changes through the provider-owned realtime subscription.</p>

## What this example shows

This recipe demonstrates the runtime behavior behind realtime push updates:

- the adapter's `subscribe()` method and its cleanup lifecycle
- typing events that update `useChatStatus().typingUserIds`
- presence events that update participant `isOnline` state
- read events that update conversation read state

## Key concepts

### The `subscribe()` adapter method

When `ChatProvider` mounts and the adapter implements `subscribe()`, the runtime calls it with an `onEvent` callback.
The adapter pushes events through this callback and returns a cleanup function:

```tsx
const adapter: ChatAdapter = {
  async sendMessage(input) { /* ... */ },

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

{{"demo": "RealtimeHeadlessChat.js"}}

## Key takeaways

- The runtime fully manages the subscription lifecycle — `subscribe()` on mount, cleanup on unmount
- Typing, presence, and read events update the store automatically
- `useChatStatus().typingUserIds` is the primary hook for typing indicators
- Presence and read updates surface through conversation-level selectors

## Next steps

- [Realtime](/x/react-chat/headless/realtime/) for the full event type reference and store effects
- [Adapters](/x/react-chat/headless/adapters/) for the `subscribe()` method reference
- [Realtime thread sync](/x/react-chat/headless/examples/realtime-thread-sync/) for message and conversation add/update/remove events
