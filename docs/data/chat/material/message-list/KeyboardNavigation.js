'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ChatBox } from '@mui/x-chat';
import { createEchoAdapter } from 'docs/data/chat/material/examples/shared/demoUtils';
import {
  createTextMessage,
  demoUsers,
  minimalConversation,
} from 'docs/data/chat/material/examples/shared/demoData';

const adapter = createEchoAdapter();

const conversationId = minimalConversation.id;

const messages = [
  createTextMessage({
    id: 'kbd-msg-1',
    conversationId,
    role: 'user',
    author: demoUsers.you,
    createdAt: '2026-03-15T09:50:00.000Z',
    text: 'How do I move around this chat with the keyboard?',
  }),
  createTextMessage({
    id: 'kbd-msg-2',
    conversationId,
    role: 'assistant',
    author: demoUsers.agent,
    createdAt: '2026-03-15T09:51:00.000Z',
    text: 'The message list is a single Tab stop — Arrow Up and Arrow Down move between messages.',
  }),
  createTextMessage({
    id: 'kbd-msg-3',
    conversationId,
    role: 'user',
    author: demoUsers.you,
    createdAt: '2026-03-15T09:52:00.000Z',
    text: 'And how do I reach a link or a copy button inside a message?',
  }),
  createTextMessage({
    id: 'kbd-msg-4',
    conversationId,
    role: 'assistant',
    author: demoUsers.agent,
    createdAt: '2026-03-15T09:53:00.000Z',
    text: [
      'Press Enter on the focused message to drill into its controls, and Escape to come back.',
      'Try it here — this message has [a link](https://mui.com/x/react-chat/) and a code block:',
      '',
      '```ts',
      "import { ChatBox } from '@mui/x-chat';",
      '```',
    ].join('\n'),
  }),
  createTextMessage({
    id: 'kbd-msg-5',
    conversationId,
    role: 'assistant',
    author: demoUsers.agent,
    createdAt: '2026-03-15T09:54:00.000Z',
    text: 'Home and End jump to the first and latest message, and Page Up/Page Down scroll natively so long messages stay readable.',
  }),
];

export default function KeyboardNavigation() {
  return (
    <Box sx={{ width: '100%', maxWidth: 560, mx: 'auto' }}>
      <Typography
        color="text.secondary"
        sx={{ mb: 1 }}
        variant="caption"
        component="p"
      >
        Tab into the list (a single stop), Arrow Up/Down between messages, Enter to
        drill into the focused message&apos;s links and buttons, Escape to come back,
        Tab onward to the composer.
      </Typography>
      <ChatBox
        adapter={adapter}
        initialActiveConversationId={conversationId}
        initialConversations={[minimalConversation]}
        initialMessages={messages}
        sx={{
          height: 420,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
        }}
      />
    </Box>
  );
}
