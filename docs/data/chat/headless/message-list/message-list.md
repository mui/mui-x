---
productId: x-chat
title: Chat - Headless message list
packageName: '@mui/x-chat/headless'
components: MessageListRoot
githubLabel: 'scope: chat'
---

# Chat - Headless message list

<p class="description">Render an ordered chat thread with history loading, scroll anchoring, and unseen-message tracking.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

## Primitives

The message list surface includes the following primitives:

- `MessageList.Root`
- `MessageList.DateDivider`

## Rendering the thread log

`MessageList.Root` is the structural thread log.
By default it sources row ids from `useMessageIds()`.
Pass a custom `items` array when the rendered order needs to differ from the store order.

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
- `onReachBottom`
- automatic history loading when the list reaches the top edge
- scroll anchoring when items are prepended
- unseen-message counting while the list is away from the bottom
- `aria-live="polite"` log semantics
- an imperative `scrollToBottom()` handle

## History loading

When the list reaches the top, `MessageList.Root` can both fire `onReachTop` and trigger history loading through the runtime.
Keeping the trigger on the list coordinates top-loading in one place.

## Scroll behavior

The list tracks whether the user is at the bottom of the thread and how many unseen messages have arrived since they moved away from the bottom.
That behavior powers `Indicators.ScrollToBottomAffordance`.

It also preserves the viewport when older messages are prepended, which keeps infinite-scroll histories from jumping as the user reads.

The list fires `onReachBottom` once each time the viewport enters the bottom zone—within the auto-scroll `buffer` (150 px by default; `estimatedItemSize` when `autoScroll` is disabled).
Programmatic scrolls (`scrollToBottom()`, the scroll-to-bottom affordance) and the forced scroll after the user sends a message count as entries.
It does not refire while the list stays pinned to the bottom during streaming, and switching conversations never fires it by itself.
The canonical use case is marking messages as read once the user scrolls to the latest message—see [read receipts](/x/react-chat/multi-conversation/read-receipts/).

### Imperative scroll handle

`MessageList.Root` exposes a `scrollToBottom()` handle through `ref`.
Use it for an explicit "jump to latest" action outside the list.

## Inserting day boundaries

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

The divider only renders when a day boundary exists, so it's safe to keep in the row pipeline for every message.

## Recommended patterns

- Use `MessageList.Root` as the single source of truth for thread scrolling behavior.
- Render `MessageList.DateDivider` and `Indicators.UnreadMarker` alongside each row in `renderItem`.
- Keep grouping and row composition inside the message-list render path so ordering and affordances stay aligned.

## See also

- [Messages](/x/react-chat/headless/messages/) for the row-level primitives that appear inside `renderItem`.
- [Indicators](/x/react-chat/headless/indicators/) for unread and scroll affordances powered by the list.

## API

- [MessageListRoot](/x/api/chat/message-list-root/)
- [MessageListDateDivider](/x/api/chat/message-list-date-divider/)
- [ScrollToBottomAffordance](/x/api/chat/scroll-to-bottom-affordance/)
