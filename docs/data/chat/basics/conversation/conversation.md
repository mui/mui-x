---
productId: x-chat
title: Conversation
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatConversation
---

# Chat - Conversation

<p class="description">The conversation surface stitches together the messages list and composer for a single thread.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

## Overview

`ChatConversation` is the mid-level layout primitive that pairs a `ChatMessageList` with a `ChatComposer` inside a single scrollable surface. Use it when you want full control over the conversation chrome but don't want to wire the scroll/composer interplay yourself.

If you also need conversation switching, history, or read receipts, reach for `ChatBox` instead.

## Interactive playground

Toggle the header and composer slots and switch variant/density:

{{"demo": "ChatConversationPlayground.js", "bg": "inline", "defaultCodeOpen": false}}
