---
title: Chat - Grouped message timeline
productId: x-chat
packageName: '@mui/x-chat-unstyled'
---

# Grouped message timeline

<p class="description">Use <code>MessageGroup</code> to build an author-grouped message timeline with custom row presentation.</p>

This recipe focuses on message presentation rather than the overall application shell.
It shows how to render a thread that visually groups messages by author and time window without manual grouping logic in the page layer.

That makes it a good fit for products where readability and density matter more than showing every message as an isolated card.

{{"demo": "GroupedMessageTimeline.js"}}

## What it shows

- `MessageGroup`
- `groupingWindowMs`
- `Message.Avatar`
- `Message.Content`
- `Message.Meta`
- grouped versus ungrouped owner state

## Key primitives

- `MessageGroup` for first/last grouping decisions
- `Message.Root` for message-level owner state
- `Message.Avatar`, `Message.Content`, and `Message.Meta` for the default row stack
- optional `Message.Actions` when a timeline needs inline actions

## Implementation notes

- Use different timestamps so the grouping window is visible and not just theoretical.
- Show at least one break in author identity and one break in time-window grouping.
- Keep the example centered on message rows, not on conversation selection or thread layout.

## When to use this pattern

Use this recipe when:

- a chat surface needs compact message grouping
- avatar repetition should be reduced
- grouped and ungrouped rows need different styling or spacing

This is especially useful in support timelines, collaboration surfaces, and assistant threads where one participant often sends several messages in a row.

## What to pay attention to

- `MessageGroup` keeps neighbor comparison logic out of the page layer.
- `groupingWindowMs` is a presentation decision, so it belongs near the message row composition rather than in the data model.

## Next steps

- Continue with [Messages](/x/react-chat/unstyled/messages/) for the message primitive reference.
- Continue with [Custom message part rendering](/x/react-chat/unstyled/examples/custom-message-part-rendering/) when the row structure is correct but certain part types need a custom presentation.
