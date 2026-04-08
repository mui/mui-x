---
productId: x-chat
title: Chat - Core realtime
packageName: '@mui/x-chat/headless'
githubLabel: 'scope: chat'
---

# Chat - Core realtime

<p class="description">Push typing, presence, read state, and collection changes into the runtime through the adapter's <code>subscribe()</code> method.</p>

The adapter's `subscribe()` method enables push-based updates from the backend.
The runtime calls it on mount and cleans it up on unmount, keeping the subscription lifecycle fully managed.

The following demo shows realtime events in action:

```tsx
import * as React from 'react';
import {
  ChatProvider,
  useChat,
  useChatStatus,
  useConversation,
  useConversations,
  type ChatAdapter,
  type ChatRealtimeEvent,
} from '@mui/x-chat/headless';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
  cloneConversations,
  demoConversations,
  demoUsers,
} from 'docsx/data/chat/core/examples/shared/demoData';
import {
  createChunkStream,
  createTextResponseChunks,
} from 'docsx/data/chat/core/examples/shared/demoUtils';

function createRealtimeAdapter() {
  let onEventRef: ((event: ChatRealtimeEvent) => void) | null = null;

  return {
    adapter: {
      async sendMessage({ conversationId }) {
        return createChunkStream(
          createTextResponseChunks(
            `realtime-${conversationId}`,
            'Realtime subscriptions keep presence, typing, and read state synced.',
          ),
        );
      },
      subscribe({ onEvent }) {
        onEventRef = onEvent;
        return () => {
          onEventRef = null;
        };
      },
    } satisfies ChatAdapter,
    emit(event: ChatRealtimeEvent) {
      onEventRef?.(event);
    },
  };
}

function getOnlineNames(conversations: ReturnType<typeof useConversations>): string {
  const seen = new Set<string>();
  const names: string[] = [];

  for (const conversation of conversations) {
    for (const participant of conversation.participants ?? []) {
      if (participant.isOnline && !seen.has(participant.id)) {
        seen.add(participant.id);
        names.push(participant.displayName ?? participant.id);
      }
    }
  }

  return names.join(', ') || 'none';
}

function RealtimeInner({ emit }: { emit: (event: ChatRealtimeEvent) => void }) {
  const { messages } = useChat();
  const { typingUserIds } = useChatStatus();
  const conversations = useConversations();
  const activeConversation = useConversation('support');

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
          Realtime presence and typing
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Typing, presence, and read-state changes come in through
          adapter.subscribe().
        </Typography>
      </Box>

      {/* Stats */}
      <Stack direction="row" spacing={1} sx={{ px: 2, pt: 2, flexWrap: 'wrap' }}>
        {[
          { label: 'Typing users', value: typingUserIds.join(', ') || 'none' },
          { label: 'Online', value: getOnlineNames(conversations) },
          { label: 'Unread', value: activeConversation?.unreadCount ?? 0 },
          {
            label: 'Read state',
            value: activeConversation?.readState ?? 'unknown',
          },
        ].map((item) => (
          <Paper
            key={item.label}
            variant="outlined"
            sx={{ p: 1.5, minWidth: 100, flex: 1 }}
          >
            <Typography
              variant="caption"
              sx={{
                textTransform: 'uppercase',
                color: 'text.secondary',
                whiteSpace: 'nowrap',
              }}
            >
              {item.label}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 700,
                mt: 0.5,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {item.value}
            </Typography>
          </Paper>
        ))}
      </Stack>

      {/* Action buttons */}
      <Stack
        direction="row"
        spacing={1}
        sx={{ px: 2, pt: 2, flexWrap: 'wrap', rowGap: 1 }}
      >
        <Button
          size="small"
          variant="outlined"
          onClick={() =>
            emit({
              type: 'typing',
              conversationId: 'support',
              userId: demoUsers.alice.id,
              isTyping: true,
            })
          }
        >
          Alice starts typing
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={() =>
            emit({
              type: 'typing',
              conversationId: 'support',
              userId: demoUsers.alice.id,
              isTyping: false,
            })
          }
        >
          Alice stops typing
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={() =>
            emit({ type: 'presence', userId: demoUsers.sam.id, isOnline: true })
          }
        >
          Sam comes online
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={() =>
            emit({ type: 'presence', userId: demoUsers.sam.id, isOnline: false })
          }
        >
          Sam goes offline
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={() =>
            emit({
              type: 'read',
              conversationId: 'support',
              userId: demoUsers.alice.id,
            })
          }
        >
          Mark thread as read
        </Button>
      </Stack>

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
            This example focuses on state reactions from realtime events.
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

export default function RealtimeHeadlessChat() {
  const { adapter, emit } = React.useMemo(() => createRealtimeAdapter(), []);

  return (
    <ChatProvider
      adapter={adapter}
      initialConversations={cloneConversations(demoConversations.slice(0, 2))}
      initialActiveConversationId="support"
    >
      <RealtimeInner emit={emit} />
    </ChatProvider>
  );
}
```

