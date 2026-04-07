---
productId: x-chat
title: Chat - State and store
packageName: '@mui/x-chat-headless'
githubLabel: 'scope: chat'
---

# Chat - State and store

<p class="description">Configure the runtime via <code>ChatProvider</code> props, choose controlled or uncontrolled state, and explore the normalized store.</p>

`ChatProvider` is the single entry point for the core runtime.
It creates the chat store, wires the adapter, and makes hooks and selectors available to every descendant component.

The following demo shows controlled state in action:

```tsx
import * as React from 'react';
import {
  ChatProvider,
  useChat,
  useChatComposer,
  type ChatAdapter,
  type ChatConversation,
  type ChatMessage,
} from '@mui/x-chat-headless';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import {
  cloneConversations,
  cloneMessages,
  demoConversations,
  demoThreads,
  demoUsers,
} from 'docsx/data/chat/core/examples/shared/demoData';
import {
  createChunkStream,
  createTextResponseChunks,
  getMessageText,
} from 'docsx/data/chat/core/examples/shared/demoUtils';

function ControlledStateChat({
  activeConversationId,
}: {
  activeConversationId?: string;
}) {
  const { messages, conversations, setActiveConversation } = useChat();
  const composer = useChatComposer();
  const listRef = React.useRef<HTMLDivElement>(null);

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
          Controlled headless state
        </Typography>
        <Chip
          size="small"
          label={activeConversationId ?? 'none'}
          color="primary"
          variant="outlined"
        />
      </Box>

      {/* Conversation selector */}
      <Stack
        direction="row"
        spacing={1}
        sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}
      >
        {conversations.map((conversation) => (
          <Chip
            key={conversation.id}
            label={conversation.title}
            variant={
              conversation.id === activeConversationId ? 'filled' : 'outlined'
            }
            color={conversation.id === activeConversationId ? 'primary' : 'default'}
            onClick={() => {
              void setActiveConversation(conversation.id);
            }}
          />
        ))}
      </Stack>

      {/* Stats */}
      <Stack
        direction="row"
        spacing={1}
        sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}
      >
        {[
          { label: 'Messages', value: messages.length },
          { label: 'Conversations', value: conversations.length },
          { label: 'Active', value: activeConversationId ?? 'none' },
          { label: 'Composer', value: composer.value || 'empty' },
        ].map((stat) => (
          <Paper
            key={stat.label}
            variant="outlined"
            sx={{ px: 1.5, py: 0.75, flex: 1, textAlign: 'center' }}
          >
            <Typography variant="caption" color="text.secondary">
              {stat.label}
            </Typography>
            <Typography variant="body2" fontWeight={700} noWrap>
              {stat.value}
            </Typography>
          </Paper>
        ))}
      </Stack>

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
            Switch conversations to load controlled messages.
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
          placeholder="The composer is controlled from the parent"
          value={composer.value}
          onChange={(event) => composer.setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              void composer.submit();
            }
          }}
        />
        <Button
          variant="contained"
          disabled={composer.isSubmitting || composer.value.trim() === ''}
          onClick={() => {
            void composer.submit();
          }}
          sx={{ minWidth: 'auto', px: 2 }}
        >
          <SendRoundedIcon fontSize="small" />
        </Button>
      </Stack>
    </Paper>
  );
}

export default function ControlledStateHeadlessChat() {
  const allConversations = React.useMemo(
    () => cloneConversations(demoConversations.slice(0, 2)),
    [],
  );
  const [conversations, setConversations] =
    React.useState<ChatConversation[]>(allConversations);
  const [activeConversationId, setActiveConversationId] = React.useState<
    string | undefined
  >('product');
  const [composerValue, setComposerValue] = React.useState(
    'Document the controlled models.',
  );
  const [messagesByConversation, setMessagesByConversation] = React.useState<
    Record<string, ChatMessage[]>
  >({
    support: cloneMessages(demoThreads.support),
    product: cloneMessages(demoThreads.product),
  });

  const messages = activeConversationId
    ? (messagesByConversation[activeConversationId] ?? [])
    : [];

  const adapter = React.useMemo<ChatAdapter>(
    () => ({
      async sendMessage({ conversationId: _conversationId, message }) {
        return createChunkStream(
          createTextResponseChunks(
            `controlled-${message.id}`,
            `Controlled state still streams through the normalized runtime: "${getMessageText(message)}".`,
          ),
          { delayMs: 160 },
        );
      },
    }),
    [],
  );

  return (
    <ChatProvider
      adapter={adapter}
      conversations={conversations}
      onConversationsChange={setConversations}
      activeConversationId={activeConversationId}
      onActiveConversationChange={setActiveConversationId}
      messages={messages}
      onMessagesChange={(nextMessages) => {
        setMessagesByConversation((previous) => ({
          ...previous,
          [activeConversationId ?? 'support']: nextMessages.map((message) => ({
            ...message,
            author:
              message.author ??
              (message.role === 'user' ? demoUsers.sam : demoUsers.agent),
          })),
        }));
      }}
      composerValue={composerValue}
      onComposerValueChange={setComposerValue}
    >
      <ControlledStateChat activeConversationId={activeConversationId} />
    </ChatProvider>
  );
}
```

