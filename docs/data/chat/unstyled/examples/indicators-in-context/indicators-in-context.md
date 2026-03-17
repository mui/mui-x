---
title: Chat - Indicators in context
productId: x-chat
packageName: '@mui/x-chat-unstyled'
---

# Indicators in context

<p class="description">Place typing, unread, and scroll indicators into a real thread layout instead of documenting them in isolation.</p>

This recipe shows that indicators are structural affordances, not floating utilities.
Their value is clearest when they are rendered exactly where the thread layout expects them.

That is why this page keeps them inside a realistic thread rather than presenting them as isolated widgets.

{{"demo": "IndicatorsInContext.js"}}

## What it shows

- `Indicators.TypingIndicator`
- `Indicators.UnreadMarker`
- `Indicators.ScrollToBottomAffordance`
- thread header placement
- message-list row placement

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

Use this recipe when:

- the thread needs a visible unread boundary
- typing activity should be surfaced inline
- the scroll position is no longer always pinned to the latest message

This pattern is common in shared support queues, collaborative assistant surfaces, and any thread where users routinely scroll away from the newest message.

## What to pay attention to

- `TypingIndicator` belongs near thread-level context such as the header or composer area.
- `UnreadMarker` belongs in the row pipeline because it marks a message boundary, not a global thread status.
- `ScrollToBottomAffordance` depends on message-list state, so it is easiest to reason about when it stays inside a message-list-aware container.

## Next steps

- Continue with [Indicators](/x/react-chat/unstyled/indicators/) for the reference page.
- Continue with [Virtualized thread](/x/react-chat/unstyled/examples/virtualized-thread/) when the same thread also needs long-list behavior.
