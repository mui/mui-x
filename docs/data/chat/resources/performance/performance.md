---
productId: x-chat
title: Performance
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatBox
---

# Chat - Performance

<p class="description">Strategies for efficient rendering, streaming tuning, and handling large message lists in the chat UI.</p>

{{"component": "@mui/docs/ComponentLinkHeader"}}

The chat runtime is designed for efficient real-time updates.
This page covers the key patterns and configuration options for maintaining smooth performance as your chat UI scales.

## `streamFlushInterval` tuning

During streaming, the runtime batches incoming text deltas before flushing them to the store.
The `streamFlushInterval` prop controls the batching window in milliseconds:

```tsx
<ChatBox
  adapter={adapter}
  streamFlushInterval={16} // default: 16ms (~60fps)
/>
```

| Value    | Effect                                                |
| :------- | :---------------------------------------------------- |
| `16`     | Default. Flushes at ~60fps for smooth character-level animation. |
| `32-50`  | Reduces store update frequency. Good for lower-end devices or when streaming is visually less important. |
| `100+`   | Chunks arrive in larger batches. Text appears to "jump" forward. Useful when minimizing re-renders matters more than streaming smoothness. |
| `0`      | No batching — every delta triggers a store update immediately. Only use for debugging. |

The optimal value depends on your UI complexity and target devices. Start with the default and increase it if profiling shows excessive re-renders during streaming.

## Efficient rendering with `useMessageIds()` + `useMessage()`

The single most important pattern for performance is separating the message list from individual message rendering:

```tsx
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

This pattern works because of how the normalized store is structured:

1. **`useMessageIds()`** subscribes to the `messageIds` array, which only changes when messages are added or removed — not when their content updates during streaming.
2. **`useMessage(id)`** subscribes to a single message record. During streaming, only the row for the message being streamed re-renders.

The result: sibling message rows and the parent thread component stay untouched during streaming. This scales to threads with hundreds of messages.

### Why `useChat()` is less efficient for lists

`useChat()` subscribes to multiple store slices at once and returns the full `messages` array. Any state change — including text deltas on a single message — causes the entire component to re-render. For a thread with many messages, this means re-rendering every row on every delta.

Use `useChat()` for small prototypes and components that need both state and actions. Use `useMessageIds()` + `useMessage(id)` for production message lists.

## Memoization strategies

### Memoize message row components

Wrap row components in `React.memo` to prevent re-renders when props have not changed:

```tsx
const MessageRow = React.memo(function MessageRow({ id }: { id: string }) {
  const message = useMessage(id);
  if (!message) return null;

  return <Paper sx={{ p: 1.5 }}>{/* render message */}</Paper>;
});
```

Because `useMessage(id)` only triggers a re-render when the specific message changes, the memo boundary is effective — the component only re-renders when its own data updates.

### Stable callback references

When passing callbacks to message rows (for example, action handlers), use `useCallback` to prevent the callback from changing on every parent render:

```tsx
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

The store keeps messages and conversations in a normalized shape (`ids` + `byId` maps) rather than flat arrays.
This design has three benefits:

1. **Point updates** — Updating a single message during streaming does not rebuild the message array. Only the `messagesById` record changes.
2. **Stable references** — The `messageIds` array only changes when messages are added or removed, not when their content updates. `useMessageIds()` stays stable during streaming.
3. **Memoized derivation** — The `messages` selector rebuilds the array only when either `messageIds` or `messagesById` changes, and the result is reference-equal when inputs are unchanged.

## Handling large message lists

### Scroll behavior

`ChatBox` handles scroll behavior automatically:

- Auto-scrolls to the bottom when new messages arrive (if the user is already near the bottom).
- Shows a scroll-to-bottom affordance when the user scrolls up.
- Loads earlier messages with a "Load earlier messages" control when `listMessages` returns `hasMore: true`.

The `autoScroll` feature flag allows tuning the scroll threshold:

```tsx
<ChatBox
  adapter={adapter}
  features={{
    autoScroll: { buffer: 300 }, // custom threshold (default: 150px)
  }}
/>
```

### Many messages

The chat UI is tested with large message counts (30+ messages) to verify:

- Scrollable message list with proper scroll positioning
- Auto-scroll to the latest message on load
- Scroll-to-bottom affordance when scrolled up
- Message grouping by author
- Performance with many DOM nodes

### Long messages

The chat UI handles various edge cases in message content:

- Long text wrapping within bubble constraints
- Word-break behavior with unbreakable strings
- Special characters and emoji rendering
- Mixed short and long messages
- Code block formatting in messages

## Profiling tips

1. **React DevTools Profiler** — Record a profiling session while streaming a response. Look for components that re-render on every delta but should not.
2. **Highlight updates** — Enable "Highlight updates when components render" in React DevTools to visually see which components re-render during streaming.
3. **Check subscription granularity** — If a component uses `useChat()` but only reads `isStreaming`, switch to `useChatStatus()` to avoid unnecessary message-triggered re-renders.

## API

## See also

- [Hooks Reference](/x/react-chat/resources/hooks/) for the `useMessageIds()` + `useMessage(id)` pattern.
- [Selectors Reference](/x/react-chat/resources/selectors/) for the normalized store design and custom selectors.
- [Controlled State](/x/react-chat/backend/controlled-state/) for `streamFlushInterval` and other provider configuration.
