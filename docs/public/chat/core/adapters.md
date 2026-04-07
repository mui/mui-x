---
productId: x-chat
title: Chat - Core adapters
packageName: '@mui/x-chat-headless'
githubLabel: 'scope: chat'
---

# Chat - Core adapters

<p class="description">Write a <code>ChatAdapter</code> to connect the core runtime to any backend — HTTP, SSE, WebSocket, or AI SDK.</p>

The `ChatAdapter` interface is the transport boundary between the core runtime and your backend.
Only one method is required: `sendMessage()`.
Everything else is optional and incrementally adopted.

```tsx
import type { ChatAdapter } from '@mui/x-chat-headless';
```

The following demo shows a minimal adapter in action:

```tsx
import * as React from 'react';
import { ChatProvider, useChat, type ChatAdapter } from '@mui/x-chat-headless';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
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

const adapter: ChatAdapter = {
  async sendMessage({ message }) {
    return createChunkStream(
      createTextResponseChunks(
        `minimal-assistant-${message.id}`,
        `You said: "${getMessageText(message)}". This response came from a streamed headless adapter.`,
      ),
      { delayMs: 220 },
    );
  },
};

function MinimalChatInner() {
  const { messages, sendMessage, isStreaming } = useChat();
  const [draft, setDraft] = React.useState('Show me the smallest working chat.');
  const listRef = React.useRef<HTMLDivElement>(null);

  const submit = React.useCallback(async () => {
    if (draft.trim() === '') {
      return;
    }

    await sendMessage({
      conversationId: 'support',
      author: demoUsers.alice,
      parts: [{ type: 'text', text: draft }],
    });

    setDraft('');
  }, [draft, sendMessage]);

  React.useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

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
          Minimal headless chat
        </Typography>
        <Chip
          size="small"
          label={isStreaming ? 'Streaming…' : 'Idle'}
          color={isStreaming ? 'primary' : 'default'}
          variant="outlined"
        />
      </Box>

      {/* Messages */}
      <Box
        ref={listRef}
        sx={{
          p: 2,
          minHeight: 300,
          maxHeight: 400,
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
            sx={{ textAlign: 'center', mt: 8 }}
          >
            Send the first message to start the thread.
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
                  </Typography>
                  {message.parts.map((part, index) => (
                    <Typography
                      variant="body2"
                      key={`${message.id}-${part.type}-${index}`}
                    >
                      {part.type === 'text' ? part.text : null}
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
        sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Type a message…"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              submit();
            }
          }}
        />
        <Button
          variant="contained"
          disabled={isStreaming || draft.trim() === ''}
          onClick={submit}
          sx={{ minWidth: 'auto', px: 2 }}
        >
          <SendRoundedIcon fontSize="small" />
        </Button>
      </Stack>
    </Paper>
  );
}

export default function MinimalHeadlessChat() {
  return (
    <ChatProvider adapter={adapter} initialActiveConversationId="support">
      <MinimalChatInner />
    </ChatProvider>
  );
}
```

## Minimal adapter

The smallest working adapter returns a `ReadableStream` of chunks from `sendMessage()`:

```tsx
const adapter: ChatAdapter = {
  async sendMessage({ message }) {
    return new ReadableStream({
      start(controller) {
        controller.enqueue({ type: 'start', messageId: 'response-1' });
        controller.enqueue({ type: 'text-start', id: 'text-1' });
        controller.enqueue({ type: 'text-delta', id: 'text-1', delta: 'Hello!' });
        controller.enqueue({ type: 'text-end', id: 'text-1' });
        controller.enqueue({ type: 'finish', messageId: 'response-1' });
        controller.close();
      },
    });
  },
};
```

That is enough for `ChatProvider` to handle streaming, message normalization, and state updates.

## Full interface reference

