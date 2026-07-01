'use client';
import * as React from 'react';
import { ChatBox } from '@mui/x-chat';

import { createEchoAdapter } from 'docs/data/chat/core/examples/shared/demoUtils';
import {
  createTextMessage,
  demoUsers,
} from 'docs/data/chat/core/examples/shared/demoData';

const adapter = createEchoAdapter();

const CONV_ID = 'date-divider-thread';

const conversation = {
  id: CONV_ID,
  title: 'Date divider thread',
  participants: [demoUsers.you, demoUsers.agent],
  readState: 'read',
  unreadCount: 0,
  lastMessageAt: '2026-03-16T10:00:00.000Z',
};

const messages = [
  createTextMessage({
    id: 'dd-thread-1',
    conversationId: CONV_ID,
    role: 'assistant',
    author: demoUsers.agent,
    createdAt: '2026-03-14T15:00:00.000Z',
    text: 'Here is a message from two days ago.',
  }),
  createTextMessage({
    id: 'dd-thread-2',
    conversationId: CONV_ID,
    role: 'user',
    author: demoUsers.you,
    createdAt: '2026-03-15T09:30:00.000Z',
    text: 'And this one is from yesterday.',
  }),
  createTextMessage({
    id: 'dd-thread-3',
    conversationId: CONV_ID,
    role: 'assistant',
    author: demoUsers.agent,
    createdAt: '2026-03-16T10:00:00.000Z',
    text: 'This one is from today. A divider appears at each day boundary above.',
  }),
];

export default function DateDividerThread() {
  return (
    <ChatBox
      adapter={adapter}
      initialActiveConversationId={conversation.id}
      initialConversations={[conversation]}
      initialMessages={messages}
      features={{ dateDivider: true }}
      slotProps={{
        dateDivider: {
          formatDate: (date) =>
            date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        },
      }}
      sx={{
        height: 400,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    />
  );
}
