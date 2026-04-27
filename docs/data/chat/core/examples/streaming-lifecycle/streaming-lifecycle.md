---
title: Chat - Streaming lifecycle
productId: x-chat
packageName: '@mui/x-chat/headless'
githubLabel: 'scope: chat'
---

# Chat - Streaming lifecycle

<p class="description">Observe the full runtime lifecycle for send, stream, stop, error, retry, and callbacks.</p>

This demo brings the runtime lifecycle together in one place.
It intentionally exposes success, failure, and long-running stream modes so you can observe every lifecycle phase:

- `sendMessage()`: send a user turn and start streaming
- `stopStreaming()`: cancel an active stream
- `retry()`: retry a failed or cancelled message
- `onData`: fires when a `data-*` chunk arrives
- `onFinish`: fires when the stream ends (success, abort, or error)
- `onError`: fires on any runtime error

## Key concepts

### The send-stream flow

When `sendMessage()` is called:

1. The user message is added optimistically with `status: 'sending'`
2. The adapter's `sendMessage()` returns a `ReadableStream`
3. Chunks update the assistant message in real time
4. A `finish` chunk completes the turn—user message moves to `status: 'sent'`

### Stopping a stream

Call `stopStreaming()` to abort the active stream.
The user message moves to `status: 'cancelled'` and the `onFinish` callback fires with `isAbort: true`.

### Retrying a failed message

When a stream fails or is cancelled, call `retry(messageId)` with the user message ID.
The runtime removes the failed assistant messages and resends the user turn.

### Runtime callbacks

Register callbacks on `ChatProvider` to observe lifecycle events:

```tsx
<ChatProvider
  adapter={adapter}
  onData={(part) => console.log('data chunk', part.type)}
  onFinish={(payload) => console.log('finished', payload.finishReason)}
  onError={(error) => console.log('error', error.message)}
>
  <MyChat />
</ChatProvider>
```

{{"demo": "StreamingLifecycleHeadlessChat.js"}}

## Key takeaways

- The runtime manages the full send → stream → finish lifecycle automatically
- `stopStreaming()` aborts the stream and triggers `onFinish` with `isAbort: true`
- `retry()` removes failed assistant messages and resends the original user turn
- Callbacks (`onData`, `onFinish`, `onError`) provide lifecycle observability without modifying the store

## See also

- [Streaming](/x/react-chat/core/streaming/) for the full chunk protocol reference
- [State and store](/x/react-chat/core/state/) for the error model and callback signatures
- [Message parts](/x/react-chat/core/examples/message-parts/) for rendering multi-part responses
- [Tool call events](/x/react-chat/core/examples/tool-call-events/) for tool-specific lifecycle callbacks

## API

- [ChatRoot](/x/api/chat/chat-root/)
