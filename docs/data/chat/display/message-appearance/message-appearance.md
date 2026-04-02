---
productId: x-chat
title: Message Appearance
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatMessageGroup, ChatMessageAvatar, ChatMessageMeta, ChatDateDivider
---

# Chat - Message Appearance

<p class="description">Control the visual presentation of messages — grouping, date dividers, avatars, timestamps, and layout variants.</p>

{{"component": "@mui/docs/ComponentLinkHeader"}}

This page covers the visual aspects of how messages are displayed in the message list. For message content rendering (text, files, code blocks), see the [Message Parts](/x/react-chat/display/message-parts/text-and-markdown/) section.

## Message groups

Consecutive messages from the same author are grouped together into a `ChatMessageGroup`. Within a group, only the first message displays the avatar, reducing visual repetition and making the conversation easier to scan.

The grouping window defaults to 5 minutes (300,000 ms). Messages from the same author that arrive within this window are placed in the same group. Customize it through `slotProps`:

{{"demo": "../../material/message-list/MessageGrouping.js", "defaultCodeOpen": false, "bg": "inline"}}

Grouping is based on:

- Author identity (user ID)
- Author role fallback when no explicit author ID exists
- An adjustable time window in milliseconds

## Date dividers

When consecutive messages span different calendar dates, a date divider is rendered automatically between them. The divider shows a localized date string and is styled as a centered label with horizontal rules.

Customize the date format through `slotProps`:

{{"demo": "../../material/message-list/DateDividerFormat.js", "defaultCodeOpen": false, "bg": "inline"}}

## Avatars

The `ChatMessageAvatar` component renders the author's avatar for the first message in each group. Avatars are sourced from the `ChatUser.avatarUrl` field on the message's author.

Within a group, subsequent messages omit the avatar to keep the layout clean. The avatar area is still allocated in the grid so that message content stays aligned.

## Timestamps and metadata

`ChatMessageMeta` renders the timestamp and delivery status below each message. The timestamp is derived from the `createdAt` field on `ChatMessage`.

In the default layout, timestamps appear below the message bubble, aligned to the same side as the bubble (right for user messages, left for assistant messages).

## Component anatomy

Inside `ChatBox`, the message list renders this component tree:

```text
ChatMessageList                     ← scrollable container
  ChatDateDivider                   ← date separator between groups
  ChatMessageGroup                  ← groups consecutive same-author messages
    ChatMessage                     ← individual message row
      ChatMessageAvatar             ← author avatar
      ChatMessageContent            ← message bubble with part renderers
      ChatMessageMeta               ← timestamp, delivery status
      ChatMessageActions            ← hover action buttons
```

## Compact variant

Set `variant="compact"` on `ChatBox` to switch to a dense, messenger-style layout:

- **No bubbles** — messages render as plain text without background colors or padding.
- **Left-aligned** — all messages are left-aligned regardless of role.
- **Group header timestamps** — the timestamp moves from below each message to the group header, displayed next to the author name.
- **Avatars preserved** — avatars remain visible for the first message in each group.

{{"demo": "../../material/message-list/CompactVariant.js", "defaultCodeOpen": false, "bg": "inline"}}

```tsx
<ChatBox variant="compact" adapter={adapter} />
```

When set on `ChatBox`, the variant automatically applies to the conversation list as well.

## Density

The `density` prop controls the vertical spacing between messages. Three values are available:

| Value         | Description                          |
| :------------ | :----------------------------------- |
| `compact`     | Tight spacing, minimal gaps          |
| `standard`    | Default spacing                      |
| `comfortable` | Generous spacing, more breathing room|

{{"demo": "../../material/message-list/DensityProp.js", "defaultCodeOpen": false, "bg": "inline"}}

```tsx
<ChatBox density="compact" adapter={adapter} />
<ChatBox density="comfortable" adapter={adapter} />
```

The `density` prop is independent of `variant` — you can combine `variant="compact"` with any density value.

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

- [`ChatMessageGroup`](/x/api/chat/chat-message-group/)
- [`ChatMessageAvatar`](/x/api/chat/chat-message-avatar/)
- [`ChatMessageMeta`](/x/api/chat/chat-message-meta/)
- [`ChatDateDivider`](/x/api/chat/chat-date-divider/)

## See also

- [Message list](/x/react-chat/basics/messages/) for scrolling behavior, auto-scroll configuration, and history loading
- [Message Actions](/x/react-chat/display/message-actions/) for the hover action menu on messages
- [Loading & Empty States](/x/react-chat/display/loading-and-empty-states/) for skeleton and empty state display
