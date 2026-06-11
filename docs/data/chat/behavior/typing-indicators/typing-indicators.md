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

Typing indicators show labels like "Alice Chen is typing" or "Alice Chen, Mira Patel are typing" in the chat UI.
The feature connects the adapter's `setTyping()` method (outbound) with real-time `typing` events (inbound) so the local composer's typing state and remote participants' typing state stay in sync.

## How typing indicators work

Typing indicators involve two directions of communication:

1. **Outbound:** when the local user types in the composer, and the adapter's `setTyping()` method notifies the backend.
2. **Inbound:** when other users type, the backend pushes `typing` events through the adapter's `subscribe()` method, and the runtime updates the store.

Both `setTyping()` and `subscribe()` are optional adapter methods — omit them if your backend has no presence channel, and the indicator simply never renders.

### Sending typing state

Implement `setTyping()` on the adapter to send typing indicators to the backend.

The runtime does not call `setTyping()` **by default**.
Enabling `features.typingSignal` (default `false`) activates the automatic contract: the runtime calls `setTyping()` for the active conversation on empty (`''`) ⇄ non-empty composer transitions — `{ isTyping: true }` when the value becomes non-empty and `{ isTyping: false }` when it becomes empty again, including when a message is sent (sending clears the composer).
Switching conversations sends `{ isTyping: false }` to the previous conversation and, when the new draft is non-empty, `{ isTyping: true }` to the new one.
`setTyping()` failures are swallowed with a dev-only warning, and there is no built-in idle timeout.
When `setTyping()` is undefined the auto-call is a silent no-op.
See [Real-time adapters](/x/react-chat/backend/real-time-adapters/) for the full contract.

```tsx
async setTyping({ conversationId, isTyping }) {
  await fetch('/api/typing', {
    method: 'POST',
    body: JSON.stringify({ conversationId, isTyping }),
  });
},
```

With the flag off — the default — wire the calls yourself, for example by listening to `onChange` on the composer text area: call `adapter.setTyping({ conversationId, isTyping: true })` when the user starts typing, and `adapter.setTyping({ conversationId, isTyping: false })` when they stop (for example, when the composer becomes empty or when they send the message).
Remove this manual wiring before enabling `features.typingSignal`, otherwise the manual and automatic calls double-fire.

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

## Typing timeout behavior

The runtime does not include built-in timeout handling for stale typing state, for inbound or outbound state.
The store updates immediately on every `typing` event with `isTyping: true`.
If no follow-up `isTyping: false` event arrives, for example when a user closes the browser tab, the indicator stays visible indefinitely.

To prevent stale indicators, implement timeout logic yourself.

With `features.typingSignal` off, a common pattern is to reset the typing state after a short idle period in the composer's `onChange` handler:

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

With `features.typingSignal` on, the runtime drives the `setTyping()` calls, so move the idle-expiry logic inside the adapter's `setTyping()` implementation — reset a timer whenever you receive `isTyping: true` and send `isTyping: false` when it fires:

```tsx
let idleTimeout: ReturnType<typeof setTimeout> | null = null;

async setTyping({ conversationId, isTyping }) {
  if (idleTimeout) {
    clearTimeout(idleTimeout);
  }
  await postTyping({ conversationId, isTyping });
  if (isTyping) {
    idleTimeout = setTimeout(() => {
      postTyping({ conversationId, isTyping: false });
    }, 3000);
  }
},
```

Alternatively, handle cleanup server-side by expiring typing state after a timeout window.

## Indicator component reference

The `ChatTypingIndicator` component wraps the headless `Indicators.TypingIndicator` primitive.
It reads typing state for the active conversation and resolves display names from:

- Conversation participants
- Message authors already present in the thread
- Raw user IDs when no richer user data is available

It renders a polite live region (`aria-live="polite"`) and shows labels such as:

- "Alice Chen is typing"
- "Alice Chen, Mira Patel are typing"

### Typical placement

Place the indicator in the thread header or just above the composer:

```tsx
import { ChatTypingIndicator } from '@mui/x-chat';

<ChatTypingIndicator />;
```

