---
productId: x-chat
title: Message appearance
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatMessageGroup, ChatMessageAvatar, ChatMessageAuthorLabel, ChatMessageMeta, ChatMessageInlineMeta, ChatDateDivider
---

# Chat - Message appearance

<p class="description">Control the visual presentation of messages—grouping, date dividers, avatars, timestamps, and layout variants.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

This page covers the visual aspects of how messages are displayed in the message list. See [Message parts](/x/react-chat/display/message-parts/text-and-markdown/) for how each message's content — text, code, files — is rendered.

## Message groups

Consecutive messages from the same author are grouped together into a `ChatMessageGroup`.
Within a group, only the first message displays the avatar, reducing visual repetition and making the conversation easier to scan.

By default, all consecutive messages from the same author are grouped together, regardless of how much time passes between them.
To split groups by time, pass `createTimeWindowGroupKey(windowMs)` (from `@mui/x-chat/headless`; the window defaults to 5 minutes) as the group's `groupKey` through `slotProps.messageGroup`.
The demo below uses a 1-minute window:

{{"demo": "../../material/message-list/MessageGrouping.js", "defaultCodeOpen": false, "bg": "inline"}}

By default, a new group starts when:

- The author identity changes (author ID, falling back to role when no explicit author ID exists).
- With `createTimeWindowGroupKey`, a new group also starts when the gap to the previous message exceeds the configured window.

## Date dividers

When consecutive messages span different calendar dates, a date divider can be rendered between them.
The divider shows a localized date string and is styled as a centered label with horizontal rules.
Dividers are disabled by default—enable them with `features={{ dateDivider: true }}`.

The demo below enables the feature and customizes the date format through `slotProps`:

{{"demo": "../../material/message-list/DateDividerFormat.js", "defaultCodeOpen": false, "bg": "inline"}}

Date dividers render with `role="separator"` and are not focusable; message rows remain individually focusable — see [Accessibility](/x/react-chat/accessibility/) for the focus model.

## Avatars

The `ChatMessageAvatar` component renders the author's avatar for the first message in each group.
Avatar resolution follows the same rules as the built-in message primitives:

- `getMessageAuthorAvatarUrl(message)` when provided
- otherwise `message.author?.avatarUrl`
- otherwise a matching `currentUser`, `members`, or active-conversation participant entry resolved by author id

The avatar is omitted entirely (the component returns `null`, no placeholder) in two cases: for every message after the first in a group, and for the first message when no `avatarUrl` resolves and no custom `messageAvatar` slot is provided.

{{"demo": "../../basics/messages/ChatMessageAvatarPlayground.js", "bg": "inline", "defaultCodeOpen": false}}

## Timestamps and metadata

Two meta components exist.
`ChatMessageInlineMeta` (default variant) renders the timestamp, delivery status (`sent`/`read` icons), and an "edited" label inside the bubble, anchored to its bottom corner — it is hidden while the message is streaming.
`ChatMessageMeta` (compact variant) renders the same information — plus a streaming progress bar while the message streams — outside the bubble.
Both derive the timestamp from `createdAt` and the edited label from `editedAt`.

The default variant renders inline meta inside the bubble:

{{"demo": "../../basics/messages/ChatMessageInlineMetaPlayground.js", "bg": "inline", "defaultCodeOpen": false}}

The compact variant renders external meta beside the message:

{{"demo": "../../basics/messages/ChatMessageMetaPlayground.js", "bg": "inline", "defaultCodeOpen": false}}

## Component anatomy

Inside `ChatBox`, the message list renders this component tree:

```text
ChatMessageList                     ← scrollable container
  ChatDateDivider                   ← date separator between groups (opt-in)
  ChatMessageGroup                  ← groups consecutive same-author messages
    ChatMessage                     ← individual message row
      ChatMessageAvatar             ← author avatar
      ChatMessageContent            ← message bubble with part renderers
        ChatMessageInlineMeta       ← timestamp/status/edited inside the bubble (default variant; hidden while streaming)
      ChatMessageMeta               ← external meta (compact variant only)
      ChatMessageError              ← error card when message status is "error"
      ChatMessageActions            ← hover action buttons
```

## Compact variant

Set `variant="compact"` on `ChatBox` to switch to a dense, messenger-style layout with no bubbles, left-aligned messages, and group header timestamps.
In the compact layout the inline meta is replaced by the external `ChatMessageMeta` rendered beside the message (use the `messageMeta` slot to customize it; in the default variant use `messageInlineMeta` instead).

{{"demo": "../../material/message-list/CompactVariant.js", "defaultCodeOpen": false, "bg": "inline"}}

See [Variants and density](/x/react-chat/basics/variants-and-density/) for details.

## Density

The `density` prop controls the vertical spacing between messages independently of the variant. Three values are available: `compact`, `standard` (default), and `comfortable`.

{{"demo": "../../material/message-list/DensityProp.js", "defaultCodeOpen": false, "bg": "inline"}}

See [Variants and density](/x/react-chat/basics/variants-and-density/) for details.

## Slots

ChatBox exposes the following slots for the message area (composer and conversation-list slots are covered on their own pages):

| Slot                | Component                                                        | Description                                                                                   |
| :------------------ | :--------------------------------------------------------------- | :-------------------------------------------------------------------------------------------- |
| `messageList`       | [ChatMessageList](/x/api/chat/chat-message-list/)                | Scrollable list container (wrapper-only — default rows render inside)                         |
| `messageGroup`      | [ChatMessageGroup](/x/api/chat/chat-message-group/)              | Per-author group wrapper around consecutive messages                                          |
| `dateDivider`       | [ChatDateDivider](/x/api/chat/chat-date-divider/)                | Date separator between groups (requires `features.dateDivider`)                               |
| `unreadMarker`      | [ChatUnreadMarker](/x/api/chat/chat-unread-marker/)              | "New messages" marker (requires `features.unreadMarker`)                                      |
| `messageRoot`       | `ChatMessage`                                                    | Styled root of the message row (wrapper-only)                                                 |
| `messageAvatar`     | [ChatMessageAvatar](/x/api/chat/chat-message-avatar/)            | Author avatar — pass `null` to hide it and collapse the avatar track                          |
| `messageContent`    | [ChatMessageContent](/x/api/chat/chat-message-content/)          | Message bubble with part renderers                                                            |
| `messageMeta`       | [ChatMessageMeta](/x/api/chat/chat-message-meta/)                | External meta (compact variant): timestamp, delivery status, streaming progress, edited label |
| `messageInlineMeta` | [ChatMessageInlineMeta](/x/api/chat/chat-message-inline-meta/)   | Inline meta inside the bubble (default variant): timestamp, delivery status, edited label     |
| `messageError`      | [ChatMessageError](/x/api/chat/chat-message-error/)              | Error card under the bubble when `message.status` is `error`                                  |
| `messageActions`    | [ChatMessageActions](/x/api/chat/chat-message-actions/)          | Hover actions row                                                                             |
| `messageAuthorName` | [ChatMessageAuthorLabel](/x/api/chat/chat-message-author-label/) | Author name label rendered by the group wrapper                                               |

## See also

- [Message list](/x/react-chat/basics/messages/) for scrolling behavior, auto-scroll configuration, and history loading
- [Message actions](/x/react-chat/display/message-actions/) for details on the hover action menu.
- [Loading and empty states](/x/react-chat/display/loading-and-empty-states/) for details on skeleton and empty state display.
