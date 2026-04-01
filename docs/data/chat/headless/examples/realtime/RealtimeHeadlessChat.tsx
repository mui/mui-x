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
} from 'docsx/data/chat/headless/examples/shared/demoData';
import { createChunkStream, createTextResponseChunks } from 'docsx/data/chat/headless/examples/shared/demoUtils';

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
        <Typography variant="subtitle1" fontWeight={700}>
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
              fontWeight={700}
              sx={{
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
