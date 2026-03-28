import * as React from 'react';
import { ChatProvider, useChat } from '@mui/x-chat/headless';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
  cloneConversations,
  cloneMessages,
  demoConversations,
  demoThreads,
  demoUsers,
} from '../shared/demoData';

function createRealtimeSyncAdapter() {
  let onEventRef = null;

  return {
    adapter: {
      async sendMessage() {
        return new ReadableStream({
          start(controller) {
            controller.close();
          },
        });
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

function RealtimeThreadSyncInner({ emit }) {
  const { conversations, messages, activeConversationId, setActiveConversation } =
    useChat();
  const messageCounter = React.useRef(0);
  const conversationCounter = React.useRef(0);
  const activeConversation = conversations.find(
    (conversation) => conversation.id === activeConversationId,
  );

  const addMessage = () => {
    if (!activeConversationId) {
      return;
    }

    messageCounter.current += 1;
    const nextMessage = {
      id: `live-message-${messageCounter.current}`,
      conversationId: activeConversationId,
      role: 'assistant',
      author: demoUsers.agent,
      status: 'sent',
      parts: [
        {
          type: 'text',
          text: `Realtime message ${messageCounter.current} arrived for ${activeConversationId}.`,
        },
      ],
    };

    emit({ type: 'message-added', message: nextMessage });
  };

  const updateLastMessage = () => {
    const target = [...messages]
      .reverse()
      .find((message) => message.role === 'assistant');

    if (!target) {
      return;
    }

    emit({
      type: 'message-updated',
      message: {
        ...target,
        parts: [
          {
            type: 'text',
            text: 'This assistant message was patched by a realtime update.',
          },
        ],
      },
    });
  };

  const removeLastMessage = () => {
    const target = [...messages]
      .reverse()
      .find((message) => message.role === 'assistant');

    if (!target) {
      return;
    }

    emit({ type: 'message-removed', messageId: target.id });
  };

  const addConversation = () => {
    conversationCounter.current += 1;
    const conversation = {
      id: `live-conversation-${conversationCounter.current}`,
      title: `Escalation ${conversationCounter.current}`,
      subtitle: 'Created by realtime sync',
      readState: 'unread',
      unreadCount: 1,
      participants: [demoUsers.alice, demoUsers.agent],
    };

    emit({ type: 'conversation-added', conversation });
  };

  const renameActiveConversation = () => {
    if (!activeConversation) {
      return;
    }

    emit({
      type: 'conversation-updated',
      conversation: {
        ...activeConversation,
        title: `${activeConversation.title} (live)`,
        subtitle: 'Renamed by realtime event',
      },
    });
  };

  const removeActiveConversation = () => {
    if (!activeConversationId) {
      return;
    }

    emit({ type: 'conversation-removed', conversationId: activeConversationId });
  };

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
          Realtime collection sync
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Message and conversation events can reshape the thread without a manual
          refetch.
        </Typography>
      </Box>

      {/* Conversation selector */}
      <Stack
        direction="row"
        spacing={1}
        sx={{
          px: 2,
          py: 1.5,
          borderBottom: 1,
          borderColor: 'divider',
          flexWrap: 'wrap',
        }}
      >
        {conversations.map((conversation) => (
          <Chip
            key={conversation.id}
            label={conversation.title ?? conversation.id}
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
          { label: 'Conversations', value: conversations.length },
          { label: 'Active', value: activeConversation?.title ?? 'none' },
          { label: 'Messages', value: messages.length },
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

      {/* Action buttons */}
      <Stack
        direction="row"
        spacing={1}
        sx={{
          px: 2,
          py: 1.5,
          borderBottom: 1,
          borderColor: 'divider',
          flexWrap: 'wrap',
          rowGap: 1,
        }}
      >
        <Button
          size="small"
          variant="outlined"
          onClick={addMessage}
          disabled={!activeConversationId}
        >
          Add message
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={updateLastMessage}
          disabled={messages.length === 0}
        >
          Update last assistant message
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={removeLastMessage}
          disabled={messages.length === 0}
        >
          Remove last assistant message
        </Button>
        <Button size="small" variant="outlined" onClick={addConversation}>
          Add conversation
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={renameActiveConversation}
          disabled={!activeConversationId}
        >
          Rename active conversation
        </Button>
        <Button
          size="small"
          variant="outlined"
          onClick={removeActiveConversation}
          disabled={!activeConversationId}
        >
          Remove active conversation
        </Button>
      </Stack>

      {/* Messages */}
      <Box
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
            Select or create a conversation. Removing the active thread clears the
            message view.
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

export default function RealtimeThreadSyncHeadlessChat() {
  const { adapter, emit } = React.useMemo(() => createRealtimeSyncAdapter(), []);

  return (
    <ChatProvider
      adapter={adapter}
      initialConversations={cloneConversations(demoConversations.slice(0, 2))}
      initialMessages={[
        ...cloneMessages(demoThreads.support),
        ...cloneMessages(demoThreads.product),
      ]}
      initialActiveConversationId="support"
    >
      <RealtimeThreadSyncInner emit={emit} />
    </ChatProvider>
  );
}
