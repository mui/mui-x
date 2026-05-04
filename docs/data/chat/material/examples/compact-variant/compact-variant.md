---
title: Chat - Compact variant
productId: x-chat
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
---

# Chat - Compact variant

<p class="description">A messenger-style layout with no bubbles, left-aligned messages, and author names as group headers.</p>

Set `variant="compact"` on `ChatBox` to switch the entire chat to a compact layout.
When `features={{ conversationList: true }}` is enabled, both the conversation list and the message list adapt automatically.

{{"demo": "CompactVariant.js", "bg": "inline"}}

## What changes in compact mode

| Default                                  | Compact                                         |
| :--------------------------------------- | :---------------------------------------------- |
| Colored message bubbles                  | Plain text, no background                       |
| User messages right-aligned              | All messages left-aligned                       |
| Timestamp below each message             | Timestamp in the group header, next to author   |
| Conversation list shows avatar + preview | Conversation list shows compact title + actions |
