'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import {
  ChatConversation,
  ChatComposer,
  ChatComposerSendButton,
  ChatComposerTextArea,
  ChatComposerToolbar,
  ChatMessage,
  ChatMessageAvatar,
  ChatMessageContent,
  ChatMessageGroup,
  ChatMessageMeta,
  ChatMessageList,
} from '@mui/x-chat';
import { ChatProvider, useMessageIds } from '@mui/x-chat/headless';
import { createEchoAdapter, randomId } from '../examples/shared/demoUtils';
import { createTextMessage, demoUsers } from '../examples/shared/demoData';

const CONVERSATION_ID = randomId();

const adapter = createEchoAdapter();

const initialMessages = [
  createTextMessage({
    id: randomId(),
    conversationId: CONVERSATION_ID,
    role: 'assistant',
    author: demoUsers.agent,
    createdAt: '2026-03-15T09:58:00.000Z',
    text: 'This layout is built with ChatProvider directly. The message list and composer are composed manually.',
  }),
  createTextMessage({
    id: randomId(),
    conversationId: CONVERSATION_ID,
    role: 'user',
    author: demoUsers.you,
    createdAt: '2026-03-15T10:00:00.000Z',
    text: 'So I get full control over what is rendered?',
  }),
  createTextMessage({
    id: randomId(),
    conversationId: CONVERSATION_ID,
    role: 'assistant',
    author: demoUsers.agent,
    createdAt: '2026-03-15T10:01:00.000Z',
    text: 'Exactly. You pick only the pieces you need and arrange them however you like.',
  }),
];

function SendIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      style={{ width: '1em', height: '1em' }}
    >
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
    </svg>
  );
}

function CustomChat() {
  const messageIds = useMessageIds();

  const renderItem = React.useCallback(
    ({ id }) => (
      <ChatMessageGroup key={id} messageId={id}>
        <ChatMessage messageId={id}>
          <ChatMessageAvatar />
          <ChatMessageContent />
          <ChatMessageMeta />
        </ChatMessage>
      </ChatMessageGroup>
    ),
    [],
  );

  return (
    <ChatConversation>
      <ChatMessageList renderItem={renderItem} items={messageIds} />
      <ChatComposer>
        <ChatComposerTextArea placeholder="Type a message..." />
        <ChatComposerToolbar>
          <ChatComposerSendButton aria-label="Send message">
            <SendIcon />
          </ChatComposerSendButton>
        </ChatComposerToolbar>
      </ChatComposer>
    </ChatConversation>
  );
}

export default function ChatProviderCustomLayout() {
  return (
    <ChatProvider
      adapter={adapter}
      initialActiveConversationId={CONVERSATION_ID}
      initialMessages={initialMessages}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: 500,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          overflow: 'hidden',
          boxSizing: 'border-box',
          '*, *::before, *::after': { boxSizing: 'inherit' },
        }}
      >
        <CustomChat />
      </Box>
    </ChatProvider>
  );
}
