'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import { ChatConversation, ChatMessageList } from '@mui/x-chat';
import { ChatProvider } from '@mui/x-chat/headless';

import { createEchoAdapter } from 'docs/data/chat/core/examples/shared/demoUtils';

const adapter = createEchoAdapter();

const conversation = {
  id: 'sources-demo',
  title: 'Sources and citations',
  participants: [],
  readState: 'read',
  unreadCount: 0,
  lastMessageAt: '2026-03-15T10:00:00.000Z',
};

const messages = [
  {
    id: 'msg-1',
    conversationId: conversation.id,
    role: 'user',
    status: 'sent',
    createdAt: '2026-03-15T09:59:00.000Z',
    parts: [{ type: 'text', text: 'How do I override the source link styles?' }],
  },
  {
    id: 'msg-2',
    conversationId: conversation.id,
    role: 'assistant',
    status: 'sent',
    createdAt: '2026-03-15T10:00:00.000Z',
    parts: [
      {
        type: 'text',
        text: 'According to the documentation [1], use the partProps slot overrides. The theming guide covers the resolution order:',
      },
      {
        type: 'source-url',
        sourceId: 'src-1',
        url: 'https://mui.com/x/react-chat/',
        title: 'MUI X Chat documentation',
      },
      {
        type: 'source-document',
        sourceId: 'src-2',
        title: 'Theming guide — slot overrides',
        text: 'Slots are resolved in order: theme defaults first, then component-level props.',
      },
    ],
  },
];

export default function SourcePartsDemo() {
  return (
    <ChatProvider
      adapter={adapter}
      initialActiveConversationId={conversation.id}
      initialConversations={[conversation]}
      initialMessages={messages}
    >
      <Box
        sx={{
          height: 320,
          overflow: 'hidden',
        }}
      >
        <ChatConversation>
          <ChatMessageList />
        </ChatConversation>
      </Box>
    </ChatProvider>
  );
}
