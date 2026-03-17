import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import type { ChatAdapter } from '@mui/x-chat-headless';
import { ChatBox } from '@mui/x-chat';
import { demoUsers } from 'docsx/data/chat/material/shared/demoData';

const adapter: ChatAdapter = {
  async sendMessage() {
    return new ReadableStream({
      start(c) {
        c.close();
      },
    });
  },
};

const CustomBubble = React.forwardRef(function CustomBubble(
  props: React.HTMLAttributes<HTMLDivElement> & Record<string, unknown>,
  ref: React.Ref<HTMLDivElement>,
) {
  const { ownerState, ...other } = props;
  const role =
    typeof ownerState === 'object' && ownerState && 'role' in ownerState
      ? ownerState.role
      : 'assistant';

  return (
    <Box
      ref={ref}
      sx={{
        borderRadius: role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
        border: 1,
        borderColor: role === 'user' ? 'primary.main' : 'divider',
        px: 2,
        py: 1,
      }}
      {...other}
    />
  );
});

export default function OwnerStateDemo() {
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
                  text: 'This bubble uses owner state to apply different border-radius for user and assistant messages.',
                },
              ],
            },
            {
              id: 'm2',
              role: 'user',
              author: demoUsers.you,
              createdAt: '2026-03-17T09:01:00.000Z',
              parts: [
                {
                  type: 'text',
                  text: 'User messages get a primary-colored border and a different corner shape.',
                },
              ],
            },
          ]}
          slots={{ messageBubble: CustomBubble }}
        />
      </Box>
    </Paper>
  );
}
