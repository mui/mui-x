'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ChatBox } from '@mui/x-chat';
import { createEchoAdapter } from 'docs/data/chat/material/examples/shared/demoUtils';
import {
  createTextMessage,
  demoUsers,
} from 'docs/data/chat/material/examples/shared/demoData';

const SUPPORT_CONVERSATION_ID = 'support-conv';
const SALES_CONVERSATION_ID = 'sales-conv';

const supportBot = { ...demoUsers.agent, displayName: 'Support Bot' };
const salesBot = { ...demoUsers.agent, displayName: 'Sales Bot' };

const supportAdapter = createEchoAdapter({
  agent: supportBot,
  respond: (text) => `Support received: "${text}". How else can I help?`,
});

const salesAdapter = createEchoAdapter({
  agent: salesBot,
  respond: (text) => `Sales received: "${text}". Let me check our catalog.`,
});

const supportMessages = [
  createTextMessage({
    id: 'support-msg-1',
    conversationId: SUPPORT_CONVERSATION_ID,
    role: 'user',
    author: demoUsers.you,
    createdAt: '2026-03-15T09:59:00.000Z',
    text: "My order #1042 hasn't arrived.",
  }),
  createTextMessage({
    id: 'support-msg-2',
    conversationId: SUPPORT_CONVERSATION_ID,
    role: 'assistant',
    author: supportBot,
    createdAt: '2026-03-15T10:00:00.000Z',
    text: 'Support received: "My order #1042 hasn\'t arrived.". How else can I help?',
  }),
];

const salesMessages = [
  createTextMessage({
    id: 'sales-msg-1',
    conversationId: SALES_CONVERSATION_ID,
    role: 'user',
    author: demoUsers.you,
    createdAt: '2026-03-15T09:59:00.000Z',
    text: 'Do you offer team licenses?',
  }),
  createTextMessage({
    id: 'sales-msg-2',
    conversationId: SALES_CONVERSATION_ID,
    role: 'assistant',
    author: salesBot,
    createdAt: '2026-03-15T10:00:00.000Z',
    text: 'Sales received: "Do you offer team licenses?". Let me check our catalog.',
  }),
];

export default function MultipleInstances() {
  return (
    <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <Typography variant="subtitle2" color="text.secondary">
          Support
        </Typography>
        <ChatBox
          adapter={supportAdapter}
          features={{ conversationHeader: false }}
          initialActiveConversationId={SUPPORT_CONVERSATION_ID}
          initialMessages={supportMessages}
          sx={{
            height: 400,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
          }}
        />
      </Box>
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <Typography variant="subtitle2" color="text.secondary">
          Sales
        </Typography>
        <ChatBox
          adapter={salesAdapter}
          features={{ conversationHeader: false }}
          initialActiveConversationId={SALES_CONVERSATION_ID}
          initialMessages={salesMessages}
          sx={{
            height: 400,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
          }}
        />
      </Box>
    </Box>
  );
}
