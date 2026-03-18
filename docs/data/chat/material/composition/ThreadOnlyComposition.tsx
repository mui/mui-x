import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { Chat } from '@mui/x-chat-unstyled';
import { ChatConversation, ChatConversationInput } from '@mui/x-chat';
import { createEchoAdapter } from 'docsx/data/chat/material/shared/demoUtils';
import { demoUsers } from 'docsx/data/chat/material/shared/demoData';

const adapter = createEchoAdapter();

export default function ThreadOnlyComposition() {
  return (
    <Paper
      elevation={0}
      sx={{ border: 1, borderColor: 'divider', overflow: 'hidden' }}
    >
      <Chat.Root
        adapter={adapter}
        defaultMessages={[
          {
            id: 'm1',
            role: 'assistant',
            author: demoUsers.agent,
            createdAt: '2026-03-17T09:00:00.000Z',
            parts: [
              {
                type: 'text',
                text: 'This thread and composer are composed manually from individual styled components, without using ChatBox.',
              },
            ],
          },
        ]}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: 480 }}>
          <ChatConversation sx={{ flex: 1 }} />
          <ChatConversationInput />
        </Box>
      </Chat.Root>
    </Paper>
  );
}
