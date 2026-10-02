---
title: Chat - Real-time thread sync
productId: x-chat
packageName: '@mui/x-chat/headless'
githubLabel: 'scope: chat'
---

# Chat - Real-time thread sync

<p class="description">Push add, update, and remove events from your backend to keep conversations and messages in sync.</p>

Collection events drive structural changes to the message and conversation lists, in contrast to the typing, presence, and read-state events covered in the basic [Realtime](/x/react-chat/core/examples/realtime/) demo:

- `message-added`—a new message appears in the thread.
- `message-updated`—an existing message is modified.
- `message-removed`—a message is deleted from the thread.
- `conversation-added`—a new conversation appears in the sidebar.
- `conversation-updated`—a conversation title or metadata changes.
- `conversation-removed`—a conversation is deleted (active conversation resets if it matched).

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
The UI can respond by showing a placeholder or selecting the next conversation.

The demo below shows collection events driving thread and sidebar updates in real time:

{{"demo": "RealtimeThreadSyncHeadlessChat.js"}}

## Key takeaways

- Collection events (`*-added`, `*-updated`, `*-removed`) drive structural changes to the store.
- The runtime handles normalization—adding, replacing, or removing records in the ID maps.
- Active conversation automatically resets when its conversation is removed.
- These events work alongside the streaming lifecycle—you can push messages while a stream is active.

## See also

- See [Realtime](/x/react-chat/core/realtime/) for the full event type reference.
- See [Realtime—Typing, presence, and read state](/x/react-chat/core/examples/realtime/) for details.
- See [Adapters](/x/react-chat/core/adapters/) for the `subscribe()` method reference.

## API

- [ChatRoot](/x/api/chat/chat-root/)