## `ChatProvider` props

### Required

| Prop       | Type                  | Description           |
| :--------- | :-------------------- | :-------------------- |
| `adapter`  | `ChatAdapter<Cursor>` | The transport adapter |
| `children` | `React.ReactNode`     | Your UI tree          |

### Controlled and uncontrolled state

Each public state model supports both controlled and uncontrolled modes.
Use `default*` props to let the runtime own the value, or pass the value directly to control it from React state.

:::info
Start with `initial*` (uncontrolled) props during prototyping, then switch to controlled props when you need to sync with external state. You can switch modes at any time without changing the runtime model.
:::

| Model               | Controlled prop        | Default prop                  | Change callback              |
| :------------------ | :--------------------- | :---------------------------- | :--------------------------- |
| Messages            | `messages`             | `initialMessages`             | `onMessagesChange`           |
| Conversations       | `conversations`        | `initialConversations`        | `onConversationsChange`      |
| Active conversation | `activeConversationId` | `initialActiveConversationId` | `onActiveConversationChange` |
| Composer value      | `composerValue`        | `initialComposerValue`        | `onComposerValueChange`      |

### Callbacks

| Prop         | Type                                       | Description                                     |
| :----------- | :----------------------------------------- | :---------------------------------------------- |
| `onToolCall` | `(payload: ChatOnToolCallPayload) => void` | Called when a tool invocation state changes     |
| `onFinish`   | `(payload: ChatOnFinishPayload) => void`   | Called when a stream finishes, aborts, or fails |
| `onData`     | `(part: ChatDataMessagePart) => void`      | Called when a `data-*` chunk arrives            |
| `onError`    | `(error: ChatError) => void`               | Called when any runtime error surfaces          |

### Configuration

| Prop                  | Type                   | Default     | Description                                 |
| :-------------------- | :--------------------- | :---------- | :------------------------------------------ |
| `streamFlushInterval` | `number`               | `16`        | Milliseconds between batched delta flushes  |
| `partRenderers`       | `ChatPartRendererMap`  | `{}`        | Custom renderers for message part types     |
| `storeClass`          | `ChatStoreConstructor` | `ChatStore` | Custom store class for advanced subclassing |

## Controlled vs uncontrolled

### Start uncontrolled

When prototyping or when the runtime can own the data, use `default*` props:

```tsx
<ChatProvider
  adapter={adapter}
  initialActiveConversationId="support"
  initialMessages={initialMessages}
>
  <MyChat />
</ChatProvider>
```

The runtime manages the state internally and feeds it to hooks automatically.

### Move to controlled

When you need to own the data externally — for example, to sync with a global store or persist across navigation — pass the state directly:

```tsx
const [messages, setMessages] = React.useState<ChatMessage[]>([]);
const [activeId, setActiveId] = React.useState<string | undefined>('support');

<ChatProvider
  adapter={adapter}
  messages={messages}
  onMessagesChange={setMessages}
  activeConversationId={activeId}
  onActiveConversationChange={setActiveId}
>
  <MyChat />
</ChatProvider>;
```

The runtime still streams, normalizes, and derives selectors — you just own the source of truth.

You can switch from uncontrolled to controlled at any time without changing the runtime model.

## Normalized internal state

