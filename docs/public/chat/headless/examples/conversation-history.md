---
title: Chat - Conversation history
productId: x-chat
packageName: '@mui/x-chat/headless'
githubLabel: 'scope: chat'
---

# Conversation history

Use adapter-driven conversations, thread loading, and history paging without any structural UI components.

## What this example shows

This recipe covers the full conversation lifecycle through the adapter:

- loading the conversation list on mount
- loading messages when the active conversation changes
- paging through older history
- sending follow-up messages within a loaded thread

The UI is a plain inbox-and-thread shell built only with React elements and runtime hooks.

## Key concepts

### Adapter methods for history

Two optional adapter methods enable conversation orchestration:

```tsx
const adapter: ChatAdapter = {
  async listConversations() {
    // Called on mount — returns the conversation list
    const res = await fetch('/api/conversations');
    return { conversations: await res.json() };
  },

  async listMessages({ conversationId, cursor }) {
    // Called when activeConversationId changes — returns thread messages
    const res = await fetch(`/api/threads/${conversationId}?cursor=${cursor ?? ''}`);
    const { messages, nextCursor, hasMore } = await res.json();
    return { messages, cursor: nextCursor, hasMore };
  },

  async sendMessage(input) {
    /* ... */
  },
};
```

### Cursor-based pagination

`listMessages()` returns a `cursor` and `hasMore` flag.
When the user scrolls to the top, call `loadMoreHistory()` to fetch the next page:

```tsx
const { hasMoreHistory, loadMoreHistory } = useChat();

<button disabled={!hasMoreHistory} onClick={() => loadMoreHistory()}>
  Load older messages
</button>;
```

### Switching conversations

Call `setActiveConversation(id)` to switch threads.
The runtime automatically calls `listMessages()` for the new conversation:

```tsx
const { setActiveConversation } = useChat();

<ConversationList onSelect={(id) => setActiveConversation(id)} />;
```

```tsx
import * as React from 'react';
import {
  ChatProvider,
  useChat,
  type ChatAdapter,
  type ChatConversation,
  type ChatMessage,
} from '@mui/x-chat/headless';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { demoUsers } from '../shared/demoData';
import {
  createChunkStream,
  createTextResponseChunks,
  wait,
} from '../shared/demoUtils';

const conversations: ChatConversation[] = [
  {
    id: 'support',
    title: 'Support',
    subtitle: 'History and paging',
    unreadCount: 1,
    readState: 'unread',
  },
  {
    id: 'research',
    title: 'Research',
    subtitle: 'Switching threads',
    unreadCount: 0,
    readState: 'read',
  },
];

const pages: Record<
  string,
  Record<string, { messages: ChatMessage[]; cursor?: string; hasMore: boolean }>
> = {
  support: {
    initial: {
      messages: [
        {
          id: 'support-now-1',
          conversationId: 'support',
          role: 'assistant',
          author: demoUsers.agent,
          status: 'sent',
          parts: [{ type: 'text', text: 'This is the newest page for Support.' }],
        },
        {
          id: 'support-now-2',
          conversationId: 'support',
          role: 'user',
          author: demoUsers.alice,
          status: 'sent',
          parts: [{ type: 'text', text: 'Load older history when I ask for it.' }],
        },
      ],
      cursor: 'support:older',
      hasMore: true,
    },
    'support:older': {
      messages: [
        {
          id: 'support-old-1',
          conversationId: 'support',
          role: 'assistant',
          author: demoUsers.agent,
          status: 'sent',
          parts: [
            {
              type: 'text',
              text: 'This older page is prepended above the current thread.',
            },
          ],
        },
      ],
      hasMore: false,
    },
  },
  research: {
    initial: {
      messages: [
        {
          id: 'research-now-1',
          conversationId: 'research',
          role: 'assistant',
          author: demoUsers.agent,
          status: 'sent',
          parts: [
            {
              type: 'text',
              text: 'Switching conversations reloads the thread from the adapter.',
            },
          ],
        },
      ],
      hasMore: false,
    },
  },
};

const adapter: ChatAdapter<string> = {
  async listConversations() {
    await wait(180);
    return { conversations };
  },
  async listMessages({ conversationId, cursor }) {
    await wait(220);
    const key = cursor ?? 'initial';
    return pages[conversationId][key];
  },
  async sendMessage({ conversationId, message }) {
    return createChunkStream(
      createTextResponseChunks(
        `reply-${conversationId}-${message.id}`,
        `The active conversation is ${conversationId}. The adapter still streams new turns after history loads.`,
      ),
      { delayMs: 160 },
    );
  },
};

function ConversationHistoryInner() {
  const {
    conversations: loadedConversations,
    messages,
    activeConversationId,
    hasMoreHistory,
    setActiveConversation,
    loadMoreHistory,
    sendMessage,
  } = useChat<string>();

  const listRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const activeTitle =
    loadedConversations.find((c) => c.id === activeConversationId)?.title ??
    activeConversationId ??
    'Loading conversations';

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
          {activeTitle}
        </Typography>
        {hasMoreHistory ? (
          <Chip
            size="small"
            label="More history available"
            color="primary"
            variant="outlined"
          />
        ) : null}
      </Box>

      {/* Conversation selector */}
      <Stack
        direction="row"
        spacing={1}
        sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}
      >
        {loadedConversations.map((conversation) => (
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

      {/* Action buttons */}
      <Stack
        direction="row"
        spacing={1}
        sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}
      >
        <Button
          size="small"
          variant="outlined"
          disabled={!hasMoreHistory}
          onClick={() => void loadMoreHistory()}
        >
          Load older history
        </Button>
        <Button
          size="small"
          variant="outlined"
          disabled={!activeConversationId}
          onClick={() =>
            void sendMessage({
              conversationId: activeConversationId,
              author: demoUsers.alice,
              parts: [{ type: 'text', text: 'Send a follow-up turn.' }],
            })
          }
        >
          Send follow-up
        </Button>
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
            Messages load from the adapter when the active conversation changes.
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
    </Paper>
  );
}

export default function ConversationHistoryHeadlessChat() {
  return (
    <ChatProvider adapter={adapter} defaultActiveConversationId="support">
      <ConversationHistoryInner />
    </ChatProvider>
  );
}

```

## Key takeaways

- `listConversations()` and `listMessages()` are optional adapter methods — the runtime skips them if not implemented
- History pagination is driven by cursors and the `hasMoreHistory` flag
- Switching conversations triggers automatic thread loading through the adapter
- New messages can still be sent and streamed within a loaded thread

## Next steps

- [Adapters](/x/react-chat/headless/adapters/) for the full adapter interface reference
- [Controlled state](/x/react-chat/headless/examples/controlled-state/) for externally-owned conversation state
- [Streaming lifecycle](/x/react-chat/headless/examples/streaming-lifecycle/) for send, stop, and retry flows
