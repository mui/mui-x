---
productId: x-chat
title: Chat - Conversations
packageName: '@mui/x-chat'
components: ChatConversations, ChatConversationSkeleton
---

# Conversations

<p class="description"><code>ChatConversations</code> renders a themed conversation list with avatars, unread badges, timestamps, and selection state.</p>

## Default rendering

`ChatConversations` renders each conversation as a list item with:

- a participant avatar (or generated initials)
- the conversation title and subtitle
- a relative timestamp
- an unread count badge

{{"demo": "ConversationsBasic.js"}}

## Dense mode

Set `dense` to use smaller avatars and tighter spacing for compact layouts.

{{"demo": "ConversationsDense.js"}}

## Loading, empty, and error states

`ChatConversations` renders built-in state surfaces when conversations are loading, empty, or errored.
The states are driven by the adapter lifecycle.

{{"demo": "ConversationsStates.js"}}

## Slot customization

Replace individual conversation item parts through slots:

- `title` — the conversation title element
- `preview` — the subtitle/preview text
- `timestamp` — the relative time display
- `unreadBadge` — the unread count indicator

## Adjacent pages

- See [Unstyled conversation list](/x/react-chat/unstyled/conversation-list/) for the structural primitive model.
- See [Slots](/x/react-chat/material/slots/) for the complete slot reference.
