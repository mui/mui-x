---
title: Chat - Minimal headless chat
productId: x-chat
packageName: '@mui/x-chat/headless'
githubLabel: 'scope: chat'
---

# Minimal headless chat

<p class="description">Start with the smallest working <code>ChatProvider</code> and <code>useChat()</code> setup.</p>

## What this example shows

This recipe keeps the UI intentionally small to demonstrate the core headless pattern:

- `ChatProvider` owns the runtime and wraps your component tree
- `useChat()` reads messages and streaming state in one call
- a plain input and button trigger `sendMessage()`
- the assistant response streams back through the adapter

Everything else — layout, styling, message rendering — is plain React with no framework opinions.

## Key concepts

### Defining an adapter

The adapter is the only required prop on `ChatProvider`.
At minimum, it implements `sendMessage()` and returns a `ReadableStream` of chunks:

```tsx
const adapter: ChatAdapter = {
  async sendMessage({ message }) {
    return createChunkStream(
      createTextResponseChunks(
        `response-${message.id}`,
        `You said: "${getMessageText(message)}".`,
      ),
      { delayMs: 220 },
    );
  },
};
```

### Wiring `ChatProvider`

Wrap your component tree with `ChatProvider` and pass the adapter:

```tsx
<ChatProvider adapter={adapter} defaultActiveConversationId="support">
  <MinimalChatInner />
</ChatProvider>
```

`defaultActiveConversationId` sets the initial conversation without requiring controlled state.

### Reading state with `useChat()`

Inside `ChatProvider`, call `useChat()` to get messages, streaming state, and actions:

```tsx
const { messages, sendMessage, isStreaming } = useChat();
```

```tsx
import * as React from 'react';
import { ChatProvider, useChat, type ChatAdapter } from '@mui/x-chat/headless';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { demoUsers } from '../shared/demoData';
import {
  createChunkStream,
  createTextResponseChunks,
  getMessageText,
} from '../shared/demoUtils';

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
    <ChatProvider adapter={adapter} defaultActiveConversationId="support">
      <MinimalChatInner />
    </ChatProvider>
  );
}

```

## Key takeaways

- The adapter is the only backend integration point — the runtime handles everything else
- `useChat()` provides both state and actions in a single hook
- No CSS, no components, no design system required — headless is pure runtime

## Next steps

- [Hooks](/x/react-chat/headless/hooks/) for the full hook API reference
- [Adapters](/x/react-chat/headless/adapters/) for writing real adapters
- [Controlled state](/x/react-chat/headless/examples/controlled-state/) for owning state externally
- [Selector-driven thread](/x/react-chat/headless/examples/selector-driven-thread/) for efficient large threads
