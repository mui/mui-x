---
title: Chat - Compact variant
productId: x-chat
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
---

# Chat - Compact variant

<p class="description">Switch the Chat to a messenger-style layout with left-aligned messages, no bubbles, and author names as group headers.</p>

Set `variant="compact"` on `<ChatBox />` to switch the Chat to a compact layout.
When `features={{ conversationList: true }}` is enabled, both the conversation list and the message list adapt automatically.

{{"demo": "CompactVariant.js", "bg": "inline"}}

## Compact mode behavior

| Default                                    | Compact                                           |
| :----------------------------------------- | :------------------------------------------------ |
| Colored message bubbles                    | Plain text, no background                         |
| User messages right-aligned                | All messages left-aligned                         |
| Timestamp below each message               | Timestamp in the group header, next to author     |
| Conversation list shows avatar and preview | Conversation list shows compact title and actions |
