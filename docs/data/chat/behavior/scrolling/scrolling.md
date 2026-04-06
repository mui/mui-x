---
productId: x-chat
title: Scrolling
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatMessageList, ChatScrollToBottomAffordance
---

# Chat - Scrolling

<p class="description">Auto-scroll behavior, scroll-to-bottom affordance, imperative scroll API, and history loading on scroll-up.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

The message list automatically manages scroll position so that new messages and streaming content stay visible without user intervention, while still allowing the user to read earlier messages undisturbed.

## Auto-scrolling

The message list automatically scrolls to the bottom when:

- The user sends a new message (always active, regardless of configuration).
- New messages arrive from the assistant while the user is near the bottom.
- Streaming content grows (token-by-token updates).

The auto-scroll behavior is gated by a **buffer** — if the user has scrolled more than `buffer` pixels away from the bottom, automatic scrolling pauses so the user can read earlier messages without interruption.

### Configuration

Control auto-scrolling through the `features` prop on `ChatBox`.
The default buffer is **150 px**.

```tsx
{
  /* Custom 300 px buffer threshold */
}
<ChatBox adapter={adapter} features={{ autoScroll: { buffer: 300 } }} />;

{
  /* Disable auto-scroll entirely */
}
<ChatBox adapter={adapter} features={{ autoScroll: false }} />;
```

When auto-scroll is disabled, the user can still scroll to the bottom manually using the scroll-to-bottom affordance button.

{{"demo": "../../material/message-list/AutoScrollConfig.js", "defaultCodeOpen": false, "bg": "inline"}}

:::info
Scrolling to the bottom when the **user** sends a message is always active regardless of the `autoScroll` setting.
:::

## Scroll-to-bottom affordance

A floating button appears when the user scrolls away from the bottom.
Clicking it smoothly scrolls back to the latest message.

The affordance is enabled by default.
Disable it with:

```tsx
<ChatBox adapter={adapter} features={{ scrollToBottom: false }} />
```

The affordance also supports an unseen-message count badge and an `aria-label` that includes the unseen count when present.

## Imperative scrolling

The `ChatMessageList` component exposes a ref handle for programmatic scroll control:

```tsx
import { ChatMessageList } from '@mui/x-chat';
import type { MessageListRootHandle } from '@mui/x-chat-headless';

const listRef = React.useRef<MessageListRootHandle>(null);

// Scroll to bottom programmatically
listRef.current?.scrollToBottom({ behavior: 'smooth' });

<ChatMessageList ref={listRef} />;
```

## `MessageListContext`

Child components inside the message list can access scroll state via context:

```tsx
import { useMessageListContext } from '@mui/x-chat-headless';

function CustomScrollIndicator() {
  const { isAtBottom, unseenMessageCount, scrollToBottom } = useMessageListContext();

  if (isAtBottom) return null;
  return (
    <button onClick={() => scrollToBottom({ behavior: 'smooth' })}>
      {unseenMessageCount} new messages
    </button>
  );
}
```

| Property             | Type                 | Description                                  |
| :------------------- | :------------------- | :------------------------------------------- |
| `isAtBottom`         | `boolean`            | Whether the scroll position is at the bottom |
| `unseenMessageCount` | `number`             | Messages added since the user scrolled away  |
| `scrollToBottom`     | `(options?) => void` | Scroll to the latest message                 |

## History loading

When the user scrolls to the top of the message list, older messages are loaded automatically via the adapter's `listMessages` method.
The message list preserves the current scroll position during prepend so the user doesn't lose their place.

The adapter signals whether more history is available through the `hasMore` flag:

```tsx
async listMessages({ conversationId, cursor }) {
  const res = await fetch(`/api/conversations/${conversationId}/messages?cursor=${cursor ?? ''}`);
  const { messages, nextCursor, hasMore } = await res.json();
  return { messages, cursor: nextCursor, hasMore };
},
```

When `hasMore` is `true`, the message list continues to load older messages as the user scrolls up.
When `hasMore` is `false`, scrolling to the top has no further effect.

You can also check the history loading state programmatically:

```tsx
const { hasMoreHistory, loadMoreHistory } = useChat();

// Trigger manually if needed
await loadMoreHistory();
```

## See also

- [Message list](/x/react-chat/basics/messages/) for the full component reference including date dividers, grouping, and density.
- [Streaming](/x/react-chat/behavior/streaming/) for how auto-scroll follows streaming content.
- [Adapter](/x/react-chat/backend/adapters/) for the `listMessages` method that powers history loading.

## API

- [`ChatMessageList`](/x/api/chat/chat-message-list/)
- [`ChatScrollToBottomAffordance`](/x/api/chat/chat-scroll-to-bottom-affordance/)
