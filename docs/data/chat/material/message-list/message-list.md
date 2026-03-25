---
productId: x-chat
title: Chat - Message list
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
---

# Message list

<p class="description">Display messages in a scrollable, auto-scrolling list with date dividers, message groups, and streaming indicators.</p>

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

## Component tree

Inside `ChatBox`, the message list renders a subtree of themed components:

```
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

Control auto-scrolling through the `features` prop on `ChatBox`:

```tsx
{/* Default: auto-scroll enabled with 150 px buffer */}
<ChatBox adapter={adapter} />

{/* Custom buffer threshold */}
<ChatBox
  adapter={adapter}
  features={{ autoScroll: { buffer: 300 } }}
/>

{/* Disable auto-scroll entirely */}
<ChatBox adapter={adapter} features={{ autoScroll: false }} />
```

When auto-scroll is disabled, the user can still scroll to the bottom manually using the scroll-to-bottom affordance button.

### Scroll-to-bottom affordance

A floating button appears when the user scrolls away from the bottom.
Clicking it smoothly scrolls back to the latest message:

```tsx
{/* Enabled by default; disable with: */}
<ChatBox adapter={adapter} features={{ scrollToBottom: false }} />
```

## Date dividers

When consecutive messages span different calendar dates, a date divider is rendered automatically between them.
The divider shows a localized date string and is styled as a centered label with horizontal rules.

## Message groups

Consecutive messages from the same author are grouped together into a `ChatMessageGroup`.
Within a group only the first message displays the avatar, reducing visual repetition and making the conversation easier to scan.

## Loading and streaming states

While the assistant is generating a response, a typing indicator appears at the bottom of the message list.
Streaming tokens are rendered incrementally inside a `ChatMessageContent` bubble.

```tsx
{/* The typing indicator is enabled by default; hide it with a slot override: */}
<ChatBox
  adapter={adapter}
  slots={{ typingIndicator: () => null }}
/>
```

## Standalone usage

When building a custom layout outside of `ChatBox`, use `ChatMessageList` directly inside a `ChatProvider`:

```tsx
import { ChatProvider } from '@mui/x-chat/headless';
import { ChatMessageList, ChatMessage, ChatMessageGroup } from '@mui/x-chat';

function CustomChat({ adapter }) {
  return (
    <ChatProvider adapter={adapter}>
      <div style={{ display: 'flex', flexDirection: 'column', height: 500 }}>
        <ChatMessageList />
        {/* your custom composer here */}
      </div>
    </ChatProvider>
  );
}
```

## Imperative scrolling

The `ChatMessageList` exposes a ref handle for imperative scroll control:

```tsx
import { ChatMessageList } from '@mui/x-chat';
import type { MessageListRootHandle } from '@mui/x-chat/unstyled';

const listRef = React.useRef<MessageListRootHandle>(null);

// Scroll to bottom programmatically
listRef.current?.scrollToBottom({ behavior: 'smooth' });

<ChatMessageList ref={listRef} />
```

## Slots

The following slots are available for customization through `ChatBox`:

| Slot | Component | Description |
| :--- | :--- | :--- |
| `messageList` | `ChatMessageList` | The scrollable container |
| `messageRoot` | `ChatMessage` | Individual message row |
| `messageAvatar` | `ChatMessageAvatar` | Author avatar |
| `messageContent` | `ChatMessageContent` | Message bubble |
| `messageMeta` | `ChatMessageMeta` | Timestamp and status |
| `messageActions` | `ChatMessageActions` | Hover action menu |
| `messageGroup` | `ChatMessageGroup` | Same-author message group |
| `dateDivider` | `ChatDateDivider` | Date separator |
