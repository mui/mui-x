---
title: Chat - Realtime thread sync
productId: x-chat
packageName: '@mui/x-chat/headless'
githubLabel: 'scope: chat'
---

# Chat - Realtime thread sync

<p class="description">Use realtime events to add, update, remove, and rename conversations and messages.</p>

This demo focuses on collection synchronization through realtime events.
Unlike the basic realtime demo (which covers typing, presence, and read state), this one demonstrates structural changes to the message and conversation lists:

- `message-added` — a new message appears in the thread
- `message-updated` — an existing message is modified
- `message-removed` — a message is deleted from the thread
- `conversation-added` — a new conversation appears in the sidebar
- `conversation-updated` — a conversation title or metadata changes
- `conversation-removed` — a conversation is deleted (active conversation resets if it matched)

## Key concepts

### Dispatching collection events

Push events through the `onEvent` callback provided by `subscribe()`:

```ts
// Add a message from another user
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

// Remove a conversation
onEvent({
  type: 'conversation-removed',
  conversationId: 'old-thread',
});
```

### Active conversation reset

When a `conversation-removed` event arrives and the removed conversation is the active one, the runtime resets `activeConversationId` to `undefined`.
Your UI can respond by showing a placeholder or selecting the next conversation.

{{"demo": "RealtimeThreadSyncHeadlessChat.js"}}

## Key takeaways

- Collection events (`*-added`, `*-updated`, `*-removed`) drive structural changes to the store
- The runtime handles normalization — adding, replacing, or removing records in the ID maps
- Active conversation automatically resets when its conversation is removed
- These events work alongside the streaming lifecycle — you can push messages while a stream is active

## See also

- [Realtime](/x/react-chat/core/realtime/) for the full event type reference
- [Realtime](/x/react-chat/core/examples/realtime/) for typing, presence, and read-state events
- [Adapters](/x/react-chat/core/adapters/) for the `subscribe()` method reference

## API

- [ChatRoot](/x/api/chat/chat-root/)