```ts
interface ChatAdapter<Cursor = string> {
  // Required
  sendMessage(
    input: ChatSendMessageInput,
  ): Promise<ReadableStream<ChatMessageChunk | ChatStreamEnvelope>>;

  // Optional
  listConversations?(
    input?: ChatListConversationsInput<Cursor>,
  ): Promise<ChatListConversationsResult<Cursor>>;
  listMessages?(
    input: ChatListMessagesInput<Cursor>,
  ): Promise<ChatListMessagesResult<Cursor>>;
  reconnectToStream?(
    input: ChatReconnectToStreamInput,
  ): Promise<ReadableStream<ChatMessageChunk | ChatStreamEnvelope> | null>;
  setTyping?(input: ChatSetTypingInput): Promise<void>;
  markRead?(input: ChatMarkReadInput): Promise<void>;
  subscribe?(
    input: ChatSubscribeInput,
  ): Promise<ChatSubscriptionCleanup> | ChatSubscriptionCleanup;
  loadMore?(cursor?: Cursor): Promise<ChatLoadMoreResult<Cursor>>;
  addToolApprovalResponse?(input: ChatAddToolApproveResponseInput): Promise<void>;
  stop?(): void;
}
```

## Method reference

### `sendMessage(input)` (required)

Sends a user message and returns a readable stream of response chunks.

```ts
interface ChatSendMessageInput {
  conversationId?: string; // target conversation
  message: ChatMessage; // the user message being sent
  messages: ChatMessage[]; // full thread context
  attachments?: ChatDraftAttachment[]; // file attachments
  metadata?: Record<string, unknown>; // extra context
  signal: AbortSignal; // cancellation signal
}
```

The `signal` is connected to `stopStreaming()` — when the user cancels, the signal aborts, giving your adapter a chance to clean up.

### `listConversations(input?)`

Loads the conversation list, typically called on mount.

```ts
interface ChatListConversationsInput<Cursor> {
  cursor?: Cursor; // pagination cursor
  query?: string; // search filter
}

interface ChatListConversationsResult<Cursor> {
  conversations: ChatConversation[];
  cursor?: Cursor; // next page cursor
  hasMore?: boolean; // whether more pages exist
}
```

### `listMessages(input)`

Loads messages for a conversation, called when `activeConversationId` changes.

```ts
interface ChatListMessagesInput<Cursor> {
  conversationId: string;
  cursor?: Cursor;
  direction?: PaginationDirection; // 'forward' | 'backward'
}

interface ChatListMessagesResult<Cursor> {
  messages: ChatMessage[];
  cursor?: Cursor;
  hasMore?: boolean;
}
```

### `reconnectToStream(input)`

Resumes an interrupted stream, for example after an SSE disconnect.

```ts
interface ChatReconnectToStreamInput {
  conversationId?: string;
  messageId?: string;
  signal: AbortSignal;
}
```

Returns `null` if reconnection is not possible.

### `setTyping(input)`

Sends a typing indicator to the backend.

```ts
interface ChatSetTypingInput {
  conversationId: string;
  isTyping: boolean;
}
```

### `markRead(input)`

Marks a conversation or specific message as read.

```ts
interface ChatMarkReadInput {
  conversationId: string;
  messageId?: string; // mark up to this message
}
```

### `subscribe(input)`

Starts a realtime subscription.
Called on mount, returns a cleanup function called on unmount.

```ts
interface ChatSubscribeInput {
  onEvent: (event: ChatRealtimeEvent) => void;
}

type ChatSubscriptionCleanup = () => void;
```

### `loadMore(cursor?)`

Loads older messages for the current conversation using a pagination cursor.

```ts
interface ChatLoadMoreResult<Cursor> {
  messages: ChatMessage[];
  cursor?: Cursor;
  hasMore?: boolean;
}
```

### `addToolApprovalResponse(input)`

Sends a tool approval decision back to the backend.

```ts
interface ChatAddToolApproveResponseInput {
  id: string; // the approval request ID
  approved: boolean; // whether the tool call is approved
  reason?: string; // optional reason for denial
}
```

### `stop()`

