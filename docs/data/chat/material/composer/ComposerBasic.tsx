import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { ChatBox } from '@mui/x-chat';
import { demoUsers } from 'docsx/data/chat/material/shared/demoData';
import { createEchoAdapter } from 'docsx/data/chat/material/shared/demoUtils';

const adapter = createEchoAdapter();

export default function ComposerBasic() {
  return (
    <Paper
      elevation={0}
      sx={{ border: 1, borderColor: 'divider', overflow: 'hidden' }}
    >
      <Box sx={{ height: 400 }}>
        <ChatBox
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
                  text: 'Type a message below. The input auto-grows and submits on Enter.',
                },
              ],
            },
          ]}
        />
      </Box>
    </Paper>
  );
}
