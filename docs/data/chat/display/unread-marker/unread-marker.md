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
The marker is positioned at the first unread message and disappears once users catch up.
It is an opt-in feature: nothing renders until you enable it, and you can also embed the component directly in custom layouts.

## Enabling the unread marker

Pass `features={{ unreadMarker: true }}` to `ChatBox` (or to a standalone `ChatMessageList`) to render the marker at the unread boundary:

```tsx
<ChatBox adapter={adapter} features={{ unreadMarker: true }} />
```

Once enabled, customize the rendered component with the `unreadMarker` slot, or forward props through `slotProps.unreadMarker`.
The label text is localizable through the `unreadMarkerLabel` locale key.

:::info
Marker slot customizations only take effect while the feature is enabled—`slots.unreadMarker` and `slotProps.unreadMarker` have no effect without `features.unreadMarker`.
:::

## Interactive playground

The demo below shows the unread marker rendering above the first unread message:

{{"demo": "ChatUnreadMarkerPlayground.js", "bg": "inline", "defaultCodeOpen": false}}
