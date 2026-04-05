---
productId: x-chat
title: Chat - Unstyled message list
packageName: '@mui/x-chat/headless'
components: MessageListRoot
githubLabel: 'scope: chat'
---

# Chat - Unstyled message list

Render ordered thread rows with date boundaries, history loading, scroll anchoring, and unseen-message tracking.

## Primitive set

The message list surface is built from:

- `MessageList.Root`
- `MessageList.DateDivider`

## `MessageList.Root`

`MessageList.Root` is the structural thread log.
By default it sources row ids from `useMessageIds()`, but you can also pass a custom `items` array when the rendered order needs to differ from the store order.

```tsx
<MessageList.Root
  estimatedItemSize={84}
  renderItem={({ id, index }) => (
    <React.Fragment key={id}>
      <Indicators.UnreadMarker index={index} messageId={id} />
      <MessageList.DateDivider index={index} messageId={id} />
      <MessageGroup index={index} messageId={id} />
    </React.Fragment>
  )}
/>
```

It supports:

- row rendering through `renderItem({ id, index })`
- item reordering through the `items` prop
- `onReachTop`
- automatic history loading when the list reaches the top edge
- scroll anchoring when items are prepended
- unseen-message counting while the list is away from the bottom
- `aria-live="polite"` log semantics
- an imperative `scrollToBottom()` handle

Those behaviors make `MessageList.Root` the main place where the unstyled layer turns store-backed thread data into a real scrolling chat log.

## History loading

When the list reaches the top, `MessageList.Root` can both fire `onReachTop` and trigger history loading through the runtime.
Because the list owns the history-loading trigger, top-loading remains coordinated instead of being split across separate helpers.

## Scroll behavior

The list tracks whether the user is at the bottom of the thread and how many unseen messages have arrived since they moved away from the bottom.
That behavior powers `Indicators.ScrollToBottomAffordance`.

It also preserves the viewport when older messages are prepended, which is important for infinite-scroll chat histories.
Without that anchoring, loading more history would make the thread jump unexpectedly.

### Imperative scroll handle

`MessageList.Root` exposes a `scrollToBottom()` handle through `ref`.
Use that when the surrounding app needs an explicit "jump to latest" action outside the list surface itself.

## `MessageList.DateDivider`

`MessageList.DateDivider` inserts a separator when the current message starts a new calendar day compared to the previous message.

It supports:

- default ISO-day formatting
- custom date formatting through `formatDate`
- slot replacement for root and label

```tsx
<MessageList.DateDivider
  index={index}
  messageId={id}
  formatDate={(date) => date.toLocaleDateString()}
/>
```

The divider only renders when a real day boundary exists.

That makes it safe to keep in the row pipeline for every message without extra filtering logic in app code.

## Recommended patterns

- Use `MessageList.Root` as the single source of truth for thread scrolling behavior.
- Render `MessageList.DateDivider` and `Indicators.UnreadMarker` alongside each row in `renderItem`.
- Keep grouping and row composition inside the message-list render path so ordering and affordances stay aligned.

## API

- [MessageListRoot](/x/api/chat/message-list-root/)
- [MessageListDateDivider](/x/api/chat/message-list-date-divider/)
- [ScrollToBottomAffordance](/x/api/chat/scroll-to-bottom-affordance/)

## See also

- Continue with [Messages](/x/react-chat/unstyled/messages/) for the row-level primitives that usually appear inside `renderItem`.
- Continue with [Indicators](/x/react-chat/unstyled/indicators/) for unread and scroll affordances powered by the list.