When no users are typing, the component renders nothing.

## Customizing the indicator appearance

`ChatTypingIndicator` exposes a `root` slot for custom rendering.
The slot receives owner state including the resolved typing users and count:

```tsx
import { ChatTypingIndicator } from '@mui/x-chat';

<ChatTypingIndicator
  slots={{
    root: ({ ownerState, children, ...props }) => (
      <div {...props} className="my-typing-indicator">
        {ownerState.count > 1 ? `${ownerState.count} people are typing` : children}
      </div>
    ),
  }}
/>;
```

For fully unstyled rendering, use the headless `Indicators.TypingIndicator` from `@mui/x-chat/headless` — same slots and owner state.

The root element exposes a `data-count` attribute with the number of typing users, which you can target from CSS:

```css
.my-typing-indicator[data-count='1'] {
  font-style: italic;
}
```

The same selector works with `styled()` and `sx` selectors.

### Customizing the label

The visible string comes from `localeText.typingIndicatorLabel(users)`.
The default formats a single user as "Alice Chen is typing" and multiple users as "Alice Chen, Mira Patel are typing".
Override it through the `localeText` prop on `ChatBox` or `ChatRoot` to change or translate the wording:

```tsx
<ChatBox
  localeText={{
    typingIndicatorLabel: (users) =>
      users.length === 1
        ? `${users[0].displayName ?? users[0].id} tippt …`
        : 'Mehrere Personen tippen …',
  }}
/>
```

`displayName` is optional on `ChatLocaleTypingUser` (`Pick<ChatUser, 'id' | 'displayName'>`), so the `?? users[0].id` fallback avoids rendering "undefined tippt".
See [Localization](/x/react-chat/customization/structure/#localization) for the full set of overridable strings.

### Owner state

Custom slots receive:

| Property               | Type                  | Description                                                                                                    |
| :--------------------- | :-------------------- | :------------------------------------------------------------------------------------------------------------- |
| `users`                | `ChatUser[]`          | Typing users resolved from participants/message authors; each has `id` and optional `displayName`, `avatarUrl` |
| `count`                | `number`              | Number of users currently typing                                                                               |
| `label`                | `string`              | The resolved localized label (for example "Alice Chen is typing")                                              |
| `activeConversationId` | `string \| undefined` | The conversation the indicator is reading from                                                                 |

Display strings should come from `ownerState.label` (already rendered as `children`), not from joining `users` directly.

## Using with Chat Box

`ChatBox` does **not** render a typing indicator by default.
The `slots.typingIndicator` / `slotProps.typingIndicator` entries exist on the ChatBox slot types, but there is currently no built-in render site for the widget.

`ChatBox` renders its `children` inside the chat provider tree, so a typing indicator placed there can read the live typing state:

```tsx
import { ChatBox, ChatTypingIndicator } from '@mui/x-chat';

<ChatBox adapter={adapter}>
  <ChatTypingIndicator />
</ChatBox>;
```

Children render after the built-in layout, so position the indicator with your own styling — or use the standalone `ChatRoot` composition from the [Using the indicator standalone](#using-the-indicator-standalone) section for full placement control.

Inbound display needs the adapter's `subscribe()` emitting `typing` events.
The outbound auto-signal is opt-in and off by default via `features.typingSignal` (see [Sending typing state](#sending-typing-state)).

## Using the indicator standalone

When building a custom layout with `ChatRoot`, place the indicator anywhere inside the provider tree:

```tsx
import { ChatRoot } from '@mui/x-chat/headless';
import { ChatTypingIndicator } from '@mui/x-chat';

<ChatRoot adapter={adapter}>
  {/* Your custom message list */}
  <ChatTypingIndicator />
  {/* Your custom composer */}
</ChatRoot>;
```

## See also

- [Adapter](/x/react-chat/backend/adapters/) for details on the `setTyping()` and `subscribe()` methods.
- [Localization](/x/react-chat/customization/structure/#localization) to translate the typing label.
- [`ChatTypingIndicator`](/x/api/chat/chat-typing-indicator/) API reference.
