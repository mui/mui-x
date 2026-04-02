---
productId: x-chat
title: Typing Indicators
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatTypingIndicator
---

# Chat - Typing Indicators

<p class="description">Display real-time typing feedback so users know when other participants are composing a message.</p>

{{"component": "@mui/docs/ComponentLinkHeader"}}

Typing indicators show labels like "Alice is typing" or "Alice, Bob are typing" in the chat UI.
The feature connects the adapter's `setTyping()` method (outbound) with realtime `typing` events (inbound) to provide a complete typing awareness loop.

## How typing indicators work

Typing indicators involve two directions of communication:

1. **Outbound** -- When the local user types in the composer, the runtime calls the adapter's `setTyping()` method to notify your backend.
2. **Inbound** -- When other users type, your backend pushes `typing` events through the adapter's `subscribe()` method, and the runtime updates the store.

### Sending typing state

Implement `setTyping()` on your adapter to send typing indicators to your backend.
The runtime calls it when the composer value changes from empty to non-empty (and vice versa):

```tsx
async setTyping({ conversationId, isTyping }) {
  await fetch('/api/typing', {
    method: 'POST',
    body: JSON.stringify({ conversationId, isTyping }),
  });
},
```

### Receiving typing state

To receive typing indicators from other users, implement `subscribe()` and emit `typing` events through the `onEvent` callback:

```tsx
subscribe({ onEvent }) {
  const ws = new WebSocket('/api/ws');
  ws.onmessage = (e) => {
    const event = JSON.parse(e.data);
    // event: { type: 'typing', conversationId, userId, isTyping }
    onEvent(event);
  };
  return () => ws.close();
},
```

The runtime tracks typing state per conversation in the store: `typingByConversation[conversationId][userId]`.

## The `TypingIndicator` component

The `TypingIndicator` primitive reads typing state for the active conversation and resolves display names from:

- Conversation participants
- Message authors already present in the thread
- Raw user IDs when no richer user data is available

It renders a polite live region (`aria-live="polite"`) and shows labels such as:

- "Alice is typing"
- "Alice, Bob are typing"

### Typical placement

Place the indicator in the thread header or just above the composer:

```tsx
import { Indicators } from '@mui/x-chat/unstyled';

<Indicators.TypingIndicator />;
```

When no users are typing, the component renders nothing.

## Typing timeout behavior

Typing indicators include built-in timeout handling.
When a `typing` event with `isTyping: true` is received, the runtime expects a follow-up event with `isTyping: false` within a timeout window.
If no follow-up arrives, the typing state is automatically cleared to prevent stale "is typing" indicators.

This means your backend only needs to send `isTyping: true` events reliably -- the frontend handles cleanup if the `isTyping: false` event is lost.

## Customizing the indicator appearance

The `TypingIndicator` primitive exposes a `root` slot for custom rendering.
The slot receives owner state including the resolved typing users and count:

```tsx
import { Indicators } from '@mui/x-chat/unstyled';

<Indicators.TypingIndicator
  slots={{
    root: ({ children, ...props }) => (
      <div {...props} className="my-typing-indicator">
        {children}
      </div>
    ),
  }}
/>;
```

### Owner state

Custom slots receive:

| Property | Type       | Description                             |
| :------- | :--------- | :-------------------------------------- |
| `users`  | `string[]` | Display names of users currently typing |
| `count`  | `number`   | Number of users currently typing        |

## Using with `ChatBox`

When using `ChatBox`, the typing indicator is integrated into the conversation header area.
No additional setup is required beyond implementing `setTyping()` and `subscribe()` on your adapter.

## Standalone usage

When building a custom layout with `ChatRoot`, place the `TypingIndicator` anywhere inside the provider tree:

```tsx
import { ChatRoot } from '@mui/x-chat/unstyled';
import { Indicators } from '@mui/x-chat/unstyled';

<ChatRoot adapter={adapter}>
  {/* Your custom message list */}
  <Indicators.TypingIndicator />
  {/* Your custom composer */}
</ChatRoot>;
```

## API

- [`ChatTypingIndicator`](/x/api/chat/chat-typing-indicator/)

## See also

- [Adapter](/x/react-chat/backend/adapters/) for the `setTyping()` and `subscribe()` methods.
- [Indicators (unstyled)](/x/react-chat/customization/unstyled/) for the full unstyled primitive reference including `UnreadMarker` and `ScrollToBottomAffordance`.
