import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import type { ChatAdapter } from '@mui/x-chat-headless';
import { ChatBox } from '@mui/x-chat';
import type {} from '@mui/x-chat/themeAugmentation';
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

const theme = createTheme({
  components: {
    MuiChatBox: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
  palette: {
    Chat: {
      userMessageBg: '#1e3a5f',
      userMessageColor: '#e0f2fe',
      assistantMessageBg: '#f0fdf4',
      assistantMessageColor: '#14532d',
      composerFocusRing: '#16a34a',
    },
  },
});

export default function ThemeOverrides() {
  return (
    <ThemeProvider theme={theme}>
      <Paper
        elevation={0}
        sx={{ border: 1, borderColor: 'divider', overflow: 'hidden' }}
      >
        <Box sx={{ height: 480 }}>
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
                    text: 'This chat uses custom theme overrides. The assistant bubble has a green tint and the user bubble has a navy background.',
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
                    text: 'The palette.Chat tokens drive the CSS variables for all chat surfaces.',
                  },
                ],
              },
            ]}
          />
        </Box>
      </Paper>
    </ThemeProvider>
  );
}
