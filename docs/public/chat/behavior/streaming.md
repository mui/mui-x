---
productId: x-chat
title: Streaming
packageName: '@mui/x-chat'
githubLabel: 'scope: chat'
components: ChatBox
---

# Chat - Streaming

How the streaming protocol works end-to-end, from adapter response to live UI updates.

The Chat component streams assistant responses token-by-token.
The adapter's `sendMessage()` method returns a `ReadableStream<ChatMessageChunk | ChatStreamEnvelope>`.
The runtime reads this stream, processes each chunk, and updates the normalized store so that UI components re-render incrementally.

```tsx
import * as React from 'react';
import {
  ChatProvider,
  useChat,
  type ChatAdapter,
  type ChatDataMessagePart,
} from '@mui/x-chat/headless';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { demoUsers } from 'docsx/data/chat/headless/examples/shared/demoData';
import {
  createChunkStream,
  createTextResponseChunks,
  getMessageText,
} from 'docsx/data/chat/headless/examples/shared/demoUtils';

function createStreamingAdapter(): ChatAdapter {
  return {
    async sendMessage({ message }) {
      const text = getMessageText(message);
      const messageId = `streaming-assistant-${message.id}`;
      const textId = `${messageId}-text`;

      if (text.includes('fail')) {
        return createChunkStream(
          [
            { type: 'start', messageId },
            { type: 'text-start', id: textId },
            {
              type: 'text-delta',
              id: textId,
              delta: 'The stream will fail',
            },
            {
              type: 'text-delta',
              id: textId,
              delta: ' after this chunk.',
            },
          ],
          {
            delayMs: 260,
            errorAfterChunk: 3,
            error: new Error('Demo transport lost the stream.'),
          },
        );
      }

      if (text.includes('slow')) {
        return createChunkStream(
          createTextResponseChunks(
            messageId,
            'This long-running stream is useful for demonstrating stopStreaming().',
          ),
          { delayMs: 420 },
        );
      }

      return createChunkStream(
        [
          { type: 'start', messageId },
          { type: 'text-start', id: textId },
          {
            type: 'text-delta',
            id: textId,
            delta: 'Streaming updates are visible',
          },
          {
            type: 'text-delta',
            id: textId,
            delta: ' before the final chunk arrives.',
          },
          {
            type: 'data-insight',
            id: `${messageId}-data`,
            data: { source: 'demo', confidence: 0.92 },
          },
          { type: 'text-end', id: textId },
          { type: 'finish', messageId, finishReason: 'stop' },
        ],
        { delayMs: 220 },
      );
    },
  };
}

export default function StreamingLifecycleHeadlessChat() {
  const adapter = React.useMemo(() => createStreamingAdapter(), []);

  return (
    <ChatProvider
      adapter={adapter}
      initialActiveConversationId="support"
      onData={(part: ChatDataMessagePart) => {
        console.log('onData', part.type);
      }}
      onFinish={(payload) => {
        console.log(
          'onFinish',
          payload.finishReason,
          payload.isError,
          payload.isAbort,
        );
      }}
      onError={(error) => {
        console.log('onError', error.message);
      }}
    >
      <StreamingLifecycleWithLogs />
    </ChatProvider>
  );
}

function StreamingLifecycleWithLogs() {
  const { messages, isStreaming, sendMessage, stopStreaming, retry } = useChat();
  const [draft, setDraft] = React.useState('success');
  const [events, setEvents] = React.useState<string[]>([]);

  const appendLog = React.useCallback((entry: string) => {
    setEvents((previous) => [entry, ...previous].slice(0, 8));
  }, []);

  React.useEffect(() => {
    const originalLog = console.log;

    console.log = (...args: unknown[]) => {
      appendLog(
        args
          .map((arg) => (typeof arg === 'string' ? arg : JSON.stringify(arg)))
          .join(' '),
      );
      originalLog(...args);
    };

    return () => {
      console.log = originalLog;
    };
  }, [appendLog]);

  return (
    <Paper variant="outlined" sx={{ overflow: 'hidden', width: '100%' }}>
      {/* Header */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Typography variant="subtitle1" fontWeight={700}>
          Streaming lifecycle
        </Typography>
        <Button
          size="small"
          variant="outlined"
          disabled={!isStreaming}
          onClick={() => stopStreaming()}
        >
          Stop stream
        </Button>
      </Box>

      {/* Event log */}
      <Box sx={{ px: 2, pt: 2 }}>
        <Paper
          variant="outlined"
          sx={{
            p: 1.5,
            bgcolor: 'grey.900',
            color: 'grey.100',
            fontFamily: 'monospace',
            fontSize: 12,
            maxHeight: 160,
            overflow: 'auto',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {events.join('\n') || 'Callback events will appear here.'}
        </Paper>
      </Box>

      {/* Messages */}
      <Box
        sx={{
          p: 2,
          minHeight: 200,
          maxHeight: 320,
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
        }}
      >
        {messages.length === 0 ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: 'center', mt: 6 }}
          >
            No messages yet.
          </Typography>
        ) : (
          messages.map((message) => {
            const isUser = message.role === 'user';
            return (
              <Box
                key={message.id}
                sx={{
                  display: 'flex',
                  justifyContent: isUser ? 'flex-end' : 'flex-start',
                }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    px: 2,
                    py: 1,
                    maxWidth: '80%',
                    bgcolor: isUser ? 'primary.main' : 'grey.100',
                    color: isUser ? 'primary.contrastText' : 'text.primary',
                    borderRadius: 3,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 700,
                      color: isUser ? 'primary.contrastText' : 'text.secondary',
                    }}
                  >
                    {message.author?.displayName ?? message.role}
                    {message.status ? ` · ${message.status}` : null}
                  </Typography>
                  {message.parts.map((part, index) => (
                    <Typography
                      variant="body2"
                      key={`${message.id}-${part.type}-${index}`}
                    >
                      {part.type === 'text' ? part.text : null}
                      {part.type.startsWith('data-') && 'data' in part
                        ? JSON.stringify(part.data, null, 2)
                        : null}
                    </Typography>
                  ))}
                </Paper>
              </Box>
            );
          })
        )}
      </Box>

      {/* Input */}
      <Stack
        direction="row"
        spacing={1}
        sx={{ px: 2, pb: 2, borderTop: 1, borderColor: 'divider', pt: 2 }}
      >
        <TextField
          fullWidth
          size="small"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              void sendMessage({
                conversationId: 'support',
                author: demoUsers.alice,
                parts: [{ type: 'text', text: draft }],
              });
            }
          }}
        />
        <Button
          variant="contained"
          disabled={isStreaming || draft.trim() === ''}
          onClick={() =>
            void sendMessage({
              conversationId: 'support',
              author: demoUsers.alice,
              parts: [{ type: 'text', text: draft }],
            })
          }
          sx={{ minWidth: 'auto', px: 2 }}
        >
          <SendRoundedIcon fontSize="small" />
        </Button>
      </Stack>

      {/* Scenario buttons */}
      <Stack direction="row" spacing={1} sx={{ px: 2, pb: 2, flexWrap: 'wrap' }}>
        <Button size="small" variant="outlined" onClick={() => setDraft('success')}>
          Success
        </Button>
        <Button size="small" variant="outlined" onClick={() => setDraft('slow')}>
          Slow stream
        </Button>
        <Button size="small" variant="outlined" onClick={() => setDraft('fail')}>
          Failure
        </Button>
        {messages
          .filter(
            (message) =>
              message.role === 'user' &&
              (message.status === 'error' || message.status === 'cancelled'),
          )
          .map((message) => (
            <Button
              key={message.id}
              size="small"
              variant="outlined"
              onClick={() => void retry(message.id)}
            >
              Retry
            </Button>
          ))}
      </Stack>
    </Paper>
  );
}
```

