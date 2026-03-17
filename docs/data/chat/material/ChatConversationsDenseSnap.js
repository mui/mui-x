import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { ChatConversations } from '@mui/x-chat';
import { ChatRoot } from '@mui/x-chat-unstyled';
import { basicAdapter, demoConversations } from './shared';

// This demo is used in visual regression tests to spot regressions in the dense conversations layout.
export default function ChatConversationsDenseSnap() {
  return (
    <Paper
      elevation={0}
      sx={{ border: 1, borderColor: 'divider', overflow: 'hidden' }}
    >
      <Box sx={{ width: 360 }}>
        <ChatRoot
          adapter={basicAdapter}
          defaultActiveConversationId="c1"
          defaultConversations={demoConversations}
        >
          <ChatConversations dense />
        </ChatRoot>
      </Box>
    </Paper>
  );
}
