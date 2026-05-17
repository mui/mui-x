'use client';
import * as React from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
  ChatMessage,
  ChatMessageAvatar,
  ChatMessageContent,
  ChatMessageGroup,
} from '@mui/x-chat';
import { ChatProvider, useChatStore } from '@mui/x-chat/headless';
import type {
  ChatAdapter,
  ChatConversation,
  ChatMessage as ChatMessageEntity,
} from '@mui/x-chat/headless';
import {
  demoUsers,
  createTextMessage,
} from 'docs/data/chat/material/examples/shared/demoData';

const noopAdapter: ChatAdapter = {
  async sendMessage() {
    return new ReadableStream({
      start(controller) {
        controller.close();
      },
    });
  },
};

const conversation: ChatConversation = {
  id: 'message-states-demo',
  title: 'Message states',
  participants: [demoUsers.you, demoUsers.agent],
  readState: 'read',
  unreadCount: 0,
};

const messages: ChatMessageEntity[] = [
  createTextMessage({
    id: 'states-msg-assistant',
    conversationId: conversation.id,
    role: 'assistant',
    author: demoUsers.agent,
    createdAt: '2026-03-15T09:30:00.000Z',
    text: 'Default assistant bubble — pulls from `palette.background.paper` and `divider`.',
  }),
  createTextMessage({
    id: 'states-msg-user',
    conversationId: conversation.id,
    role: 'user',
    author: demoUsers.you,
    createdAt: '2026-03-15T09:31:00.000Z',
    text: 'Outgoing user bubble — uses `palette.primary.main`.',
  }),
  {
    ...createTextMessage({
      id: 'states-msg-streaming',
      conversationId: conversation.id,
      role: 'assistant',
      author: demoUsers.agent,
      createdAt: '2026-03-15T09:32:00.000Z',
      text: 'Streaming bubble — animates while the assistant is typing…',
    }),
    status: 'streaming',
  },
  {
    ...createTextMessage({
      id: 'states-msg-error',
      conversationId: conversation.id,
      role: 'assistant',
      author: demoUsers.agent,
      createdAt: '2026-03-15T09:33:00.000Z',
      text: 'This message failed to send.',
    }),
    status: 'error',
  },
];

function ErrorEffect({ messageId }: { messageId: string }) {
  const store = useChatStore();
  React.useEffect(() => {
    store.setMessageError(messageId, {
      code: 'SEND_ERROR',
      source: 'send',
      message: 'Could not reach the chat server.',
      recoverable: true,
      retryable: true,
    });
    return () => {
      store.setMessageError(messageId, null);
    };
  }, [store, messageId]);
  return null;
}

function MessageBubble({ messageId }: { messageId: string }) {
  return (
    <ChatMessageGroup messageId={messageId}>
      <ChatMessage messageId={messageId}>
        <ChatMessageAvatar />
        <ChatMessageContent />
      </ChatMessage>
    </ChatMessageGroup>
  );
}

const STATE_LABELS: Record<string, string> = {
  'states-msg-assistant': 'role="assistant" — status="sent"',
  'states-msg-user': 'role="user" — status="sent"',
  'states-msg-streaming': 'role="assistant" — status="streaming"',
  'states-msg-error': 'role="assistant" — status="error"',
};

export default function MessageStatesDemo() {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: 2,
        backgroundColor: 'background.default',
      }}
    >
      <ChatProvider
        adapter={noopAdapter}
        currentUser={demoUsers.you}
        members={[demoUsers.you, demoUsers.agent]}
        initialConversations={[conversation]}
        initialMessages={messages}
        initialActiveConversationId={conversation.id}
      >
        <ErrorEffect messageId="states-msg-error" />
        <Stack spacing={3}>
          {messages.map((message) => (
            <Stack key={message.id} spacing={1}>
              <Typography variant="caption" color="text.secondary">
                {STATE_LABELS[message.id]}
              </Typography>
              <div>
                <MessageBubble messageId={message.id} />
              </div>
            </Stack>
          ))}
        </Stack>
      </ChatProvider>
    </Paper>
  );
}
