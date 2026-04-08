---
productId: x-chat
title: Chat - Core
packageName: '@mui/x-chat-headless'
githubLabel: 'scope: chat'
---

# Chat - Core

Runtime, adapter contract, hooks, selectors, and stream processing for building fully custom chat UIs.

`@mui/x-chat-headless` is the runtime-focused layer in the chat package family.
It gives you chat state, streaming, adapters, selectors, and composer logic without imposing any rendered UI.

## Where core fits

Use the core layer when you want chat behavior but you want to own the markup, layout, styling, and interaction model yourself.

Core owns:

- the normalized chat store
- controlled and uncontrolled state models
- adapter-driven message sending and history loading
- stream processing and runtime callbacks
- realtime subscriptions and presence/read updates
- selector-friendly hooks for render-sensitive trees
- composer state, attachments, and submit behavior
- typed message-part and stream contracts

Core does not own:

- semantic DOM structure
- default rendering for message parts
- visual slots or compound components
- Material UI theming or styling

Those concerns belong to [Headless](/x/react-chat/headless/).

## Mental model

The following demo shows the core runtime with a minimal custom UI:

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
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
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

The runtime is easiest to understand as a pipeline:

1. `ChatProvider` creates the store and runtime actions.
2. Your `ChatAdapter` talks to the backend and returns streams.
3. `processStream` turns chunks into normalized message updates.
4. Hooks and selectors read the store at the granularity your UI needs.
5. Your components render plain React, headless primitives, or your own design system.

```tsx
<ChatProvider adapter={adapter}>
  <YourCustomChatUI />
</ChatProvider>
```

The main public surface is:

```tsx
import {
  ChatProvider,
  chatSelectors,
  useChat,
  useChatComposer,
  useChatPartRenderer,
  useChatStatus,
  useChatStore,
  useConversation,
  useConversations,
  useMessage,
  useMessageIds,
} from '@mui/x-chat-headless';
```

## State and store

`ChatProvider` supports both controlled and uncontrolled state for messages, conversations, active conversation ID, and composer value.
Internally the store normalizes data into ID arrays and record maps, making streaming updates efficient and selector subscriptions granular.

See [State and store](/x/react-chat/core/state/) for the full `ChatProvider` props reference, the controlled/uncontrolled model, error model, callbacks, and store internals.

## Hooks

Nine public hooks cover the full spectrum from all-in-one orchestration (`useChat()`) to row-level subscriptions (`useMessageIds()` + `useMessage(id)`).

Narrower hooks like `useChatComposer()`, `useChatStatus()`, and `useChatPartRenderer()` handle specific concerns without subscribing to unrelated state.

See [Hooks](/x/react-chat/core/hooks/) for signatures, return types, and when-to-use guidance for every hook.

## Selectors

`chatSelectors` provides memoized selectors for the normalized store.
Use them directly with `useChatStore()` for custom derived values and advanced subscriptions.

See [Selectors](/x/react-chat/core/selectors/) for the full selector table and usage patterns.

## Adapter contract

`ChatAdapter` is the transport boundary between the runtime and your backend.
Only `sendMessage()` is required — everything else is optional and incrementally adopted.
The adapter works with HTTP, SSE, WebSocket, or AI SDK-style streaming backends.

See [Adapters](/x/react-chat/core/adapters/) for the full interface reference, a step-by-step writing guide, and backend pattern guidance.

## Streaming

The adapter returns a `ReadableStream` of typed chunks.
The runtime processes text, reasoning, tool, source, file, data, step, and metadata chunks into normalized message parts.
`streamFlushInterval` batches rapid deltas for efficient store updates.

See [Streaming](/x/react-chat/core/streaming/) for the chunk protocol reference, envelope format, and stream construction patterns.

## Realtime

The adapter's `subscribe()` method enables push-based updates for messages, conversations, typing indicators, presence, and read state.
The runtime manages the subscription lifecycle on mount and unmount.

See [Realtime](/x/react-chat/core/realtime/) for event types, store effects, and consumption patterns.

## Type augmentation

Module augmentation lets you add app-specific metadata, typed tool definitions, typed `data-*` payloads, and custom message parts.
Types flow through the entire stack at compile time — no provider props needed.

See [Type augmentation](/x/react-chat/core/types/) for the six registry interfaces, a step-by-step guide, and an end-to-end example.

## Core examples

The core examples are organized as demos.
Move from the smallest setup to the more specialized runtime patterns:

- [Core examples overview](/x/react-chat/core/examples/)
- [Minimal core chat](/x/react-chat/core/examples/minimal-chat/)
- [Controlled state](/x/react-chat/core/examples/controlled-state/)
- [Selector-driven thread](/x/react-chat/core/examples/selector-driven-thread/)
- [Conversation history](/x/react-chat/core/examples/conversation-history/)
- [Composer](/x/react-chat/core/examples/composer/)
- [Message parts](/x/react-chat/core/examples/message-parts/)
- [Streaming lifecycle](/x/react-chat/core/examples/streaming-lifecycle/)
- [Realtime](/x/react-chat/core/examples/realtime/)
- [Realtime thread sync](/x/react-chat/core/examples/realtime-thread-sync/)
- [Tool call events](/x/react-chat/core/examples/tool-call-events/)
- [Type augmentation](/x/react-chat/core/examples/type-augmentation/)
- [Tool approval and renderers](/x/react-chat/core/examples/tool-approval-and-renderers/)
- [Advanced store access](/x/react-chat/core/examples/advanced-store-access/)

## Scope boundary

- Stay on core when you want runtime primitives and complete control over UI.
- Move to [Headless](/x/react-chat/headless/) when you want structure and composition primitives.

## API

- [ChatRoot](/x/api/chat/chat-root/)
