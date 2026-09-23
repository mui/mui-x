---
productId: x-chat
title: Chat - Message list
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatMessageList, ChatDateDivider, ChatScrollToBottomAffordance
---

# Chat - Message list

<p class="description">Display messages in a scrollable, auto-scrolling list with date dividers, message groups, and streaming indicators.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

The message list is the scrollable region that renders conversation history.
`ChatMessageList` provides Material UI styling—scroll behavior, overflow, padding, and a thin scrollbar are handled automatically.

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
  MessageListDateDivider            ← date separator between message groups (opt-in)
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

The auto-scroll behavior is gated by a **buffer**—if the user has scrolled more than `buffer` pixels away from the bottom, automatic scrolling pauses so the user can read earlier messages without interruption.

### Configuration

Control auto-scrolling through the `features` prop on `ChatBox`.
Use the toggle in the demo below to compare the behavior with auto-scroll enabled and disabled.
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

When consecutive messages span different calendar dates, a date divider can be rendered between them.
The divider shows a localized date string and is styled as a centered label with horizontal rules.
Dividers are disabled by default—enable them with `features={{ dateDivider: true }}`.

Customize the date format through `slotProps`. The demo below enables the feature and uses a short month + day format:

{{"demo": "DateDividerFormat.js", "defaultCodeOpen": false, "bg": "inline"}}

## Message groups

Consecutive messages from the same author are grouped together into a `ChatMessageGroup`.
Within a group only the first message displays the avatar, reducing visual repetition and making the conversation easier to scan.
If no avatar resolves for that author, the avatar slot is omitted entirely.

The grouping window defaults to 5 minutes (300,000 ms). Customize it through `slotProps`.
The demo below sets the window to 1 minute (60,000 ms)—messages more than 1 minute apart start a new group with a fresh avatar:

{{"demo": "MessageGrouping.js", "defaultCodeOpen": false, "bg": "inline"}}

## Compact variant

Set `variant="compact"` on `ChatBox` to switch to a dense, messenger-style layout.
Compact mode applies the following changes to the message list:

- **No bubbles**—messages render as plain text without background colors or padding.
- **Left-aligned**—all messages are left-aligned regardless of role (no right-aligned user messages).
- **Group header timestamps**—the timestamp moves from below each message to the group header, displayed next to the author name.
- **Avatars preserved when available**—the first message in each group still shows its resolved avatar.

When set on `ChatBox`, the variant automatically applies to the conversation list as well.

{{"demo": "CompactVariant.js", "defaultCodeOpen": false, "bg": "inline"}}

```tsx
<ChatBox variant="compact" adapter={adapter} />
```

## Density

The `density` prop controls the vertical spacing between messages.
Three values are available—`compact`, `standard` (default), and `comfortable`—mirroring the density model used in [Data Grid—Density](/x/react-data-grid/accessibility/#density).

Use the toggle in the demo below to compare the three density levels:

{{"demo": "DensityProp.js", "defaultCodeOpen": false, "bg": "inline"}}

```tsx
<ChatBox density="compact" adapter={adapter} />
<ChatBox density="comfortable" adapter={adapter} />
```

The `density` prop is independent of `variant`—combine `variant="compact"` with any density value.

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
import type { MessageListRootHandle } from '@mui/x-chat/headless';

const listRef = React.useRef<MessageListRootHandle>(null);

// Scroll to bottom programmatically
listRef.current?.scrollToBottom({ behavior: 'smooth' });

<ChatMessageList ref={listRef} />;
```

## Accessing scroll state with context

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

## Accessibility

### Keyboard navigation

The message list is a single Tab stop: a roving tabindex over the `role="article"` messages keeps only one message in the tab order at a time, so tabbing from the composer to the rest of the application never walks through every message.

{{"demo": "KeyboardNavigation.js", "defaultCodeOpen": false, "bg": "inline"}}

| Key                                              | Action                                                                                           |
| :----------------------------------------------- | :----------------------------------------------------------------------------------------------- |
| <kbd>Tab</kbd> / <kbd>Shift</kbd>+<kbd>Tab</kbd> | Enter or leave the message list (a single stop)                                                  |
| <kbd>Arrow Up</kbd> / <kbd>Arrow Down</kbd>      | Move focus to the previous / next message                                                        |
| <kbd>Home</kbd> / <kbd>End</kbd>                 | Move focus to the first / latest message                                                         |
| <kbd>Page Up</kbd> / <kbd>Page Down</kbd>        | Native scrolling (kept unbound so a message taller than the viewport stays readable by keyboard) |
| <kbd>Enter</kbd>                                 | Drill into the focused message's controls (links, copy buttons, tool output, actions)            |
| <kbd>Escape</kbd>                                | Return from a message's controls to the message                                                  |

Before the user interacts, the tab stop tracks the newest message.
The tab stop is remembered per list, so leaving and re-entering the message list returns focus to the same message.

### Interior controls and drill-in

Interactive content inside messages—links in Markdown, code-block copy buttons, tool and reasoning disclosures, source and file links—stays out of the tab order until the user drills into the focused message with <kbd>Enter</kbd>, and leaves it again on <kbd>Escape</kbd>.
All controls remain mouse-clickable throughout.
Message actions are additionally hidden (`visibility: hidden`) until the message is hovered or drilled into.

Custom interactive content rendered inside a message can participate in this model with the `useMessageContentTabIndex()` hook (or `useMessageActionable()` for full control), both exported from `@mui/x-chat-headless`:

```tsx
function CustomControl() {
  const tabIndex = useMessageContentTabIndex();
  return (
    <button type="button" tabIndex={tabIndex}>
      …
    </button>
  );
}
```

Outside a roving message list both hooks leave the natural tab order untouched, so the same component works in standalone message compositions.

Set `enableRovingFocus={false}` on the message list to opt out entirely (for example when rendering fully custom rows that manage focus themselves).

### Screen readers

- The scroller element has `role="log"` and `aria-live="polite"`, so newly arriving complete messages are announced.
- A streaming message carries `aria-busy="true"` while it streams, hinting assistive technology to defer reading it until it completes.
- A visually hidden `role="status"` region announces streaming transitions—"Assistant is responding" and "Response complete"—exactly once each, never per streamed token. The strings come from the locale text system (`responseStreamingStartedAnnouncement`, `responseStreamingCompletedAnnouncement`).
- Each message is a `role="article"` labeled "Message from {author}".
- Date dividers use `role="separator"`.
- The list `aria-label` is derived from the locale text system.

## Slots

The following slots are available for customization through `ChatBox`:

| Slot          | Component            | Description               |
| :------------ | :------------------- | :------------------------ |
| `messageList` | `ChatMessageList`    | The scrollable container  |
| `message`     | `ChatMessage`        | Individual message row    |
| `avatar`      | `ChatMessageAvatar`  | Author avatar             |
| `content`     | `ChatMessageContent` | Message bubble            |
| `meta`        | `ChatMessageMeta`    | Timestamp and status      |
| `actions`     | `ChatMessageActions` | Hover action menu         |
| `group`       | `ChatMessageGroup`   | Same-author message group |
| `dateDivider` | `ChatDateDivider`    | Date separator            |

## API

- [`MessageListRoot`](/x/api/chat/message-list-root/)
- [`MessageListDateDivider`](/x/api/chat/message-list-date-divider/)
- [`ScrollToBottomAffordance`](/x/api/chat/scroll-to-bottom-affordance/)
