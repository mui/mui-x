import * as React from 'react';
import Box from '@mui/material/Box';
import { ChatUnreadMarker } from '@mui/x-chat';

import { ScopedChat } from 'docs/src/modules/components/chat-playground/sharedProviders';
import { MessageBubble } from 'docs/src/modules/components/chat-playground/MessageBubble';
import { users } from 'docs/src/modules/components/chat-playground/data';

const CONVERSATION_ID = 'standalone-thread';

const conversation = {
  id: CONVERSATION_ID,
  title: 'Standalone thread',
  participants: [users.me, users.assistant],
  unreadCount: 2,
  readState: 'unread',
};

const base = Date.UTC(2026, 4, 3, 8, 30, 0);

const messages = Array.from({ length: 5 }, (_, i) => ({
  id: `standalone-msg-${i}`,
  conversationId: CONVERSATION_ID,
  role: i % 2 === 0 ? 'assistant' : 'user',
  author: i % 2 === 0 ? users.assistant : users.me,
  createdAt: new Date(base + i * 60_000).toISOString(),
  parts: [{ type: 'text', text: `Message ${i + 1}` }],
}));

export default function UnreadMarkerStandalone() {
  return (
    <ScopedChat
      conversations={[conversation]}
      messages={messages}
      activeConversationId={CONVERSATION_ID}
    >
      <Box sx={{ width: '100%' }}>
        {messages.map((message) => (
          <React.Fragment key={message.id}>
            <ChatUnreadMarker messageId={message.id} />
            <MessageBubble messageId={message.id} />
          </React.Fragment>
        ))}
      </Box>
    </ScopedChat>
  );
}