## Stream lifecycle

Every stream must follow this lifecycle:

1. **`start`** -- Begin a new assistant message. The runtime creates the message shell and sets its status to `'streaming'`.
2. **Content chunks** -- Text, reasoning, tool, source, file, or data chunks populate the message parts.
3. **`finish`** or **`abort`** -- Terminal chunk. `finish` marks the message as `'sent'`; `abort` marks it as `'cancelled'`.

If the stream closes without a terminal chunk, the runtime treats it as a disconnect (see [Error and disconnect handling](#error-and-disconnect-handling) below).

## Chunk types

### Lifecycle chunks

| Chunk type | Fields                       | Description                    |
| :--------- | :--------------------------- | :----------------------------- |
| `start`    | `messageId`                  | Begin a new assistant message  |
| `finish`   | `messageId`, `finishReason?` | Complete the assistant message |
| `abort`    | `messageId`                  | Cancel the assistant message   |

### Text chunks

| Chunk type   | Fields        | Description            |
| :----------- | :------------ | :--------------------- |
| `text-start` | `id`          | Begin a new text part  |
| `text-delta` | `id`, `delta` | Append text content    |
| `text-end`   | `id`          | Finalize the text part |

Text chunks create a `ChatTextMessagePart` in the message.
Multiple `text-delta` chunks are batched according to `streamFlushInterval` before being applied to the store.

### Reasoning chunks

| Chunk type        | Fields        | Description                 |
| :---------------- | :------------ | :-------------------------- |
| `reasoning-start` | `id`          | Begin a reasoning part      |
| `reasoning-delta` | `id`, `delta` | Append reasoning content    |
| `reasoning-end`   | `id`          | Finalize the reasoning part |

Reasoning chunks create a `ChatReasoningMessagePart`, useful for chain-of-thought or thinking trace displays.

### Tool chunks

| Chunk type              | Fields                                           | Description                   |
| :---------------------- | :----------------------------------------------- | :---------------------------- |
| `tool-input-start`      | `toolCallId`, `toolName`, `dynamic?`             | Begin a tool invocation       |
| `tool-input-delta`      | `toolCallId`, `inputTextDelta`                   | Stream tool input JSON        |
| `tool-input-available`  | `toolCallId`, `toolName`, `input`                | Tool input is fully available |
| `tool-input-error`      | `toolCallId`, `errorText`                        | Tool input parsing failed     |
| `tool-approval-request` | `toolCallId`, `toolName`, `input`, `approvalId?` | Request user approval         |
| `tool-output-available` | `toolCallId`, `output`, `preliminary?`           | Tool output is available      |
| `tool-output-error`     | `toolCallId`, `errorText`                        | Tool execution failed         |
| `tool-output-denied`    | `toolCallId`, `reason?`                          | User denied the tool call     |

The `toolInvocation.state` tracks the tool lifecycle: `'input-streaming'` -> `'input-available'` -> `'approval-requested'` -> `'output-available'` (or `'output-error'` / `'output-denied'`).

### Source, file, and data chunks

| Chunk type        | Fields                                 | Description           |
| :---------------- | :------------------------------------- | :-------------------- |
| `source-url`      | `sourceId`, `url`, `title?`            | URL-based source      |
| `source-document` | `sourceId`, `title?`, `text?`          | Document-based source |
| `file`            | `mediaType`, `url`, `filename?`, `id?` | Inline file           |
| `data-*`          | `type`, `data`, `id?`, `transient?`    | Custom data payload   |

Data chunks use a type that matches the `data-*` pattern (for example, `data-citations` or `data-summary`).
They create `ChatDataMessagePart` entries and also fire the `onData` callback.
If `transient` is `true`, the part is not persisted in the message.

### Step boundary chunks

| Chunk type    | Description                 |
| :------------ | :-------------------------- |
| `start-step`  | Begin a new processing step |
| `finish-step` | End the current step        |

Step chunks create `ChatStepStartMessagePart` entries, useful for showing multi-step agentic processing in the UI.

## Building a stream

When writing an adapter, construct a `ReadableStream` from an array of chunks:

```tsx
const adapter: ChatAdapter = {
  async sendMessage({ message }) {
    return new ReadableStream({
      start(controller) {
        controller.enqueue({ type: 'start', messageId: 'msg-1' });
        controller.enqueue({ type: 'text-start', id: 'text-1' });
        controller.enqueue({ type: 'text-delta', id: 'text-1', delta: 'Hello!' });
        controller.enqueue({ type: 'text-end', id: 'text-1' });
        controller.enqueue({ type: 'finish', messageId: 'msg-1' });
        controller.close();
      },
    });
  },
};
```

Or convert a server-sent event stream into chunks:

```tsx
async function fromSSE(
  url: string,
  signal: AbortSignal,
): Promise<ReadableStream<ChatMessageChunk>> {
  const response = await fetch(url, { signal });
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  return new ReadableStream({
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) {
        controller.close();
        return;
      }
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6).trim();
          if (data && data !== '[DONE]') {
            controller.enqueue(JSON.parse(data));
          }
        }
      }
    },
  });
}
```

## Stream envelopes

For deduplication and ordering, wrap chunks in a `ChatStreamEnvelope`:

```ts
interface ChatStreamEnvelope {
  eventId?: string; // unique event identifier for deduplication
  sequence?: number; // monotonic ordering number
  chunk: ChatMessageChunk;
}
```

The runtime accepts both raw `ChatMessageChunk` objects and enveloped chunks in the same stream.
Envelopes are useful for SSE-based transports where chunks might arrive out of order or be replayed.

## Flush interval

Rapid text and reasoning deltas are batched before being applied to the store.
The `streamFlushInterval` prop on `ChatBox` (or `ChatProvider`) controls the batching window.
The default is **16 ms** (approximately one frame at 60 fps).

```tsx
<ChatBox adapter={adapter} streamFlushInterval={32} />
```

:::info
Lower values mean faster visual updates but more store mutations.
Higher values reduce mutation frequency at the cost of perceived latency.
:::

## Stopping and cancelling streams

The `sendMessage` input includes an `AbortSignal` that fires when the user clicks the stop button.
Pass it to your `fetch` call so the HTTP request is cancelled automatically:

```tsx
async sendMessage({ message, signal }) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ message }),
    signal, // browser cancels the request when the user stops
  });
  return res.body!;
},
```

If your backend requires explicit cancellation (for example, sending a separate cancel request), implement the optional `stop()` method on the adapter alongside the signal:

```tsx
stop() {
  fetch('/api/chat/cancel', { method: 'POST' });
},
```

You can also stop streaming programmatically using the `useChat` hook:

```tsx
const { stopStreaming } = useChat();

// Cancel the active stream
stopStreaming();
```

## Reconnecting to streams

Implement the adapter's `reconnectToStream()` method to resume an interrupted stream -- for example, when an SSE connection drops mid-response:

```tsx
async reconnectToStream({ conversationId, messageId, signal }) {
  const res = await fetch('/api/chat/reconnect', {
    method: 'POST',
    body: JSON.stringify({ conversationId, messageId }),
    signal,
  });
  if (res.status === 404) return null; // message no longer resumable
  return res.body!;
},
```

Return `null` if the interrupted message cannot be resumed.
The runtime calls `reconnectToStream()` automatically after detecting a disconnected stream.

## Error and disconnect handling

If the stream closes without a terminal chunk (`finish` or `abort`), the runtime:

1. Records a recoverable stream error.
2. Sets the message status to `'error'`.
3. Calls `onError` and `onFinish` with `isDisconnect: true`.
4. If `reconnectToStream()` is implemented, attempts to resume.

If the adapter's `sendMessage()` throws, the runtime records a send error and surfaces it through the error model.
See [Error handling](/x/react-chat/behavior/error-handling/) for more details.

## How chunks become message parts

The stream processor maps chunks to `ChatMessagePart` entries:

1. `text-start` creates a new `ChatTextMessagePart` with `state: 'streaming'`.
2. `text-delta` appends to the existing text part.
3. `text-end` sets `state: 'done'`.
4. Tool chunks follow a similar lifecycle, updating `toolInvocation.state` through each phase.
5. Source, file, and data chunks each create their corresponding part type immediately.
6. `start-step` creates a `ChatStepStartMessagePart` separator.

The message's `status` field also updates through the stream:

- `'sending'` -- set when the user message is optimistically added
- `'streaming'` -- set when `start` arrives
- `'sent'` -- set when `finish` arrives
- `'cancelled'` -- set when `abort` arrives
- `'error'` -- set when the stream fails

## API

- [`ChatBox`](/x/api/chat/chat-box/)

## See also

- [Adapter](/x/react-chat/backend/adapters/) for the adapter interface that produces streams.
- [Error handling](/x/react-chat/behavior/error-handling/) for error model and recovery.
- [Scrolling](/x/react-chat/behavior/scrolling/) for how auto-scroll follows streaming content.
