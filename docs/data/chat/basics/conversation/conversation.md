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

If you also need conversation switching, history, or read receipts, use `ChatBox` instead.

## Interactive playground

The demo below lets you toggle the header and composer slots and switch between variants and densities:

{{"demo": "ChatConversationPlayground.js", "bg": "inline", "defaultCodeOpen": false}}
