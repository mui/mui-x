---
productId: x-chat
title: History and pagination
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatMessageList
---

# Chat - History and pagination

<p class="description">Load older messages on demand with cursor-based pagination.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

When working with multi-conversation layouts, each conversation typically has a message history stored on the server.
The `listMessages` adapter method lets you load that history page by page using cursor-based pagination.

## Loading message history

Implement `listMessages` to load message history when the user opens a conversation.
The runtime calls it whenever `activeConversationId` changes to a non-null conversation, clearing any previously loaded messages before fetching the new page (when `messages` is uncontrolled—with a controlled `messages` prop, the store is never reset).
`listMessages` supersedes the deprecated `loadMore(cursor)` method—the runtime only falls back to `loadMore` for scroll-triggered loads when `listMessages` is not implemented.

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

The runtime always requests `direction: 'backward'`—the newest page first, then progressively older pages as the user scrolls up. The `'forward'` value exists on the input type for adapters that are also called directly (for example, to fill gaps after a reconnect), but `ChatBox` never passes it. Adapters that only serve `ChatBox` can ignore the field.

`hasMore` defaults to `false`—if your adapter omits it, the runtime assumes the history is complete and stops paginating.

A typical implementation fetches from a REST endpoint:

```ts
const adapter: ChatAdapter = {
  // ...
  async listMessages({ conversationId, cursor }) {
    const params = new URLSearchParams({ cursor: cursor ?? '' });
    const res = await fetch(
      `/api/conversations/${conversationId}/messages?${params}`,
    );
    const { messages, nextCursor, hasMore } = await res.json();
    return { messages, cursor: nextCursor, hasMore };
  },
};
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

## Tracking pagination state

When `listMessages` returns `hasMore: true`, the runtime sets `hasMoreHistory` to `true` in the store.
This flag tells the message list that an additional page of history can be fetched when the user scrolls to the top.

The chat store exposes the history pagination state—readable from `useChat()` or via `chatSelectors`:

| Store field        | Type                  | Description                                                                     |
| :----------------- | :-------------------- | :------------------------------------------------------------------------------ |
| `hasMoreHistory`   | `boolean`             | Whether more history is available                                               |
| `isLoadingHistory` | `boolean`             | Whether a history fetch is currently in flight (initial page or older messages) |
| `historyCursor`    | `Cursor \| undefined` | Pagination cursor for history loading                                           |

All three fields are readable through `useChat()` or the corresponding selectors (`selectHasMoreHistory`, `selectIsLoadingHistory`).

## Loading older messages

These store fields drive the scroll-triggered flow.
When `hasMoreHistory` is `true`, the message list automatically calls `listMessages` with the stored `historyCursor` as soon as the user scrolls to the top of the list.
`ChatBox` does not render a separate button—the load is triggered by the scroll position.

The runtime drives history loading in these steps:

1. User opens a conversation—runtime calls `listMessages({ conversationId, direction: 'backward' })`.
2. Adapter returns messages plus `{ cursor: nextCursor, hasMore: true }`.
3. Runtime stores messages, sets `hasMoreHistory: true` and `historyCursor: nextCursor`.
4. User scrolls to the top—runtime automatically calls `listMessages({ conversationId, cursor: nextCursor, direction: 'backward' })`.
5. Adapter returns the next page. If `hasMore: false`, no further automatic loads are triggered.

{{"demo": "HistoryPaginationDemo.js", "bg": "inline"}}

## History loading indicator

While a history fetch is in flight, the runtime blocks duplicate scroll-triggered requests (an in-flight guard prevents overlapping loads—there is no debounce).
However, `ChatBox` and `ChatMessageList` do not render a built-in loading indicator during history fetches.
To show a spinner or skeleton while messages are loading, use the `overlay` prop on `ChatMessageList` combined with the `isLoadingHistory` value from `useChat`:

```tsx
const { isLoadingHistory } = useChat();

<ChatMessageList overlay={isLoadingHistory ? <HistoryLoadingIndicator /> : null} />;
```

`isLoadingHistory` is `true` whenever a history fetch for the active conversation is in flight—both the initial page fetched when a conversation opens and the older pages fetched when the user scrolls to the top.
Its initial value is `false`, so server-rendered markup is stable; the flag flips after mount while the first page is being fetched.
Switching conversations resets the flag along with the rest of the message state.
One edge case: with controlled `messages` and `setActiveConversation(undefined)`, the flag can stay `true` briefly until the in-flight request settles.

The `overlay` slot renders as a floating, pointer-transparent layer anchored to the bottom edge of the list—it does not appear at the top.
To pin an indicator to the top of the list instead, override the overlay slot's styling, for example through `slotProps.messageListOverlay`.

## Error handling

If `listMessages` throws, the runtime records a `ChatError` with `source: 'history'` and surfaces it through the error model. The error is recoverable—the user can retry by triggering the load again.

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

## See also

- [Adapter interface reference](/x/react-chat/backend/adapters/) for the full contract between your backend and the chat runtime.
- [Conversation List](/x/react-chat/multi-conversation/conversation-list/) for the sidebar that triggers conversation switches.
- [Real-time sync](/x/react-chat/multi-conversation/real-time-sync/) for pushing new messages through subscriptions.
