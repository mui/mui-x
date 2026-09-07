---
productId: x-chat
title: Performance
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatBox
---

# Chat - Performance

<p class="description">Optimize rendering, tune streaming, and scale to large message lists in the Chat.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

The Chat runtime is designed for efficient real-time updates.
This page covers the key patterns and configuration options for maintaining smooth performance as your chat UI scales.

## Rendering message lists efficiently

The single most important pattern for performance is separating the message list from individual message rendering:

All chat hooks are imported from `@mui/x-chat/headless` (re-exported from `@mui/x-chat-headless`).

```tsx
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import { useMessageIds, useMessage } from '@mui/x-chat/headless';

function Thread() {
  const messageIds = useMessageIds();

  return (
    <Stack spacing={1}>
      {messageIds.map((id) => (
        <MessageRow key={id} id={id} />
      ))}
    </Stack>
  );
}

function MessageRow({ id }: { id: string }) {
  const message = useMessage(id);
  if (!message) return null;

  const textPart = message.parts.find((p) => p.type === 'text');
  return (
    <Paper sx={{ p: 1.5 }}>{textPart?.type === 'text' ? textPart.text : null}</Paper>
  );
}
```

The normalized store makes this pattern work:

1. **`useMessageIds()`** subscribes to the `messageIds` array, which only changes when messages are added or removed—not when their content updates during streaming.
2. **`useMessage(id)`** subscribes to a single message record. During streaming, only the row for the message being streamed re-renders.

The result: sibling message rows and the parent thread component stay untouched during streaming. This scales to threads with hundreds of messages.

The demo below renders the same conversation twice from one shared runtime — send a message and watch which render counters increment while the reply streams.

{{"demo": "RenderIsolationComparison.js", "bg": "inline"}}

### Why `useChat()` is less efficient for lists

`useChat()` subscribes to multiple store slices at once and returns the full `messages` array. Any state change—including text deltas on a single message—causes the entire component to re-render. For a thread with many messages, this means re-rendering every row on every delta.

Use `useChat()` for small prototypes and components that need both state and actions. Use `useMessageIds()` + `useMessage(id)` for production message lists.

## Tuning the stream flush interval

During streaming, the runtime batches incoming text deltas before flushing them to the store.
The `streamFlushInterval` prop controls the batching window in milliseconds:

```tsx
<ChatBox
  adapter={adapter}
  streamFlushInterval={16} // default: 16ms (~60fps)
/>
```

| Value   | Effect                                                                                                                                                  |
| :------ | :------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `16`    | Default. Flushes at ~60fps for smooth character-level animation.                                                                                        |
| `32-50` | Reduces store update frequency. Good for lower-end devices or when streaming is visually less important.                                                |
| `100+`  | Chunks arrive in larger batches. Text appears to "jump" forward. Useful when minimizing re-renders matters more than streaming smoothness.              |
| `0`     | No batching—every delta triggers a store update immediately. Can cause excessive re-renders and dropped frames on busy streams. Only use for debugging. |

The same prop is available on the headless `ChatProvider` — see [Controlled state](/x/react-chat/backend/controlled-state/).

The optimal value depends on UI complexity and target devices. Start with the default and increase it if profiling shows excessive re-renders during streaming.

## Memoization strategies

### Memoize message row components

Wrap row components in `React.memo` to prevent re-renders when props have not changed:

```tsx
const MessageRow = React.memo(function MessageRow({ id }: { id: string }) {
  const message = useMessage(id);
  if (!message) return null;

  const textPart = message.parts.find((p) => p.type === 'text');
  return (
    <Paper sx={{ p: 1.5 }}>{textPart?.type === 'text' ? textPart.text : null}</Paper>
  );
});
```

Because `useMessage(id)` only triggers a re-render when the specific message changes, the memo boundary is effective—the component only re-renders when its own data updates.

### Stable callback references

When passing callbacks to message rows (for example, action handlers), use `useCallback` to prevent the callback from changing on every parent render:

```tsx
import * as React from 'react';
import { useMessageIds, useChat } from '@mui/x-chat/headless';

function Thread() {
  const messageIds = useMessageIds();
  const { retry } = useChat();

  const handleRetry = React.useCallback(
    (messageId: string) => retry(messageId),
    [retry],
  );

  return (
    <>
      {messageIds.map((id) => (
        <MessageRow key={id} id={id} onRetry={handleRetry} />
      ))}
    </>
  );
}
```

## Why normalization matters

This is the store design that makes the list-rendering pattern above work:
The store keeps messages and conversations in a normalized shape (`ids` + `byId` maps) rather than flat arrays.
This design has three benefits:

1. **Point updates**—Updating a single message during streaming does not rebuild the message array. Only the `messagesById` record changes.
2. **Stable references**—The `messageIds` array only changes when messages are added or removed, not when their content updates.
3. **Memoized derivation**—The `messages` selector rebuilds the array only when either `messageIds` or `messagesById` changes, and the result is reference-equal when inputs are unchanged.

## Handling large message lists

### Scroll behavior

The Chat handles scroll behavior automatically:

- Auto-scrolls to the bottom when new messages arrive (if the user is already near the bottom).
- Shows a scroll-to-bottom affordance when the user scrolls up.
- Automatically loads earlier messages when the user scrolls to the top of the list, as long as `listMessages` keeps returning `hasMore: true`. See [History and pagination](/x/react-chat/multi-conversation/history-and-pagination/).

Use the `autoScroll` feature flag to tune the scroll threshold:

```tsx
<ChatBox
  adapter={adapter}
  features={{
    autoScroll: { buffer: 300 }, // custom threshold (default: 150px)
  }}
/>
```

### Many messages

The message list is **not virtualized** — every message in the active conversation stays mounted in the DOM.

This works because of the subscription model described above: with `useMessageIds()` + `useMessage(id)` and memoized rows, message rows do not re-render during streaming, so the cost of a long thread is DOM size and initial mount time — not per-delta update work.

For very large threads, bound the DOM size by paginating history: have `listMessages` return a window of recent messages with `hasMore: true`. The list then loads older messages automatically when the user scrolls to the top, instead of loading the entire conversation history into the store up front.

Auto-scroll on load, the scroll-to-bottom affordance, and grouping of consecutive messages by author keep working regardless of message count.

### Long messages

Long messages cost render time mainly through part rendering — markdown parsing and code-block highlighting — rather than raw text length. Because `useMessage(id)` isolates subscriptions, a long message only re-renders while it is the one streaming; settled messages are untouched by other rows' deltas.

If you render expensive custom part content (for example a markdown renderer or a syntax highlighter), wrap it in `React.memo` so settled long messages are not re-parsed when their row re-renders for other reasons.

## Profiling tips

1. **[React DevTools Profiler](https://react.dev/learn/react-developer-tools)**—Record a profiling session while streaming a response. Look for components that re-render on every delta but should not.
2. **Highlight updates**—Enable "Highlight updates when components render" in React DevTools to visually see which components re-render during streaming.
3. **Check subscription granularity**—If a component uses `useChat()` but only reads `isStreaming`, switch to `useChatStatus()` to avoid unnecessary message-triggered re-renders.

## See also

- See [Hooks reference](/x/react-chat/resources/hooks/) for details on the `useMessageIds()` + `useMessage(id)` pattern.
- See [Selectors reference](/x/react-chat/resources/selectors/) for details on the normalized store design and custom selectors.
- See [Controlled state](/x/react-chat/backend/controlled-state/) for details on `streamFlushInterval` and other provider configuration.
