'use client';
import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ChatBox } from '@mui/x-chat';

import { createEchoAdapter } from 'docs/data/chat/material/examples/shared/demoUtils';
import {
  minimalConversation,
  minimalMessages,
  demoUsers,
} from 'docs/data/chat/material/examples/shared/demoData';

const adapter = createEchoAdapter();

const theme = createTheme({
  components: {
    // Theme override: tweak the default message bubble radius
    MuiChatMessage: {
      styleOverrides: {
        bubble: { borderRadius: 16 },
      },
    },
  },
});

// Slot override: replace the avatar with a robot icon
function BotAvatar({ message }) {
  const isBot = message?.author?.displayName === demoUsers.agent.displayName;
  return (
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: '50%',
        background: isBot ? '#9c27b0' : '#1976d2',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 18,
        flexShrink: 0,
      }}
    >
      {isBot ? '\u2699' : '\u263A'}
    </div>
  );
}

export default function ThemeAndSlotCombination() {
  return (
    <ThemeProvider theme={theme}>
      <ChatBox
        adapter={adapter}
        initialActiveConversationId={minimalConversation.id}
        initialConversations={[minimalConversation]}
        initialMessages={minimalMessages}
        slots={{ messageAvatar: BotAvatar }}
        sx={{
          height: 500,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
        }}
      />
    </ThemeProvider>
  );
}
