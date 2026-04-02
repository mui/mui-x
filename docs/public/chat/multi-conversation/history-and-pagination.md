---
productId: x-chat
title: History & Pagination
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatMessageList
---

# Chat - History & Pagination

<p class="description">Load older messages on demand using cursor-based pagination through the adapter's <code>listMessages</code> method.</p>



When working with multi-conversation layouts, each conversation typically has a message history stored on the server. The `listMessages` adapter method lets you load that history page by page using cursor-based pagination.

## The `listMessages` adapter method

Implement `listMessages` to load message history when the user opens a conversation. The runtime calls it whenever `activeConversationId` changes to a conversation that has no messages in the store yet.

```ts
interface ChatListMessagesInput<Cursor> {
  conversationId: string;
  cursor?: Cursor;
  direction?: 'forward' | 'backward'; // default: 'backward' (newest first)
}

interface ChatListMessagesResult<Cursor> {
  messages: ChatMessage[];
  cursor?: Cursor;
  hasMore?: boolean;
}
```

A typical implementation fetches from a REST endpoint:

```tsx
async listMessages({ conversationId, cursor }) {
  const params = new URLSearchParams({ cursor: cursor ?? '' });
  const res = await fetch(`/api/conversations/${conversationId}/messages?${params}`);
  const { messages, nextCursor, hasMore } = await res.json();
  return { messages, cursor: nextCursor, hasMore };
},
```

## Cursor-based pagination

The adapter interface is generic over the cursor type. The default is `string`, which covers opaque server cursors, Base64 tokens, and ISO timestamps.

If your API uses a structured cursor, provide the type at the call site:

```ts
interface MyCursor {
  page: number;
  token: string;
}

const adapter: ChatAdapter<MyCursor> = {
  async sendMessage(input) {
    /* ... */
  },

  async listMessages({ cursor }) {
    // cursor is typed as MyCursor | undefined here
    const page = cursor?.page ?? 1;
    const res = await fetch(`/api/messages?page=${page}`);
    const { messages, nextPage, token } = await res.json();
    return {
      messages,
      cursor: { page: nextPage, token },
      hasMore: !!nextPage,
    };
  },
};
```

The cursor type flows automatically through `ChatBox`, the store, hooks, and all adapter input and output types.

## The `hasMoreHistory` state

When `listMessages` returns `hasMore: true`, the runtime sets `hasMoreHistory` to `true` in the store. This flag drives the "Load earlier messages" affordance in the message list.

The normalized store tracks history pagination state:

| Internal field   | Type                  | Description                           |
| :--------------- | :-------------------- | :------------------------------------ |
| `hasMoreHistory` | `boolean`             | Whether more history is available     |
| `historyCursor`  | `Cursor \| undefined` | Pagination cursor for history loading |

## Loading older messages

When `hasMoreHistory` is `true`, `ChatBox` shows a "Load earlier messages" control at the top of the message list. Clicking it calls `listMessages` again with the stored `historyCursor`.

The flow works as follows:

1. User opens a conversation — runtime calls `listMessages({ conversationId })`.
2. Adapter returns messages plus `{ cursor: nextCursor, hasMore: true }`.
3. Runtime stores messages, sets `hasMoreHistory: true` and `historyCursor: nextCursor`.
4. User scrolls to the top and triggers load — runtime calls `listMessages({ conversationId, cursor: nextCursor })`.
5. Adapter returns the next page. If `hasMore: false`, the "load more" control disappears.

## History loading indicator

While `listMessages` is in flight, the runtime enters a history-loading state. The message list renders a loading indicator at the top of the scroll area. This happens automatically when using `ChatBox`.

## Error handling

If `listMessages` throws, the runtime records a `ChatError` with `source: 'history'` and surfaces it through the error model. The error is recoverable — the user can retry by triggering the load again.

```tsx
<ChatBox
  adapter={adapter}
  onError={(error) => {
    if (error.source === 'history') {
      console.error('Failed to load message history:', error.message);
    }
  }}
/>
```

## API

- [`ChatMessageList`](/x/api/chat/chat-message-list/)

## See also

- [Adapter](/x/react-chat/backend/adapters/) for the full adapter interface reference.
- [Conversation List](/x/react-chat/multi-conversation/conversation-list/) for the sidebar that triggers conversation switches.
- [Real-Time Sync](/x/react-chat/multi-conversation/real-time-sync/) for pushing new messages through subscriptions.
- [State and store](/x/react-chat/customization/headless/) for the normalized store and `hasMoreHistory` flag.