## Subscription lifecycle

When `ChatProvider` mounts and the adapter implements `subscribe()`, the runtime:

1. Calls `subscribe({ onEvent })` with a callback.
2. Stores the returned cleanup function.
3. On unmount, calls the cleanup function to close the connection.

```ts
const adapter: ChatAdapter = {
  async sendMessage(input) {
    /* ... */
  },

  subscribe({ onEvent }) {
    const ws = new WebSocket('/api/realtime');
    ws.onmessage = (event) => onEvent(JSON.parse(event.data));
    return () => ws.close();
  },
};
```

The cleanup function can be returned directly or from a resolved promise, supporting both synchronous and asynchronous setup.

## Event types

The `onEvent` callback receives `ChatRealtimeEvent` objects.
There are eight event variants:

### Conversation events

| Event type             | Payload              | Store effect                                                |
| :--------------------- | :------------------- | :---------------------------------------------------------- |
| `conversation-added`   | `{ conversation }`   | Adds the conversation to the store                          |
| `conversation-updated` | `{ conversation }`   | Replaces the conversation record                            |
| `conversation-removed` | `{ conversationId }` | Removes the conversation and resets active ID if it matched |

### Message events

| Event type        | Payload                          | Store effect                       |
| :---------------- | :------------------------------- | :--------------------------------- |
| `message-added`   | `{ message }`                    | Adds the message to the store      |
| `message-updated` | `{ message }`                    | Replaces the message record        |
| `message-removed` | `{ messageId, conversationId? }` | Removes the message from the store |

### Typing events

| Event type | Payload                                | Store effect                                |
| :--------- | :------------------------------------- | :------------------------------------------ |
| `typing`   | `{ conversationId, userId, isTyping }` | Updates the typing map for the conversation |

### Presence events

| Event type | Payload                | Store effect                                             |
| :--------- | :--------------------- | :------------------------------------------------------- |
| `presence` | `{ userId, isOnline }` | Updates `isOnline` on matching conversation participants |

### Read events

| Event type | Payload                                   | Store effect                          |
| :--------- | :---------------------------------------- | :------------------------------------ |
| `read`     | `{ conversationId, messageId?, userId? }` | Updates the conversation's read state |

## Consuming realtime state

### Typing indicators

Use `useChatStatus()` to get the list of users currently typing:

```tsx
function TypingIndicator() {
  const { typingUserIds } = useChatStatus();

  if (typingUserIds.length === 0) return null;

  return <span>{typingUserIds.length} user(s) typing...</span>;
}
```

The `typingUserIds` selector returns user IDs for the active conversation by default.
For a specific conversation, use `chatSelectors.typingUserIds` with a conversation ID argument.

### Presence

Presence events update the `isOnline` field on `ChatUser` objects inside conversation participants.
Use `useConversation(id)` or `useConversations()` to see participant presence.

### Read state

Read events update the `readState` and `unreadCount` fields on `ChatConversation`.
Use `useConversation(id)` to reflect read status in the UI.

## Dispatching events from the backend

Each event is a plain object with a `type` field.
Here are the full shapes:

```ts
// Conversation events
{ type: 'conversation-added', conversation: ChatConversation }
{ type: 'conversation-updated', conversation: ChatConversation }
{ type: 'conversation-removed', conversationId: string }

// Message events
{ type: 'message-added', message: ChatMessage }
{ type: 'message-updated', message: ChatMessage }
{ type: 'message-removed', messageId: string, conversationId?: string }

// Typing
{ type: 'typing', conversationId: string, userId: string, isTyping: boolean }

// Presence
{ type: 'presence', userId: string, isOnline: boolean }

// Read
{ type: 'read', conversationId: string, messageId?: string, userId?: string }
```

## See also

- [Adapters](/x/react-chat/core/adapters/) for the full adapter interface including `subscribe()`.
- [Hooks](/x/react-chat/core/hooks/) for `useChatStatus()` and the typing/presence consumption pattern.
- [Realtime](/x/react-chat/core/examples/realtime/) for a demo covering subscriptions, typing, and presence.
- [Realtime thread sync](/x/react-chat/core/examples/realtime-thread-sync/) for add, update, and remove events.

## API

- [ChatRoot](/x/api/chat/chat-root/)
