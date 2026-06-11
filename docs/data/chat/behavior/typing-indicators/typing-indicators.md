---
productId: x-chat
title: Typing indicators
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatTypingIndicator
---

# Chat - Typing indicators

<p class="description">Show users when other participants are composing a message in real time.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

## Interactive playground

Toggle which users appear as typing in the current conversation:

{{"demo": "ChatTypingIndicatorPlayground.js", "bg": "inline", "defaultCodeOpen": false}}

Typing indicators show labels like "Alice is typing" or "Alice, Bob are typing" in the chat UI.
The feature connects the adapter's `setTyping()` method (outbound) with real-time `typing` events (inbound) to close the loop between the local composer and remote participants.

## How typing indicators work

Typing indicators involve two directions of communication:

1. **Outbound**—when the local user types in the composer, and the adapter's `setTyping()` method notifies the backend.
2. **Inbound**—when other users type, the backend pushes `typing` events through the adapter's `subscribe()` method, and the runtime updates the store.

### Sending typing state

Implement `setTyping()` on the adapter to send typing indicators to the backend.
The runtime does **not** call `setTyping()` automatically—you must wire it up yourself, for example by listening to `onChange` on the composer text area:

```tsx
async setTyping({ conversationId, isTyping }) {
  await fetch('/api/typing', {
    method: 'POST',
    body: JSON.stringify({ conversationId, isTyping }),
  });
},
```

Call `adapter.setTyping({ conversationId, isTyping: true })` when the user starts typing, and `adapter.setTyping({ conversationId, isTyping: false })` when they stop (for example, when the composer becomes empty or when they send the message).

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

## Indicator component reference

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
import { Indicators } from '@mui/x-chat/headless';

<Indicators.TypingIndicator />;
```

When no users are typing, the component renders nothing.

## Typing timeout behavior

The runtime does **not** include built-in timeout handling for stale typing state.
The store updates immediately on every `typing` event with `isTyping: true`.
If no follow-up `isTyping: false` event arrives—for example, when a user closes the browser tab—the indicator stays visible indefinitely.

To prevent stale indicators, implement timeout logic yourself.
A common pattern is to reset the typing state after a short idle period on the sender side:

```tsx
// In your composer onChange handler
let typingTimeout: ReturnType<typeof setTimeout> | null = null;

function handleComposerChange(value: string) {
  if (value !== '') {
    adapter.setTyping({ conversationId, isTyping: true });

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    typingTimeout = setTimeout(() => {
      adapter.setTyping({ conversationId, isTyping: false });
    }, 3000);
  } else {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    adapter.setTyping({ conversationId, isTyping: false });
  }
}
```

Alternatively, handle cleanup server-side by expiring typing state after a timeout window.

## Customizing the indicator appearance

The `TypingIndicator` primitive exposes a `root` slot for custom rendering.
The slot receives owner state including the resolved typing users and count:

```tsx
import { Indicators } from '@mui/x-chat/headless';

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

## Using with Chat Box

When using `ChatBox`, the typing indicator is integrated into the conversation header area.
No additional setup is required beyond implementing `setTyping()` and `subscribe()` on your adapter.

## Using the indicator standalone

When building a custom layout with `ChatRoot`, place the `TypingIndicator` anywhere inside the provider tree:

```tsx
import { ChatRoot } from '@mui/x-chat/headless';
import { Indicators } from '@mui/x-chat/headless';

<ChatRoot adapter={adapter}>
  {/* Your custom message list */}
  <Indicators.TypingIndicator />
  {/* Your custom composer */}
</ChatRoot>;
```

## See also

- [Adapter](/x/react-chat/backend/adapters/) for details on the `setTyping()` and `subscribe()` methods.
