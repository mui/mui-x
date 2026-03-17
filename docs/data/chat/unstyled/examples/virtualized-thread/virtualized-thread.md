---
title: Chat - Virtualized thread
productId: x-chat
packageName: '@mui/x-chat-unstyled'
---

# Virtualized thread

<p class="description">Render a long thread with virtualization, date dividers, and top-edge history loading.</p>

This recipe focuses on the thread log as a performance and scrolling surface rather than a static list of messages.

It is the recipe to reach for when thread behavior starts to matter as much as thread presentation.

{{"demo": "VirtualizedThread.js"}}

## What it shows

- `MessageList.Root` with `virtualization`
- custom `renderItem`
- `MessageList.DateDivider`
- `onReachTop`
- runtime-driven history loading
- `scrollToBottom()` and unseen-message behavior

## Key primitives

- `MessageList.Root` as the log container and virtualization boundary
- `MessageList.DateDivider` for calendar-day boundaries
- `Indicators.ScrollToBottomAffordance` as the companion affordance for unseen messages
- `MessageGroup` or custom row composition inside `renderItem`

## Implementation notes

- Teach the difference between the default `useMessageIds()` order and a custom `items` array only if the example truly needs reordering.
- Keep the example focused on list behavior: history loading, row rendering, and scroll state.
- Use a realistic enough thread shape that date dividers and top-loading behavior are visible.

## When to use this pattern

Use this recipe when:

- threads can grow large
- history is loaded incrementally
- the UI needs a visible "jump to latest" affordance

This is common in support threads, long-running AI chats, audit-style timelines, and any product where the most recent message is important but older context must remain easy to recover.

## Next steps

- Continue with [Message list](/x/react-chat/unstyled/message-list/) for the reference-level API and behavior notes.
- Continue with [Indicators in context](/x/react-chat/unstyled/examples/indicators-in-context/) when the thread also needs typing and unread affordances.

## What to pay attention to

- `MessageList.Root` is not just a visual container. It owns virtualization, top-edge loading, scroll anchoring, and unseen-message state.
- `MessageList.DateDivider` and `Indicators.ScrollToBottomAffordance` become much easier to reason about when they stay inside the message-list composition model.
