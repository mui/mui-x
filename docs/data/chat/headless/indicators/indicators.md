---
productId: x-chat
title: Chat - Headless indicators
packageName: '@mui/x-chat-headless'
components: TypingIndicator, UnreadMarker, ScrollToBottomAffordance
githubLabel: 'scope: chat'
---

# Chat - Headless indicators

<p class="description">Use shared structural affordances for typing, unread boundaries, and scroll-to-bottom behavior.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

{{"demo": "../examples/indicators-in-context/IndicatorsInContext.js", "hideToolbar": true}}

## Primitive set

The indicator group is built from:

- `Indicators.TypingIndicator`
- `Indicators.UnreadMarker`
- `Indicators.ScrollToBottomAffordance`

These primitives are small, but they encode thread-specific semantics that are easy to get wrong when rebuilt from scratch.

## `TypingIndicator`

`TypingIndicator` reads typing state for the active conversation and resolves display names from:

- conversation participants
- message authors already present in the thread
- raw user ids when no richer user data is available

It renders a polite live region and shows labels such as:

- `Alice is typing`
- `Alice, Bob are typing`

### Typical placement

```tsx
import { Indicators, Conversation } from '@mui/x-chat-headless';

<Conversation.Header>
  <Conversation.Title />
  <Conversation.Subtitle />
  <Indicators.TypingIndicator />
</Conversation.Header>;
```

Use it in the thread header or just above the composer when typing feedback should stay close to the active draft area.

## `UnreadMarker`

`UnreadMarker` inserts a structural boundary into the message flow.

The unread boundary is derived from the active conversation state:

- `conversation.unreadCount`
- `conversation.readState`

The component renders only for the row that starts the unread region and applies `role="separator"` so the boundary stays meaningful to assistive technology.

### Typical placement

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

You can replace both the separator root and the label through slots.

## `ScrollToBottomAffordance`

`ScrollToBottomAffordance` consumes message-list context and appears only when the user is away from the bottom of the thread.

It supports:

- scroll-to-bottom action wiring
- unseen-message count badges
- an `aria-label` that includes the unseen count when present

The primitive expects to live inside the `MessageList.Root` context, usually in a custom message-list root slot or another descendant of the list surface.

### Typical placement

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

- `TypingIndicator`: `root`
- `UnreadMarker`: `root`, `label`
- `ScrollToBottomAffordance`: `root`, `badge`

Custom slots receive owner state such as:

- resolved typing users and count
- unread-boundary presence and label
- unseen-message count and `isAtBottom`

That makes it straightforward to map the indicators into an existing design system without rewriting the underlying behavior.

## See also

- Continue with [Message list](/x/react-chat/headless/message-list/) for the list context that powers unread boundaries and scroll affordances.
- Continue with [Thread](/x/react-chat/headless/thread/) for header composition patterns.
- Continue with [Indicators in context](/x/react-chat/headless/examples/indicators-in-context/) for the demo version of these primitives.

## API

- [TypingIndicator](/x/api/chat/typing-indicator/)
- [UnreadMarker](/x/api/chat/unread-marker/)
- [ScrollToBottomAffordance](/x/api/chat/scroll-to-bottom-affordance/)
