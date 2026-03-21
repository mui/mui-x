'use client';
import * as React from 'react';
import { nanoid } from 'nanoid';
import { ChatBox } from '@mui/x-chat';
import { createEchoAdapter } from '../shared/demoUtils';
import { createTextMessage, demoUsers } from '../shared/demoData';
import type { ChatConversation, ChatMessage } from '@mui/x-chat-headless';

const adapter = createEchoAdapter();

const MANY_CONV_ID = nanoid();

const conversation: ChatConversation = {
  id: MANY_CONV_ID,
  title: 'Scroll behavior test',
  subtitle: 'Testing with many messages',
  participants: [demoUsers.you, demoUsers.agent],
  readState: 'read',
  unreadCount: 0,
  lastMessageAt: '2026-03-15T12:00:00.000Z',
};

function generateMessages(count: number): ChatMessage[] {
  const messages: ChatMessage[] = [];
  const baseDate = new Date('2026-03-15T08:00:00.000Z');

  for (let i = 0; i < count; i += 1) {
    const isUser = i % 2 === 0;
    const date = new Date(baseDate.getTime() + i * 2 * 60 * 1000);

    messages.push(
      createTextMessage({
        id: nanoid(),
        conversationId: MANY_CONV_ID,
        role: isUser ? 'user' : 'assistant',
        author: isUser ? demoUsers.you : demoUsers.agent,
        createdAt: date.toISOString(),
        text: isUser
          ? `User message #${Math.floor(i / 2) + 1}: How does feature ${Math.floor(i / 2) + 1} work?`
          : `Assistant reply #${Math.floor(i / 2) + 1}: Feature ${Math.floor(i / 2) + 1} works by using the appropriate API configuration. Check the documentation for details.`,
      }),
    );
  }

  return messages;
}

const manyMessages = generateMessages(30);

export default function ManyMessages() {
  return (
    <ChatBox
      adapter={adapter}
      defaultActiveConversationId={conversation.id}
      defaultConversations={[conversation]}
      defaultMessages={manyMessages}
      sx={{
        height: 500,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
      }}
    />
  );
}
