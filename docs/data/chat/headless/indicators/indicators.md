---
productId: x-chat
title: Chat - Headless indicators
packageName: '@mui/x-chat/headless'
components: StreamingIndicator, TypingIndicator, UnreadMarker, ScrollToBottomAffordance
githubLabel: 'scope: chat'
---

# Chat - Headless indicators

<p class="description">Display streaming activity, typing presence, unread boundaries, and scroll-to-bottom affordances inside the message thread.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

The demo below combines all three indicator primitives inside a chat thread:

{{"demo": "../examples/indicators-in-context/IndicatorsInContext.js", "hideToolbar": true}}

## Indicator primitives

The indicator group is built from:

- `Indicators.StreamingIndicator`.
- `Indicators.TypingIndicator`.
- `Indicators.UnreadMarker`.
- `Indicators.ScrollToBottomAffordance`.

These primitives encode thread-specific behaviors — response generation, typing presence, unread state, and scroll position — that are easy to mishandle when rebuilt from scratch.

## Showing response generation

`StreamingIndicator` renders while an assistant response is in flight.
It covers two placements:

- **Trailing row** — rendered after the last message row, it shows during the waiting phase (the request was sent but no assistant message exists yet). Pass `index`/`items` so it self-suppresses on every row except the last one.
- **Inside a message** — rendered inside an assistant message (it reads the surrounding `MessageContext`, or an explicit `message` prop), it shows while that message has `status: 'streaming'`.

The `mode` prop mirrors the Material `features.streamingIndicator` flag: `'auto'` (default) renders only in assistant-backed conversations, `true` always renders while a response is in flight, and `false` never renders.
Reuse the gating in custom components with the `useStreamingIndicatorVisibility(mode)` hook.

### Placing the indicator

```tsx
<MessageList.Root
  renderItem={({ id, index }) => (
    <React.Fragment>
      <MessageGroup index={index} messageId={id} />
      <Indicators.StreamingIndicator index={index} items={items} />
    </React.Fragment>
  )}
/>
```

The root renders three bare `<span>` elements (the dots) for your CSS to animate, and is `aria-hidden` — the message list's status region already announces streaming transitions.

## Showing typing activity

`TypingIndicator` reads typing state for the active conversation and resolves display names from:

- Conversation participants.
- Message authors already present in the thread.
- Raw user ids when no richer user data is available.

It renders a polite live region and shows labels such as:

- `Alice is typing`.
- `Alice, Bob are typing`.

### Placing the indicator

```tsx
import { Indicators, Conversation } from '@mui/x-chat/headless';

<Conversation.Header>
  <Conversation.Title />
  <Conversation.Subtitle />
  <Indicators.TypingIndicator />
</Conversation.Header>;
```

Use it in the thread header or just above the composer when typing feedback should stay close to the active draft area.

## Marking the unread boundary

`UnreadMarker` inserts a structural boundary into the message flow.

The unread boundary is derived from the active conversation state:

- `conversation.unreadCount`.
- `conversation.readState`.

The component renders only for the row that starts the unread region and applies `role="separator"` so the boundary stays meaningful to assistive technology.

### Placing the marker

```tsx
<MessageList.Root
  renderItem={({ id, index }) => (
    <React.Fragment>
      <Indicators.UnreadMarker index={index} messageId={id} />
      <MessageGroup index={index} messageId={id} />
    </React.Fragment>
  )}
/>
```

Replace the separator root and the label through slots.

## Surfacing a scroll-to-bottom action

`ScrollToBottomAffordance` consumes message-list context and appears only when the user is away from the bottom of the thread.

It supports:

- Scroll-to-bottom action wiring.
- Unseen-message count badges.
- An `aria-label` that includes the unseen count when present.

Render `ScrollToBottomAffordance` inside a `MessageList.Root` context — typically in a custom message-list root slot or another descendant of the list surface.

### Placing the affordance

```tsx
function MessageListShell(props) {
  return (
    <div {...props}>
      {props.children}
      <Indicators.ScrollToBottomAffordance />
    </div>
  );
}
```

When the user is already at the bottom of the thread, the affordance returns `null`.

## Slots and owner state

The indicator primitives expose the following slot surfaces:

- `StreamingIndicator`: `root`.
- `TypingIndicator`: `root`.
- `UnreadMarker`: `root`, `label`.
- `ScrollToBottomAffordance`: `root`, `badge`.

Custom slots receive owner state such as:

- The streaming phase (`'waiting'` or `'streaming'`).
- Resolved typing users and count.
- Unread-boundary presence and label.
- Unseen-message count and `isAtBottom`.

Owner state makes it possible to map the indicators into an existing design system without rewriting the underlying behavior.

## See also

- See [Message list](/x/react-chat/headless/message-list/) for the list context that powers unread boundaries and scroll affordances.
- See [Thread](/x/react-chat/headless/thread/) for header composition patterns.
- See [Indicators in context](/x/react-chat/headless/examples/indicators-in-context/) for the runnable demo of these primitives.

## API

- [StreamingIndicator](/x/api/chat/streaming-indicator/)
- [TypingIndicator](/x/api/chat/typing-indicator/)
- [UnreadMarker](/x/api/chat/unread-marker/)
- [ScrollToBottomAffordance](/x/api/chat/scroll-to-bottom-affordance/)
