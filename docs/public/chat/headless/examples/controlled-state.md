---
title: Chat - Controlled state
productId: x-chat
packageName: '@mui/x-chat/headless'
githubLabel: 'scope: chat'
---

# Chat - Controlled state

Drive the public chat models from React state while the runtime keeps normalized internals.

This demo demonstrates the controlled state model — the major public design choice of the headless package.
All four public state models are owned by the parent component while the runtime still streams, normalizes, and derives selectors internally.

## Key concepts

### The four controlled models

Each model has a controlled prop, a change callback, and an uncontrolled default:

| Model               | Controlled prop        | Change callback              |
| :------------------ | :--------------------- | :--------------------------- |
| Messages            | `messages`             | `onMessagesChange`           |
| Conversations       | `conversations`        | `onConversationsChange`      |
| Active conversation | `activeConversationId` | `onActiveConversationChange` |
| Composer value      | `composerValue`        | `onComposerValueChange`      |

### Wiring controlled state

Pass your React state directly to `ChatProvider`:

```tsx
<ChatProvider
  adapter={adapter}
  conversations={conversations}
  onConversationsChange={setConversations}
  activeConversationId={activeConversationId}
  onActiveConversationChange={setActiveConversationId}
  messages={messages}
  onMessagesChange={setMessages}
  composerValue={composerValue}
  onComposerValueChange={setComposerValue}
>
  <ControlledStateChat />
</ChatProvider>
```

### When to use controlled state

Use controlled state when you need to:

- sync chat state with a global store (Redux, Zustand, etc.)
- persist messages across navigation or page reloads
- drive the conversation list from an external data source
- coordinate the composer value with external UI (e.g. slash commands)

Start with `default*` props for prototyping and switch to controlled when the need arises — no other changes are required.

```tsx
import * as React from 'react';
import {
  ChatProvider,
  useChat,
  useChatComposer,
  type ChatAdapter,
  type ChatConversation,
  type ChatMessage,
} from '@mui/x-chat/headless';
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
} from 'docsx/data/chat/headless/examples/shared/demoData';
import {
  createChunkStream,
  createTextResponseChunks,
  getMessageText,
} from 'docsx/data/chat/headless/examples/shared/demoUtils';

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

## Key takeaways

- Controlled state lets you own the source of truth while the runtime still handles streaming and normalization
- You can switch from uncontrolled to controlled at any time without changing the runtime model
- The `onMessagesChange` callback fires with the full array after every update, including streaming deltas

## See also

- [State and store](/x/react-chat/headless/state/) for the full `ChatProvider` props reference
- [Selector-driven thread](/x/react-chat/headless/examples/selector-driven-thread/) for efficient rendering with controlled state
- [Conversation history](/x/react-chat/headless/examples/conversation-history/) for adapter-driven conversation loading

## API

- [ChatRoot](/x/api/chat/chat-root/)
