---
title: Chat - Indicators in Context
productId: x-chat
packageName: '@mui/x-chat/headless'
githubLabel: 'scope: chat'
---

# Chat - Indicators in Context

<p class="description">Place typing, unread, and scroll indicators into a real thread layout instead of documenting them in isolation.</p>

This demo shows that indicators are structural affordances, not floating utilities.
Their value is clearest when they are rendered exactly where the thread layout expects them.

That is why this page keeps them inside a realistic thread rather than presenting them as isolated widgets.

- `Indicators.TypingIndicator`
- `Indicators.UnreadMarker`
- `Indicators.ScrollToBottomAffordance`
- thread header placement
- message-list row placement

{{"demo": "IndicatorsInContext.js"}}

## Key primitives

- `Indicators.TypingIndicator` near the thread header or composer
- `Indicators.UnreadMarker` inside the message row pipeline
- `Indicators.ScrollToBottomAffordance` inside a message-list-aware container
- `MessageList.Root` as the source of unseen-message and scroll state

## Implementation notes

- Keep the example tied to a real thread so the placement rules are obvious.
- Show unread and typing state at the same time so the reader can see that the indicators solve different problems.
- Keep the layout realistic enough to justify the scroll affordance rather than presenting it as an isolated button.

## When to use this pattern

Use this pattern when:

- the thread needs a visible unread boundary
- typing activity should be surfaced inline
- the scroll position is no longer always pinned to the latest message

This pattern is common in shared support queues, collaborative assistant surfaces, and any thread where users routinely scroll away from the newest message.

## What to pay attention to

- `TypingIndicator` belongs near thread-level context such as the header or composer area.
- `UnreadMarker` belongs in the row pipeline because it marks a message boundary, not a global thread status.
- `ScrollToBottomAffordance` depends on message-list state, so it is easiest to reason about when it stays inside a message-list-aware container.

## See also

- Continue with [Indicators](/x/react-chat/headless/indicators/) for the reference page.

## API

- [ChatRoot](/x/api/chat/chat-root/)
