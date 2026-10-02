import * as React from 'react';
import {
  ChatProvider,
  useChat,
  useConversation,
  useConversations,
} from '@mui/x-chat/headless';
import { ChatTypingIndicator } from '@mui/x-chat';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
  createChunkStream,
  createTextResponseChunks,
} from 'docs/data/chat/core/examples/shared/demoUtils';

const currentUser = { id: 'me', displayName: 'You', isOnline: true };
const alex = { id: 'user-1', displayName: 'Alex', isOnline: true };
const sam = { id: 'user-2', displayName: 'Sam', isOnline: false };

const initialConversations = [
  {
    id: 'support',
    title: 'Support',
    readState: 'read',
    unreadCount: 0,
    participants: [{ ...currentUser }, { ...alex }],
  },
  {
    id: 'design',
    title: 'Design review',
    readState: 'read',
    unreadCount: 0,
    participants: [{ ...sam }],
  },
];

const initialMessages = [
  {
    id: 'support-1',
    conversationId: 'support',
    role: 'user',
    author: { ...currentUser },
    status: 'sent',
    parts: [{ type: 'text', text: 'Hi, is anyone there to help?' }],
  },
  {
    id: 'support-2',
    conversationId: 'support',
    role: 'assistant',
    author: { ...alex },
    status: 'sent',
    parts: [
      { type: 'text', text: 'Yes! Watch the buttons below drive live events.' },
    ],
  },
];

function createSimulatedRealtimeAdapter() {
  let onEventRef = null;

  return {
    adapter: {
      async sendMessage({ conversationId }) {
        return createChunkStream(
          createTextResponseChunks(
            `reply-${conversationId}`,
            'Thanks — your message reached the simulated backend.',
          ),
        );
      },
      subscribe({ onEvent }) {
        onEventRef = onEvent;
        return () => {
          onEventRef = null;
        };
      },
    },
    emit(event) {
      onEventRef?.(event);
    },
  };
}

function RealtimeSyncInner({ emit }) {
  const { messages } = useChat();
  const conversations = useConversations();
  const support = useConversation('support');

  const messageCounter = React.useRef(0);
  const typingRef = React.useRef(false);
  const onlineRef = React.useRef(alex.isOnline);
  const [hasUnread, setHasUnread] = React.useState(false);

  const onlineNames = React.useMemo(() => {
    const seen = new Set();
    const names = [];
    for (const conversation of conversations) {
      for (const participant of conversation.participants ?? []) {
        if (
          participant.isOnline &&
          participant.id !== currentUser.id &&
          !seen.has(participant.id)
        ) {
          seen.add(participant.id);
          names.push(participant.displayName ?? participant.id);
        }
      }
    }
    return names.join(', ') || 'nobody';
  }, [conversations]);

  const unreadCount = support?.unreadCount ?? 0;

  const handleIncomingMessage = () => {
    messageCounter.current += 1;
    emit({
      type: 'message-added',
      message: {
        id: `incoming-${messageCounter.current}`,
        conversationId: 'support',
        role: 'assistant',
        author: { id: alex.id },
        status: 'sent',
        parts: [{ type: 'text', text: 'New message from the backend.' }],
      },
    });
  };

  const handleToggleTyping = () => {
    typingRef.current = !typingRef.current;
    emit({
      type: 'typing',
      conversationId: 'support',
      userId: alex.id,
      isTyping: typingRef.current,
    });
  };

  const handleTogglePresence = () => {
    onlineRef.current = !onlineRef.current;
    emit({ type: 'presence', userId: alex.id, isOnline: onlineRef.current });
  };

  const handleToggleRead = () => {
    if (!hasUnread) {
      emit({
        type: 'conversation-updated',
        conversation: { id: 'support', unreadCount: 3, readState: 'unread' },
      });
      setHasUnread(true);
    } else {
      emit({ type: 'read', conversationId: 'support' });
      setHasUnread(false);
    }
  };

  return (
    <Paper variant="outlined" sx={{ overflow: 'hidden', width: '100%' }}>
      <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {support?.title ?? 'Support'}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Chip
              size="small"
              color={onlineNames === 'nobody' ? 'default' : 'success'}
              label={`Online: ${onlineNames}`}
            />
            <Chip
              size="small"
              color={unreadCount > 0 ? 'primary' : 'default'}
              label={`Unread: ${unreadCount}`}
            />
          </Stack>
        </Stack>
      </Box>

      <Box
        sx={{
          p: 2,
          minHeight: 180,
          maxHeight: 280,
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
        }}
      >
        {messages.map((message) => {
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
                {message.parts.map((part, index) => (
                  <Typography variant="body2" key={`${message.id}-${index}`}>
                    {part.type === 'text' ? part.text : null}
                  </Typography>
                ))}
              </Paper>
            </Box>
          );
        })}
        <ChatTypingIndicator />
      </Box>

      <Stack
        direction="row"
        spacing={1}
        sx={{
          px: 2,
          py: 1.5,
          borderTop: 1,
          borderColor: 'divider',
          flexWrap: 'wrap',
          rowGap: 1,
        }}
      >
        <Button size="small" variant="outlined" onClick={handleIncomingMessage}>
          Incoming message
        </Button>
        <Button size="small" variant="outlined" onClick={handleToggleTyping}>
          Toggle typing
        </Button>
        <Button size="small" variant="outlined" onClick={handleTogglePresence}>
          Toggle presence
        </Button>
        <Button size="small" variant="outlined" onClick={handleToggleRead}>
          {hasUnread ? 'Mark read' : 'Add unread'}
        </Button>
      </Stack>
    </Paper>
  );
}

export default function RealtimeSyncSimulation() {
  const { adapter, emit } = React.useMemo(
    () => createSimulatedRealtimeAdapter(),
    [],
  );

  return (
    <ChatProvider
      adapter={adapter}
      initialConversations={initialConversations}
      initialMessages={initialMessages}
      initialActiveConversationId="support"
    >
      <RealtimeSyncInner emit={emit} />
    </ChatProvider>
  );
}
