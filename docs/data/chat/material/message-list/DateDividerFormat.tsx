'use client';
import * as React from 'react';
import { ChatBox } from '@mui/x-chat';
import type { ChatConversation, ChatMessage } from '@mui/x-chat/headless';
import { createEchoAdapter } from 'docs/data/chat/material/examples/shared/demoUtils';
import {
  createTextMessage,
  demoUsers,
} from 'docs/data/chat/material/examples/shared/demoData';

const adapter = createEchoAdapter();

const CONV_ID = 'date-divider-conv';

const conversation: ChatConversation = {
  id: CONV_ID,
  title: 'Date divider demo',
  subtitle: 'Custom date formatting',
  participants: [demoUsers.you, demoUsers.agent],
  readState: 'read',
  unreadCount: 0,
  lastMessageAt: '2026-03-16T10:00:00.000Z',
};

const messages: ChatMessage[] = [
  createTextMessage({
    id: 'dd-msg-1',
    conversationId: CONV_ID,
    role: 'assistant',
    author: demoUsers.agent,
    createdAt: '2026-03-14T15:00:00.000Z',
    text: 'Here is a message from two days ago.',
  }),
  createTextMessage({
    id: 'dd-msg-2',
    conversationId: CONV_ID,
    role: 'user',
    author: demoUsers.you,
    createdAt: '2026-03-15T09:30:00.000Z',
    text: 'And this one is from yesterday.',
  }),
  createTextMessage({
    id: 'dd-msg-3',
    conversationId: CONV_ID,
    role: 'assistant',
    author: demoUsers.agent,
    createdAt: '2026-03-16T10:00:00.000Z',
    text: 'This message is from today. Notice the short date format in the dividers above.',
  }),
];

export default function DateDividerFormat() {
  return (
    <ChatBox
      adapter={adapter}
      initialActiveConversationId={conversation.id}
      initialConversations={[conversation]}
      initialMessages={messages}
      slotProps={{
        dateDivider: {
          formatDate: (date: Date) =>
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
