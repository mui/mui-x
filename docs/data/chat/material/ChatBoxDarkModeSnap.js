import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ChatBox } from '@mui/x-chat';
import { basicAdapter, demoConversations, demoMessages } from './shared';

const theme = createTheme({
  palette: {
    mode: 'dark',
    Chat: {
      assistantMessageBg: '#111827',
      assistantMessageColor: '#f3f4f6',
      composerBorder: '#374151',
      composerFocusRing: '#60a5fa',
      conversationHoverBg: '#1f2937',
      conversationSelectedBg: '#24324a',
      conversationSelectedColor: '#f9fafb',
      userMessageBg: '#1d4ed8',
      userMessageColor: '#eff6ff',
    },
  },
});

// This demo is used in visual regression tests to spot regressions in the dark ChatBox layout.
export default function ChatBoxDarkModeSnap() {
  return (
    <ThemeProvider theme={theme}>
      <Paper
        elevation={0}
        sx={{ border: 1, borderColor: 'divider', overflow: 'hidden' }}
      >
        <Box sx={{ height: 560, width: 960 }}>
          <ChatBox
            adapter={basicAdapter}
            defaultActiveConversationId="c1"
            defaultConversations={demoConversations}
            defaultMessages={demoMessages}
          />
        </Box>
      </Paper>
    </ThemeProvider>
  );
}
