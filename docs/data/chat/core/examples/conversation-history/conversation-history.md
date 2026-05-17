---
title: Chat - Conversation history
productId: x-chat
packageName: '@mui/x-chat/headless'
githubLabel: 'scope: chat'
---

# Chat - Conversation history

<p class="description">Load, page, and switch between conversation threads through the chat adapter.</p>

Handle the full conversation lifecycle through the adapter:

- Load the conversation list on mount.
- Load messages when the active conversation changes.
- Page through older history.
- Send follow-up messages within a loaded thread.

## Key concepts

### Adapter methods for history

Two optional adapter methods—`listConversations()` and `listMessages()`—enable conversation orchestration:

```tsx
const adapter: ChatAdapter = {
  async listConversations() {
    // Called on mount—returns the conversation list
    const res = await fetch('/api/conversations');
    return { conversations: await res.json() };
  },

  async listMessages({ conversationId, cursor }) {
    // Called when activeConversationId changes—returns thread messages
    const res = await fetch(`/api/threads/${conversationId}?cursor=${cursor ?? ''}`);
    const { messages, nextCursor, hasMore } = await res.json();
    return { messages, cursor: nextCursor, hasMore };
  },

  async sendMessage(input) {
    /* ... */
  },
};
```

### Cursor-based pagination

`listMessages()` returns a `cursor` and `hasMore` flag.
When the user scrolls to the top, call `loadMoreHistory()` to fetch the next page:

```tsx
const { hasMoreHistory, loadMoreHistory } = useChat();

<button disabled={!hasMoreHistory} onClick={() => loadMoreHistory()}>
  Load older messages
</button>;
```

### Switching conversations

Call `setActiveConversation(id)` to switch threads.
The runtime automatically calls `listMessages()` for the new conversation:

```tsx
const { setActiveConversation } = useChat();

<ConversationList onSelect={(id) => setActiveConversation(id)} />;
```

## Key takeaways

- `listConversations()` and `listMessages()` are optional adapter methods—the runtime skips them if not implemented.
- History pagination is driven by cursors and the `hasMoreHistory` flag.
- Switching conversations triggers automatic thread loading through the adapter.
- New messages can be sent and streamed within a loaded thread.

## See also

- See [Adapters](/x/react-chat/core/adapters/) for the full adapter interface reference.
- See [Controlled state](/x/react-chat/core/examples/controlled-state/) for details on externally owned conversation state.
- See [Streaming lifecycle](/x/react-chat/core/examples/streaming-lifecycle/) for details on send, stop, and retry flows.

## API

- [ChatRoot](/x/api/chat/chat-root/)
