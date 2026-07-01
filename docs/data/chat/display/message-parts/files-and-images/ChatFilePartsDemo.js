'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import { ChatConversation, ChatMessageList } from '@mui/x-chat';
import { ChatProvider } from '@mui/x-chat/headless';

import { createEchoAdapter } from 'docs/data/chat/core/examples/shared/demoUtils';

const adapter = createEchoAdapter();

const conversation = {
  id: 'files-conv',
  title: 'Files and images',
  participants: [],
  readState: 'read',
  unreadCount: 0,
  lastMessageAt: '2026-03-15T10:00:00.000Z',
};

const messages = [
  {
    id: 'files-msg-1',
    conversationId: 'files-conv',
    role: 'assistant',
    status: 'sent',
    createdAt: '2026-03-15T10:00:00.000Z',
    parts: [
      { type: 'text', text: 'Here are the requested files:' },
      {
        type: 'file',
        mediaType: 'image/svg+xml',
        url: '/static/x/chat/quarterly-chart.svg',
        filename: 'quarterly-chart.svg',
      },
      {
        type: 'file',
        mediaType: 'text/csv',
        url: '/static/x/chat/q4-metrics.csv',
        filename: 'q4-metrics.csv',
      },
    ],
  },
];

export default function ChatFilePartsDemo() {
  return (
    <ChatProvider
      adapter={adapter}
      initialActiveConversationId={conversation.id}
      initialConversations={[conversation]}
      initialMessages={messages}
    >
      <Box sx={{ height: 320, overflow: 'hidden' }}>
        <ChatConversation>
          <ChatMessageList />
        </ChatConversation>
      </Box>
    </ChatProvider>
  );
}
