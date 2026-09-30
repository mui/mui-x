---
title: Chat - Indicators in context
productId: x-chat
packageName: '@mui/x-chat/headless'
githubLabel: 'scope: chat'
---

# Chat - Indicators in context

<p class="description">Compose typing, unread, and scroll-to-bottom indicators inside a realistic thread layout.</p>

Indicators are structural affordances rather than floating utilities, so their placement inside the thread layout is part of their behavior.
The demo below shows where each indicator belongs in a realistic thread:

{{"demo": "IndicatorsInContext.js"}}

## Placement reference

- `Indicators.TypingIndicator` near the thread header or composer
- `Indicators.UnreadMarker` inside the message row pipeline
- `Indicators.ScrollToBottomAffordance` inside a message-list-aware container
- `MessageList.Root` as the source of unseen-message and scroll state

## Implementation notes

- Tie indicators to a real thread so placement rules stay obvious.
- Show unread and typing state at the same time so the reader can see that the indicators solve different problems.
- Keep the surrounding layout realistic so the scroll affordance has a reason to appear.

## When to use this pattern

Use this pattern when:

- The thread needs a visible unread boundary.
- Typing activity should be surfaced inline.
- The scroll position is no longer pinned to the latest message.

This pattern is common in shared support queues, collaborative assistant surfaces, and any thread where users routinely scroll away from the newest message.

## Placement rules

- `TypingIndicator` belongs near thread-level context such as the header or composer area.
- `UnreadMarker` belongs in the row pipeline because it marks a message boundary, not a global thread status.
- `ScrollToBottomAffordance` depends on message-list state, so it is easiest to reason about when it stays inside a message-list-aware container.

## See also

- See [Indicators](/x/react-chat/headless/indicators/) for details.

## API

- [ChatRoot](/x/api/chat/chat-root/)
