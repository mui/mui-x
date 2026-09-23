'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ChatBox } from '@mui/x-chat';
import type {} from '@mui/x-chat/themeAugmentation';
import { createEchoAdapter } from 'docs/data/chat/core/examples/shared/demoUtils';
import {
  demoUsers,
  minimalConversation,
  minimalMessages,
} from 'docs/data/chat/core/examples/shared/demoData';

const adapter = createEchoAdapter({ respond: () => 'echo' });

const theme = createTheme({
  typography: { fontFamily: '"Inter", sans-serif' },
  components: {
    MuiChatBox: {
      styleOverrides: {
        root: ({ theme: t }) => ({
          border: '1px solid',
          borderColor: t.palette.divider,
        }),
      },
    },
    MuiChatMessage: {
      styleOverrides: {
        bubble: ({ theme: t }) => ({
          borderRadius: Number(t.shape.borderRadius) * 3,
        }),
      },
    },
  },
});

export default function ThemeAndSlotsDemo() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ height: 420, width: '100%' }}>
        <ChatBox
          adapter={adapter}
          currentUser={demoUsers.you}
          members={[demoUsers.you, demoUsers.agent]}
          initialConversations={[minimalConversation]}
          initialMessages={minimalMessages}
          initialActiveConversationId={minimalConversation.id}
          slotProps={{
            composerInput: { placeholder: 'Ask anything...' },
            composerSendButton: { sx: { borderRadius: 6 } },
          }}
          sx={{ height: '100%' }}
        />
      </Box>
    </ThemeProvider>
  );
}
