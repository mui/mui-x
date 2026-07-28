---
productId: x-chat
title: Unread marker
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatUnreadMarker
---

# Chat - Unread marker

<p class="description">Highlight messages that arrived while users were away with an inline divider in the chat thread.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

## Overview

The unread marker appears inline in the message list when the active conversation has unread messages.
The marker is positioned at the first unread message and is removed once the conversation's `unreadCount` reaches 0 (the user has caught up).
It is an opt-in feature: nothing renders until you enable it, and you can also embed the component directly in custom layouts.
For date-based thread separators, see the [Date divider](/x/react-chat/display/date-divider/) page.

## Enabling the unread marker

Pass `features={{ unreadMarker: true }}` to `ChatBox` (or to a standalone `ChatMessageList`) to render the marker at the unread boundary:

```tsx
<ChatBox adapter={adapter} features={{ unreadMarker: true }} />
```

Once enabled, customize the rendered component with the `unreadMarker` slot, or forward props through `slotProps.unreadMarker`.
The label text is localizable through the `unreadMarkerLabel` locale key.

:::info
Marker slot customizations only take effect while the feature is enabled. Without `features.unreadMarker`, `slots.unreadMarker` and `slotProps.unreadMarker` have no effect.
:::

## How the marker is positioned

The marker's position is derived from the active conversation's read state, not from message flags:

- When `conversation.unreadCount` is greater than 0, the marker renders above the first unread message — at index `messages.length - unreadCount` (clamped to the first message when `unreadCount` exceeds the message count).
- When `unreadCount` is not set (or is 0) and `conversation.readState` is `'unread'`, the marker renders above the first message.
- Otherwise (the user has caught up), nothing renders — even with `features.unreadMarker` enabled.

See the [Read receipts](/x/react-chat/multi-conversation/read-receipts/) page for how `unreadCount` and `readState` are set and updated.

## Standalone usage

`ChatUnreadMarker` can be embedded directly in a custom message layout.
Render it once per message and pass the required `messageId` prop — the component identifies the message it is anchored above, and renders only when that message sits at the unread boundary (it returns `null` everywhere else).

:::warning
When you pass a custom `renderItem` to `ChatMessageList`, the `features` prop is ignored — including `features.unreadMarker`. Embed `ChatUnreadMarker` inside your `renderItem` as shown below to keep the marker.
:::

{{"demo": "UnreadMarkerStandalone.js", "bg": "inline"}}

## Accessibility

The marker root renders with `role="separator"`, so assistive technology announces it as a thread divider rather than message content.
The visible label (default "New messages") is the announced text — override it through the `label` prop or the `unreadMarkerLabel` locale key to localize the announcement.
The rendered root carries a `data-has-boundary="true"` attribute.

For the full keyboard navigation and screen-reader model of the message list, see the [Message list accessibility](/x/react-chat/material/message-list/#accessibility) section.

## Interactive playground

The demo below shows the unread marker rendering above the first unread message:

{{"demo": "ChatUnreadMarkerPlayground.js", "bg": "inline", "defaultCodeOpen": false}}
