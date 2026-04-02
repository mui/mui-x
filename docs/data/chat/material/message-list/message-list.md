---
productId: x-chat
title: Chat - Message list
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: MessageListRoot, MessageListDateDivider, ScrollToBottomAffordance
---

# Chat - Message list

<p class="description">Display messages in a scrollable, auto-scrolling list with date dividers, message groups, and streaming indicators.</p>

{{"component": "@mui/docs/ComponentLinkHeader"}}

The message list is the scrollable region that renders conversation history.
`ChatMessageList` wraps the `@mui/x-chat/unstyled` `MessageListRoot` primitive with Material UI styling — scroll behavior, overflow, padding, and thin scrollbar are handled out of the box.

## Import

```tsx
import { ChatMessageList } from '@mui/x-chat';
```

:::info
When using `ChatBox`, the message list is already included as a built-in part of the composition.
You only need to import `ChatMessageList` directly when building a custom layout.
:::

## Component anatomy

Inside `ChatBox`, the message list renders a subtree of themed components:

```text
ChatMessageList                     ← scrollable container
  MessageListDateDivider            ← date separator between message groups
  ChatMessageGroup                  ← groups consecutive same-author messages
    ChatMessage                     ← individual message row
      ChatMessageAvatar             ← author avatar
      ChatMessageContent            ← message bubble with part renderers
      ChatMessageMeta               ← timestamp, delivery status
      ChatMessageActions            ← hover action buttons
```

## Auto-scrolling

The message list automatically scrolls to the bottom when:

- The user sends a new message (always active).
- New messages arrive from the assistant while the user is near the bottom.
- Streaming content grows (token-by-token updates).

The auto-scroll behavior is gated by a **buffer** — if the user has scrolled more than `buffer` pixels away from the bottom, automatic scrolling pauses so the user can read earlier messages without interruption.

### Configuration

Control auto-scrolling through the `features` prop on `ChatBox`.
The first demo below uses a custom 300 px buffer threshold; the second disables auto-scroll entirely.
When auto-scroll is disabled, the user can still scroll to the bottom manually using the scroll-to-bottom affordance button.

{{"demo": "AutoScrollConfig.js", "defaultCodeOpen": false, "bg": "inline"}}

### Scroll-to-bottom affordance

A floating button appears when the user scrolls away from the bottom.
Clicking it smoothly scrolls back to the latest message:

```tsx
{
  /* Enabled by default; disable with: */
}
<ChatBox adapter={adapter} features={{ scrollToBottom: false }} />;
```

## History loading

When the user scrolls to the top of the message list, older messages are loaded automatically via the adapter's `listMessages` method.
The message list preserves the current scroll position during prepend so the user doesn't lose their place.

## Date dividers

When consecutive messages span different calendar dates, a date divider is rendered automatically between them.
The divider shows a localized date string and is styled as a centered label with horizontal rules.

Customize the date format through `slotProps`. The demo below uses a short month + day format:

{{"demo": "DateDividerFormat.js", "defaultCodeOpen": false, "bg": "inline"}}

## Message groups

Consecutive messages from the same author are grouped together into a `ChatMessageGroup`.
Within a group only the first message displays the avatar, reducing visual repetition and making the conversation easier to scan.

The grouping window defaults to 5 minutes (300,000 ms). Customize it through `slotProps`.
The demo below sets the window to 1 minute (60,000 ms) — notice how messages more than 1 minute apart start a new group with a fresh avatar:

{{"demo": "MessageGrouping.js", "defaultCodeOpen": false, "bg": "inline"}}

## Compact variant

Set `variant="compact"` on `ChatBox` to switch to a dense, messenger-style layout.
Compact mode applies the following changes to the message list:

- **No bubbles** — messages render as plain text without background colors or padding.
- **Left-aligned** — all messages are left-aligned regardless of role (no right-aligned user messages).
- **Group header timestamps** — the timestamp moves from below each message to the group header, displayed next to the author name.
- **Avatars preserved** — avatars remain visible for the first message in each group.

When set on `ChatBox`, the variant automatically applies to the conversation list as well.

{{"demo": "CompactVariant.js", "defaultCodeOpen": false, "bg": "inline"}}

```tsx
<ChatBox variant="compact" adapter={adapter} />
```

## Density

The `density` prop controls the vertical spacing between messages.
Three values are available — `compact`, `standard` (default), and `comfortable` — mirroring the density model used in [Data Grid](/x/react-data-grid/accessibility/#density).

Use the toggle in the demo below to compare the three density levels:

{{"demo": "DensityProp.js", "defaultCodeOpen": false, "bg": "inline"}}

```tsx
<ChatBox density="compact" adapter={adapter} />
<ChatBox density="comfortable" adapter={adapter} />
```

The `density` prop is independent of `variant` — you can combine `variant="compact"` with any density value.

## Loading and streaming states

While the assistant is generating a response, streaming tokens are rendered incrementally inside a `ChatMessageContent` bubble.
The message list auto-scrolls to follow new content as long as the user is near the bottom.

## Standalone usage

When building a custom layout outside of `ChatBox`, use `ChatMessageList` directly inside a `ChatRoot` provider.
The demo below renders only the message list with a placeholder for a custom composer:

{{"demo": "StandaloneMessageList.js", "defaultCodeOpen": false, "bg": "inline"}}

## Imperative scrolling

The `ChatMessageList` exposes a ref handle for imperative scroll control:

```tsx
import { ChatMessageList } from '@mui/x-chat';
import type { MessageListRootHandle } from '@mui/x-chat/unstyled';

const listRef = React.useRef<MessageListRootHandle>(null);

// Scroll to bottom programmatically
listRef.current?.scrollToBottom({ behavior: 'smooth' });

<ChatMessageList ref={listRef} />;
```

## MessageListContext

Child components inside the message list can access scroll state via context:

```tsx
import { useMessageListContext } from '@mui/x-chat/unstyled';

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

## Accessibility

The message list includes built-in ARIA attributes:

- The scroller element has `role="log"` and `aria-live="polite"` for screen reader announcements
- Date dividers use `role="separator"`
- The `aria-label` is derived from the locale text system

## Slots

The following slots are available for customization through `ChatBox`:

| Slot             | Component            | Description               |
| :--------------- | :------------------- | :------------------------ |
| `messageList`    | `ChatMessageList`    | The scrollable container  |
| `messageRoot`    | `ChatMessage`        | Individual message row    |
| `messageAvatar`  | `ChatMessageAvatar`  | Author avatar             |
| `messageContent` | `ChatMessageContent` | Message bubble            |
| `messageMeta`    | `ChatMessageMeta`    | Timestamp and status      |
| `messageActions` | `ChatMessageActions` | Hover action menu         |
| `messageGroup`   | `ChatMessageGroup`   | Same-author message group |
| `dateDivider`    | `ChatDateDivider`    | Date separator            |

## API

- [MessageListRoot](/x/api/chat/message-list-root/)
- [MessageListDateDivider](/x/api/chat/message-list-date-divider/)
- [ScrollToBottomAffordance](/x/api/chat/scroll-to-bottom-affordance/)
