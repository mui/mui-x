'use client';
import * as React from 'react';
import { ChatBox } from '@mui/x-chat';
import type { ChatConversation, ChatMessage } from '@mui/x-chat/headless';
import { createEchoAdapter, randomId } from '../examples/shared/demoUtils';
import { createTextMessage, demoUsers } from '../examples/shared/demoData';

const adapter = createEchoAdapter();

const CONV_ID = randomId();

const conversation: ChatConversation = {
  id: CONV_ID,
  title: 'Message grouping demo',
  subtitle: 'Custom grouping window',
  participants: [demoUsers.you, demoUsers.agent],
  readState: 'read',
  unreadCount: 0,
  lastMessageAt: '2026-03-15T10:05:00.000Z',
};

// Messages from the same author spaced 30 seconds apart — well within a
// 1-minute grouping window but outside a very short one.
const messages: ChatMessage[] = [
  createTextMessage({
    id: randomId(),
    conversationId: CONV_ID,
    role: 'user',
    author: demoUsers.you,
    createdAt: '2026-03-15T10:00:00.000Z',
    text: 'First message from the user.',
  }),
  createTextMessage({
    id: randomId(),
    conversationId: CONV_ID,
    role: 'user',
    author: demoUsers.you,
    createdAt: '2026-03-15T10:00:30.000Z',
    text: 'Second message, sent 30 seconds later. Same group because the window is 1 minute.',
  }),
  createTextMessage({
    id: randomId(),
    conversationId: CONV_ID,
    role: 'user',
    author: demoUsers.you,
    createdAt: '2026-03-15T10:02:00.000Z',
    text: 'Third message, sent 2 minutes after the first. This starts a new group.',
  }),
  createTextMessage({
    id: randomId(),
    conversationId: CONV_ID,
    role: 'assistant',
    author: demoUsers.agent,
    createdAt: '2026-03-15T10:05:00.000Z',
    text: 'With groupingWindowMs set to 60 000 (1 minute), consecutive messages from the same author are grouped only when they are less than 1 minute apart. The avatar appears only on the first message in each group.',
  }),
];

export default function MessageGrouping() {
  return (
    <ChatBox
      adapter={adapter}
      defaultActiveConversationId={conversation.id}
      defaultConversations={[conversation]}
      defaultMessages={messages}
      slotProps={{
        messageGroup: { groupingWindowMs: 60000 },
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
