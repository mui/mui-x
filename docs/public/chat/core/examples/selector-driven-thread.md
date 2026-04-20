---
title: Chat - Selector-driven thread
productId: x-chat
packageName: '@mui/x-chat/headless'
githubLabel: 'scope: chat'
---

# Chat - Selector-driven thread

Render large custom threads efficiently with IDs at the list level and row-level message subscriptions.

This demo demonstrates the performance-focused rendering pattern for threads with many messages.
Instead of subscribing the entire list to every message change, each row subscribes only to its own message record.

## Key concepts

### The ID list + row subscription pattern

The parent component calls `useMessageIds()` to get the ordered list of message IDs.
Each row component calls `useMessage(id)` to subscribe to its own message:

```tsx
function Thread() {
  const messageIds = useMessageIds();

  return (
    <div>
      {messageIds.map((id) => (
        <MessageRow key={id} id={id} />
      ))}
    </div>
  );
}

const MessageRow = React.memo(function MessageRow({ id }: { id: string }) {
  const message = useMessage(id);
  if (!message) return null;

  return (
    <div>{message.parts[0]?.type === 'text' ? message.parts[0].text : null}</div>
  );
});
```

### Why this matters

The store keeps messages in a normalized shape (`messageIds` + `messagesById`).
When a single message updates during streaming:

- `messageIds` stays reference-equal because the ID list did not change
- Only the `messagesById` entry for the updated message changes
- `useMessage(id)` on the updated row triggers a re-render
- All other rows stay untouched

This means that for a thread with 100 messages where one is streaming, only one component re-renders per delta — not 100.

### Conversation-level selectors

The same pattern applies to conversations:

```tsx
const conversations = useConversations();
const conversation = useConversation('selectors');
```

```tsx
import * as React from 'react';
import {
  ChatProvider,
  useConversation,
  useConversations,
  useMessage,
  useMessageIds,
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
import { demoUsers } from 'docsx/data/chat/core/examples/shared/demoData';

function createMessages() {
  return Array.from({ length: 14 }, (_, index) => ({
    id: `selector-${index + 1}`,
    conversationId: 'selectors',
    role: index % 2 === 0 ? 'assistant' : 'user',
    author: index % 2 === 0 ? demoUsers.agent : demoUsers.alice,
    status: 'sent',
    parts: [
      {
        type: 'text',
        text: `Row ${index + 1} is subscribed independently.`,
      },
    ],
  })) as ChatMessage[];
}

const MessageRow = React.memo(function MessageRow({ id }: { id: string }) {
  const message = useMessage(id);
  const renders = React.useRef(0);

  React.useEffect(() => {
    renders.current += 1;
  });

  if (!message) {
    return null;
  }

  return (
    <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 2 }}>
      <Typography variant="caption" color="text.secondary">
        {message.id} &middot; renders {renders.current}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 700, mt: 0.5 }}>
        {message.author?.displayName ?? message.role}
      </Typography>
      <Typography variant="body2" sx={{ mt: 0.5 }}>
        {message.parts[0]?.type === 'text' ? message.parts[0].text : null}
      </Typography>
    </Paper>
  );
});

function SelectorThread() {
  const messageIds = useMessageIds();
  const conversations = useConversations();
  const conversation = useConversation('selectors');

  return (
    <Paper variant="outlined" sx={{ overflow: 'hidden', width: '100%' }}>
      {/* Header */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          {conversation?.title ?? 'Selector lab'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Update one controlled message from the parent to see only the matching row
          rerender.
        </Typography>
      </Box>

      {/* Conversations */}
      <Box sx={{ px: 2, pt: 2 }}>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
          {conversations.map((conv) => (
            <Chip
              key={conv.id}
              label={conv.title ?? conv.id}
              size="small"
              variant={conv.id === 'selectors' ? 'filled' : 'outlined'}
              color={conv.id === 'selectors' ? 'primary' : 'default'}
            />
          ))}
        </Stack>
      </Box>

      {/* Message rows */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          maxHeight: 480,
          overflow: 'auto',
        }}
      >
        {messageIds.map((id) => (
          <MessageRow key={id} id={id} />
        ))}
      </Box>
    </Paper>
  );
}

export default function SelectorDrivenThread() {
  const [messages, setMessages] = React.useState(createMessages);
  const [conversations] = React.useState<ChatConversation[]>([
    {
      id: 'selectors',
      title: 'Selector-driven thread',
      subtitle: 'Row-level subscriptions',
    },
  ]);

  const adapter = React.useMemo<ChatAdapter>(
    () => ({
      async sendMessage() {
        return new ReadableStream({
          start(controller) {
            controller.close();
          },
        });
      },
    }),
    [],
  );

  return (
    <Stack spacing={1.5}>
      <Stack direction="row" spacing={1}>
        <Button
          size="small"
          variant="outlined"
          onClick={() => {
            setMessages((previous) =>
              previous.map((message) =>
                message.id === 'selector-6'
                  ? {
                      ...message,
                      parts: [
                        {
                          type: 'text',
                          text: 'Only this row changed in the controlled state.',
                        },
                      ],
                    }
                  : message,
              ),
            );
          }}
        >
          Update message 6
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={() => {
            setMessages((previous) => [
              ...previous,
              {
                id: `selector-${previous.length + 1}`,
                conversationId: 'selectors',
                role: 'assistant',
                author: demoUsers.agent,
                status: 'sent',
                parts: [
                  {
                    type: 'text',
                    text: 'A new row appears without rerendering every item.',
                  },
                ],
              },
            ]);
          }}
        >
          Append one row
        </Button>
      </Stack>
      <ChatProvider
        adapter={adapter}
        messages={messages}
        conversations={conversations}
        activeConversationId="selectors"
      >
        <SelectorThread />
      </ChatProvider>
    </Stack>
  );
}
```

## Key takeaways

- `useMessageIds()` + `useMessage(id)` is the recommended pattern for threads with more than a handful of messages
- The normalized store ensures stable references — only changed data triggers re-renders
- Wrap row components in `React.memo()` for maximum efficiency
- `useConversations()` and `useConversation(id)` follow the same pattern for conversation lists

## See also

- [Selectors](/x/react-chat/core/selectors/) for the full selector API and custom subscriptions
- [Hooks](/x/react-chat/core/hooks/) for all available hooks
- [Advanced store access](/x/react-chat/core/examples/advanced-store-access/) for custom selectors with `useChatStore()`

## API

- [ChatRoot](/x/api/chat/chat-root/)
