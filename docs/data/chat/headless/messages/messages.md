---
productId: x-chat
title: Chat - Headless messages
packageName: '@mui/x-chat/headless'
components: MessageRoot, MessageAvatar, MessageAuthorLabel, MessageContent, MessageMeta, MessageActions, MessageError, MessageGroup, MessageListDateDivider
githubLabel: 'scope: chat'
---

# Chat - Headless messages

<p class="description">Compose chat message rows from grouping helpers, message subcomponents, and default part renderers.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

The demo below shows a grouped message timeline composed from `MessageGroup`, `Message.Root`, and the default subparts:

{{"demo": "../examples/grouped-message-timeline/GroupedMessageTimeline.js", "hideToolbar": true}}

## Message surface primitives

The message surface is built from:

- `MessageGroup`
- `Message.Root`
- `Message.Avatar`
- `Message.Content`
- `Message.Meta`
- `Message.Actions`

## Grouping consecutive messages

`MessageGroup` is the default row-level composition helper for threaded chats.
It derives the previous and next message, then decides whether the current message starts or ends a visual group:

```tsx
<MessageGroup groupingWindowMs={300_000} index={index} messageId={id} />
```

Grouping is based on:

- Author identity.
- Author role fallback when no explicit author id exists.
- An adjustable grouping window in milliseconds.

`MessageGroup` exposes `isFirst` and `isLast` grouping state without manual row bookkeeping.

Grouping stays close to the row composition instead of leaking into application code, which is especially helpful when a thread mixes authored messages, assistant responses, and sparse metadata.

## Resolving messages by id

`Message.Root` resolves a message by id and exposes owner state such as:

- `role`
- `status`
- `streaming`
- `error`
- `isGrouped`

That owner state powers slot-based styling for user versus assistant messages, streaming states, and grouped rows.

`Message.Root` is the main bridge between state-driven message identity and the leaf subcomponents that render avatars, message bodies, metadata, and actions.

## Default row stack

The most common message composition inside a group is:

- `Message.Avatar`
- `Message.Content`
- `Message.Meta`
- `Message.Actions` (optional).

`MessageGroup` can render this default stack for you, or you can provide custom children for a different row layout:

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

Use these helpers to keep the default rendering for most part types and selectively replace only one or two:

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
This makes them a good fit for progressive customization instead of full renderer rewrites.

## When to replace message rendering

Use the default helpers when:

- The structural message model is correct.
- Only certain part types need a custom presentation.

Rebuild more of the message surface when:

- The row layout is completely different.
- Message actions need a different placement model.
- Grouped and ungrouped messages need distinct markup.

## See also

- See [Message list](/x/react-chat/headless/message-list/) for details.
- See [Customization](/x/react-chat/headless/customization/) for details.
- See [Custom message part rendering](/x/react-chat/headless/examples/custom-message-part-rendering/) for details.

## API

- [`MessageRoot`](/x/api/chat/message-root/)
- [`MessageGroup`](/x/api/chat/message-group/)
- [`MessageContent`](/x/api/chat/message-content/)
- [`MessageAvatar`](/x/api/chat/message-avatar/)
- [`MessageMeta`](/x/api/chat/message-meta/)
- [`MessageAuthorLabel`](/x/api/chat/message-author-label/)
- [`MessageActions`](/x/api/chat/message-actions/)
- [`MessageListDateDivider`](/x/api/chat/message-list-date-divider/)
