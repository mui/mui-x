---
productId: x-chat
title: Conversation
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatConversation
---

# Chat - Conversation

<p class="description">Pair a message list and composer into a single scrollable conversation surface.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

## Overview

`ChatConversation` is the mid-level layout primitive that pairs a `ChatMessageList` with a `ChatComposer` inside a single scrollable surface.
Use it when you want full control of the conversation layout without wiring the scroll and composer interplay manually.

If you also need conversation switching, history, or read receipts, use [`ChatBox`](/x/react-chat/basics/chatbox/) instead.

`ChatConversation` must be rendered inside a `ChatProvider`: the title, subtitle, and message list all read the active conversation from the Chat state.
Appearance is controlled by the surrounding variant and density providers — see [Variants and density](/x/react-chat/basics/variants-and-density/) and [State and store](/x/react-chat/core/state/).

## Anatomy

`ChatConversation` is a compound component: you compose its children explicitly.
A fully assembled conversation looks like this:

```tsx
<ChatConversation>
  <ChatConversationHeader>
    <ChatConversationHeaderInfo>
      <ChatConversationTitle />
      <ChatConversationSubtitle />
    </ChatConversationHeaderInfo>
    <ChatConversationHeaderActions>{/* header buttons */}</ChatConversationHeaderActions>
  </ChatConversationHeader>
  <ChatMessageList renderItem={...} />
  <ChatComposer />
</ChatConversation>
```

- `ChatConversationHeader` — the bar pinned at the top of the surface; the message list scrolls beneath it.
- `ChatConversationHeaderInfo` — groups the title and subtitle on the left side of the header.
- `ChatConversationTitle` / `ChatConversationSubtitle` — render the active conversation's title and subtitle from the Chat state; no props needed.
- `ChatConversationHeaderActions` — hosts action buttons on the right side of the header.
- `ChatMessageList` and `ChatComposer` fill the remaining space: the list scrolls, the composer stays pinned to the bottom.

All parts are optional — omit the header for a bare thread, or the composer for a read-only view.
`ChatConversation` is also the "thread" pane of [Layout](/x/react-chat/basics/layout/): when rendered inside `ChatLayout`, it is recognized automatically and placed in the thread region.
See [Conversation header](/x/react-chat/multi-conversation/conversation-header/) for header customization in depth.

`ChatConversation` has no behavior props of its own — beyond standard styling and slot props (`className`, `sx`, `classes`, `slots`, `slotProps`), you configure it entirely through composition and the surrounding Chat providers.

## Basic usage

The demo below wires `ChatConversation` to a `ChatProvider` with a demo adapter.
The title and subtitle come from the active conversation; send a message to see the list scroll and the echo reply arrive.

{{"component": "file://./demos/conversation-basic-standalone/index.ts", "bg": "inline", "initialExpanded": true}}

## Interactive playground

The demo below lets you toggle whether the header and composer are rendered, and switch the surrounding variant and density:

{{"component": "file://./demos/chat-conversation-playground/index.ts", "bg": "inline", "collapseToEmpty": true}}

:::info
The conversation surface is the chat's main scroll region: the message list manages roving focus and `Page Up`/`Page Down` scrolling, and the composer is reachable with `Tab`.
See [Message list — Accessibility](/x/react-chat/material/message-list/#accessibility) for the complete keyboard and screen reader model.
:::
