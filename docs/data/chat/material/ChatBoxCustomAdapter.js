import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

import { ChatBox } from '@mui/x-chat';
import {
  createChunkStream,
  createTextResponseChunks,
} from 'docsx/data/chat/material/shared/demoUtils';
import { demoUsers } from 'docsx/data/chat/material/shared/demoData';

const storedConversations = [
  {
    id: 'c1',
    title: 'Onboarding questions',
    subtitle: 'Getting started with the adapter',
    lastMessageAt: '2026-03-17T09:30:00.000Z',
  },
  {
    id: 'c2',
    title: 'Bug report',
    subtitle: 'Scroll anchoring edge case',
    lastMessageAt: '2026-03-16T14:00:00.000Z',
  },
];

const storedMessages = {
  c1: [
    {
      id: 'c1-m1',
      conversationId: 'c1',
      role: 'user',
      author: demoUsers.you,
      status: 'sent',
      createdAt: '2026-03-17T09:28:00.000Z',
      parts: [
        { type: 'text', text: 'How does the adapter integrate with ChatBox?' },
      ],
    },
    {
      id: 'c1-m2',
      conversationId: 'c1',
      role: 'assistant',
      author: demoUsers.agent,
      status: 'sent',
      createdAt: '2026-03-17T09:30:00.000Z',
      parts: [
        {
          type: 'text',
          text: 'ChatBox calls your adapter methods at the right lifecycle points. Provide `listConversations`, `listMessages`, and `sendMessage` to let ChatBox bootstrap entirely from your backend.',
        },
      ],
    },
  ],
  c2: [
    {
      id: 'c2-m1',
      conversationId: 'c2',
      role: 'user',
      author: demoUsers.you,
      status: 'sent',
      createdAt: '2026-03-16T14:00:00.000Z',
      parts: [
        {
          type: 'text',
          text: 'I noticed the scroll position jumps when images load. Is that expected?',
        },
      ],
    },
  ],
};

const adapter = {
  async listConversations() {
    return { conversations: storedConversations };
  },
  async listMessages({ conversationId }) {
    return { messages: storedMessages[conversationId] ?? [] };
  },
  async sendMessage({ message }) {
    return createChunkStream(
      createTextResponseChunks(
        `resp-${message.id}`,
        'Thanks for your message. This response was streamed through the custom adapter.',
      ),
    );
  },
};

export default function ChatBoxCustomAdapter() {
  return (
    <Paper
      elevation={0}
      sx={{ border: 1, borderColor: 'divider', overflow: 'hidden' }}
    >
      <Box sx={{ height: 560 }}>
        <ChatBox adapter={adapter} />
      </Box>
    </Paper>
  );
}
