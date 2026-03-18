---
productId: x-chat
title: Chat - Dark mode
packageName: '@mui/x-chat'
---

# Dark mode chat

<p class="description">A dark-themed chat surface with custom <code>palette.Chat</code> tokens showing how the Material layer adapts to the MUI theme.</p>

```tsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { ChatBox } from '@mui/x-chat';
import type {} from '@mui/x-chat/themeAugmentation';
import { createEchoAdapter } from 'docsx/data/chat/material/shared/demoUtils';
import {
  inboxConversations,
  inboxThreads,
} from 'docsx/data/chat/material/shared/demoData';

const adapter = createEchoAdapter();

export default function DarkModeChat() {
  const [mode, setMode] = React.useState<'light' | 'dark'>('dark');

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'dark'
            ? {
                Chat: {
                  userMessageBg: '#1e40af',
                  userMessageColor: '#dbeafe',
                  assistantMessageBg: '#1e293b',
                  assistantMessageColor: '#e2e8f0',
                  conversationSelectedBg: '#334155',
                  composerBorder: '#475569',
                  composerFocusRing: '#3b82f6',
                },
              }
            : {
                Chat: {
                  userMessageBg: '#1e3a5f',
                  userMessageColor: '#fff',
                  assistantMessageBg: '#f8fafc',
                  assistantMessageColor: '#0f172a',
                },
              }),
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
          aria-label="Toggle theme"
          onClick={() => setMode((m) => (m === 'light' ? 'dark' : 'light'))}
          size="small"
          sx={{ position: 'absolute', right: 8, top: 8, zIndex: 1 }}
        >
          {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
        <Box sx={{ height: 600 }}>
          <ChatBox
            adapter={adapter}
            defaultActiveConversationId="triage"
            defaultConversations={inboxConversations}
            defaultMessages={inboxThreads.triage}
          />
        </Box>
      </Paper>
    </ThemeProvider>
  );
}

```

## What this example demonstrates

- Dark mode via `createTheme({ palette: { mode: 'dark' } })`
- Custom `palette.Chat` tokens for message bubble colors
- Toggle between light and dark modes
- All surfaces (conversations, thread, composer) adapt automatically
