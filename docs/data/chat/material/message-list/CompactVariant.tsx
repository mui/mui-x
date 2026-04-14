'use client';
import * as React from 'react';
import { ChatBox } from '@mui/x-chat';
import type { ChatConversation, ChatMessage } from '@mui/x-chat/headless';
import { createEchoAdapter } from 'docsx/data/chat/material/examples/shared/demoUtils';
import {
  createTextMessage,
  demoUsers,
} from 'docsx/data/chat/material/examples/shared/demoData';

const adapter = createEchoAdapter();

const CONV_ID = 'compact-conv';

const conversation: ChatConversation = {
  id: CONV_ID,
  title: 'Team standup',
  subtitle: 'Daily sync',
  participants: [demoUsers.you, demoUsers.agent],
  readState: 'read',
  unreadCount: 0,
  lastMessageAt: '2026-03-15T10:05:00.000Z',
};

const messages: ChatMessage[] = [
  createTextMessage({
    id: 'cv-msg-1',
    conversationId: CONV_ID,
    role: 'assistant',
    author: demoUsers.agent,
    createdAt: '2026-03-15T09:55:00.000Z',
    text: 'Good morning! Here is the agenda for today.',
  }),
  createTextMessage({
    id: 'cv-msg-2',
    conversationId: CONV_ID,
    role: 'assistant',
    author: demoUsers.agent,
    createdAt: '2026-03-15T09:55:10.000Z',
    text: 'We need to review the sprint progress and plan next steps.',
  }),
  createTextMessage({
    id: 'cv-msg-3',
    conversationId: CONV_ID,
    role: 'user',
    author: demoUsers.you,
    createdAt: '2026-03-15T10:00:00.000Z',
    text: 'Sounds good. I finished the variant feature yesterday.',
  }),
  createTextMessage({
    id: 'cv-msg-4',
    conversationId: CONV_ID,
    role: 'user',
    author: demoUsers.you,
    createdAt: '2026-03-15T10:00:15.000Z',
    text: 'The compact layout is ready for review.',
  }),
  createTextMessage({
    id: 'cv-msg-5',
    conversationId: CONV_ID,
    role: 'assistant',
    author: demoUsers.agent,
    createdAt: '2026-03-15T10:02:00.000Z',
    text: 'Great work! The compact variant removes message bubbles and aligns everything to the left — perfect for dense message feeds.',
  }),
];

export default function CompactVariant() {
  return (
    <ChatBox
      variant="compact"
      adapter={adapter}
      initialActiveConversationId={conversation.id}
      initialConversations={[conversation]}
      initialMessages={messages}
      sx={{
        height: 460,
        border: '1px solid',
        borderColor: 'divider',
      }}
    />
  );
}