The store keeps data in a normalized shape for efficient streaming and updates:

| Internal field                | Type                                      | Description                                  |
| :---------------------------- | :---------------------------------------- | :------------------------------------------- |
| `messageIds`                  | `string[]`                                | Ordered message IDs                          |
| `messagesById`                | `Record<string, ChatMessage>`             | Message records by ID                        |
| `conversationIds`             | `string[]`                                | Ordered conversation IDs                     |
| `conversationsById`           | `Record<string, ChatConversation>`        | Conversation records by ID                   |
| `activeConversationId`        | `string \| undefined`                     | Active conversation                          |
| `typingByConversation`        | `Record<string, Record<string, boolean>>` | Typing state per conversation per user       |
| `isStreaming`                 | `boolean`                                 | Whether a stream is active                   |
| `hasMoreHistory`              | `boolean`                                 | Whether more history is available            |
| `historyCursor`               | `Cursor \| undefined`                     | Pagination cursor for history loading        |
| `composerValue`               | `string`                                  | Current draft text                           |
| `composerIsComposing`         | `boolean`                                 | Whether an IME composition session is active |
| `composerAttachments`         | `ChatDraftAttachment[]`                   | File attachments in the draft                |
| `error`                       | `ChatError \| null`                       | Current error state                          |
| `activeStreamAbortController` | `AbortController \| null`                 | Controller for aborting the active stream    |

This normalization is why streaming updates are efficient — updating one message does not require rebuilding the entire thread array.

## Error model

Runtime errors use the `ChatError` type:

```ts
interface ChatError {
  code: string; // machine-readable error code
  message: string; // human-readable description
  source: ChatErrorSource; // where the error originated
  recoverable: boolean; // whether the runtime can continue
  retryable?: boolean; // whether the failed operation can be retried
  details?: Record<string, unknown>; // additional context
}

type ChatErrorSource = 'send' | 'stream' | 'history' | 'render' | 'adapter';
```

Errors surface through:

- `useChat().error`
- `useChatStatus().error`
- `onError` callback on `ChatProvider`

## Callbacks

### `onToolCall`

Fires when a tool invocation state changes during streaming.
Use it for side effects outside the message list — logging, analytics, or triggering external workflows.

```ts
interface ChatOnToolCallPayload {
  toolCall: ChatToolInvocation | ChatDynamicToolInvocation;
}
```

### `onFinish`

Fires when a stream reaches a terminal state (success, abort, disconnect, or error).

```ts
interface ChatOnFinishPayload {
  message: ChatMessage; // the assistant message
  messages: ChatMessage[]; // all messages after the stream
  isAbort: boolean; // user stopped the stream
  isDisconnect: boolean; // stream disconnected unexpectedly
  isError: boolean; // stream ended with an error
  finishReason?: string; // backend-provided reason
}
```

### `onData`

Fires when a `data-*` chunk arrives.
Use it for transient data that should trigger app-level side effects without being persisted in the message.

## Part renderer registration

Register custom renderers for message part types through the `partRenderers` prop:

```tsx
const renderers: ChatPartRendererMap = {
  'ticket-summary': ({ part }) => <div>Ticket: {part.ticketId}</div>,
};

<ChatProvider adapter={adapter} partRenderers={renderers}>
  <MyChat />
</ChatProvider>;
```

Registered renderers are available through `useChatPartRenderer(partType)` inside any descendant component.

## Custom store class

For advanced use cases, pass a custom store class via the `storeClass` prop.
The class must satisfy `ChatStoreConstructor<Cursor>`:

```ts
interface ChatStoreConstructor<Cursor = string> {
  new (parameters: ChatStoreParameters<Cursor>): ChatStore<Cursor>;
}
```

Use this when you need to override internal normalization, add computed state, or integrate with an external store.

## See also

- [Hooks](/x/react-chat/core/hooks/) for the full hook API reference.
- [Selectors](/x/react-chat/core/selectors/) for store selectors and advanced subscriptions.
- [Controlled state](/x/react-chat/core/examples/controlled-state/) for the controlled model pattern in action.
- [Streaming lifecycle](/x/react-chat/core/examples/streaming-lifecycle/) for send, stream, stop, and retry callbacks.

## API

- [ChatRoot](/x/api/chat/chat-root/)
