'use client';
import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ChatBox } from '@mui/x-chat';
import { createEchoAdapter } from '../shared/demoUtils';
import { minimalConversation, minimalMessages } from '../shared/demoData';

const tealTheme = createTheme({
  palette: {
    primary: {
      main: '#00796b',
      light: '#48a999',
      dark: '#004c40',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ff6f00',
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const adapter = createEchoAdapter({
  respond: (text) =>
    `Received: "${text}". Notice how the bubble colors, border radius, and typography all come from the custom teal theme — no extra CSS required.`,
});

export default function CustomTheme() {
  return (
    <ThemeProvider theme={tealTheme}>
      <CssBaseline />
      <ChatBox
        adapter={adapter}
        defaultActiveConversationId={minimalConversation.id}
        defaultConversations={[minimalConversation]}
        defaultMessages={minimalMessages}
        sx={{
          height: 500,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: '12px',
        }}
      />
    </ThemeProvider>
  );
}
