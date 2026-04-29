---
productId: x-chat
title: Chat - Headless Messages
packageName: '@mui/x-chat/headless'
components: MessageRoot, MessageAvatar, MessageAuthorLabel, MessageContent, MessageMeta, MessageActions, MessageGroup, MessageListDateDivider
githubLabel: 'scope: chat'
---

# Chat - Headless Messages

<p class="description">Compose thread rows from message grouping primitives, message subparts, and default message-part renderers.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

{{"demo": "../examples/grouped-message-timeline/GroupedMessageTimeline.js", "hideToolbar": true}}

## Primitive set

The message surface is built from:

- `MessageGroup`
- `Message.Root`
- `Message.Avatar`
- `Message.Content`
- `Message.Meta`
- `Message.Actions`

## Grouping messages by author

`MessageGroup` is the default row-level composition helper for threaded chats.
It derives the previous and next message, then decides whether the current message starts or ends a visual group.

```tsx
<MessageGroup groupingWindowMs={300_000} index={index} messageId={id} />
```

Grouping is based on:

- author identity
- author role fallback when no explicit author id exists
- an adjustable grouping window in milliseconds

This gives you `isFirst` and `isLast` grouping state without manual row bookkeeping.

That is especially useful when the thread mixes authored messages, assistant responses, and sparse metadata.
The grouping rules stay close to the row composition instead of leaking into application code.

## Setting up the message root

`Message.Root` resolves a message by id and exposes owner state such as:

- `role`
- `status`
- `streaming`
- `error`
- `isGrouped`

That owner state powers slot-based styling for user versus assistant messages, streaming states, and grouped rows.

`Message.Root` is the main bridge between state-driven message identity and the leaf subparts that render avatars, message bodies, metadata, and actions.

## Default row stack

The most common message composition inside a group is:

- `Message.Avatar`
- `Message.Content`
- `Message.Meta`
- optional `Message.Actions`

`MessageGroup` can render this default stack for you, or you can provide custom children for a different row layout.

```tsx
<MessageGroup index={index} messageId={id}>
  <Message.Root messageId={id}>
    <Message.Avatar />
    <Message.Content />
    <Message.Meta />
    <Message.Actions />
  </Message.Root>
</MessageGroup>
```

This pattern keeps grouping logic and row layout close together while still allowing subpart-level slot replacement.

## Default message-part renderers

The headless package also exports helpers for common message parts:

- `getDefaultMessagePartRenderer()`
- `renderDefaultTextPart()`
- `renderDefaultReasoningPart()`
- `renderDefaultToolPart()`
- `renderDefaultDynamicToolPart()`
- `renderDefaultFilePart()`
- `renderDefaultSourceUrlPart()`
- `renderDefaultSourceDocumentPart()`
- `renderDefaultStepStartPart()`
- `renderDefaultDataPart()`

Use these helpers when you want to keep the default rendering for most part types and selectively replace only one or two.

```tsx
function renderPart(part: ChatMessagePart, message: ChatMessage, index: number) {
  if (part.type === 'reasoning') {
    return <CustomReasoningPanel part={part} />;
  }

  const renderer = getDefaultMessagePartRenderer(part);

  return renderer ? renderer({ part, message, index }) : null;
}
```

The helpers cover text, reasoning, tool parts, files, sources, step boundaries, and `data-*` parts.
That makes them a good fit for progressive customization instead of full renderer rewrites.

## When to replace message rendering

Use the default helpers when:

- the structural message model is correct
- only certain part types need a custom presentation

Rebuild more of the message surface when:

- the row layout is completely different
- message actions need a different placement model
- grouped and ungrouped messages need distinct markup

## See also

- Continue with [Message list](/x/react-chat/headless/message-list/) for ordering, date boundaries, and thread scrolling behavior.
- Continue with [Customization](/x/react-chat/headless/customization/) for slot replacement patterns on message rows and subparts.
- Continue with [Custom message part rendering](/x/react-chat/headless/examples/custom-message-part-rendering/) for the demo version of selective renderer replacement.

## API

- [MessageRoot](/x/api/chat/message-root/)
- [MessageGroup](/x/api/chat/message-group/)
- [MessageContent](/x/api/chat/message-content/)
- [MessageAvatar](/x/api/chat/message-avatar/)
- [MessageMeta](/x/api/chat/message-meta/)
- [MessageAuthorLabel](/x/api/chat/message-author-label/)
- [MessageActions](/x/api/chat/message-actions/)
- [MessageListDateDivider](/x/api/chat/message-list-date-divider/)
