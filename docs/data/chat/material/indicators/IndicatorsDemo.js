import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { ChatBox } from '@mui/x-chat';
import { createEchoAdapter } from 'docsx/data/chat/material/shared/demoUtils';
import {
  demoUsers,
  createTextMessage,
} from 'docsx/data/chat/material/shared/demoData';

const adapter = createEchoAdapter();

const messages = [
  createTextMessage({
    id: 'ind-a1',
    role: 'assistant',
    author: demoUsers.agent,
    createdAt: '2026-03-17T09:00:00.000Z',
    text: 'I analyzed the latest deployment logs.',
  }),
  createTextMessage({
    id: 'ind-a2',
    role: 'assistant',
    author: demoUsers.agent,
    createdAt: '2026-03-17T09:01:00.000Z',
    text: 'No regressions found. The scroll-to-bottom affordance appears when you scroll up in a long thread. Send a message to see the typing indicator.',
  }),
  createTextMessage({
    id: 'ind-u1',
    role: 'user',
    author: demoUsers.you,
    createdAt: '2026-03-17T09:05:00.000Z',
    text: 'Good. Let me test the indicators by sending another message.',
  }),
];

export default function IndicatorsDemo() {
  return (
    <Paper
      elevation={0}
      sx={{ border: 1, borderColor: 'divider', overflow: 'hidden' }}
    >
      <Box sx={{ height: 480 }}>
        <ChatBox adapter={adapter} defaultMessages={messages} />
      </Box>
    </Paper>
  );
}