Called alongside the abort signal when the user stops streaming.
Use this for server-side cleanup that goes beyond closing the stream.

## Cursor generics

`ChatAdapter<Cursor>` is generic over the pagination cursor type.
The default is `string`, but you can use any type your backend requires:

```ts
interface MyCursor {
  page: number;
  token: string;
}

const adapter: ChatAdapter<MyCursor> = {
  async sendMessage(input) {
    /* ... */
  },
  async listMessages({ cursor }) {
    // cursor is typed as MyCursor | undefined
    const page = cursor?.page ?? 1;
    // ...
  },
};
```

The cursor type flows through `ChatProvider`, store, hooks, and all adapter input/output types.

## Write your first adapter

### Step 1: Echo adapter

Start with a basic adapter that echoes user messages:

```tsx
const adapter: ChatAdapter = {
  async sendMessage({ message }) {
    const text = message.parts
      .filter((p) => p.type === 'text')
      .map((p) => p.text)
      .join('');

    return new ReadableStream({
      start(controller) {
        const id = `response-${message.id}`;
        controller.enqueue({ type: 'start', messageId: id });
        controller.enqueue({ type: 'text-start', id: 'text-1' });
        controller.enqueue({
          type: 'text-delta',
          id: 'text-1',
          delta: `You said: "${text}"`,
        });
        controller.enqueue({ type: 'text-end', id: 'text-1' });
        controller.enqueue({ type: 'finish', messageId: id });
        controller.close();
      },
    });
  },
};
```

### Step 2: Add history

Implement `listConversations()` and `listMessages()` to load initial data:

```tsx
const adapter: ChatAdapter = {
  async sendMessage(input) {
    /* ... */
  },

  async listConversations() {
    const res = await fetch('/api/conversations');
    const conversations = await res.json();
    return { conversations };
  },

  async listMessages({ conversationId, cursor }) {
    const res = await fetch(
      `/api/conversations/${conversationId}/messages?cursor=${cursor ?? ''}`,
    );
    const { messages, nextCursor, hasMore } = await res.json();
    return { messages, cursor: nextCursor, hasMore };
  },
};
```

### Step 3: Add realtime

Implement `subscribe()` for push updates:

```tsx
const adapter: ChatAdapter = {
  async sendMessage(input) {
    /* ... */
  },

  subscribe({ onEvent }) {
    const ws = new WebSocket('/api/ws');
    ws.onmessage = (e) => onEvent(JSON.parse(e.data));
    return () => ws.close();
  },
};
```

### Step 4: Add cancellation

Implement `stop()` for server-side cleanup:

```tsx
const adapter: ChatAdapter = {
  async sendMessage({ signal }) {
    // signal.aborted is checked by the runtime
    // ...
  },

  stop() {
    fetch('/api/cancel', { method: 'POST' });
  },
};
```

## Error handling

When an adapter method throws, the runtime:

1. Records a `ChatError` with the appropriate `source` field (`'send'`, `'history'`, or `'adapter'`).
2. Surfaces the error through `useChat().error`, `useChatStatus().error`, and the `onError` callback.
3. Sets `recoverable` based on the error type — stream disconnects are typically recoverable, while send failures may be retryable.

:::info
You do not need to catch errors inside adapter methods — the runtime handles them for you. When an adapter method throws, the runtime records a `ChatError`, surfaces it through the UI and callbacks, and marks it recoverable or retryable when applicable.
:::

## See also

- [Streaming](/x/react-chat/core/streaming/) for the full stream chunk protocol.
- [Realtime](/x/react-chat/core/realtime/) for the event types used by `subscribe()`.
- [Hooks](/x/react-chat/core/hooks/) for the runtime actions that trigger adapter methods.
- [Minimal core chat](/x/react-chat/core/examples/minimal-chat/) for the smallest working adapter.
- [Conversation history](/x/react-chat/core/examples/conversation-history/) for adapter-driven history loading.

## API

- [ChatRoot](/x/api/chat/chat-root/)
