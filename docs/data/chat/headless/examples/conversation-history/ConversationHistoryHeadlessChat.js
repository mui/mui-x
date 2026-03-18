import * as React from 'react';
import { ChatProvider, useChat } from '@mui/x-chat-headless';
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

const conversations = [
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

const pages = {
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

const adapter = {
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
  } = useChat();

  const listRef = React.useRef(null);

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
