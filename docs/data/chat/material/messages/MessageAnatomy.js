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
    id: 'g1-a1',
    role: 'assistant',
    author: demoUsers.agent,
    createdAt: '2026-03-16T09:00:00.000Z',
    text: 'Good morning. I prepared the deployment summary.',
  }),
  createTextMessage({
    id: 'g1-a2',
    role: 'assistant',
    author: demoUsers.agent,
    createdAt: '2026-03-16T09:01:00.000Z',
    text: 'All integration tests passed. The staging environment is healthy.',
  }),
  createTextMessage({
    id: 'g1-u1',
    role: 'user',
    author: demoUsers.you,
    createdAt: '2026-03-16T09:05:00.000Z',
    text: 'Great. Ship it to production.',
  }),
  createTextMessage({
    id: 'g2-a1',
    role: 'assistant',
    author: demoUsers.agent,
    createdAt: '2026-03-17T10:00:00.000Z',
    text: 'This message is from the next day, so a date divider appears above it.',
  }),
];

export default function MessageAnatomy() {
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
