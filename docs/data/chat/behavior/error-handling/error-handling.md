---
productId: x-chat
title: Error handling
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatBox, ChatMessageError
---

# Chat - Error handling

<p class="description">Handle errors raised by adapters, streams, and history loading through a unified error model.</p>

{{"component": "@mui/internal-core-docs/ComponentLinkHeader"}}

The chat runtime captures errors from adapters, streams, and history loading, and surfaces them through a unified error model.
You don't need to catch errors inside adapter methods—the runtime handles them for you.

## Interactive playground

The demo below lets you toggle a recoverable message error and observe the `ChatMessageError` slot:

{{"demo": "ChatMessageErrorPlayground.js", "bg": "inline", "defaultCodeOpen": false}}

## Error object structure

Every error recorded by the runtime is represented as a `ChatError`:

```ts
interface ChatError {
  code: ChatErrorCode;
  message: string;
  source: ChatErrorSource;
  recoverable: boolean;
  retryable?: boolean;
  details?: Record<string, unknown>;
}
```

### Error codes

| Code             | Description                                     |
| :--------------- | :---------------------------------------------- |
| `SEND_ERROR`     | The adapter's `sendMessage()` threw an error.   |
| `STREAM_ERROR`   | The stream failed or disconnected unexpectedly. |
| `HISTORY_ERROR`  | Loading message history failed.                 |
| `REALTIME_ERROR` | The realtime subscription encountered an error. |

### Error sources

| Source      | Description                       |
| :---------- | :-------------------------------- |
| `'send'`    | Error during message send.        |
| `'stream'`  | Error during stream processing.   |
| `'history'` | Error during history loading.     |
| `'render'`  | Error during component rendering. |
| `'adapter'` | Generic adapter error.            |

### `recoverable` vs `retryable`

- **`recoverable`**—the runtime can recover from this error automatically (for example, by reconnecting a dropped stream via `reconnectToStream()`).
- **`retryable`**—the user can try the operation again (for example, by re-sending a failed message).

## Error propagation

When an adapter method throws, the runtime:

1. Records a `ChatError` with the appropriate `source` and `code`.
2. Surfaces it through `ChatBox`'s built-in error UI, `useChat().error`, and the `onError` callback.
3. Marks the error `recoverable` when applicable (for example, stream disconnects) and `retryable` when the user can try again.

## Handling errors at the application level

Use the `onError` prop on `ChatBox` to handle errors at the application level:

```tsx
<ChatBox
  adapter={adapter}
  onError={(error) => {
    console.error(`[Chat error] ${error.source}: ${error.message}`);

    // Report to your error tracking service
    errorTracker.capture(error);
  }}
/>
```

The demo below shows the default error UI surfaced by `ChatBox` when `sendMessage()` fails:

{{"demo": "../../material/examples/error-state/ErrorState.js", "defaultCodeOpen": false, "bg": "inline"}}

## Accessing the error state

The `useChat()` hook exposes the current error:

```tsx
import { useChat } from '@mui/x-chat/headless';

function ErrorBanner() {
  const { error, setError } = useChat();

  if (!error) return null;

  return (
    <div role="alert">
      <p>{error.message}</p>
      <button onClick={() => setError(null)}>Dismiss</button>
    </div>
  );
}
```

## Retrying failed messages

When `sendMessage()` fails, the user's message stays in the thread (optimistic update) and the composer re-enables so the user can try again.

The `useChat()` hook provides a `retry` method that re-sends the message associated with a given message ID:

```tsx
import { useChat } from '@mui/x-chat/headless';

function RetryButton({ messageId }: { messageId: string }) {
  const { retry } = useChat();

  return <button onClick={() => retry(messageId)}>Retry</button>;
}
```

`retry()` looks up the original user message by ID, re-submits it through the adapter's `sendMessage()`, and replaces any previous error state.

## Error from adapter methods

You don't need to wrap adapter methods in try/catch to surface errors to the runtime—but you should wrap them to log to your observability platform.
If you want to transform or enrich an error before the runtime sees it, throw a plain `Error` with a custom message.
The runtime wraps it in a `ChatError` with source `'adapter'`:

```tsx
async sendMessage({ message, signal }) {
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message }),
      signal,
    });

    if (!res.ok) {
      throw new Error(`Server responded with ${res.status}`);
    }

    return res.body!;
  } catch (error) {
    // Log to Sentry, Datadog, or your error-tracking platform
    console.error('Adapter sendMessage failed:', error);
    // Re-throw so the runtime can surface the failure to the user
    throw error;
  }
},
```

## Stream disconnect recovery

If a stream closes without a terminal chunk (`finish` or `abort`), the runtime:

1. Records a recoverable stream error.
2. Sets the message status to `'error'`.
3. Calls `onFinish` with `isDisconnect: true`.
4. If `reconnectToStream()` is implemented on the adapter, makes one attempt to resume the stream.
5. Calls `onError` only when the disconnect remains unrecovered.

See [Streaming—Reconnecting to streams](/x/react-chat/behavior/streaming/#reconnecting-to-streams) for details.

## Message status and errors

The message `status` field reflects error states:

| Status        | Description                                 |
| :------------ | :------------------------------------------ |
| `'sending'`   | Message is being sent (optimistic update).  |
| `'streaming'` | Assistant response is streaming.            |
| `'sent'`      | Message was sent and response completed.    |
| `'error'`     | An error occurred during send or streaming. |
| `'cancelled'` | The stream was aborted by the user.         |

Components can use the `status` field to conditionally render error indicators:

```tsx
function MessageBubble({ message }: { message: ChatMessage }) {
  return (
    <div>
      {message.parts.map((part) => /* render parts */)}
      {message.status === 'error' && (
        <span className="error-badge">Failed to send</span>
      )}
    </div>
  );
}
```

Use the [`useMessageError(messageId)`](/x/react-chat/resources/hooks/#usemessageerrormessageid) hook to read a single message's error from your own components.

## See also

- [Streaming](/x/react-chat/behavior/streaming/) for stream lifecycle and disconnect handling.
- [Adapter](/x/react-chat/backend/adapters/) for the adapter interface and error propagation details.
