import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { Chat } from '@mui/x-chat-unstyled';
import { ChatConversations, ChatThread, ChatComposer } from '@mui/x-chat';
import { createEchoAdapter } from 'docsx/data/chat/material/shared/demoUtils';
import {
  inboxConversations,
  inboxThreads,
} from 'docsx/data/chat/material/shared/demoData';

const adapter = createEchoAdapter();

export default function ModularComposition() {
  return (
    <Paper
      elevation={0}
      sx={{ border: 1, borderColor: 'divider', overflow: 'hidden' }}
    >
      <Chat.Root
        adapter={adapter}
        defaultActiveConversationId="triage"
        defaultConversations={inboxConversations}
        defaultMessages={inboxThreads.triage}
      >
        <Box sx={{ display: 'flex', height: 560 }}>
          <Box sx={{ width: 280, borderRight: 1, borderColor: 'divider' }}>
            <ChatConversations />
          </Box>
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <ChatThread sx={{ flex: 1 }} />
            <ChatComposer />
          </Box>
        </Box>
      </Chat.Root>
    </Paper>
  );
}
