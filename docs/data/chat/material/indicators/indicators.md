---
productId: x-chat
title: Chat - Indicators and skeletons
packageName: '@mui/x-chat'
components: ChatTypingIndicator, ChatUnreadMarker, ChatScrollToBottomAffordance
---

# Indicators and skeletons

<p class="description">Typed indicators, unread markers, scroll affordances, and skeleton placeholders provide real-time feedback while the chat loads and updates.</p>

## Typing indicator

`ChatTypingIndicator` shows an animated dots indicator when the assistant is composing a response.
It is automatically displayed inside `ChatThread` during streaming.

## Unread marker

`ChatUnreadMarker` inserts a colored separator between read and unread messages.

## Scroll-to-bottom affordance

`ChatScrollToBottomAffordance` is a floating action button that appears when the user scrolls away from the bottom of the thread.
It shows a badge with the count of unseen messages.

{{"demo": "IndicatorsDemo.js"}}

## Message skeleton

`ChatMessageSkeleton` renders a placeholder message bubble while messages are loading.
Customize the alignment and number of text lines.

## Conversation skeleton

`ChatConversationSkeleton` renders a placeholder conversation list item.
Use `dense` for compact layouts.

{{"demo": "SkeletonStates.js"}}

## Adjacent pages

- See [Unstyled indicators](/x/react-chat/unstyled/indicators/) for the structural primitive model.
