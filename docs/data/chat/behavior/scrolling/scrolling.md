---
productId: x-chat
title: Scrolling
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatMessageList, ChatScrollToBottomAffordance
---

# Chat - Scrolling

<p class="description">Keep new messages visible with auto-scroll, scroll-to-bottom affordance, and automatic history loading on scroll.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

## Interactive playground

Try the scroll-to-bottom affordance live: scroll up inside the preview to reveal the jump-to-latest button, and try each `scrollBehavior`.

{{"demo": "ChatScrollToBottomAffordancePlayground.js", "bg": "inline", "defaultCodeOpen": false}}

The message list automatically manages scroll position so new messages and streaming content stay visible without user intervention.
Users can still scroll up to read earlier messages without losing their place.

## Auto-scrolling

The message list automatically scrolls to the bottom when:

- The user sends a new message (always active, regardless of configuration).
- New messages arrive from the assistant while the user is near the bottom.
- Streaming content grows (token-by-token updates).

The auto-scroll behavior is gated by a **buffer**—if the user has scrolled more than `buffer` pixels away from the bottom, automatic scrolling pauses so the user can read earlier messages without interruption.
The same buffer defines the bottom zone for the message list's `onReachBottom` callback, which fires once each time the viewport enters it.

### Configuration

Control auto-scrolling through the `features` prop on `ChatBox`.
The default buffer is `150px`:

```tsx
// Default — auto-scroll on with a 150px buffer
<ChatBox adapter={adapter} />

// Custom 300px buffer threshold
<ChatBox adapter={adapter} features={{ autoScroll: { buffer: 300 } }} />

// Disable auto-scroll entirely
<ChatBox adapter={adapter} features={{ autoScroll: false }} />
```

When auto-scroll is disabled, users can still scroll to the bottom manually using the scroll-to-bottom affordance.

Send a message, then scroll up while the long reply streams in — auto-scroll pauses once you're more than `buffer` pixels from the bottom and resumes when you scroll back within it.

{{"demo": "AutoScrollBuffer.js", "defaultCodeOpen": false, "bg": "inline"}}

:::info
Scrolling to the bottom when the user sends a message is always active, regardless of the `autoScroll` setting.
:::

## Scroll-to-bottom affordance

A floating button appears when the user scrolls away from the bottom.
Clicking it smoothly scrolls back to the latest message.
Try it in the [interactive playground](#interactive-playground) at the top of this page.

The [affordance](/x/api/chat/chat-scroll-to-bottom-affordance/) is enabled by default.
Disable it with:

```tsx
<ChatBox adapter={adapter} features={{ scrollToBottom: false }} />
```

The affordance also supports an unseen-message count badge and an `aria-label` that includes the unseen count when present.

The affordance's accessible name comes from the `scrollToBottomLabel` and `scrollToBottomWithCountLabel` locale strings — see [Localization](/x/react-chat/customization/structure/#localization) to translate them.
The message list also renders a visually hidden `role="status"` live region (the `messageListStatus` slot) that announces when a streamed response starts and completes to screen readers.
For the full keyboard and screen-reader model, see the [Accessibility](/x/react-chat/accessibility/) page and [Message list—Accessibility](/x/react-chat/material/message-list/#accessibility).

## Scrolling programmatically with a ref

The [`ChatMessageList`](/x/api/chat/chat-message-list/) component exposes a ref handle for programmatic scroll control:

```tsx
import { ChatMessageList } from '@mui/x-chat';
import type { MessageListRootHandle } from '@mui/x-chat/headless';

const listRef = React.useRef<MessageListRootHandle>(null);

// Scroll to bottom programmatically
listRef.current?.scrollToBottom({ behavior: 'smooth' });

<ChatMessageList ref={listRef} />;
```

## Accessing scroll state from child components

Child components inside the message list can access scroll state via context:

```tsx
import { useMessageListContext } from '@mui/x-chat/headless';

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

## Loading message history

When the user scrolls to the top of the message list, older messages are loaded automatically via the adapter's `listMessages` method.
The message list preserves the current scroll position during prepend so the user doesn't lose their place.

:::success
Prepending history never causes a scroll jump — the list anchors to the first visible message and restores its position after the older messages render.
:::

The adapter signals whether more history is available through the `hasMore` flag:

```tsx
async listMessages({ conversationId, cursor }) {
  const res = await fetch(`/api/conversations/${conversationId}/messages?cursor=${cursor ?? ''}`);
  const { messages, nextCursor, hasMore } = await res.json();
  return { messages, cursor: nextCursor, hasMore };
},
```

When `hasMore` is `true`, the message list continues to load older messages as the user scrolls up.
When `hasMore` is `false`, no more history is requested when the user reaches the top.

You can also check the history loading state programmatically:

```tsx
const { hasMoreHistory, loadMoreHistory } = useChat();

// Trigger manually if needed
await loadMoreHistory();
```

## See also

- [Message list](/x/react-chat/basics/messages/) for details on date dividers, grouping, and density.
- [Streaming](/x/react-chat/behavior/streaming/) for details on how auto-scroll follows streaming content.
- [Adapter](/x/react-chat/backend/adapters/) for details on the `listMessages` method that powers history loading.
