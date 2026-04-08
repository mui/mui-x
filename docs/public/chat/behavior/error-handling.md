---
productId: x-chat
title: Error Handling
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatBox
---

# Chat - Error Handling

How errors are captured, surfaced, and recovered from across the chat runtime.



The chat runtime captures errors from adapters, streams, and history loading, and surfaces them through a unified error model.
You do not need to catch errors inside adapter methods — the runtime handles them for you.

## The `ChatError` type

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

- **`recoverable`** — The runtime can potentially recover from this error automatically (for example, by reconnecting a dropped stream via `reconnectToStream()`).
- **`retryable`** — The user can reasonably try the operation again (for example, re-sending a failed message).

## Error propagation

When an adapter method throws, the runtime:

1. Records a `ChatError` with the appropriate `source` and `code`.
2. Surfaces it through `ChatBox`'s built-in error UI, `useChat().error`, and the `onError` callback.
3. Marks the error `recoverable` when applicable (for example, stream disconnects) and `retryable` when the user can try again.

## The `onError` callback

Handle errors at the application level using the `onError` prop on `ChatBox`:

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

```tsx
'use client';
import * as React from 'react';
import { ChatBox } from '@mui/x-chat';
import {
  minimalConversation,
  minimalMessages,
  demoUsers,
} from 'docsx/data/chat/material/examples/shared/demoData';
import type { ChatAdapter } from '@mui/x-chat/headless';

const demoMembers = [demoUsers.you, demoUsers.agent];

const failingAdapter: ChatAdapter = {
  async sendMessage() {
    // Simulate network delay then fail
    await new Promise((resolve) => {
      setTimeout(resolve, 800);
    });
    throw new Error(
      'Network error: Unable to reach the server. Please check your connection.',
    );
  },
};

export default function ErrorState() {
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  return (
    <div style={{ width: '100%' }}>
      <ChatBox
        adapter={failingAdapter}
        members={demoMembers}
        initialActiveConversationId={minimalConversation.id}
        initialConversations={[minimalConversation]}
        initialMessages={minimalMessages}
        onError={(error) => {
          setErrorMessage(error.message ?? 'An unknown error occurred');
        }}
        sx={{
          height: 460,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
        }}
      />
      {errorMessage && (
        <div
          role="alert"
          style={{
            marginTop: 8,
            padding: '8px 16px',
            backgroundColor: '#fdeded',
            color: '#5f2120',
            borderRadius: 4,
            fontSize: 14,
          }}
        >
          Error: {errorMessage}
        </div>
      )}
    </div>
  );
}

```

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

When `sendMessage()` fails, the user's message is still displayed in the thread (optimistic update) and the composer is re-enabled so the user can try again.

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

You do not need to wrap adapter methods in try/catch — the runtime handles all thrown errors.
If you want to transform or enrich an error before the runtime sees it, throw a plain `Error` with a custom message.
The runtime wraps it in a `ChatError` with source `'adapter'`:

```tsx
async sendMessage({ message, signal }) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ message }),
    signal,
  });

  if (!res.ok) {
    throw new Error(`Server responded with ${res.status}`);
  }

  return res.body!;
},
```

## Stream disconnect recovery

If a stream closes without a terminal chunk (`finish` or `abort`), the runtime:

1. Records a recoverable stream error.
2. Sets the message status to `'error'`.
3. Calls `onError` and `onFinish` with `isDisconnect: true`.
4. If `reconnectToStream()` is implemented on the adapter, attempts to resume the stream.

See [Streaming—Reconnecting to streams](/x/react-chat/behavior/streaming/#reconnecting-to-streams) for implementation details.

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

## See also

- [Streaming](/x/react-chat/behavior/streaming/) for stream lifecycle and disconnect handling.
- [Adapter](/x/react-chat/backend/adapters/) for the adapter interface and error propagation details.
