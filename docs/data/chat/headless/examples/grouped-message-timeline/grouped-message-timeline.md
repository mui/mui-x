---
title: Chat - Grouped message timeline
productId: x-chat
packageName: '@mui/x-chat/headless'
githubLabel: 'scope: chat'
---

# Chat - Grouped message timeline

<p class="description">Group consecutive messages from the same author into a compact timeline with custom row presentation.</p>

Use this pattern to render a thread that visually groups messages by author and time window without manual grouping logic in the page layer.

This pattern fits support timelines, collaboration surfaces, and assistant threads where readability and density outweigh per-message isolation.

This example exercises `MessageGroup`, `groupingWindowMs`, the `Message.Avatar`/`Message.Content`/`Message.Meta` primitives, and grouped-versus-ungrouped owner state.

The demo below shows an author-grouped timeline that collapses repeated avatars and metadata within a short time window:

{{"demo": "GroupedMessageTimeline.js"}}

## Key primitives

- `MessageGroup` for first/last grouping decisions.
- `Message.Root` for message-level owner state.
- `Message.Avatar`, `Message.Content`, and `Message.Meta` for the default row stack.
- `Message.Actions` (optional) when a timeline needs inline actions.

## Implementation notes

- Vary timestamps so the grouping window is observable, not just theoretical.
- Include at least one break in author identity and one in time-window grouping.
- Keep the composition focused on message rows, not conversation selection or thread layout.

## When to use this pattern

Use this pattern when:

- A chat surface needs compact message grouping.
- Avatar repetition should be reduced.
- Grouped and ungrouped rows need different styling or spacing.

This is especially useful in support timelines, collaboration surfaces, and assistant threads where one participant often sends several messages in a row.

## Design notes

- `MessageGroup` keeps neighbor comparison logic out of the page layer.
- `groupingWindowMs` is a presentation decision, so it belongs near the message row composition rather than in the data model.

## See also

- See [Messages](/x/react-chat/headless/messages/) for details.
- See [Custom message part rendering](/x/react-chat/headless/examples/custom-message-part-rendering/) for details.

## API

- [ChatRoot](/x/api/chat/chat-root/)
