import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import type { ChatAdapter } from '@mui/x-chat-headless';
import { ChatBox } from '@mui/x-chat';
import { demoUsers } from 'docsx/data/chat/material/shared/demoData';

const adapter: ChatAdapter = {
  async sendMessage() {
    return new ReadableStream({
      start(controller) {
        controller.close();
      },
    });
  },
};

export default function ChatBoxDarkMode() {
  const [mode, setMode] = React.useState<'light' | 'dark'>('dark');

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode],
  );

  return (
    <ThemeProvider theme={theme}>
      <Paper
        elevation={0}
        sx={{
          border: 1,
          borderColor: 'divider',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <IconButton
          aria-label="Toggle dark mode"
          onClick={() => setMode((prev) => (prev === 'light' ? 'dark' : 'light'))}
          size="small"
          sx={{ position: 'absolute', right: 8, top: 8, zIndex: 1 }}
        >
          {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
        <Box sx={{ height: 560 }}>
          <ChatBox
            adapter={adapter}
            defaultActiveConversationId="c1"
            defaultConversations={[
              {
                id: 'c1',
                title: 'Dark mode preview',
                subtitle: 'Toggle light and dark themes',
                unreadCount: 1,
              },
            ]}
            defaultMessages={[
              {
                id: 'm1',
                role: 'assistant',
                author: demoUsers.agent,
                createdAt: '2026-03-17T09:00:00.000Z',
                parts: [
                  {
                    type: 'text',
                    text: 'The ChatBox reads the MUI theme palette directly, including the Chat-specific tokens. Toggle the mode to see how the surface adapts.',
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
                    text: 'Message bubbles, backgrounds, and borders all update automatically.',
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
