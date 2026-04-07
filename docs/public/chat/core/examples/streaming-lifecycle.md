---
title: Chat - Streaming lifecycle
productId: x-chat
packageName: '@mui/x-chat-headless'
githubLabel: 'scope: chat'
---

# Chat - Streaming lifecycle

Observe the full runtime lifecycle for send, stream, stop, error, retry, and callbacks.

This demo brings the runtime lifecycle together in one place.
It intentionally exposes success, failure, and long-running stream modes so you can observe every lifecycle phase:

- `sendMessage()` — send a user turn and start streaming
- `stopStreaming()` — cancel an active stream
- `retry()` — retry a failed or cancelled message
- `onData` — fires when a `data-*` chunk arrives
- `onFinish` — fires when the stream ends (success, abort, or error)
- `onError` — fires on any runtime error

## Key concepts

### The send-stream flow

When `sendMessage()` is called:

1. The user message is added optimistically with `status: 'sending'`
2. The adapter's `sendMessage()` returns a `ReadableStream`
3. Chunks update the assistant message in real time
4. A `finish` chunk completes the turn — user message moves to `status: 'sent'`

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

```tsx
import * as React from 'react';
import {
  ChatProvider,
  useChat,
  type ChatAdapter,
  type ChatDataMessagePart,
} from '@mui/x-chat-headless';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { demoUsers } from 'docsx/data/chat/core/examples/shared/demoData';
import {
  createChunkStream,
  createTextResponseChunks,
  getMessageText,
} from 'docsx/data/chat/core/examples/shared/demoUtils';

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
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
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
