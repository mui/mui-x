'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ChatBox } from '@mui/x-chat';
import { createEchoAdapter } from '../examples/shared/demoUtils';
import { demoUsers } from '../examples/shared/demoData';

const supportAdapter = createEchoAdapter({
  agent: { ...demoUsers.agent, displayName: 'Support Bot' },
  respond: (text) => `Support received: "${text}". How else can I help?`,
});

const salesAdapter = createEchoAdapter({
  agent: { ...demoUsers.agent, displayName: 'Sales Bot' },
  respond: (text) => `Sales received: "${text}". Let me check our catalog.`,
});

export default function MultipleInstances() {
  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Support
        </Typography>
        <ChatBox
          adapter={supportAdapter}
          features={{ conversationHeader: false }}
          sx={{
            height: 400,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
          }}
        />
      </Box>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Sales
        </Typography>
        <ChatBox
          adapter={salesAdapter}
          features={{ conversationHeader: false }}
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
