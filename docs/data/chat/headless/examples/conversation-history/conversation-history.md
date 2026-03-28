---
title: Chat - Conversation history
productId: x-chat
packageName: '@mui/x-chat/headless'
githubLabel: 'scope: chat'
---

# Chat - Conversation history

<p class="description">Use adapter-driven conversations, thread loading, and history paging without any structural UI components</p>

This demo covers the full conversation lifecycle through the adapter:

- loading the conversation list on mount
- loading messages when the active conversation changes
- paging through older history
- sending follow-up messages within a loaded thread

The UI is a plain inbox-and-thread shell built only with React elements and runtime hooks.

## Key concepts

### Adapter methods for history

Two optional adapter methods enable conversation orchestration:

```tsx
const adapter: ChatAdapter = {
  async listConversations() {
    // Called on mount — returns the conversation list
    const res = await fetch('/api/conversations');
    return { conversations: await res.json() };
  },

  async listMessages({ conversationId, cursor }) {
    // Called when activeConversationId changes — returns thread messages
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

{{"demo": "ConversationHistoryHeadlessChat.js"}}

## Key takeaways

- `listConversations()` and `listMessages()` are optional adapter methods — the runtime skips them if not implemented
- History pagination is driven by cursors and the `hasMoreHistory` flag
- Switching conversations triggers automatic thread loading through the adapter
- New messages can still be sent and streamed within a loaded thread

## API

- [ChatRoot](/x/api/chat/chat-root/)

## See also

- [Adapters](/x/react-chat/headless/adapters/) for the full adapter interface reference
- [Controlled state](/x/react-chat/headless/examples/controlled-state/) for externally-owned conversation state
- [Streaming lifecycle](/x/react-chat/headless/examples/streaming-lifecycle/) for send, stop, and retry flows
