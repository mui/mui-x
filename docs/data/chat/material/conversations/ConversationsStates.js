import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import { ChatBox } from '@mui/x-chat';

export default function ConversationsStates() {
  const [demoState, setDemoState] = React.useState('loaded');

  const adapter = React.useMemo(
    () => ({
      async listConversations() {
        if (demoState === 'loading') {
          await new Promise(() => {});
        }
        if (demoState === 'empty') {
          return { conversations: [] };
        }
        return {
          conversations: [
            {
              id: 'c1',
              title: 'Active thread',
              subtitle: 'Conversations loaded successfully',
              lastMessageAt: '2026-03-17T09:00:00.000Z',
            },
          ],
        };
      },
      async sendMessage() {
        return new ReadableStream({
          start(c) {
            c.close();
          },
        });
      },
    }),
    [demoState],
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Stack direction="row" spacing={1}>
        <Button
          onClick={() => setDemoState('loaded')}
          size="small"
          variant={demoState === 'loaded' ? 'contained' : 'outlined'}
        >
          Loaded
        </Button>
        <Button
          onClick={() => setDemoState('empty')}
          size="small"
          variant={demoState === 'empty' ? 'contained' : 'outlined'}
        >
          Empty
        </Button>
        <Button
          onClick={() => setDemoState('loading')}
          size="small"
          variant={demoState === 'loading' ? 'contained' : 'outlined'}
        >
          Loading
        </Button>
      </Stack>
      <Paper
        elevation={0}
        sx={{ border: 1, borderColor: 'divider', overflow: 'hidden' }}
      >
        <Box sx={{ height: 400 }}>
          <ChatBox adapter={adapter} key={demoState} />
        </Box>
      </Paper>
    </Box>
  );
}
